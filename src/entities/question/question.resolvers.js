const _ = require('underscore')
const { ADMIN } = require('../../utils/roles')
const { sortObjectsByIdArray } = require('../../utils/sort')
const { createVersionIfNeeded } = require('../version/version.control')
const { valueExists, arrayExists, stringExists } = require('../../utils/checks')

const isValueInRange = (value, min, max) => value >= min && value <= max

const getValidValueInRange = (value, min, max) => {
  if (isValueInRange(value, min, max)) return value
  if (value > max) return max
  return min
}

const getValidLabelsForRange = (labels, min, max) => labels.map(label => {
  const validLabel = (label.toObject) ? label.toObject() : { ...label }
  if (valueExists(validLabel, 'value')) {
    validLabel.value = getValidValueInRange(validLabel.value, min, max)
  }

  return validLabel
})

const getRequestedQuestionIfAuthorized = async (auth, questionId, models) => {
  const [question] = await models.question.get({ _id: questionId })

  if (!(auth.role === ADMIN || auth.id === question.user)) {
    throw new Error('Not authorized or no permissions.')
  }

  return question
}

const getUpdateWithoutImageField = data => Object.keys(data).reduce((acc, key) => ((key !== 'image')
  ? { ...acc, [key]: data[key] }
  : acc), {})

const uploadImage = async (
  image,
  questionId,
  userId,
  models,
  imageStore,
  bonusDBImageAttributes) => {
  const upload = await imageStore.saveImage(await image, userId)

  const updatedUpload = {
    ...upload,
    ...bonusDBImageAttributes,
    user: userId,
    question: questionId,
  }

  try {
    return models.image.insert(updatedUpload)
  } catch (e) {
    await imageStore.removeImage(upload.name, userId)
    throw new Error('Image upload failed. Try again later.')
  }
}

const uploadIcon = async (key, data, question, models, imageStore) => {
  const [survey] = await models.survey.get({ _id: question.survey })

  return uploadImage(
    data[key],
    question.id,
    survey.creator,
    models,
    imageStore,
    {},
  )
}

const resetQuestionToDefault = async (question, models) => {
  // eslint-disable-next-line
  await Promise.all(question.labels.map(label => models.question.deleteLabel(question.id, label.id)))
  // eslint-disable-next-line
  await Promise.all(question.choices.map(choice => models.question.deleteChoice(question.id, choice.id)))

  return models.question.update({ _id: question.id }, {
    $unset: { likeIcon: '', dislikeIcon: '', choiceDefault: '' },
    stepSize: 1,
    min: 0,
    max: 10,
    regulatorDefault: 5,
  })
}

const checkIfAllIdsArePresent = async (arrayOfIds, arrayOfObjects) => {
  const presentIds = arrayOfObjects.map(object => object.id)

  if (_.difference(arrayOfIds, presentIds).length !== 0) {
    throw new Error('Adding new Objects is not allowed in Question update.')
  }
}

const processQuestionUpdate = async (data, question, models, imageStore) => {
  const updatedData = data

  const min = 0
  const max = (updatedData.max) ? updatedData.max : question.max

  if (min >= max) throw new Error('The maximum value needs to be greater than 0.')

  if (valueExists(updatedData, 'regulatorDefault')
    && !isValueInRange(updatedData.regulatorDefault, min, max)) {
    throw new Error('The default value is not in range of min and max.')
  }

  if (valueExists(updatedData, 'max')) {
    if (!valueExists(updatedData, 'regulatorDefault')) {
      updatedData.regulatorDefault = getValidValueInRange(question.regulatorDefault, min, max)
    }

    const labels = question.labels
    updatedData.labels = getValidLabelsForRange(labels, min, max)
  }

  if (updatedData.itemOrder) {
    updatedData.itemOrder = _.uniq(updatedData.itemOrder)
    await checkIfAllIdsArePresent(updatedData.itemOrder, question.items)
  }

  if (updatedData.choiceOrder) {
    updatedData.choiceOrder = _.uniq(updatedData.choiceOrder)
    await checkIfAllIdsArePresent(updatedData.choiceOrder, question.choices)
  }

  if (updatedData.labelOrder) {
    updatedData.labelOrder = _.uniq(updatedData.labelOrder)
    await checkIfAllIdsArePresent(updatedData.labelOrder, question.labels)
  }

  if (updatedData.choiceDefault) {
    const presentChoices = question.choices.map(choice => choice.id)
    if (!presentChoices.includes(updatedData.choiceDefault)) {
      throw new Error('Default choice not found in present choices.')
    }
  }

  if (updatedData.likeIcon) {
    const likeIconData = await uploadIcon('likeIcon', data, question, models, imageStore)
    updatedData.likeIcon = likeIconData.id
  }

  if (updatedData.dislikeIcon) {
    const dislikeIconData = await uploadIcon('dislikeIcon', data, question, models, imageStore)
    updatedData.dislikeIcon = dislikeIconData.id
  }

  await createVersionIfNeeded(question.survey, models)

  if (data.type && data.type !== question.type) {
    await resetQuestionToDefault(question, models)
  }

  const [updatedQuestion] = await models.question.update({ _id: question.id }, updatedData)
  return updatedQuestion
}

