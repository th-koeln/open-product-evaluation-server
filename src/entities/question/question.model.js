const questionModel = {}
module.exports = questionModel

const questionSchema = require('./question.schema')
const dbLoader = require('../../utils/dbLoader')
const imageModel = require('../image/image.model')
const surveyModel = require('../survey/survey.model')
const _ = require('underscore')

const Question = dbLoader.getDB().model('question', questionSchema, 'question')


const getQuestionsImagesForKey = (questions, key) => questions.reduce((acc, question) => {
  let questionImages = []
  if (Object.prototype.hasOwnProperty.call(question.toObject(), key)
    && question.toObject()[key] !== null) {
    questionImages = question.toObject()[key].reduce((accOldKey, object) =>
      ((Object.prototype.hasOwnProperty.call(object, 'image')) ? [...accOldKey, object.image.toString()] : accOldKey), [])
  }

  const images = [...acc, ...questionImages]
  return images
}, [])

const getAllQuestionsImages = (questions) => {
  const items = getQuestionsImagesForKey(questions, 'items')
  const labels = getQuestionsImagesForKey(questions, 'labels')
  const choices = getQuestionsImagesForKey(questions, 'choices')
  const all = [...items, ...labels, ...choices]

  return _.uniq(all)
}

const checkForAndReturnReplacedImages = async (oldQuestions, updatedQuestions, key) => {
  const oldQuestionsImages = getQuestionsImagesForKey(oldQuestions, key)
  const updatedQuestionsImages = getQuestionsImagesForKey(updatedQuestions, key)
  const replacedImages = _.without(oldQuestionsImages, ...updatedQuestionsImages)

  return replacedImages
}

const removeImagesIfNotReferenced = async (images) => {
  const questionsWithReplacedImages = await Question.find({
    $or:
      [{ 'items.image': { $in: images } },
        { 'labels.image': { $in: images } },
        { 'choices.image': { $in: images } }],
  })

  const foundImages = getAllQuestionsImages(questionsWithReplacedImages)
  const removedImages = _.without(images, ...foundImages)

  if (removedImages.length > 0) await imageModel.delete({ _id: { $in: removedImages } })
}

questionModel.get = async (find, limit, offset, sort) => {
  try {
    const questions = await Question.find(find).limit(limit).skip(offset).sort(sort)
    if (questions.length === 0) throw new Error('No Question found.')
    return questions
  } catch (e) {
    throw e
  }
}

questionModel.insert = async (object) => {
  try {
    const question = await new Question(object).save()
    try {
      await surveyModel.update({ _id: question.survey }, { $push: { questions: question.id } })
    } catch (e) {
      console.log(e)
    }
    return question
  } catch (e) {
    throw e
  }
}

questionModel.update = async (where, data) => {
  try {
    let oldQuestions
    if (data.items || data.labels || data.choices) oldQuestions = await Question.find(where)
    const result = await Question.updateMany(where, data)
    if (result.nMatched === 0) throw new Error('No Question found.')
    if (result.nModified === 0) throw new Error('Question update failed.')
    const updatedQuestions = await Question.find(where)

    if (oldQuestions) {
      let replacedItems = []
      let replacedLabels = []
      let replacedChoices = []
      try {
        if (Object.prototype.hasOwnProperty.call(data, 'items')) replacedItems = await checkForAndReturnReplacedImages(oldQuestions, updatedQuestions, 'items')
      } catch (e) {
        console.log(e)
      }
      try {
        if (Object.prototype.hasOwnProperty.call(data, 'labels')) replacedLabels = await checkForAndReturnReplacedImages(oldQuestions, updatedQuestions, 'labels')
      } catch (e) {
        console.log(e)
      }
      try {
        if (Object.prototype.hasOwnProperty.call(data, 'choices')) replacedChoices = await checkForAndReturnReplacedImages(oldQuestions, updatedQuestions, 'choices')
      } catch (e) {
        console.log(e)
      }

      const replacedImages = _.uniq([...replacedItems, ...replacedLabels, ...replacedChoices])

      try {
        if (replacedImages.length > 0) await removeImagesIfNotReferenced(replacedImages)
        //  TODO: Check amount of deleted Images and retry those still there
      } catch (e) {
        console.log(e)
      }
    }

    return updatedQuestions
  } catch (e) {
    throw e
  }
}

questionModel.delete = async (where) => {
  try {
    const questions = await Question.find(where)
    const result = await Question.deleteMany(where)
    if (result.n === 0) throw new Error('Question deletion failed.')

    const itemImages = getQuestionsImagesForKey(questions, 'items')
    const labelImages = getQuestionsImagesForKey(questions, 'labels')
    const choiceImages = getQuestionsImagesForKey(questions, 'choices')
    const imagesToDelete = _.uniq([...itemImages, ...labelImages, ...choiceImages])

    try {
      if (imagesToDelete.length > 0) await removeImagesIfNotReferenced(imagesToDelete)
      //  TODO: Check amount of deleted Images and retry those still there
    } catch (e) {
      console.log(e)
    }

    //  TODO: Check amount of deleted Questions and retry those still there
    return result
  } catch (e) {
    throw e
  }
}
