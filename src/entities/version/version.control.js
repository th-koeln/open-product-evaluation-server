const { sortObjectsByIdArray, sortInnerElementsOfQuestion } = require('../../utils/sort')

const checkIfUpdateIsNeeded = async (version, models) => {
  try {
    await models.vote.get({ version: version.id })
    return true
  } catch (e) { return false }
}

const createDuplicateImage = async (imageId, models) => {
  const [image] = await models.image.get({ _id: imageId })

  const duplicateImage = image.toObject()
  delete duplicateImage._id

  return (await models.image.insert(duplicateImage)).id
}

const replaceImagesOfInnerElements = async (elements, models) => Promise.all(
  elements.map(async (element) => {
    const updatedElement = { ...element.toObject() }
    if (element.image) updatedElement.image = await createDuplicateImage(element.image, models)

    return updatedElement
  })
)

const replaceImagesOfQuestionsByDuplicates = async (questions, models) => {
  const updatePromises = questions.map(async (question) => {
    const updatedQuestion = { ...question.toObject() }

    if (question.likeIcon) {
      updatedQuestion.likeIcon = await createDuplicateImage(question.likeIcon, models)
    }

    if (question.dislikeIcon) {
      updatedQuestion.dislikeIcon = await createDuplicateImage(question.dislikeIcon, models)
    }

    if (question.choices && question.choices.length > 0) {
      updatedQuestion.choices = await replaceImagesOfInnerElements(question.choices, models)
    }

    if (question.labels && question.labels.length > 0) {
      updatedQuestion.labels = await replaceImagesOfInnerElements(question.labels, models)
    }

    if (question.items && question.items.length > 0) {
      updatedQuestion.items = await replaceImagesOfInnerElements(question.items, models)
    }

    return updatedQuestion
  })

  return Promise.all(updatePromises)
}



const completeCurrentVersion = async (version, models) => {
  const [{ questionOrder }] = await models.survey.get({ _id: version.survey })
  const currentQuestions = await models.question.get({ survey: version.survey })

  const sortedQuestions = sortObjectsByIdArray(questionOrder, currentQuestions)
    .map(question => sortInnerElementsOfQuestion(question))

  const updatedQuestions = await replaceImagesOfQuestionsByDuplicates(sortedQuestions, models)

  await models.version.update({ _id: version.id }, {
    questions: updatedQuestions,
    to: new Date(),
  })
}

const createNewVersion = async (currentVersion, models) => {
  const versionNumber = currentVersion.versionNumber + 1
  await models.version.insert({
    versionNumber,
    survey: currentVersion.survey,
  })
}

const createVersionIfNeeded = async (surveyId, models) => {
  try {
    const [currentVersion] = await models.version.get(
      { survey: surveyId },
      null,
      null,
      { versionNumber: 'Descending' }
    )

    if (await checkIfUpdateIsNeeded(currentVersion, models)) {
      await completeCurrentVersion(currentVersion, models)
      await createNewVersion(currentVersion, models)
    }
  } catch (e) { }
}

module.exports = Object.freeze({
  createVersionIfNeeded
})
