const questionModel = require('./question.model')()
const surveyModel = require('../survey/survey.model')()
const { getMatchingId, createHashFromId } = require('../../utils/idStore')
const { isUser, userIdIsMatching } = require('../../utils/authUtils')
const shortId = require('shortid')

const iterateQuestionAndCorrectIds = (questionData) => {
  const updatedQuestionData = questionData
  Object.keys(updatedQuestionData).forEach((key) => {
    if (key === 'surveyID') updatedQuestionData[key] = getMatchingId(updatedQuestionData.surveyID)
    if ((key === 'items' || key === 'labels' || key === 'choices') && updatedQuestionData[key] !== null) {
      updatedQuestionData[key] = updatedQuestionData[key].map((object) => {
        const updatedObject = object
        if (key === 'choices' && !Object.prototype.hasOwnProperty.call(object, 'code')) {
          updatedObject.code = shortId.generate()
          if (Object.prototype.hasOwnProperty.call(updatedQuestionData, 'default') && updatedQuestionData.default === updatedObject.label) {
            updatedQuestionData.default = updatedObject.code
          }
        }
        if (Object.prototype.hasOwnProperty.call(updatedObject, 'image')) updatedObject.image = getMatchingId(updatedObject.image)
        return updatedObject
      })
    }
  })
  if (Object.prototype.hasOwnProperty.call(updatedQuestionData, 'surveyID')) {
    updatedQuestionData.survey = updatedQuestionData.surveyID
    delete updatedQuestionData.surveyID
  }
  return updatedQuestionData
}

const createQuestion = async (data, auth) => {
  const matchingSurveyID = getMatchingId(data.surveyID)
  const [survey] = (await surveyModel.get({ _id: matchingSurveyID }))
  if (!isUser(auth) || (survey && !userIdIsMatching(auth, createHashFromId(survey.creator)))) { throw new Error('Not authorized or no permissions.') }
  const updatedData = iterateQuestionAndCorrectIds(data)
  updatedData.user = survey.creator

  await questionModel.insert(updatedData)
  const [updatedSurvey] = await surveyModel.get({ _id: matchingSurveyID })
  return updatedSurvey
}

module.exports = {
  Mutation: {
    createLikeQuestion: async (parent, { data }, { request }, info) => {
      try {
        const { auth } = request
        const updatedData = { ...data, type: 'LIKE' }
        if (Object.prototype.hasOwnProperty.call(updatedData, 'likeIcon')) updatedData.likeIcon = getMatchingId(updatedData.likeIcon)
        return { survey: await createQuestion(updatedData, auth) }
      } catch (e) {
        throw e
      }
    },
    createLikeDislikeQuestion: async (parent, { data }, { request }, info) => {
      try {
        const { auth } = request
        const updatedData = { ...data, type: 'LIKEDISLIKE' }
        if (Object.prototype.hasOwnProperty.call(updatedData, 'likeIcon')) updatedData.likeIcon = getMatchingId(updatedData.likeIcon)
        if (Object.prototype.hasOwnProperty.call(updatedData, 'dislikeIcon')) updatedData.dislikeIcon = getMatchingId(updatedData.dislikeIcon)
        return { survey: await createQuestion(updatedData, auth) }
      } catch (e) {
        throw e
      }
    },
    createChoiceQuestion: async (parent, { data }, { request }, info) => {
      try {
        const { auth } = request
        const updatedData = { ...data, type: 'CHOICE' }
        return { survey: await createQuestion(updatedData, auth) }
      } catch (e) {
        throw e
      }
    },
    createRegulatorQuestion: async (parent, { data }, { request }, info) => {
      try {
        const { auth } = request
        const updatedData = { ...data, type: 'REGULATOR' }
        return { survey: await createQuestion(updatedData, auth) }
      } catch (e) {
        throw e
      }
    },
    createRankingQuestion: async (parent, { data }, { request }, info) => {
      try {
        const { auth } = request
        const updatedData = { ...data, type: 'RANKING' }
        return { survey: await createQuestion(updatedData, auth) }
      } catch (e) {
        throw e
      }
    },
    createFavoriteQuestion: async (parent, { data }, { request }, info) => {
      try {
        const { auth } = request
        const updatedData = { ...data, type: 'FAVORITE' }
        return { survey: await createQuestion(updatedData, auth) }
      } catch (e) {
        throw e
      }
    },
  },
  Question: {
    __resolveType(obj, context, info) {
      switch (obj.type) {
        case 'LIKE': return 'LikeQuestion'
        case 'LIKEDISLIKE': return 'LikeDislikeQuestion'
        case 'CHOICE': return 'ChoiceQuestion'
        case 'REGULATOR': return 'RegulatorQuestion'
        case 'RANKING': return 'RankingQuestion'
        case 'FAVORITE': return 'FavoriteQuestion'
        default: throw new Error('Unkown Question')
      }
    },
  },
}
