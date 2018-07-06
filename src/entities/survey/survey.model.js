const surveySchema = require('./survey.schema')
const dbLoader = require('../../utils/dbLoader')
const questionModel = require('../question/question.model')()
const contextModel = require('../context/context.model')()

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
    update: async (where, data) => {
      try {
        const result = await Survey.updateMany(where, data)
        if (result.nMatched === 0) throw new Error('Survey not found.')
        if (result.nModified === 0) throw new Error('Survey update failed.')
        const updatedSurvey = await Survey.find(where)
        return updatedSurvey
      } catch (e) {
        throw e
      }
    },
    delete: async (where) => {
      try {
        const surveys = await Survey.find(where)
        if (surveys.length === 0) throw new Error('Survey not found.')
        const result = await Survey.deleteMany(where)
        if (result.n) throw new Error('Survey deletion failed.')
        const surveyIds = surveys.reduce((acc, survey) => ([...acc, survey._id]), [])
        /** Delete Questions and all sub-documents * */
        try {
          await questionModel.delete({ survey: { $in: surveyIds } })
        } catch (e) {
          // TODO:
          // ggf. Modul erstellen, welches fehlgeschlagene DB-Zugriffe
          // in bestimmten abständen wiederholt
          // (nur für welche, die nicht ausschlaggebend für erfolg der query sind)
          console.log(e)
        }
        /** Update all contexts referencing this survey * */
        try {
          await contextModel.update({ activeSurvey: { $in: surveyIds } }, { $unset: { activeSurvey: '' } })
        } catch (e) {
          // TODO:
          // ggf. Modul erstellen, welches fehlgeschlagene DB-Zugriffe
          // in bestimmten abständen wiederholt
          // (nur für welche, die nicht ausschlaggebend für erfolg der query sind)
          console.log(e)
        }
        return result
      } catch (e) {
        throw e
      }
    },
  })
}
