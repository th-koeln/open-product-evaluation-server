const contextSchema = require('./context.schema')
const dbLoader = require('../../utils/dbLoader')


module.exports = () => {
  const Context = dbLoader.getDB().model('context', contextSchema, 'context')

  return Object.freeze({
    get: async (find, limit, offset, sort) => {
      try {
        const contexts = await Context.find(find).limit(limit).skip(offset).sort(sort)
        if (contexts.length === 0) throw new Error('No contexts found')
        return contexts
      } catch (e) {
        throw e
      }
    },
    insert: async (object) => {
      try {
        return (await new Context(object).save())
      } catch (e) {
        throw e
      }
    },
    update: async (id, data) => {
      try {
        const updatedContext = Context.findByIdAndUpdate(id, data, { new: true })
        if (!updatedContext) throw new Error('Context not found')
        return updatedContext
      } catch (e) {
        throw e
      }
    },
    delete: async (id) => {
      try {
        const deletedContext = await Context.findByIdAndDelete(id)
        if (!deletedContext) throw new Error('Context not found')
        return deletedContext
      } catch (e) {
        throw e
      }
    },
    insertState: async (contextID, key, value) => {
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
    },
    updateState: async (contextID, key, value) => {
      try {
        const results = await Context
          .update({ _id: contextID, 'states.key': key }, { 'states.$.value': value })
        if (results.nModified !== 1 || results.ok !== 1) { throw new Error('Failed to update!') }
        return { key, value }
      } catch (e) {
        throw e
      }
    },
    deleteState: async (contextID, key) => {
      try {
        const contextsWithKey = (await Context
          .find({ $and: [{ _id: contextID }, { states: { $elemMatch: { key } } }] }))[0]
        if (!contextsWithKey) throw Error('State does not exist!')
        const deletedState = contextsWithKey.states.find(state => state.key === key)
        const updatedContext = await Context
          .findByIdAndUpdate(contextID, { $pull: { states: { key } } }, { new: true })
        if (!updatedContext) throw Error('Failed to delete!')
        return deletedState
      } catch (e) {
        throw e
      }
    },
  })
}
