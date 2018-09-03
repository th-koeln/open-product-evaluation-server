const idStore = require('../../utils/idStore')
const { encodeDevice } = require('../../utils/authUtils')
const { ADMIN, USER, DEVICE } = require('../../utils/roles')


const keyExists = (object, keyName) =>
  Object.prototype.hasOwnProperty.call(object.toObject(), keyName)

module.exports = {
  Query: {
    devices: async (parent, args, { request, models }, info) => {
      try {
        const { auth } = request
        switch (auth.role) {
          case ADMIN:
            return await models.device.get()

          case USER:
            return await models.device.get({ owners: { $in: auth.id } })

          case DEVICE:
            if (keyExists(auth.device, 'context')
            && auth.device.context !== null
            && auth.device.context !== '') return await models.device.get({ context: auth.device.context })
            return [auth.device]

          default:
            throw new Error('Not authorized or no permissions.')
        }
      } catch (e) {
        throw e
      }
    },
    device: async (parent, { deviceID }, { request, models }, info) => {
      try {
        const { auth } = request
        const [device] = await models.device.get({ _id: idStore.getMatchingId(deviceID) })

        switch (auth.role) {
          case ADMIN:
            return device

          case USER:
            if (device.owners.indexOf(auth.id) > -1) return device
            break

          case DEVICE:
            if (device.id === auth.id) return device
            break

          default:
            throw new Error('No permissions.')
        }
        throw new Error('No permissions.')
      } catch (e) {
        throw e
      }
    },
  },
  Mutation: {
    createDevice: async (parent, { deviceID, data }, { request, models }, info) => {
      try {
        const { auth } = request
        const newDevice = (auth.role === USER) ? {
          owners: [auth.user.id],
          ...data,
        } : data
        const device = await models.device.insert(newDevice)
        return {
          device,
          token: encodeDevice(idStore.createHashFromId(device.id)),
        }
      } catch (e) {
        throw e
      }
    },
    updateDevice: async (parent, { deviceID, data }, { request, models }, info) => {
      const matchingDeviceId = idStore.getMatchingId(deviceID)

      async function updateDevice() {
        const inputData = data
        if (inputData.context) {
          inputData.context = idStore.getMatchingId(inputData.context)
          await models.context.get({ _id: inputData.context })
        }
        const [newDevice] = await models.context
          .update({ _id: matchingDeviceId }, data)

        return { device: newDevice }
      }

      try {
        const { auth } = request

        const [device] = await models.device.get({ _id: matchingDeviceId })

        switch (auth.role) {
          case ADMIN:
            return updateDevice()

          case USER:
            if (device.owners.indexOf(auth.user.id) > -1) return updateDevice()
            break

          case DEVICE:
            if (auth.id === device.id) return updateDevice()
            break

          default:
            throw new Error('Not authorized or no permissions.')
        }
        throw new Error('Not authorized or no permissions.')
      } catch (e) {
        throw e
      }
    },
    deleteDevice: async (parent, { deviceID }, { request, models }, info) => {
      const matchingId = idStore.getMatchingId(deviceID)

      async function deleteDevice() {
        await models.device.delete({ _id: matchingId })
        return { success: true }
      }

      try {
        const { auth } = request
        const [device] = await models.device.get({ _id: matchingId })
        switch (auth.role) {
          case ADMIN:
            return deleteDevice()

          case USER:
            if (device.owners.indexOf(auth.user.id) > -1) return deleteDevice()
            break

          case DEVICE:
            if (auth.id === device.id) return deleteDevice()
            break

          default:
            throw new Error('Not authorized or no permissions.')
        }
        throw new Error('Not authorized or no permissions.')
      } catch (e) {
        throw e
      }
    },
  },
  Device: {
    id: async (parent, args, context, info) => idStore.createHashFromId(parent.id),
    owners: async (parent, args, { models, request }, info) => {
      const { auth } = request
      if (!keyExists(parent, 'owners') || parent.owners === null || parent.owners.length === 0) return null
      switch (auth.role) {
        case ADMIN:
          return models.user.get({ _id: { $in: parent.owners } })

        case USER:
          if (parent.owners.indexOf(auth.user.id) > -1) {
            return models.user.get({ _id: { $in: parent.owners } })
          }
          break

        default:
          throw new Error('Not authorized or no permissions.')
      }
      throw new Error('Not authorized or no permissions.')
    },
    context: async (parent, args, { models }, info) => {
      if (!keyExists(parent, 'context') || parent.context === null || parent.context === '') return null
      return (await models.context.get({ _id: parent.context }))[0]
    },
  },

}
