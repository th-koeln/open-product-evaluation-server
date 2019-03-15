/**
 * Created by Dennis Dubbert on 17.09.18.
 */
const { ObjectId } = require('mongodb')
const { createHash } = require('crypto')
const { sortAnswersByQuestionIdArray } = require('../../../src/utils/sort')

const questions = require('../seeds/question/question')
const surveys = require('../seeds/survey/survey')
const clients = require('../seeds/client/client')
const domains = require('../seeds/domain/domain')
const versions = require('../seeds/versionEntry/versionEntry')

/*
  domain {
    domainId
    clients [clientId]
  }

  question {
    id
    type
    questionData {
      items
      choiceCodes
      min
      max
    }
  }
 */

function shuffle(array) {
  const stringArray = array.map(item => item.toString())
  const shuffledArray = stringArray
  let currentIndex = array.length
  let temporaryValue
  let randomIndex

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex -= 1

    temporaryValue = stringArray[currentIndex]
    shuffledArray[currentIndex] = stringArray[randomIndex]
    shuffledArray[randomIndex] = temporaryValue
  }

  return shuffledArray
}

function getRndInteger(min, max) {
  return Math.floor(Math.random() * ((max - min) + 1)) + min
}

function randomDate(start, end) {
  return new Date(start.getTime() + (Math.random() * (end.getTime() - start.getTime())))
}

function addMinutesToDate(date, minutes) {
  return new Date(date.getTime() + (minutes * 60000))
}

const getRandomAnswer = (type, question, data, i, date) => {
  const creationDate = randomDate(date, addMinutesToDate(date, -30))
  switch (type) {
    case 'LIKE': {
      const random = Math.floor(Math.random() * 11)
      let liked
      if (random > 7) {
        liked = false
      } else {
        liked = (random < 2) ? null : true
      }
      return {
        creationDate,
        question,
        type,
        liked,
      }
    }
    case 'LIKEDISLIKE': {
      const random = Math.floor(Math.random() * 11)
      let liked
      if (random > 7) {
        liked = false
      } else {
        liked = (random < 1) ? null : true
      }
      return {
        creationDate,
        question,
        type,
        liked,
      }
    }
    case 'CHOICE': {
      const random = Math.floor(Math.random() * 11)
      return {
        creationDate,
        question,
        type,
        choice: (random > 9)
          ? null
          : data.choices[Math.floor(Math.random() * data.choices.length)],
      }
    }
    case 'REGULATOR': {
      const random = Math.floor(Math.random() * 11)
      const distance = Math.abs(data.max - data.min)
      const rating = (random > 9) ? null : getRndInteger(data.min, data.max)
      return {
        creationDate,
        question,
        type,
        rating,
        normalized: (rating) ? ((rating - data.min) / distance) : null,
      }
    }
    case 'RANKING': {
      const random = Math.floor(Math.random() * 11)
      return {
        creationDate,
        id: i,
        question,
        type,
        rankedItems: (random > 9) ? null : shuffle(data.items),
      }
    }
    case 'FAVORITE': {
      const random = Math.floor(Math.random() * 11)
      return {
        creationDate,
        question,
        type,
        favoriteItem:
          (random > 9) ? null : data.items[Math.floor(Math.random() * data.items.length)],
      }
    }
    default: throw new Error('Answer generation error.')
  }
}

const getObjectID = (name) => {
  const hash = createHash('sha1')
    .update(name, 'utf8')
    .digest('hex')

  return new ObjectId(hash.substring(0, 24))
}

const generateTestVotes = (amount, version, survey, domainsData, questionsData) => {
  const newVotes = [...Array(amount).keys()].map((value, index) => {
    const domainObject = domainsData[Math.floor(Math.random() * domainsData.length)]
    const domain = domainObject.domainId
    const client = domainObject.clients[Math.floor(Math.random() * domainObject.clients.length)]
    const date = randomDate(version.from, (version.to) ? version.to : new Date())

    const answersData = questionsData
      .map(question =>
        getRandomAnswer(question.type, question.id, question.questionData, value, date))

    const orderedAnswers = sortAnswersByQuestionIdArray(survey.questionOrder, answersData)

    return {
      domain,
      client,
      _id: getObjectID(`${version._id}vote${index}`),
      version: version._id,
      survey: survey._id,
      answers: orderedAnswers,
      creationDate: date,
      lastUpdate: date,
    }
  })

  return newVotes
}

const getVotes = (amount) => {
  const votes =  surveys.reduce((acc, surveyData) => {
    const surveyId = surveyData._id
    const domainIds = domains
      .filter(domain => domain.activeSurvey.toString() === surveyId.toString())
      .map(domain => domain._id)

    if (domainIds.length === 0) {
      return acc
    }

    const domainsData = domainIds.reduce((innerAcc, domainId) => {
      const clientIds = clients
        .filter(client => client.domain && domainId.toString() === client.domain.toString())
        .map(client => client._id)

      if (clientIds.length === 0) {
        return innerAcc
      }

      return [...innerAcc, { domainId, clients: clientIds }]
    }, [])

    if (domainsData.length === 0) {
      return acc
    }

    const questionsData = questions
      .filter(question => question.survey.toString() === surveyId.toString())
      .map((question) => {
        const items = (question.items)
          ? question.items.map(item => item._id)
          : null

        const choices = (question.choices)
          ? question.choices.map(choice => choice._id)
          : null

        return {
          id: question._id,
          type: question.type,
          questionData: {
            items,
            choices,
            min: (question.min) ? question.min : null,
            max: (question.max) ? question.max : null,
          },
        }
      })

    if (questionsData.length === 0) {
      return acc
    }

    const surveyVersions = versions.filter(version => version.survey.toString() === surveyData._id.toString())

    const versionVotes = surveyVersions.reduce((innerAcc, version) => {

      const currentVotes = generateTestVotes(
        amount,
        version,
        surveyData,
        domainsData,
        questionsData,
      )

      return [...innerAcc, ...currentVotes]
    }, [])

    return [...acc, ...versionVotes]
  }, [])

  return votes
}

module.exports = getVotes
