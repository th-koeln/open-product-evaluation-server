const _ = require('underscore')
const config = require('../../../config')
const { ADMIN } = require('../../utils/roles')

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

const sortObjectsByIdArray = (arrayOfIds, arrayOfObjects) => {
  /** Convert array of ids to Object with id:index pairs* */
  const sortObj = arrayOfIds.reduce((acc, id, index) => ({
    ...acc,
    [id]: index,
  }), {})
  /** Sort questions depending on the former Array of ids * */
  return _.sortBy(arrayOfObjects, object => sortObj[object.id])
}

const checkIfAllIdsArePresent = async (arrayOfIds, arrayOfObjects) => {
  const presentIds = arrayOfObjects.map(object => object.id)

  if (_.difference(arrayOfIds, presentIds).length !== 0) {
    throw new Error('Adding new Objects is not allowed in Question update.')
  }
}

const processQuestionUpdate = async (data, question, models, imageStore) => {
  const updatedData = data

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

  if (data.likeIcon) {
    const likeIconData = await uploadIcon('likeIcon', data, question, models, imageStore)
    updatedData.likeIcon = likeIconData.id
  }

  if (data.dislikeIcon) {
    const dislikeIconData = await uploadIcon('dislikeIcon', data, question, models, imageStore)
    updatedData.dislikeIcon = dislikeIconData.id
  }

  if (data.type && data.type !== question.type) {
    await resetQuestionToDefault(question, models)
  }

  const [updatedQuestion] = await models.question.update({ _id: question.id }, updatedData)
  return updatedQuestion
}

const sharedResolver = {
  value: async parent => ((Object.prototype.hasOwnProperty.call(parent.toObject(), 'value')
    && parent.value !== null && parent.value !== '') ? parent.value : null),
  description: async parent => ((Object.prototype.hasOwnProperty.call(parent.toObject(), 'description')
    && parent.description !== null && parent.description !== '') ? parent.description : null),
  items: async (parent) => {
    if (Object.prototype.hasOwnProperty.call(parent.toObject(), 'items')
      && parent.items !== null && parent.items.length !== 0) {
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

      const result = await models.question.delete({ _id: question.id })
      return { success: result.n > 0 }
    },
    createItem: async (parent, { data, questionID }, { request, models }) => {
      const { auth } = request
      const question = await getRequestedQuestionIfAuthorized(auth, questionID, models)
      const [survey] = await models.survey.get({ _id: question.survey })

      if (survey.isActive) { throw new Error('Survey needs to be inactive for updates.') }

      const itemData = getUpdateWithoutImageField(data)

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
        if (presentChoiceCodes.includes(data.code)) { throw new Error('Choice code is already taken.') }
      }

      const update = getUpdateWithoutImageField(data)

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
      let likeIcon
      if (Object.prototype.hasOwnProperty.call(parent.toObject(), 'likeIcon')
        && parent.likeIcon !== null) {
        [likeIcon] = await models.image.get({ _id: parent.likeIcon })
      } else {
        [likeIcon] = await models.image.get({ url: `${config.app.defaultFolder}/likeIcon.png` })
      }
      return likeIcon
    },
  },
  LikeDislikeQuestion: {
    ...sharedResolver,
    likeIcon: async (parent, args, { models }) => {
      let likeIcon
      if (Object.prototype.hasOwnProperty.call(parent.toObject(), 'likeIcon')
        && parent.likeIcon !== null) {
        [likeIcon] = await models.image.get({ _id: parent.likeIcon })
      } else {
        [likeIcon] = await models.image.get({ url: `${config.app.defaultFolder}/likeIcon.png` })
      }
      return likeIcon
    },
    dislikeIcon: async (parent, args, { models }) => {
      let dislikeIcon
      if (Object.prototype.hasOwnProperty.call(parent.toObject(), 'dislikeIcon')
        && parent.dislikeIcon !== null) {
        [dislikeIcon] = await models.image.get({ _id: parent.dislikeIcon })
      } else {
        [dislikeIcon] = await models.image.get({ url: `${config.app.defaultFolder}/dislikeIcon.png` })
      }
      return dislikeIcon
    },
  },
  ChoiceQuestion: {
    ...sharedResolver,
    default: async parent => ((Object.prototype.hasOwnProperty.call(parent.toObject(), 'choiceDefault')
      && parent.choiceDefault !== null && parent.choiceDefault !== '')
      ? parent.choiceDefault
      : null),
    choices: async (parent) => {
      if (Object.prototype.hasOwnProperty.call(parent.toObject(), 'choices')
      && parent.choices !== null && parent.choices.length !== 0) {
        const { choices, choiceOrder } = parent
        return sortObjectsByIdArray(choiceOrder, choices)
      }
      return null
    },
  },
  RegulatorQuestion: {
    ...sharedResolver,
    default: async parent => ((Object.prototype.hasOwnProperty.call(parent.toObject(), 'regulatorDefault')
      && parent.regulatorDefault !== null && parent.regulatorDefault !== '')
      ? parent.regulatorDefault
      : null),
    labels: async (parent) => {
      if (Object.prototype.hasOwnProperty.call(parent.toObject(), 'labels')
      && parent.labels !== null && parent.labels.length !== 0) {
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
