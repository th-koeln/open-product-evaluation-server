const _ = require('underscore')
const config = require('../../config')
const { sortAnswersByQuestionIdArray } = require('../utils/sort')

/** cache für antworten { surveyId: { domainId: { clientID: { [answers], timeout } } } } * */
const answerCache = {}

/** cache für Questions (key = surveyID) * */
const questionCache = {}

const typeKeys = {
  LIKE: ['liked'],
  LIKEDISLIKE: ['liked'],
  CHOICE: ['choice'],
  REGULATOR: ['rating', 'normalized'],
  FAVORITE: ['favoriteItem'],
  RANKING: ['rankedItems'],
}

module.exports = (models, eventEmitter) => {
  const clearAllClientTimeoutsForSurvey = (surveyId) => {
    Object.keys(answerCache[surveyId]).forEach((cachedDomain) => {
      Object.keys(answerCache[surveyId][cachedDomain]).forEach((cachedClient) => {
        clearTimeout(answerCache[surveyId][cachedDomain][cachedClient].timeout)
      })
    })
  }

  const removeSurveyFromCache = (surveyId) => {
    if (Object.prototype.hasOwnProperty.call(answerCache, surveyId)) {
      clearAllClientTimeoutsForSurvey(surveyId)
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

  const removeClientFromCache = (surveyId, domainId, clientId) => {
    if (Object.prototype.hasOwnProperty.call(answerCache, surveyId)
      && Object.prototype.hasOwnProperty.call(answerCache[surveyId], domainId)) {
      clearTimeout(answerCache[surveyId][domainId][clientId].timeout)
      delete answerCache[surveyId][domainId][clientId]

      eventEmitter.emit('Cache/Client/Delete', clientId)

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
            const { choice } = answerInput
            const choices = question.choices.map(choiceDescription => choiceDescription.id)
            if (choices.indexOf(choice) > -1) {
              enhancedAnswer = { ...answerInput, type: 'CHOICE' }
              enhancedAnswer.choice = choice
            }
          } else { enhancedAnswer = { ...answerInput, type: 'CHOICE' } }
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
            const { rankedItems } = answerInput
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
            const { favoriteItem } = answerInput
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

    if (!enhancedAnswer) { throw new Error('Answer is not valid.') }
    enhancedAnswer.creationDate = new Date()
    return enhancedAnswer
  }

  const enhanceAnswerIfAllowedAndValid = async ({ survey }, answerInput) => {
    const surveyId = survey.id
    if (!Object.prototype.hasOwnProperty.call(questionCache, surveyId)) {
      const questions = await models.question.get({ survey: surveyId })
      if (questions.length === 0) { throw new Error('Answer is not valid.') }

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
    if (questionIndex === -1) { throw new Error('Answer is not valid.') }

    const question = questionCache[surveyId].questions[questionIndex]

    return enhanceAnswerIfValid(question, answerInput)
  }

  const persistVote = async ({ domain, client, survey }, answers) => {
    const [{ _id: versionId }] = await models.version.get(
      { survey: survey.id },
      null,
      null,
      { versionNumber: 'Descending' },
    )

    const orderedAnswers = sortAnswersByQuestionIdArray(survey.questionOrder, answers)

    const vote = {
      answers: orderedAnswers,
      version: versionId,
      survey: survey.id,
      domain: domain.id,
      client: client.id,
    }
    return models.vote.insert(vote)
  }

  const persistAnswer = async (clientDependencies, answer) => {
    const { client, domain, survey } = clientDependencies
    const clientId = client.id
    const domainId = domain.id
    const surveyId = survey.id
    const { questionIds } = questionCache[surveyId]

    if (questionIds.length === 1) {
      try {
        await persistVote(clientDependencies, [answer])
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

    if (!Object.prototype.hasOwnProperty.call(answerCache[surveyId][domainId], clientId)) {
      answerCache[surveyId][domainId][clientId] = {
        answers: [],
        timeout: setTimeout(() => {
          removeClientFromCache(surveyId, domainId, clientId)
        }, config.app.clientCacheTime),
      }
    }

    const presentAnswers = answerCache[surveyId][domainId][clientId].answers
    const answerQuestionIds = presentAnswers.map(presentAnswer => presentAnswer.question)
    const answerQuestionIndex = answerQuestionIds.indexOf(answer.question)

    if (answerQuestionIndex > -1) {
      const oldAnswer = answerCache[surveyId][domainId][clientId].answers[answerQuestionIndex]

      answerCache[surveyId][domainId][clientId].answers[answerQuestionIndex] = answer

      eventEmitter.emit('Answer/Update', answer, oldAnswer, domainId, clientId)

      return { answer, voteCreated: false }
    }

    if (questionIds.length === presentAnswers.length + 1) {
      const answers = [...answerCache[surveyId][domainId][clientId].answers, answer]
      try {
        await persistVote(clientDependencies, answers)
        removeClientFromCache(surveyId, domainId, clientId)

        eventEmitter.emit('Answer/Insert', answer, domainId, clientId)

        return { answer, voteCreated: true }
      } catch (e) {
        throw new Error('Vote could not be persistet. Please retry.')
      }
    }

    clearTimeout(answerCache[surveyId][domainId][clientId].timeout)
    answerCache[surveyId][domainId][clientId].timeout = setTimeout(() => {
      removeClientFromCache(surveyId, domainId, clientId)
      eventEmitter.emit('Answer/Delete', domainId, clientId)
    }, config.app.clientCacheTime)

    answerCache[surveyId][domainId][clientId].answers.push(answer)
    eventEmitter.emit('Answer/Insert', answer, domainId, clientId)

    return { answer, voteCreated: false }
  }

  const createAnswer = async (clientDependencies, answerInput) => {
    const updatedAnswerInput = await enhanceAnswerIfAllowedAndValid(clientDependencies, answerInput)
    return persistAnswer(clientDependencies, updatedAnswerInput)
  }

  const removeAnswerForQuestion = (questionId, clientDependencies) => {
    const surveyId = clientDependencies.survey.id
    const domainId = clientDependencies.domain.id
    const clientId = clientDependencies.client.id

    if (!answerCache[surveyId]
      || !answerCache[surveyId][domainId]
      || !answerCache[surveyId][domainId][clientId]) {
      return true
    }

    clearTimeout(answerCache[surveyId][domainId][clientId].timeout)
    answerCache[surveyId][domainId][clientId].timeout = setTimeout(() => {
      removeClientFromCache(surveyId, domainId, clientId)
      eventEmitter.emit('Answer/Delete', domainId, clientId)
    }, config.app.clientCacheTime)

    const presentAnswers = answerCache[surveyId][domainId][clientId].answers
    const answerQuestionIds = presentAnswers.map(presentAnswer => presentAnswer.question)
    const answerQuestionIndex = answerQuestionIds.indexOf(questionId)

    if (answerQuestionIndex === -1) {
      return true
    }

    const newAnswer = Object.assign({}, presentAnswers[answerQuestionIndex])

    Object.keys(newAnswer).forEach((key) => {
      if (typeKeys[newAnswer.type].includes(key)) {
        newAnswer[key] = null
      }
    })

    answerCache[surveyId][domainId][clientId].answers[answerQuestionIndex] = newAnswer

    return true
  }

  eventEmitter.on('Survey/Delete', (deletedSurveys) => {
    deletedSurveys.forEach(survey => removeSurveyFromCache(survey.id))
  })

  eventEmitter.on('Domain/Update', (updatedDomains, oldDomains) => {
    updatedDomains.forEach((domain, index) => {
      if (oldDomains[index].activeSurvey
        && domain.activeSurvey !== oldDomains[index].activeSurvey) {
        removeDomainFromCache(oldDomains[index].activeSurvey, domain._id)
      }
    })
  })

  eventEmitter.on('Domain/Delete', (deletedDomains) => {
    deletedDomains.forEach((domain) => {
      if (Object.prototype.hasOwnProperty.call(domain.toObject(), 'activeSurvey')
        && domain.activeSurvey !== null
        && domain.activeSurvey !== '') { removeDomainFromCache(domain.activeSurvey, domain._id) }
    })
  })

  eventEmitter.on('Client/Delete', (deletedClients) => {
    deletedClients.forEach(async (client) => {
      if (Object.prototype.hasOwnProperty.call(client.toObject(), 'domain')
        && client.domain !== null
        && client.domain !== '') {
        const [domain] = await models.domain.get({ _id: client.domain })

        if (Object.prototype.hasOwnProperty.call(domain.toObject(), 'activeSurvey')
          && domain.activeSurvey !== null
          && domain.activeSurvey !== '') { removeClientFromCache(domain.activeSurvey, domain.id, client.id) }
      }
    })
  })

  return Object.freeze({
    createAnswer,
    removeAnswerForQuestion,
  })
}
