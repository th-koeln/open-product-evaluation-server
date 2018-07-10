const deviceSchema = require('./device.schema')
const dbLoader = require('../../utils/dbLoader')

module.exports = () => {
  const Device = dbLoader.getDB().model('device', deviceSchema, 'device')

  return Object.freeze({
    get: async (find, limit, offset, sort) => {
      try {
        const devices = await Device.find(find).limit(limit).skip(offset).sort(sort)
        if (devices.length === 0) throw new Error('No devices found')
        return devices
      } catch (e) {
        throw e
      }
    },
    insert: async (object) => {
      try {
        return (await new Device(object).save())
      } catch (e) {
        throw e
      }
    },
    update: async (where, data) => {
      try {
        const result = await Device.updateMany(where, data)
        if (result.nMatched === 0) throw new Error('Device not found.')
        if (result.nModified === 0) throw new Error('Device update failed.')
        const updatedDevice = await Device.find(where)
        return updatedDevice
      } catch (e) {
        throw e
      }
    },
    delete: async (where) => {
      try {
        const result = await Device.deleteMany(where)
        if (result.n === 0) throw new Error('Device deletion failed.')
        return result
      } catch (e) {
        throw e
      }
    },
  })
}
