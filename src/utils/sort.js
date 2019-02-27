const _ = require('underscore')

const sortObjectsByIdArray = (arrayOfIds, arrayOfObjects) => {
  /** Convert array of ids to Object with id:index pairs* */
  const sortObj = arrayOfIds.reduce((acc, id, index) => ({
    ...acc,
    [id]: index,
  }), {})
  /** Sort questions depending on the former Array of ids * */
  return _.sortBy(arrayOfObjects, object => sortObj[object.id])
}

const sortAnswersByQuestionIdArray = (arrayOfQuestionIds, arrayOfAnswers) => {
  /** Convert array of ids to Object with id:index pairs* */
  const sortObj = arrayOfQuestionIds.reduce((acc, id, index) => ({
    ...acc,
    [id]: index,
  }), {})
  /** Sort questions depending on the former Array of ids * */
  return _.sortBy(arrayOfAnswers, answer => sortObj[answer.question])
}

const sortInnerElementsOfQuestion = (question) => {
  if (question.items && question.items.length) {
    question.items = sortObjectsByIdArray(question.itemOrder, question.items)
  }

  if (question.choices && question.choices.length) {
    question.choices = sortObjectsByIdArray(question.choiceOrder, question.choices)
  }

  if (question.labels && question.labels.length) {
    question.labels = sortObjectsByIdArray(question.labelOrder, question.labels)
  }

  return question
}

module.exports = Object.freeze({
  sortObjectsByIdArray,
  sortAnswersByQuestionIdArray,
  sortInnerElementsOfQuestion
})

