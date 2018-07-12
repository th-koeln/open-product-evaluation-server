/**
 * Created by Dennis Dubbert on 11.07.18.
 */
const questionModel = require('../entities/question/question.model')
//  const voteModel = require('../entities/vote/vote.model')
const { getMatchingId } = require('./idStore')
const _ = require('underscore')

/** cache für antworten {surveyId: [contextId: [deviceID: [{questionID: answer}]]]} * */
//  const answerCache = {}

/** cache für Questions (key = surveyID) * */
const questionCache = {}

const enhanceIfValidAnswer = (question, answerInput) => {
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

  return enhanceIfValidAnswer(question, answerInput)
}

const createAnswer = async (deviceDependencies, answerInput) => {
  const updatedAnswerInput = enhanceAnswerIfAllowedAndValid(deviceDependencies, answerInput)
  //  await persistAnswer(deviceDependencies, updatedAnswerInput)

  return updatedAnswerInput
}

module.exports = {
  createAnswer,
}
