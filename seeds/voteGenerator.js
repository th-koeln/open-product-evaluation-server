/**
 * Created by Dennis Dubbert on 17.09.18.
 */
const { ObjectId } = require('mongodb')
const { createHash } = require('crypto')
const questions = require('./data/question/question')
const surveys = require('./data/survey/survey')
const devices = require('./data/device/device')
const contexts = require('./data/context/context')

/*
  context {
    contextId
    devices [deviceId]
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
  const shuffledArray = array
  let currentIndex = array.length
  let temporaryValue
  let randomIndex

  // While there remain elements to shuffle...
  while (currentIndex !== 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex -= 1

    // And swap it with the current element.
    temporaryValue = array[currentIndex]
    shuffledArray[currentIndex] = array[randomIndex]
    shuffledArray[randomIndex] = temporaryValue
  }

  return array
}

function getRndInteger(min, max) {
  return Math.floor(Math.random() * ((max - min) + 1)) + min
}

const getRandomAnswer = (type, question, data) => {
  switch (type) {
    case 'LIKE': {
      const random = Math.floor(Math.random() * 11)
      let liked
      if (random > 7) liked = false
      else liked = (random < 2) ? null : true
      return {
        question,
        type,
        liked,
      }
    }
    case 'LIKEDISLIKE': {
      const random = Math.floor(Math.random() * 11)
      let liked
      if (random > 7) liked = false
      else liked = (random < 2) ? null : true
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
        choiceCode: (random > 7)
          ? null
          : data.choiceCodes[Math.floor(Math.random() * data.choiceCodes.length)],
      }
    }
    case 'REGULATOR': {
      const random = Math.floor(Math.random() * 11)
      const distance = Math.abs(data.max - data.min)
      const rating = (random > 7) ? null : getRndInteger(data.min, data.max)
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
        question,
        type,
        rankedItems: (random > 7) ? null : shuffle(data.items),
      }
    }
    case 'FAVORITE': {
      const random = Math.floor(Math.random() * 11)
      return {
        question,
        type,
        favoriteItem:
          (random > 7) ? null : data.items[Math.floor(Math.random() * data.items.length)],
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

const generateTestVotes = (amount, survey, contextsData, questionsData) => {
  const votes = [];

  [...Array(amount).keys()].forEach((index) => {
    const contextObject = contextsData[Math.floor(Math.random() * contextsData.length)]
    const context = contextObject.contextId
    const device = contextObject.devices[Math.floor(Math.random() * contextObject.devices.length)]

    const answers = questionsData
      .map(question => getRandomAnswer(question.type, question.id, question.questionData))

    const date = randomDate(new Date('2018-09-15T14:45:10.603Z'), new Date())

    votes.push({
      _id: getObjectID(`vote${survey}${index}`),
      survey,
      context,
      device,
      answers,
      creationDate: date,
      lastUpdate: date,
    })
  })

  return votes
}

const getVotes = (amount) => {
  const votes = surveys.reduce((acc, surveyData) => {
    const surveyId = surveyData._id
    const contextIds = contexts
      .filter(context => context.activeSurvey.toString() === surveyId.toString())
      .map(context => context._id)

    if (contextIds.length === 0) return acc

    const contextsData = contextIds.reduce((innerAcc, contextId) => {
      const deviceIds = devices
        .filter(device => device.context && contextId.toString() === device.context.toString())
        .map(device => device._id)

      if (deviceIds.length === 0) return innerAcc

      return [...innerAcc, { contextId, devices: deviceIds }]
    }, [])

    if (contextsData.length === 0) return acc

    const questionsData = questions
      .filter(question => question.survey.toString() === surveyId.toString())
      .map((question) => {
        const items = (question.items)
          ? question.items.map(item => item._id)
          : null

        const choiceCodes = (question.choices)
          ? question.choices.map(choice => choice.code)
          : null

        return {
          id: question._id,
          type: question.type,
          questionData: {
            items,
            choiceCodes,
            min: (question.min) ? question.min : null,
            max: (question.max) ? question.max : null,
          },
        }
      })

    if (questionsData.length === 0) return acc

    return [...acc, ...generateTestVotes(amount, surveyId, contextsData, questionsData)]
  }, [])

  return votes
}

module.exports = getVotes
