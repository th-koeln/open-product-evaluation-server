const surveySchema = require('./survey.schema')
const dbLoader = require('../../utils/dbLoader')

module.exports = () => {
  const Survey = dbLoader.getDB().model('survey', surveySchema, 'survey')

  return Object.freeze({
    get: async (find, limit, offset, sort) => {
      try {
        const surveys = await Survey.find(find).limit(limit).skip(offset).sort(sort)
        if (surveys.length === 0) throw new Error('No survey found.')
        return surveys
      } catch (e) {
        throw e
      }
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