const sharedResolver = {
  value: async parent =>
    (stringExists(parent, 'value')
      ? parent.value : null),
  description: async parent =>
    (stringExists(parent, 'description')
      ? parent.description : null),
  items: async (parent) => {
    if (arrayExists(parent, 'items')) {
      const { items, itemOrder } = parent
      return sortObjectsByIdArray(itemOrder, items)
    }
    return null
  },
}

module.exports = {
  Mutation: {
    createQuestion: async (parent, { data }, { request, models }) => {
      const { auth } = request
      const [survey] = await models.survey.get({ _id: data.surveyID })

      if (!(auth.role === ADMIN || auth.id === survey.creator)) {
        throw new Error('Not authorized or no permissions.')
      }

      if (survey.isActive) {
        throw new Error('Survey needs to be inactive for updates.')
      }

      const updatedData = data
      updatedData.survey = data.surveyID
      delete updatedData.surveyID
      updatedData.user = survey.creator

      let questionPosition = survey.questionOrder.length + 1

      if (data.previousQuestionID) {
        const index = survey.questionOrder.indexOf(data.previousQuestionID)

        if (index > -1) {
          questionPosition = index + 1
        }

        delete updatedData.previousQuestionID
      }

      await createVersionIfNeeded(survey.id, models)

      return { question: await models.question.insert(updatedData, questionPosition) }
    },
    updateQuestion: async (parent, { data, questionID }, { request, models, imageStore }) => {
      const { auth } = request
      const question = await getRequestedQuestionIfAuthorized(auth, questionID, models)
      const [survey] = await models.survey.get({ _id: question.survey })

      if (survey.isActive) { throw new Error('Survey needs to be inactive for updates.') }

      return { question: await processQuestionUpdate(data, question, models, imageStore) }
    },
    deleteQuestion: async (parent, { questionID }, { request, models }) => {
      const { auth } = request
      const question = await getRequestedQuestionIfAuthorized(auth, questionID, models)
      const [survey] = await models.survey.get({ _id: question.survey })

      if (survey.isActive) { throw new Error('Survey needs to be inactive for updates.') }

      await createVersionIfNeeded(survey.id, models)

      const result = await models.question.delete({ _id: question.id })
      return { success: result.n > 0 }
    },
    createItem: async (parent, { data, questionID }, { request, models }) => {
      const { auth } = request
      const question = await getRequestedQuestionIfAuthorized(auth, questionID, models)
      const [survey] = await models.survey.get({ _id: question.survey })

      if (survey.isActive) { throw new Error('Survey needs to be inactive for updates.') }

      const itemData = getUpdateWithoutImageField(data)

      await createVersionIfNeeded(survey.id, models)

      return { item: await models.question.insertItem(question.id, itemData) }
    },
    updateItem: async (parent, { data, questionID, itemID }, { request, models }) => {
      const { auth } = request
      const question = await getRequestedQuestionIfAuthorized(auth, questionID, models)
      const [survey] = await models.survey.get({ _id: question.survey })

      if (survey.isActive) { throw new Error('Survey needs to be inactive for updates.') }

      const oldItem = question.items.find(item => item.id === itemID)
      if (!oldItem) { throw new Error('Item not found.') }

      const update = getUpdateWithoutImageField(data)

      await createVersionIfNeeded(survey.id, models)

      return {
        item: await models.question.updateItem(
          question.id,
          itemID,
          update,
        ),
      }
    },
    deleteItem: async (parent, { data, questionID, itemID }, { request, models }) => {
      const { auth } = request
      const question = await getRequestedQuestionIfAuthorized(auth, questionID, models)
      const [survey] = await models.survey.get({ _id: question.survey })

      if (survey.isActive) { throw new Error('Survey needs to be inactive for updates.') }

      const oldItem = question.items.find(item => item.id === itemID)
      if (!oldItem) { throw new Error('Item not found.') }

      await createVersionIfNeeded(survey.id, models)

      await models.question.deleteItem(question.id, itemID)

      return { success: true }
    },
    setItemImage: async (parent, { questionID, itemID, image },
      { request, models, imageStore }) => {
      const { auth } = request
      const question = await getRequestedQuestionIfAuthorized(auth, questionID, models)
      const [survey] = await models.survey.get({ _id: question.survey })

      if (survey.isActive) { throw new Error('Survey needs to be inactive for updates.') }

      const oldItem = question.items.find(item => item.id === itemID)
      if (!oldItem) { throw new Error('Item not found.') }

      const imageData = await uploadImage(
        image,
        question.id,
        question.user,
        models,
        imageStore,
        { item: itemID },
      )

      await createVersionIfNeeded(survey.id, models)

      return {
        item: await models.question.updateItem(
          question.id,
          itemID,
          { image: imageData.id },
        ),
      }
    },
    removeItemImage: async (parent, { questionID, itemID }, { request, models }) => {
      const { auth } = request
      const question = await getRequestedQuestionIfAuthorized(auth, questionID, models)
      const [survey] = await models.survey.get({ _id: question.survey })

      if (survey.isActive) { throw new Error('Survey needs to be inactive for updates.') }

      const oldItem = question.items.find(item => item.id === itemID)
      if (!oldItem) { throw new Error('Item not found.') }

      await createVersionIfNeeded(survey.id, models)

      const updatedItem = await models.question.updateItem(
        question.id,
        itemID,
        { image: null },
      )

      return { success: updatedItem.image === null }
    },
    createLabel: async (parent, { data, questionID }, { request, models }) => {
      const { auth } = request
      const question = await getRequestedQuestionIfAuthorized(auth, questionID, models)
      const [survey] = await models.survey.get({ _id: question.survey })

      if (survey.isActive) { throw new Error('Survey needs to be inactive for updates.') }

      const labelData = getUpdateWithoutImageField(data)

      if (labelData.value && !isValueInRange(labelData.value, question.min, question.max)) {
        throw new Error('Value is not in range of min and max.')
      }

      await createVersionIfNeeded(survey.id, models)

      return { label: await models.question.insertLabel(question.id, labelData) }
    },
    updateLabel: async (parent, { data, questionID, labelID }, { request, models }) => {
      const { auth } = request
      const question = await getRequestedQuestionIfAuthorized(auth, questionID, models)
      const [survey] = await models.survey.get({ _id: question.survey })

      if (survey.isActive) { throw new Error('Survey needs to be inactive for updates.') }

      const oldLabel = question.labels.find(label => label.id === labelID)
      if (!oldLabel) { throw new Error('Label not found.') }

      const update = getUpdateWithoutImageField(data)

      await createVersionIfNeeded(survey.id, models)

      if (update.value && !isValueInRange(update.value, question.min, question.max)) {
        throw new Error('Value is not in range of min and max.')
      }

      return {
        label: await models.question.updateLabel(
          question.id,
          labelID,
          update,
        ),
      }
    },
    deleteLabel: async (parent, { data, questionID, labelID }, { request, models }) => {
      const { auth } = request
      const question = await getRequestedQuestionIfAuthorized(auth, questionID, models)
      const [survey] = await models.survey.get({ _id: question.survey })

      if (survey.isActive) { throw new Error('Survey needs to be inactive for updates.') }

      const oldLabel = question.labels.find(label => label.id === labelID)
      if (!oldLabel) { throw new Error('Label not found.') }

      await createVersionIfNeeded(survey.id, models)

      await models.question.deleteLabel(question.id, labelID)

      return { success: true }
    },
    setLabelImage: async (parent, { questionID, labelID, image },
      { request, models, imageStore }) => {
      const { auth } = request
      const question = await getRequestedQuestionIfAuthorized(auth, questionID, models)
      const [survey] = await models.survey.get({ _id: question.survey })

      if (survey.isActive) { throw new Error('Survey needs to be inactive for updates.') }

      const oldLabel = question.labels.find(label => label.id === labelID)
      if (!oldLabel) { throw new Error('Label not found.') }

      const imageData = await uploadImage(
        image,
        question.id,
        question.user,
        models,
        imageStore,
        { label: labelID },
      )

      await createVersionIfNeeded(survey.id, models)

      return {
        label: await models.question.updateLabel(
          question.id,
          labelID,
          { image: imageData.id },
        ),
      }
    },
    removeLabelImage: async (parent, { questionID, labelID }, { request, models }) => {
      const { auth } = request
      const question = await getRequestedQuestionIfAuthorized(auth, questionID, models)
      const [survey] = await models.survey.get({ _id: question.survey })

      if (survey.isActive) { throw new Error('Survey needs to be inactive for updates.') }

      const oldLabel = question.labels.find(label => label.id === labelID)
      if (!oldLabel) { throw new Error('Label not found.') }

      await createVersionIfNeeded(survey.id, models)

      const updatedLabel = await models.question.updateLabel(
        question.id,
        labelID,
        { image: null },
      )

      return { success: updatedLabel.image === null }
    },
    createChoice: async (parent, { data, questionID }, { request, models }) => {
      const { auth } = request
      const question = await getRequestedQuestionIfAuthorized(auth, questionID, models)
      const [survey] = await models.survey.get({ _id: question.survey })

      if (survey.isActive) { throw new Error('Survey needs to be inactive for updates.') }

      const choiceData = getUpdateWithoutImageField(data)

      const presentChoiceCodes = question.choices.map(choice => choice.code)
      if (data.code) {
        if (presentChoiceCodes.includes(data.code)) {
          throw new Error('Choice code is already taken.')
        }
      } else {
        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
        let index = 0
        let isNotUnique = true
        while (isNotUnique) {
          choiceData.code = alphabet[index]
          if (!presentChoiceCodes.includes(choiceData.code)) { isNotUnique = false }
          index += 1
        }
      }

      await createVersionIfNeeded(survey.id, models)

      return { choice: await models.question.insertChoice(question.id, choiceData) }
    },
    updateChoice: async (parent, { data, questionID, choiceID }, { request, models }) => {
      const { auth } = request
      const question = await getRequestedQuestionIfAuthorized(auth, questionID, models)
      const [survey] = await models.survey.get({ _id: question.survey })

      if (survey.isActive) { throw new Error('Survey needs to be inactive for updates.') }

      const oldChoice = question.choices.find(choice => choice.id === choiceID)
      if (!oldChoice) { throw new Error('Choice not found.') }

      if (data.code) {
        const presentChoiceCodes = question.choices.map(choice => choice.code)
        if (presentChoiceCodes.includes(data.code)) {
          throw new Error('Choice code is already taken.')
        }
      }

      const update = getUpdateWithoutImageField(data)

      await createVersionIfNeeded(survey.id, models)

      return {
        choice: await models.question.updateChoice(
          question.id,
          choiceID,
          update,
        ),
      }
    },
    deleteChoice: async (parent, { data, questionID, choiceID }, { request, models }) => {
      const { auth } = request
      const question = await getRequestedQuestionIfAuthorized(auth, questionID, models)
      const [survey] = await models.survey.get({ _id: question.survey })

      if (survey.isActive) { throw new Error('Survey needs to be inactive for updates.') }

      const oldChoice = question.choices.find(choice => choice.id === choiceID)
      if (!oldChoice) { throw new Error('Choice not found.') }

      await createVersionIfNeeded(survey.id, models)

      await models.question.deleteChoice(question.id, choiceID)

      return { success: true }
    },
    setChoiceImage: async (parent, { questionID, choiceID, image },
      { request, models, imageStore }) => {
      const { auth } = request
      const question = await getRequestedQuestionIfAuthorized(auth, questionID, models)
      const [survey] = await models.survey.get({ _id: question.survey })

      if (survey.isActive) { throw new Error('Survey needs to be inactive for updates.') }

      const oldChoice = question.choices.find(choice => choice.id === choiceID)
      if (!oldChoice) { throw new Error('Choice not found.') }

      const imageData = await uploadImage(
        image,
        question.id,
        question.user,
        models,
        imageStore,
        { choice: choiceID },
      )

      await createVersionIfNeeded(survey.id, models)

      return {
        choice: await models.question.updateChoice(
          question.id,
          choiceID,
          { image: imageData.id },
        ),
      }
    },
    removeChoiceImage: async (parent, { questionID, choiceID }, { request, models }) => {
      const { auth } = request
      const question = await getRequestedQuestionIfAuthorized(auth, questionID, models)
      const [survey] = await models.survey.get({ _id: question.survey })

      if (survey.isActive) { throw new Error('Survey needs to be inactive for updates.') }

      const oldChoice = question.choices.find(choice => choice.id === choiceID)
      if (!oldChoice) { throw new Error('Choice not found.') }

      await createVersionIfNeeded(survey.id, models)

      const updatedChoice = await models.question.updateChoice(
        question.id,
        choiceID,
        { image: null },
      )

      return { success: updatedChoice.image === null }
    },
  },
  Question: {
    __resolveType(obj) {
      switch (obj.type) {
        case 'LIKE': return 'LikeQuestion'
        case 'LIKEDISLIKE': return 'LikeDislikeQuestion'
        case 'CHOICE': return 'ChoiceQuestion'
        case 'REGULATOR': return 'RegulatorQuestion'
        case 'RANKING': return 'RankingQuestion'
        case 'FAVORITE': return 'FavoriteQuestion'
        default: throw new Error('Unkown Question')
      }
    },
  },
  LikeQuestion: {
    ...sharedResolver,
    likeIcon: async (parent, args, { models }) => {
      return valueExists(parent, 'likeIcon')
        ? (await models.image.get({ _id: parent.likeIcon }))[0]
        : null
    },
  },
  LikeDislikeQuestion: {
    ...sharedResolver,
    likeIcon: async (parent, args, { models }) => {
      return valueExists(parent, 'likeIcon')
        ? (await models.image.get({ _id: parent.likeIcon }))[0]
        : null
    },
    dislikeIcon: async (parent, args, { models }) => {
      return valueExists(parent, 'dislikeIcon')
        ? (await models.image.get({ _id: parent.dislikeIcon }))[0]
        : null
    },
  },
  ChoiceQuestion: {
    ...sharedResolver,
    default: async parent =>
      (stringExists(parent, 'choiceDefault')
        ? parent.choiceDefault
        : null),
    choices: async (parent) => {
      if (arrayExists(parent, 'choices')) {
        const { choices, choiceOrder } = parent
        return sortObjectsByIdArray(choiceOrder, choices)
      }
      return null
    },
  },
  RegulatorQuestion: {
    ...sharedResolver,
    default: async parent =>
      (stringExists(parent, 'regulatorDefault')
        ? parent.regulatorDefault
        : null),
    labels: async (parent) => {
      if (arrayExists(parent, 'labels')) {
        const { labels, labelOrder } = parent
        return sortObjectsByIdArray(labelOrder, labels)
      }
      return null
    },
  },
  RankingQuestion: sharedResolver,
  FavoriteQuestion: sharedResolver,
  Item: {
    image: async ({ image }, args, { models }) => {
      try {
        const [imageData] = await models.image.get({ _id: image })
        return imageData
      } catch (e) {
        return null
      }
    },
  },
  Label: {
    image: async ({ image }, args, { models }) => {
      try {
        const [imageData] = await models.image.get({ _id: image })
        return imageData
      } catch (e) {
        return null
      }
    },
  },
  ChoiceDescription: {
    image: async ({ image }, args, { models }) => {
      try {
        const [imageData] = await models.image.get({ _id: image })
        return imageData
      } catch (e) {
        return null
      }
    },
  },
}
