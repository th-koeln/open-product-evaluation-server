/**
 * Created by Dennis Dubbert on 11.07.18.
 */
const { getMatchingId } = require('./idStore')
const _ = require('underscore')
const config = require('../../config')

/** cache für antworten { surveyId: { domainId: { deviceID: { [answers], timeout } } } } * */
const answerCache = {}

/** cache für Questions (key = surveyID) * */
const questionCache = {}

module.exports = (models, eventEmitter) => {
  const clearAllDeviceTimeoutsForSurvey = (surveyId) => {
    Object.keys(answerCache[surveyId]).forEach((cachedDomain) => {
      Object.keys(answerCache[surveyId][cachedDomain]).forEach((cachedDevice) => {
        clearTimeout(answerCache[surveyId][cachedDomain][cachedDevice].timeout)
      })
    })
  }

  const removeSurveyFromCache = (surveyId) => {
    if (Object.prototype.hasOwnProperty.call(answerCache, surveyId)) {
      clearAllDeviceTimeoutsForSurvey(surveyId)
      delete answerCache[surveyId]
    }

    if (Object.prototype.hasOwnProperty.call(questionCache, surveyId)) {
      clearTimeout(questionCache[surveyId].timeout)
      delete questionCache[surveyId]
    }
  }

  const removeDomainFromCache = (surveyId, domainId) => {
    if (Object.prototype.hasOwnProperty.call(answerCache, surveyId)) {
      delete answerCache[surveyId][domainId]
      if (Object.keys(answerCache[surveyId]).length === 0) {
        removeSurveyFromCache(surveyId)
      }
    }
  }

  const removeDeviceFromCache = (surveyId, domainId, deviceId) => {
    if (Object.prototype.hasOwnProperty.call(answerCache, surveyId)
      && Object.prototype.hasOwnProperty.call(answerCache[surveyId], domainId)) {
      clearTimeout(answerCache[surveyId][domainId][deviceId].timeout)
      delete answerCache[surveyId][domainId][deviceId]
      if (Object.keys(answerCache[surveyId][domainId]).length === 0) {
        removeDomainFromCache(surveyId, domainId)
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
        if (Object.prototype.hasOwnProperty.call(answerInput, 'choice')) {
          if (answerInput.choice !== null) {
            const choice = getMatchingId(answerInput.choice)
            const choices = question.choices.map(choiceDescription => choiceDescription.id)
            if (choices.indexOf(choice) > -1) {
              enhancedAnswer = { ...answerInput, type: 'CHOICE' }
              enhancedAnswer.choice = choice
              console.log(enhancedAnswer)
            }
          } else enhancedAnswer = { ...answerInput, type: 'CHOICE' }
        } break
      }
      case 'REGULATOR': {
        if (Object.prototype.hasOwnProperty.call(answerInput, 'rating')) {
          if (answerInput.rating !== null) {
            const { rating } = answerInput
            const { max, min, stepSize } = question
            if (rating >= min && rating <= max && ((rating * 100) % (stepSize * 100)) === 0) {
              const distance = Math.abs(max - min)
              enhancedAnswer = { ...answerInput, normalized: ((rating - min) / distance), type: 'REGULATOR' }
            }
          } else { enhancedAnswer = { ...answerInput, normalized: null, type: 'REGULATOR' } }
        } break
      }
      case 'RANKING': {
        if (Object.prototype.hasOwnProperty.call(answerInput, 'rankedItems')) {
          if (answerInput.rankedItems !== null) {
            const rankedItems = answerInput.rankedItems.map(itemId => getMatchingId(itemId))
            const questionItems = question.items.reduce((acc, item) => [...acc, item.id], [])
            if (rankedItems.length === questionItems.length
              && _.without(questionItems, ...rankedItems).length === 0) {
              enhancedAnswer = { ...answerInput, type: 'RANKING' }
              enhancedAnswer.rankedItems = rankedItems
            }
          } else { enhancedAnswer = { ...answerInput, type: 'RANKING' } }
        } break
      }
      case 'FAVORITE': {
        if (Object.prototype.hasOwnProperty.call(answerInput, 'favoriteItem')) {
          if (answerInput.favoriteItem !== null) {
            const favoriteItem = getMatchingId(answerInput.favoriteItem)
            const questionItems = question.items.reduce((acc, item) => [...acc, item.id], [])
            if (questionItems.indexOf(favoriteItem) > -1) {
              enhancedAnswer = { ...answerInput, type: 'FAVORITE' }
              enhancedAnswer.favoriteItem = favoriteItem
            }
          } else { enhancedAnswer = { ...answerInput, type: 'FAVORITE' } }
        } break
      }
      default: throw new Error('Answer is not valid.')
    }

    if (!enhancedAnswer) throw new Error('Answer is not valid.')
    return enhancedAnswer
  }

  const enhanceAnswerIfAllowedAndValid = async ({ survey }, answerInput) => {
    const surveyId = survey.id
    if (!Object.prototype.hasOwnProperty.call(questionCache, surveyId)) {
      const questions = await models.question.get({ survey: surveyId })
      if (questions.length === 0) throw new Error('Answer is not valid.')

      const questionIds = questions.map(question => question.id)
      const cacheData = {
        questionIds,
        questions,
        timeout: setTimeout(() => {
          delete questionCache[surveyId]
        }, config.app.questionCacheTime),
      }

      questionCache[surveyId] = cacheData
    }

    clearTimeout(questionCache[surveyId].timeout)
    questionCache[surveyId].timeout = setTimeout(() => {
      delete questionCache[surveyId]
    }, config.app.questionCacheTime)

    const answerQuestionId = answerInput.question
    const questionIndex = questionCache[surveyId].questionIds.indexOf(answerQuestionId)
    if (questionIndex === -1) throw new Error('Answer is not valid.')

    const question = questionCache[surveyId].questions[questionIndex]

    return enhanceAnswerIfValid(question, answerInput)
  }

  const persistVote = async ({ domain, device, survey }, answers) => {
    const domainId = domain.id
    const deviceId = device.id
    const surveyId = survey.id
    const vote = {
      survey: surveyId,
      domain: domainId,
      device: deviceId,
      answers,
    }
    return models.vote.insert(vote)
  }

  const persistAnswer = async (deviceDependencies, answer) => {
    const { device, domain, survey } = deviceDependencies
    const deviceId = device.id
    const domainId = domain.id
    const surveyId = survey.id
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

    if (!Object.prototype.hasOwnProperty.call(answerCache[surveyId], domainId)) {
      answerCache[surveyId][domainId] = {}
    }

    if (!Object.prototype.hasOwnProperty.call(answerCache[surveyId][domainId], deviceId)) {
      answerCache[surveyId][domainId][deviceId] = {
        answers: [],
        timeout: setTimeout(() => {
          removeDeviceFromCache(surveyId, domainId, deviceId)
        }, config.app.deviceCacheTime),
      }
    }

    const presentAnswers = answerCache[surveyId][domainId][deviceId].answers
    const answerQuestionIds = presentAnswers.map(presentAnswer => presentAnswer.question)
    const answerQuestionIndex = answerQuestionIds.indexOf(answer.question)

    if (answerQuestionIndex > -1) {
      const oldAnswer = answerCache[surveyId][domainId][deviceId].answers[answerQuestionIndex]

      answerCache[surveyId][domainId][deviceId].answers[answerQuestionIndex] = answer

      eventEmitter.emit('Answer/Update', answer, oldAnswer, domainId, deviceId)

      return { answer, voteCreated: false }
    }

    if (questionIds.length === presentAnswers.length + 1) {
      const answers = [...answerCache[surveyId][domainId][deviceId].answers, answer]
      try {
        await persistVote(deviceDependencies, answers)
        removeDeviceFromCache(surveyId, domainId, deviceId)

        eventEmitter.emit('Answer/Insert', answer, domainId, deviceId)

        return { answer, voteCreated: true }
      } catch (e) {
        console.log(e)
        throw new Error('Vote could not be persistet. Please retry.')
      }
    }

    clearTimeout(answerCache[surveyId][domainId][deviceId].timeout)
    answerCache[surveyId][domainId][deviceId].timeout = setTimeout(() => {
      removeDeviceFromCache(surveyId, domainId, deviceId)
      eventEmitter.emit('Answer/Delete', domainId, deviceId)
    }, config.app.deviceCacheTime)

    answerCache[surveyId][domainId][deviceId].answers.push(answer)
    eventEmitter.emit('Answer/Insert', answer, domainId, deviceId)

    return { answer, voteCreated: false }
  }

  const createAnswer = async (deviceDependencies, answerInput) => {
    const updatedAnswerInput = await enhanceAnswerIfAllowedAndValid(deviceDependencies, answerInput)
    return persistAnswer(deviceDependencies, updatedAnswerInput)
  }

  eventEmitter.on('Survey/Delete', (deletedSurveys) => {
    deletedSurveys.forEach(survey => removeSurveyFromCache(survey.id))
  })

  eventEmitter.on('Domain/Delete', (deletedDomains) => {
    deletedDomains.forEach((domain) => {
      if (Object.prototype.hasOwnProperty.call(domain.toObject(), 'activeSurvey')
        && domain.activeSurvey !== null
        && domain.activeSurvey !== '') removeDomainFromCache(domain.activeSurvey, domain._id)
    })
  })

  eventEmitter.on('Device/Delete', (deletedDevices) => {
    deletedDevices.forEach(async (device) => {
      if (Object.prototype.hasOwnProperty.call(device.toObject(), 'domain')
        && device.domain !== null
        && device.domain !== '') {
        const [domain] = await models.domain.get({ _id: device.domain })

        if (Object.prototype.hasOwnProperty.call(domain.toObject(), 'activeSurvey')
          && domain.activeSurvey !== null
          && domain.activeSurvey !== '') removeDeviceFromCache(domain.activeSurvey, domain.id, device.id)
      }
    })
  })

  return Object.freeze({
    createAnswer,
  })
}
