const deviceModel = require('./device.model')
const userModel = require('../user/user.model')
const contextModel = require('../context/context.model')
const idStore = require('../../utils/idStore')
const {
  isUser,
  isAdmin,
  encodeDevice,
  deviceIdIsMatching,
} = require('../../utils/authUtils')


const keyExists = (object, keyName) =>
  Object.prototype.hasOwnProperty.call(object.toObject(), keyName)

module.exports = {
  Query: {
    devices: async (parent, args, context, info) => {
      try {
        const { auth } = context.request
        if (!isUser(auth)) { throw new Error('Not authorized or no permissions.') }
        if (isAdmin(auth)) {
          const devices = await deviceModel
            .get()
          return devices
        }
        const devices = await deviceModel
          .get({ owners: { $in: idStore.getMatchingId(auth.user.id) } })
        return devices
      } catch (e) {
        throw e
      }
    },
    device: async (parent, args, context, info) => {
      try {
        const { auth } = context.request
        const [device] = await deviceModel.get({ _id: idStore.getMatchingId(args.deviceID) })
        if (isAdmin(auth)
          || deviceIdIsMatching(auth, idStore.createHashFromId(device.id))
          || device.owners.indexOf(idStore.getMatchingId(auth.user.id)) > -1) return device
        throw new Error('No permissions.')
      } catch (e) {
        throw e
      }
    },
  },
  Mutation: {
    createDevice: async (parent, args, context, info) => {
      try {
        const { auth } = context.request
        const newDevice = isUser(auth) ? {
          owners: [idStore.getMatchingId(auth.user.id)],
          ...args.data,
        } : args.data
        const device = await deviceModel.insert(newDevice)
        return {
          device,
          token: encodeDevice(idStore.createHashFromId(device.id)),
        }
      } catch (e) {
        throw e
      }
    },
    updateDevice: async (parent, args, context, info) => {
      try {
        const { auth } = context.request
        const matchingDeviceId = idStore.getMatchingId(args.deviceID)
        const [device] = await deviceModel.get({ _id: matchingDeviceId })
        if (isAdmin(auth) || (isUser(auth) &&
          device.owners.indexOf(idStore.getMatchingId(auth.user.id)) > -1)
          || deviceIdIsMatching(auth, idStore.createHashFromId(device.id))) {
          const inputData = args.data
          if (inputData.context) {
            inputData.context = idStore.getMatchingId(inputData.context)
            await contextModel.get({ _id: inputData.context })
          }
          const [newDevice] = await deviceModel
            .update({ _id: matchingDeviceId }, args.data)
          return { device: newDevice }
        }
        throw new Error('Not authorized or no permissions.')
      } catch (e) {
        throw e
      }
    },
    deleteDevice: async (parent, args, context, info) => {
      try {
        const { auth } = context.request
        const [device] = await deviceModel.get({ _id: idStore.getMatchingId(args.deviceID) })
        if (isAdmin(auth) || (isUser(auth) &&
        device.owners.indexOf(idStore.getMatchingId(auth.user.id)) > -1)
        || deviceIdIsMatching(auth, idStore.createHashFromId(device.id))) {
          await deviceModel.delete({ _id: idStore.getMatchingId(args.deviceID) })
          return { status: 'success' }
        }
        throw new Error('Not authorized or no permissions.')
      } catch (e) {
        throw e
      }
    },
  },
  Device: {
    id: async (parent, args, context, info) => idStore.createHashFromId(parent.id),
    owners: async (parent, args, context, info) => {
      const { auth } = context.request
      if (!keyExists(parent, 'owners') || parent.owners === null || parent.owners.length === 0) return null
      if (isAdmin(auth) || (isUser(auth) &&
      parent.owners.indexOf(idStore.getMatchingId(auth.user.id)) > -1)) {
        return userModel.get({ _id: { $in: parent.owners } })
      }
      return null
    },
    context: async (parent, args, context, info) => {
      if (!keyExists(parent, 'context') || parent.context === null || parent.context === '') return null
      return (await contextModel.get({ _id: parent.context }))[0]
    },
  },

}
