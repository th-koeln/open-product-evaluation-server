const questionSchema = require('./question.schema')
const _ = require('underscore')

module.exports = (db, eventEmitter) => {
  const questionModel = {}

  const Question = db.model('question', questionSchema, 'question')

  const getAllQuestionTypesOfSurvey = async (surveyId) => {
    const questions = await questionModel.get({ survey: surveyId })
    const types = _.uniq((questions).map(question => question.type))
    return types
  }

  const getQuestionsImagesForKey = (questions, key) => questions.reduce((acc, question) => {
    let questionImages = []
    if (Object.prototype.hasOwnProperty.call(question.toObject(), key)
      && question.toObject()[key] !== null) {
      questionImages = question.toObject()[key].reduce((accOldKey, object) =>
        ((Object.prototype.hasOwnProperty.call(object, 'image')
          && object.image !== null
          && object.image !== '') ? [...accOldKey, object.image.toString()] : accOldKey), [])
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

    //  TODO: Improve / Remake !!!!!!!
    if (removedImages.length > 0) eventEmitter.emit('Image/Removed', removedImages)
  }

  questionModel.get = async (find, limit, offset, sort) => {
    try {
      const questions = await Question.find(find)
        .limit(limit)
        .skip(offset)
        .sort(sort)
      if (questions.length === 0) throw new Error('No Question found.')
      return questions
    } catch (e) {
      throw e
    }
  }

  questionModel.insert = async (object) => {
    try {
      const question = await new Question(object).save()
      const newQuestionTypesOfSurvey = await getAllQuestionTypesOfSurvey(`${question.survey}`)

      eventEmitter.emit('Question/Insert', question, newQuestionTypesOfSurvey)

      return question
    } catch (e) {
      throw e
    }
  }

  questionModel.update = async (where, data) => {
    try {
      const oldQuestions = await Question.find(where)
      const result = await Question.updateMany(where, data)
      if (result.nMatched === 0) throw new Error('No Question found.')
      if (result.nModified === 0) throw new Error('Question update failed.')
      const updatedQuestions = await Question.find(where)

      eventEmitter.emit('Question/Update', updatedQuestions, oldQuestions)

      if (oldQuestions) {
        //  TODO: Improve / Remake !!!!!!!
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

      const notDeletedQuestions = await Question.find(where)
      const deletedQuestions = questions.filter(question => !notDeletedQuestions.includes(question))

      if (deletedQuestions.length > 0) {
        const surveyIds = deletedQuestions.reduce((acc, question) =>
          (acc.includes(question.survey) ? acc : [...acc, question.survey]), [])
        const getTypesPromises = surveyIds.map(question => getAllQuestionTypesOfSurvey(`${question.survey}`))
        const newQuestionTypesOfSurveys = (await Promise.all(getTypesPromises))
          .map((types, index) => ({
            survey: surveyIds[index],
            types,
          }))

        eventEmitter.emit('Question/Delete', deletedQuestions, newQuestionTypesOfSurveys)

        //  TODO: Improve / Remake !!!!!!!
        const itemImages = getQuestionsImagesForKey(deletedQuestions, 'items')
        const labelImages = getQuestionsImagesForKey(deletedQuestions, 'labels')
        const choiceImages = getQuestionsImagesForKey(deletedQuestions, 'choices')
        const imagesToDelete = _.uniq([...itemImages, ...labelImages, ...choiceImages])

        try {
          if (imagesToDelete.length > 0) await removeImagesIfNotReferenced(imagesToDelete)
          //  TODO: Check amount of deleted Images and retry those still there
        } catch (e) {
          console.log(e)
        }
      }

      //  TODO: Check amount of deleted Questions and retry those still there
      return result
    } catch (e) {
      throw e
    }
  }

  /** EventEmitter reactions * */

  /** Delete Questions and all sub-documents when survey was deleted * */
  eventEmitter.on('Survey/Delete', async (deletedSurveys) => {
    try {
      const deletedIds = deletedSurveys.map(survey => survey.id)
      await questionModel.delete({ survey: { $in: deletedIds } })
    } catch (e) {
      // TODO:
      // ggf. Modul erstellen, welches fehlgeschlagene DB-Zugriffe
      // in bestimmten abständen wiederholt
      // (nur für welche, die nicht ausschlaggebend für erfolg der query sind)
      console.log(e)
    }
  })

  return Object.freeze(questionModel)
}
