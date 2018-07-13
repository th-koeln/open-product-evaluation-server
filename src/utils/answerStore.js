/**
 * Created by Dennis Dubbert on 11.07.18.
 */
const questionModel = require('../entities/question/question.model')
const voteModel = require('../entities/vote/vote.model')
const { getMatchingId } = require('./idStore')
const _ = require('underscore')

/** cache für antworten { surveyId: { contextId: { deviceID: { questionID: [answers] } } } } * */
const answerCache = {}

/** cache für Questions (key = surveyID) * */
const questionCache = {}

const removeSurveyFromCache = (surveyId) => {
  delete answerCache[surveyId]
}

const removeContextFromCache = (surveyId, contextId) => {
  delete answerCache[surveyId][contextId]
  if (Object.keys(answerCache[surveyId]).length === 0) {
    removeSurveyFromCache(surveyId)
  }
}

const removeDeviceFromCache = (surveyId, contextId, deviceId) => {
  delete answerCache[surveyId][contextId][deviceId]
  if (Object.keys(answerCache[surveyId][contextId]).length === 0) {
    removeContextFromCache(surveyId, contextId)
  }
}

const enhanceAnswerIfValid = (question, answerInput) => {
  let enhancedAnswer
  switch (question.type) {
    case 'LIKE': {
      if (Object.prototype.hasOwnProperty.call(answerInput, 'liked')) {
        enhancedAnswer = { ...answerInput, type: 'LIKE' }
      } break
    }
    case 'LIKEDISLIKE': {
      if (Object.prototype.hasOwnProperty.call(answerInput, 'liked')) {
        enhancedAnswer = { ...answerInput, type: 'LIKEDISLIKE' }
      } break
    }
    case 'CHOICE': {
      if (Object.prototype.hasOwnProperty.call(answerInput, 'choiceCode')) {
        const choices = question.choices.map(choiceDescription => `${choiceDescription.code}`)
        if (choices.indexOf(answerInput.choiceCode) > -1) {
          enhancedAnswer = { ...answerInput, type: 'CHOICE' }
        }
      } break
    }
    case 'REGULATOR': {
      if (Object.prototype.hasOwnProperty.call(answerInput, 'rating')) {
        const { rating } = answerInput
        const { max, min, stepSize } = question
        if (rating >= min && rating <= max && ((rating * 100) % (stepSize * 100)) === 0) {
          const distance = Math.abs(max - min)
          enhancedAnswer = { ...answerInput, normalized: ((rating - min) / distance), type: 'REGULATOR' }
        }
      } break
    }
    case 'RANKING': {
      if (Object.prototype.hasOwnProperty.call(answerInput, 'rankedImages')) {
        const rankedImages = answerInput.rankedImages.map(imageId => getMatchingId(imageId))
        const questionItems = question.items.map(item => `${item.image}`)
        if (rankedImages.length === questionItems.length
          && _.without(questionItems, rankedImages).length === 0) {
          enhancedAnswer = { ...answerInput, type: 'RANKING' }
          enhancedAnswer.rankedImages = rankedImages
        }
      } break
    }
    case 'FAVORITE': {
      if (Object.prototype.hasOwnProperty.call(answerInput, 'favoriteImage')) {
        const favoriteImage = getMatchingId(answerInput.favoriteImage)
        const questionItems = question.items.map(item => `${item.image}`)
        if (questionItems.indexOf(favoriteImage) > -1) {
          enhancedAnswer = { ...answerInput, type: 'FAVORITE' }
          enhancedAnswer.favoriteImage = favoriteImage
        }
      } break
    }
    default: throw new Error('Answer is not valid.')
  }

  if (!enhancedAnswer) throw new Error('Answer is not valid.')
  return enhancedAnswer
}

const enhanceAnswerIfAllowedAndValid = async ({ survey }, answerInput) => {
  if (!Object.prototype.hasOwnProperty.call(questionCache, `${survey.id}`)) {
    const questions = await questionModel.get({ survey: survey.id })
    if (questions.length === 0) throw new Error('Answer is not valid.')
    const questionIds = questions.map(question => `${question.id}`)
    const cacheData = { questionIds, questions }
    questionCache[`${survey.id}`] = cacheData
  }

  const answerQuestionId = `${answerInput.question}`
  const questionIndex = questionCache[`${survey.id}`].questionIds.indexOf(answerQuestionId)
  if (questionIndex === -1) throw new Error('Answer is not valid.')

  const question = questionCache[`${survey.id}`].questions[questionIndex]

  return enhanceAnswerIfValid(question, answerInput)
}

const persistVote = async ({ context, device, survey }, answers) => {
  const contextId = context.id
  const deviceId = device.id
  const surveyId = survey.id
  const vote = {
    survey: surveyId,
    context: contextId,
    device: deviceId,
    answers,
  }
  return voteModel.insert(vote)
}

const persistAnswer = async (deviceDependencies, answer) => {
  const { device, context, survey } = deviceDependencies
  const { questionIds } = questionCache[`${survey.id}`]

  if (questionIds.length === 1) {
    try {
      await persistVote(deviceDependencies, [answer])
      return { answer, voteCreated: true }
    } catch (e) {
      throw new Error('Vote could not be persistet. Please retry.')
    }
  }

  if (!Object.prototype.hasOwnProperty.call(answerCache, `${survey.id}`)) {
    answerCache[`${survey.id}`] = {}
  }

  if (!Object.prototype.hasOwnProperty.call(answerCache[`${survey.id}`], `${context.id}`)) {
    answerCache[`${survey.id}`][`${context.id}`] = {}
  }

  if (!Object.prototype.hasOwnProperty.call(answerCache[`${survey.id}`][`${context.id}`], `${device.id}`)) {
    answerCache[`${survey.id}`][`${context.id}`][`${device.id}`] = []
  }

  const presentAnswers = answerCache[`${survey.id}`][`${context.id}`][`${device.id}`]
  const answerQuestionIds = presentAnswers.map(presentAnswer => presentAnswer.question)
  const answerQuestionIndex = answerQuestionIds.indexOf(answer.question)

  if (answerQuestionIndex > -1) {
    answerCache[`${survey.id}`][`${context.id}`][`${device.id}`][answerQuestionIndex] = answer
    return { answer, voteCreated: false }
  }

  if (questionIds.length === presentAnswers.length + 1) {
    const answers = [...answerCache[`${survey.id}`][`${context.id}`][`${device.id}`], answer]
    try {
      await persistVote(deviceDependencies, answers)
      removeDeviceFromCache(`${survey.id}`, `${context.id}`, `${device.id}`)

      return { answer, voteCreated: true }
    } catch (e) {
      throw new Error('Vote could not be persistet. Please retry.')
    }
  }

  answerCache[`${survey.id}`][`${context.id}`][`${device.id}`].push(answer)
  return { answer, voteCreated: false }
}

const createAnswer = async (deviceDependencies, answerInput) => {
  const updatedAnswerInput = await enhanceAnswerIfAllowedAndValid(deviceDependencies, answerInput)
  const p = await persistAnswer(deviceDependencies, updatedAnswerInput)
  console.log(answerCache)
  return p
}

module.exports = {
  createAnswer,
}
