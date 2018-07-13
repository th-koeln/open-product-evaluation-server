/**
 * Created by Dennis Dubbert on 11.07.18.
 */
const questionModel = require('../entities/question/question.model')
const voteModel = require('../entities/vote/vote.model')
const { getMatchingId } = require('./idStore')
const _ = require('underscore')

/** cache für antworten { surveyId: { contextId: { deviceID: [answers] } } } * */
const answerCache = {}

/** cache für Questions (key = surveyID) * */
const questionCache = {}

const removeSurveyFromCache = (surveyId) => {
  if (Object.prototype.hasOwnProperty.call(answerCache, surveyId)) {
    delete answerCache[surveyId]
  }

  if (Object.prototype.hasOwnProperty.call(questionCache, surveyId)) {
    clearTimeout(questionCache[surveyId].timeout)
    delete questionCache[surveyId]
  }
}

const removeContextFromCache = (surveyId, contextId) => {
  if (Object.prototype.hasOwnProperty.call(answerCache, surveyId)) {
    delete answerCache[surveyId][contextId]
    if (Object.keys(answerCache[surveyId]).length === 0) {
      removeSurveyFromCache(surveyId)
    }
  }
}

const removeDeviceFromCache = (surveyId, contextId, deviceId) => {
  if (Object.prototype.hasOwnProperty.call(answerCache, surveyId)
    && Object.prototype.hasOwnProperty.call(answerCache[surveyId], contextId)) {
    delete answerCache[surveyId][contextId][deviceId]
    if (Object.keys(answerCache[surveyId][contextId]).length === 0) {
      removeContextFromCache(surveyId, contextId)
    }
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
        const questionItems = question.items.reduce((acc, item) => [...acc, `${item.image}`], [])
        if (rankedImages.length === questionItems.length
          && _.without(questionItems, ...rankedImages).length === 0) {
          enhancedAnswer = { ...answerInput, type: 'RANKING' }
          enhancedAnswer.rankedImages = rankedImages
        }
      } break
    }
    case 'FAVORITE': {
      if (Object.prototype.hasOwnProperty.call(answerInput, 'favoriteImage')) {
        const favoriteImage = getMatchingId(answerInput.favoriteImage)
        const questionItems = question.items.reduce((acc, item) => [...acc, `${item.image}`], [])
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
    const cacheData = {
      questionIds,
      questions,
      timeout: setTimeout(() => {
        delete questionCache[`${survey.id}`]
      }, 1000 * 60),
    }
    questionCache[`${survey.id}`] = cacheData
  }

  clearTimeout(questionCache[`${survey.id}`].timeout)
  questionCache[`${survey.id}`].timeout = setTimeout(() => {
    delete questionCache[`${survey.id}`]
  }, 1000 * 60)

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
  const deviceId = `${device.id}`
  const contextId = `${context.id}`
  const surveyId = `${survey.id}`
  const { questionIds } = questionCache[surveyId]

  if (questionIds.length === 1) {
    try {
      await persistVote(deviceDependencies, [answer])
      return { answer, voteCreated: true }
    } catch (e) {
      throw new Error('Vote could not be persistet. Please retry.')
    }
  }

  if (!Object.prototype.hasOwnProperty.call(answerCache, surveyId)) {
    answerCache[surveyId] = {}
  }

  if (!Object.prototype.hasOwnProperty.call(answerCache[surveyId], contextId)) {
    answerCache[surveyId][contextId] = {}
  }

  if (!Object.prototype.hasOwnProperty.call(answerCache[surveyId][contextId], deviceId)) {
    answerCache[surveyId][contextId][deviceId] = []
  }

  const presentAnswers = answerCache[surveyId][contextId][deviceId]
  const answerQuestionIds = presentAnswers.map(presentAnswer => presentAnswer.question)
  const answerQuestionIndex = answerQuestionIds.indexOf(answer.question)

  if (answerQuestionIndex > -1) {
    answerCache[surveyId][contextId][deviceId][answerQuestionIndex] = answer
    return { answer, voteCreated: false }
  }

  if (questionIds.length === presentAnswers.length + 1) {
    const answers = [...answerCache[surveyId][contextId][deviceId], answer]
    try {
      await persistVote(deviceDependencies, answers)
      removeDeviceFromCache(surveyId, contextId, deviceId)

      return { answer, voteCreated: true }
    } catch (e) {
      throw new Error('Vote could not be persistet. Please retry.')
    }
  }

  answerCache[surveyId][contextId][deviceId].push(answer)
  return { answer, voteCreated: false }
}

const createAnswer = async (deviceDependencies, answerInput) => {
  const updatedAnswerInput = await enhanceAnswerIfAllowedAndValid(deviceDependencies, answerInput)
  return persistAnswer(deviceDependencies, updatedAnswerInput)
}

module.exports = {
  createAnswer,
  removeSurveyFromCache,
  removeContextFromCache,
  removeDeviceFromCache,
}
