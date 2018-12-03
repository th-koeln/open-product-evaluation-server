/**
 * Created by Dennis Dubbert on 17.09.18.
 */
const { ObjectId } = require('mongodb')
const { createHash } = require('crypto')
const questions = require('./data/question/question')
const surveys = require('./data/survey/survey')
const clients = require('./data/client/client')
const domains = require('./data/domain/domain')

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

const getRandomAnswer = (type, question, data, i) => {
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
        question,
        type,
        liked,
      }
    }
    case 'CHOICE': {
      const random = Math.floor(Math.random() * 11)
      return {
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
        question,
        type,
        rating,
        normalized: (rating) ? ((rating - data.min) / distance) : null,
      }
    }
    case 'RANKING': {
      const random = Math.floor(Math.random() * 11)
      return {
        id: i,
        question,
        type,
        rankedItems: (random > 9) ? null : shuffle(data.items),
      }
    }
    case 'FAVORITE': {
      const random = Math.floor(Math.random() * 11)
      return {
        question,
        type,
        favoriteItem:
          (random > 9) ? null : data.items[Math.floor(Math.random() * data.items.length)],
      }
    }
    default: throw new Error('penis')
  }
}

function randomDate(start, end) {
  return new Date(start.getTime() + (Math.random() * (end.getTime() - start.getTime())))
}

const getObjectID = (name) => {
  const hash = createHash('sha1')
    .update(name, 'utf8')
    .digest('hex')

  return new ObjectId(hash.substring(0, 24))
}

const generateTestVotes = (amount, survey, domainsData, questionsData) => {
  const newVotes = [...Array(amount).keys()].map((value, index) => {
    const domainObject = domainsData[Math.floor(Math.random() * domainsData.length)]
    const domain = domainObject.domainId
    const client = domainObject.clients[Math.floor(Math.random() * domainObject.clients.length)]
    const date = randomDate(new Date('2018-09-15T14:45:10.603Z'), new Date())

    const answersData = questionsData
      .map(question => getRandomAnswer(question.type, question.id, question.questionData, value))

    return {
      _id: getObjectID(`vote${survey}${index}`),
      survey,
      domain,
      client,
      answers: answersData,
      creationDate: date,
      lastUpdate: date,
    }
  })

  return newVotes
}

const getVotes = (amount) => {
  const votes = surveys.reduce((acc, surveyData) => {
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

    return [...acc, ...generateTestVotes(amount, surveyId, domainsData, questionsData)]
  }, [])

  return votes
}

module.exports = getVotes
