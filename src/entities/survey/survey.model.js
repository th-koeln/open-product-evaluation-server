const surveyModel = {}
module.exports = surveyModel

const surveySchema = require('./survey.schema')
const dbLoader = require('../../utils/dbLoader')
const questionModel = require('../question/question.model')
const contextModel = require('../context/context.model')
const imageModel = require('../image/image.model')
const voteModel = require('../vote/vote.model')
const _ = require('underscore')
const { removeSurveyFromCache } = require('../../utils/answerStore')

const Survey = dbLoader.getDB().model('survey', surveySchema, 'survey')

surveyModel.get = async (find, limit, offset, sort) => {
  try {
    const surveys = await Survey.find(find).limit(limit).skip(offset).sort(sort)
    if (surveys.length === 0) throw new Error('No Survey found.')
    return surveys
  } catch (e) {
    throw e
  }
}

surveyModel.insert = async (object) => {
  try {
    return (await new Survey(object).save())
  } catch (e) {
    throw e
  }
}

surveyModel.update = async (where, data) => {
  try {
    const result = await Survey.updateMany(where, data)
    if (result.nMatched === 0) throw new Error('No Survey found.')
    if (result.nModified === 0) throw new Error('Survey update failed.')
    const updatedSurvey = await Survey.find(where)
    return updatedSurvey
  } catch (e) {
    throw e
  }
}

surveyModel.delete = async (where) => {
  try {
    const surveys = await Survey.find(where)
    if (surveys.length === 0) throw new Error('No Survey found.')
    const result = await Survey.deleteMany(where)
    if (result.n === 0) throw new Error('Survey deletion failed.')
    const surveyIds = surveys.reduce((acc, survey) => ([...acc, `${survey._id}`]), [])
    const notDeletedSurveys = await Survey.find(where)
    const notDeletedIds = notDeletedSurveys.reduce((acc, survey) => ([...acc, `${survey._id}`]), [])
    const deletedIds = _.without(surveyIds, ...notDeletedIds)

    if (deletedIds.length > 0) {
      deletedIds.forEach(surveyId => removeSurveyFromCache(surveyId))
      /** Delete votes * */
      try {
        await voteModel.delete({ survey: { $in: deletedIds } })
      } catch (e) {
        // TODO:
        // ggf. Modul erstellen, welches fehlgeschlagene DB-Zugriffe
        // in bestimmten abständen wiederholt
        // (nur für welche, die nicht ausschlaggebend für erfolg der query sind)
        console.log(e)
      }
      /** Delete Questions and all sub-documents * */
      try {
        await questionModel.delete({ survey: { $in: deletedIds } })
      } catch (e) {
        // TODO:
        // ggf. Modul erstellen, welches fehlgeschlagene DB-Zugriffe
        // in bestimmten abständen wiederholt
        // (nur für welche, die nicht ausschlaggebend für erfolg der query sind)
        console.log(e)
      }
      /** Delete Images and all sub-documents * */
      try {
        await imageModel.delete({ survey: { $in: deletedIds } })
      } catch (e) {
        // TODO:
        // ggf. Modul erstellen, welches fehlgeschlagene DB-Zugriffe
        // in bestimmten abständen wiederholt
        // (nur für welche, die nicht ausschlaggebend für erfolg der query sind)
        console.log(e)
      }
      /** Update all contexts referencing this survey * */
      try {
        await contextModel.update({ activeSurvey: { $in: deletedIds } }, { $unset: { activeSurvey: '', activeQuestion: '' } })
      } catch (e) {
        // TODO:
        // ggf. Modul erstellen, welches fehlgeschlagene DB-Zugriffe
        // in bestimmten abständen wiederholt
        // (nur für welche, die nicht ausschlaggebend für erfolg der query sind)
        console.log(e)
      }
    }
    return result
  } catch (e) {
    throw e
  }
}
