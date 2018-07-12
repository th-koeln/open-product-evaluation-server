/**
 * Created by Dennis Dubbert on 11.07.18.
 */
const questionModel = require('../entities/question/question.model')
const { getMatchingId } = require('./idStore')
const _ = require('underscore')

/** cache für antworten {deviceID: {questionID: answer}} * */
//  const answerCache = {}

/** cache für Questions (key = surveyID) * */
const questionCache = {}

const enhanceAnswer = (survey, answerInput) => {
  if (Object.prototype.hasOwnProperty.call(answerInput, 'rating')) return answerInput
  const answerQuestionId = `${answerInput.questionID}`
  const questionIndex = questionCache[`${survey.id}`].questionIds.indexOf(answerQuestionId)
  const question = questionCache[`${survey.id}`].questions[questionIndex]
  const { rating } = answerInput
  const { max, min } = question
  const distance = Math.abs(max - min)
  return { ...answerInput, normalized: ((rating - min) / distance) }
}

const answerIsValid = (question, answerInput) => {
  switch (question.type) {
    case 'LIKE': return Object.prototype.hasOwnProperty.call(answerInput, 'liked')
    case 'LIKEDISLIKE': return Object.prototype.hasOwnProperty.call(answerInput, 'liked')
    case 'CHOICE': {
      if (!Object.prototype.hasOwnProperty.call(answerInput, 'choiceCode')) return false
      const choices = question.choices.map(choiceDescription => `${choiceDescription.code}`)
      return choices.indexOf(answerInput.choiceCode) > -1
    }
    case 'REGULATOR': {
      if (!Object.prototype.hasOwnProperty.call(answerInput, 'rating')) return false
      const { rating } = answerInput
      const { max, min, stepSize } = question
      return (rating >= min && rating <= max && ((rating * 100) % (stepSize * 100)) === 0)
    }
    case 'RANKING': {
      if (!Object.prototype.hasOwnProperty.call(answerInput, 'rankedImages')) return false
      const rankedImages = answerInput.rankedImages.map(imageId => getMatchingId(imageId))
      const questionItems = question.items.map(item => `${item.image}`)
      return (rankedImages.length === questionItems.length
        && _.without(questionItems, rankedImages).length === 0)
    }
    case 'FAVORITE': {
      if (!Object.prototype.hasOwnProperty.call(answerInput, 'favoriteImage')) return false
      const favoriteImage = getMatchingId(answerInput.favoriteImage)
      const questionItems = question.items.map(item => `${item.image}`)
      return questionItems.indexOf(favoriteImage) > -1
    }
    default: throw new Error('Answer is not valid.')
  }
}

const answerIsAllowed = async (survey, answerInput) => {
  if (!Object.prototype.hasOwnProperty.call(questionCache, `${survey.id}`)) {
    console.log('p')
    const questions = await questionModel.get({ survey: survey.id })
    if (questions.length === 0) return false
    const questionIds = questions.map(question => `${question.id}`)
    const cacheData = { questionIds, questions }
    questionCache[`${survey.id}`] = cacheData
  }

  const answerQuestionId = `${answerInput.questionID}`
  const questionIndex = questionCache[`${survey.id}`].questionIds.indexOf(answerQuestionId)
  if (questionIndex === -1) return false

  const question = questionCache[`${survey.id}`].questions[questionIndex]

  if (!answerIsValid(question, answerInput)) throw new Error('Answer is not valid.')
  return true
}

const persistAnswer = (answer) => {
  //  TODO: Persist answer or overwrite if already present
}

const createAnswer = async (deviceDependencies, answerInput) => {
  if (!await answerIsAllowed(deviceDependencies.survey, answerInput)) throw new Error('No permissions to create the provided Answer.')
  const updatedAnswerInput = enhanceAnswer(deviceDependencies.survey, answerInput)
  persistAnswer(updatedAnswerInput)
  return 'kot'
}

module.exports = {
  createAnswer,
}
