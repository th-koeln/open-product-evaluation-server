const { getObjectID } = require('../../helper/helpers.js')
const surveys = require('../survey/survey')
const questions = require('../question/question')

const addHours = (date, h) => {
  const newDate = new Date(date.getTime())
  newDate.setTime(newDate.getTime() + (h*60*60*1000))
  return newDate
}

const versionEntry = surveys.reduce((acc, survey) => {
  const surveyQuestions = questions.filter(question => question.survey.toString() === survey._id.toString())

  const indexArray = Array.apply(null, {length: 5}).map(Number.call, Number)
  indexArray.shift()
  let startingDate = new Date()
  const surveyVersions = indexArray.map((index) => {
    const endDate = addHours(startingDate, 2)
    const v = {
      _id: getObjectID(`${survey._id}version${index}`),
      versionNumber: index,
      survey: survey._id,
      from: startingDate,
    }

    if (index !== indexArray[indexArray.length - 1]) {
      v.questions = surveyQuestions
      v.to = endDate
    }

    startingDate = endDate
    return v
  })

  return [...acc, ...surveyVersions]
}, [])

module.exports = versionEntry
