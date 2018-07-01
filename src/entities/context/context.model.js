const contextSchema = require('./context.schema')
const dbLoader = require('../../utils/dbLoader')


module.exports = () => {
  const Context = dbLoader.getDB().model('context', contextSchema, 'context')

  return Object.freeze({
    get: async (find, limit, offset, sort) => {
      try {
        const contexts = await Context.find(find).limit(limit).skip(offset).sort(sort)
        console.log(contexts)
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
  })
}
