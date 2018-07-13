const contextModel = {}
module.exports = contextModel

const contextSchema = require('./context.schema')
const dbLoader = require('../../utils/dbLoader')
const deviceModel = require('../device/device.model')
const _ = require('underscore')
const { removeContextFromCache } = require('../../utils/answerStore')


const Context = dbLoader.getDB().model('context', contextSchema, 'context')

contextModel.get = async (find, limit, offset, sort) => {
  try {
    const contexts = await Context.find(find).limit(limit).skip(offset).sort(sort)
    if (contexts.length === 0) throw new Error('No contexts found')
    return contexts
  } catch (e) {
    throw e
  }
}
contextModel.insert = async (object) => {
  try {
    return (await new Context(object).save())
  } catch (e) {
    throw e
  }
}
contextModel.update = async (where, data) => {
  try {
    const currentContexts = await Context.find(where)
    const result = await Context.updateMany(where, data)
    if (result.nMatched === 0) throw new Error('Context not found.')
    if (result.nModified === 0) throw new Error('Context update failed.')
    const updatedContext = await Context.find(where)

    if (Object.prototype.hasOwnProperty.call(data, 'activeSurvey')) {
      currentContexts.forEach((context) => {
        if (Object.prototype.hasOwnProperty.call(context.toObject(), 'activeSurvey')
          && context.activeSurvey !== null
          && context.activeSurvey !== '') removeContextFromCache(`${context.activeSurvey}`, `${context.id}`)
      })
    }

    return updatedContext
  } catch (e) {
    throw e
  }
}
contextModel.delete = async (where) => {
  try {
    const contexts = await Context.find(where)
    if (contexts.length === 0) throw new Error('Context not found.')
    const result = await Context.deleteMany(where)
    if (result.n === 0) throw new Error('Context deletion failed.')
    const contextIds = contexts.reduce((acc, context) => ([...acc, `${context._id}`]), [])
    const notDeletedContexts = await Context.find(where)
    const notDeletedIds = notDeletedContexts.reduce((acc, context) => ([...acc, `${context._id}`]), [])
    const deletedIds = _.without(contextIds, ...notDeletedIds)

    if (deletedIds.length > 0) {
      contexts.forEach((context) => {
        if (deletedIds.indexOf(`${context.id}`) > -1
          && Object.prototype.hasOwnProperty.call(context.toObject(), 'activeSurvey')
          && context.activeSurvey !== null
          && context.activeSurvey !== '') removeContextFromCache(`${context.activeSurvey}`, `${context.id}`)
      })
      try {
        await deviceModel.update({ context: { $in: deletedIds } }, { $unset: { context: '' } })
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
contextModel.insertState = async (contextID, key, value) => {
  try {
    const contextsWithKey = await Context
      .find({ $and: [{ _id: contextID }, { states: { $elemMatch: { key } } }] })
    if (contextsWithKey.length > 0) throw new Error('State already exists!')
    const newContext = await Context
      .findByIdAndUpdate(contextID, { $push: { states: { key, value } } }, { new: true })
    return newContext.states.find(state => state.key === key)
  } catch (e) {
    throw e
  }
}
contextModel.updateState = async (contextID, key, value) => {
  try {
    const results = await Context
      .update({ _id: contextID, 'states.key': key }, { 'states.$.value': value })
    if (results.nModified !== 1 || results.ok !== 1) { throw new Error('Failed to update!') }
    return { key, value }
  } catch (e) {
    throw e
  }
}
contextModel.deleteState = async (contextID, key) => {
  try {
    const [contextsWithKey] = await Context
      .find({ $and: [{ _id: contextID }, { states: { $elemMatch: { key } } }] })
    if (!contextsWithKey) throw Error('State does not exist!')
    const deletedState = contextsWithKey.states.find(state => state.key === key)
    const updatedContext = await Context
      .findByIdAndUpdate(contextID, { $pull: { states: { key } } }, { new: true })
    if (!updatedContext) throw Error('Failed to delete!')
    return deletedState
  } catch (e) {
    throw e
  }
}
