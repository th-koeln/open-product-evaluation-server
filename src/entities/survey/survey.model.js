const surveySchema = require('./survey.schema')
const dbLoader = require('../../utils/dbLoader')

module.exports = () => {
  const Survey = dbLoader.getDB().model('survey', surveySchema, 'survey')

  return Object.freeze({
    get: async (find, limit, offset, sort) => {

    },
    insert: async (object) => {
      try {
        return (await new Survey(object).save())
      } catch (e) {
        throw e
      }
    },
    update: async (id, data) => {

    },
    delete: async (id) => {

    },
  })
}
