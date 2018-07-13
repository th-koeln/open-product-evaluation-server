const deviceModel = {}

module.exports = deviceModel

const deviceSchema = require('./device.schema')
const dbLoader = require('../../utils/dbLoader')
const contextModel = require('../context/context.model')
const _ = require('underscore')
const { removeDeviceFromCache } = require('../../utils/answerStore')

const Device = dbLoader.getDB().model('device', deviceSchema, 'device')

const removeFromCache = async (device) => {
  if (Object.prototype.hasOwnProperty.call(device.toObject(), 'context')
  && device.context !== null
  && device.context !== '') {
    const [context] = await contextModel.get({ _id: device.context })

    if (Object.prototype.hasOwnProperty.call(context.toObject(), 'activeSurvey')
      && context.activeSurvey !== null
      && context.activeSurvey !== '') removeDeviceFromCache(`${context.activeSurvey}`, `${context.id}`, `${device.id}`)
  }
}

deviceModel.get = async (find, limit, offset, sort) => {
  try {
    const devices = await Device.find(find).limit(limit).skip(offset).sort(sort)
    if (devices.length === 0) throw new Error('No devices found')
    return devices
  } catch (e) {
    throw e
  }
}
deviceModel.insert = async (object) => {
  try {
    return (await new Device(object).save())
  } catch (e) {
    throw e
  }
}
deviceModel.update = async (where, data) => {
  try {
    const currentDevices = await Device.find(where)
    const result = await Device.updateMany(where, data)
    if (result.nMatched === 0) throw new Error('Device not found.')
    if (result.nModified === 0) throw new Error('Device update failed.')
    const updatedDevice = await Device.find(where)

    if (Object.prototype.hasOwnProperty.call(data, 'context')) {
      currentDevices.forEach(device => removeFromCache(device))
    }

    return updatedDevice
  } catch (e) {
    throw e
  }
}
deviceModel.delete = async (where) => {
  try {
    const devices = await Device.find(where)
    const result = await Device.deleteMany(where)
    if (result.n === 0) throw new Error('Device deletion failed.')

    const deviceIds = devices.reduce((acc, device) => ([...acc, `${device._id}`]), [])
    const notDeletedDevices = await Device.find(where)
    const notDeletedIds = notDeletedDevices.reduce((acc, device) => ([...acc, `${device._id}`]), [])
    const deletedIds = _.without(deviceIds, ...notDeletedIds)

    if (deletedIds.length > 0) {
      try {
        const promises = []
        devices.forEach((device) => {
          if (deletedIds.indexOf(`${device.id}`) > -1) promises.push(removeFromCache(device))
        })
        await Promise.all(promises)
      } catch (e) {
        // TODO retry modul
        console.log(e)
      }
    }

    return result
  } catch (e) {
    throw e
  }
}
