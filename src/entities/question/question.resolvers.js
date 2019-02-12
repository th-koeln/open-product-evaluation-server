const { getMatchingId, createHashFromId } = require('../../utils/idStore')
const config = require('../../../config')
const { ADMIN } = require('../../utils/roles')

const getRequestedQuestionIfAuthorized = async (auth, questionId, models) => {
  const matchingQuestionId = getMatchingId(questionId)
  const [question] = await models.question.get({ _id: matchingQuestionId })

  if (!(auth.role === ADMIN || auth.id === question.user)) { throw new Error('Not authorized or no permissions.') }

  return question
}

const getUpdateWithoutImageField = data => Object.keys(data).reduce((acc, key) => ((key !== 'image') ? { ...acc, [key]: data[key] } : acc), {})

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

const processQuestionUpdate = async (data, question, models, imageStore) => {
  const updatedData = data
  if (updatedData.choiceDefault) {
    const matchingChoiceId = getMatchingId(updatedData.choiceDefault)
    const presentChoices = question.choices.map(choice => choice.id)
    if (!presentChoices.includes(matchingChoiceId)) { throw new Error('Default choice not found in present choices.') }
    updatedData.choiceDefault = matchingChoiceId
  }

  if (updatedData.likeIcon) {
    const likeIconData = await uploadIcon('likeIcon', data, question, models, imageStore)
    updatedData.likeIcon = likeIconData.id
  }

  if (updatedData.dislikeIcon) {
    const dislikeIconData = await uploadIcon('dislikeIcon', data, question, models, imageStore)
    updatedData.dislikeIcon = dislikeIconData.id
  }

  const [updatedQuestion] = await models.question.update({ _id: question.id }, updatedData)
  return updatedQuestion
}

const sharedResolver = {
  id: async parent => createHashFromId(parent.id),
  value: async parent => ((Object.prototype.hasOwnProperty.call(parent.toObject(), 'value')
    && parent.value !== null && parent.value !== '') ? parent.value : null),
  description: async parent => ((Object.prototype.hasOwnProperty.call(parent.toObject(), 'description')
    && parent.description !== null && parent.description !== '') ? parent.description : null),
  items: async parent => ((Object.prototype.hasOwnProperty.call(parent.toObject(), 'items')
      && parent.items !== null && parent.items.length !== 0) ? parent.items : null),
}

module.exports = {
  Mutation: {
    createQuestion: async (parent, { data }, { request, models }) => {
      const { auth } = request
      const matchingSurveyID = getMatchingId(data.surveyID)
      const [survey] = await models.survey.get({ _id: matchingSurveyID })

      if (!(auth.role === ADMIN || auth.id === survey.creator)) { throw new Error('Not authorized or no permissions.') }

      if (survey.isActive) { throw new Error('Survey needs to be inactive for updates.') }

      const updatedData = data
      updatedData.survey = matchingSurveyID
      delete updatedData.surveyID
      updatedData.user = survey.creator

      return { question: await models.question.insert(updatedData) }
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

      const matchingItemID = getMatchingId(itemID)

      const oldItem = question.items.find(item => item.id === matchingItemID)
      if (!oldItem) { throw new Error('Item not found.') }

      const update = getUpdateWithoutImageField(data)

      return {
        item: await models.question.updateItem(
          question.id,
          matchingItemID,
          update,
        ),
      }
    },
    deleteItem: async (parent, { data, questionID, itemID }, { request, models }) => {
      const { auth } = request
      const question = await getRequestedQuestionIfAuthorized(auth, questionID, models)
      const [survey] = await models.survey.get({ _id: question.survey })

      if (survey.isActive) { throw new Error('Survey needs to be inactive for updates.') }

      const matchingItemID = getMatchingId(itemID)

      await models.question.deleteItem(question.id, matchingItemID)

      return { success: true }
    },
    setItemImage: async (parent, { questionID, itemID, image },
      { request, models, imageStore }) => {
      const { auth } = request
      const question = await getRequestedQuestionIfAuthorized(auth, questionID, models)
      const [survey] = await models.survey.get({ _id: question.survey })

      if (survey.isActive) { throw new Error('Survey needs to be inactive for updates.') }

      const matchingItemID = getMatchingId(itemID)

      const oldItem = question.items.find(item => item.id === matchingItemID)
      if (!oldItem) { throw new Error('Item not found.') }

      const imageData = await uploadImage(
        image,
        question.id,
        question.user,
        models,
        imageStore,
        { item: matchingItemID },
      )

      return {
        item: await models.question.updateItem(
          question.id,
          matchingItemID,
          { image: imageData.id },
        ),
      }
    },
    removeItemImage: async (parent, { questionID, itemID }, { request, models }) => {
      const { auth } = request
      const question = await getRequestedQuestionIfAuthorized(auth, questionID, models)
      const [survey] = await models.survey.get({ _id: question.survey })

      if (survey.isActive) { throw new Error('Survey needs to be inactive for updates.') }

      const matchingItemID = getMatchingId(itemID)

      const updatedItem = await models.question.updateItem(
        question.id,
        matchingItemID,
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

      const matchingLabelID = getMatchingId(labelID)

      const oldLabel = question.labels.find(item => item.id === matchingLabelID)
      if (!oldLabel) { throw new Error('Label not found.') }

      const update = getUpdateWithoutImageField(data)

      return {
        label: await models.question.updateLabel(
          question.id,
          matchingLabelID,
          update,
        ),
      }
    },
    deleteLabel: async (parent, { data, questionID, labelID }, { request, models }) => {
      const { auth } = request
      const question = await getRequestedQuestionIfAuthorized(auth, questionID, models)
      const [survey] = await models.survey.get({ _id: question.survey })

      if (survey.isActive) { throw new Error('Survey needs to be inactive for updates.') }

      const matchingLabelID = getMatchingId(labelID)

      await models.question.deleteLabel(question.id, matchingLabelID)

      return { success: true }
    },
    setLabelImage: async (parent, { questionID, labelID, image },
      { request, models, imageStore }) => {
      const { auth } = request
      const question = await getRequestedQuestionIfAuthorized(auth, questionID, models)
      const [survey] = await models.survey.get({ _id: question.survey })

      if (survey.isActive) { throw new Error('Survey needs to be inactive for updates.') }

      const matchingLabelID = getMatchingId(labelID)

      const oldLabel = question.labels.find(item => item.id === matchingLabelID)
      if (!oldLabel) { throw new Error('Label not found.') }

      const imageData = await uploadImage(
        image,
        question.id,
        question.user,
        models,
        imageStore,
        { label: matchingLabelID },
      )

      return {
        label: await models.question.updateLabel(
          question.id,
          matchingLabelID,
          { image: imageData.id },
        ),
      }
    },
    removeLabelImage: async (parent, { questionID, labelID }, { request, models }) => {
      const { auth } = request
      const question = await getRequestedQuestionIfAuthorized(auth, questionID, models)
      const [survey] = await models.survey.get({ _id: question.survey })

      if (survey.isActive) { throw new Error('Survey needs to be inactive for updates.') }

      const matchingLabelID = getMatchingId(labelID)

      const updatedLabel = await models.question.updateLabel(
        question.id,
        matchingLabelID,
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
        if (presentChoiceCodes.includes(data.code)) { throw new Error('Choice code is already taken.') }
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

      const matchingChoiceID = getMatchingId(choiceID)

      const oldChoice = question.choices.find(item => item.id === matchingChoiceID)
      if (!oldChoice) { throw new Error('Choice not found.') }

      if (data.code) {
        const presentChoiceCodes = question.choices.map(choice => choice.code)
        if (presentChoiceCodes.includes(data.code)) { throw new Error('Choice code is already taken.') }
      }

      const update = getUpdateWithoutImageField(data)

      return {
        choice: await models.question.updateChoice(
          question.id,
          matchingChoiceID,
          update,
        ),
      }
    },
    deleteChoice: async (parent, { data, questionID, choiceID }, { request, models }) => {
      const { auth } = request
      const question = await getRequestedQuestionIfAuthorized(auth, questionID, models)
      const [survey] = await models.survey.get({ _id: question.survey })

      if (survey.isActive) { throw new Error('Survey needs to be inactive for updates.') }

      const matchingChoiceID = getMatchingId(choiceID)

      await models.question.deleteChoice(question.id, matchingChoiceID)

      return { success: true }
    },
    setChoiceImage: async (parent, { questionID, choiceID, image },
      { request, models, imageStore }) => {
      const { auth } = request
      const question = await getRequestedQuestionIfAuthorized(auth, questionID, models)
      const [survey] = await models.survey.get({ _id: question.survey })

      if (survey.isActive) { throw new Error('Survey needs to be inactive for updates.') }

      const matchingChoiceID = getMatchingId(choiceID)

      const oldChoice = question.choices.find(item => item.id === matchingChoiceID)
      if (!oldChoice) { throw new Error('Choice not found.') }

      const imageData = await uploadImage(
        image,
        question.id,
        question.user,
        models,
        imageStore,
        { choice: matchingChoiceID },
      )

      return {
        choice: await models.question.updateChoice(
          question.id,
          matchingChoiceID,
          { image: imageData.id },
        ),
      }
    },
    removeChoiceImage: async (parent, { questionID, choiceID }, { request, models }) => {
      const { auth } = request
      const question = await getRequestedQuestionIfAuthorized(auth, questionID, models)
      const [survey] = await models.survey.get({ _id: question.survey })

      if (survey.isActive) { throw new Error('Survey needs to be inactive for updates.') }

      const matchingChoiceID = getMatchingId(choiceID)

      const updatedChoice = await models.question.updateChoice(
        question.id,
        matchingChoiceID,
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
      if (Object.prototype.hasOwnProperty.call(parent.toObject(), 'likeIcon') && parent.likeIcon !== null) {
        [likeIcon] = await models.image.get({ _id: parent.likeIcon })
      } else { [likeIcon] = await models.image.get({ url: `${config.app.defaultFolder}/likeIcon.png` }) }
      return likeIcon
    },
  },
  LikeDislikeQuestion: {
    ...sharedResolver,
    likeIcon: async (parent, args, { models }) => {
      let likeIcon
      if (Object.prototype.hasOwnProperty.call(parent.toObject(), 'likeIcon') && parent.likeIcon !== null) {
        [likeIcon] = await models.image.get({ _id: parent.likeIcon })
      } else { [likeIcon] = await models.image.get({ url: `${config.app.defaultFolder}/likeIcon.png` }) }
      return likeIcon
    },
    dislikeIcon: async (parent, args, { models }) => {
      let dislikeIcon
      if (Object.prototype.hasOwnProperty.call(parent.toObject(), 'dislikeIcon') && parent.dislikeIcon !== null) {
        [dislikeIcon] = await models.image.get({ _id: parent.dislikeIcon })
      } else { [dislikeIcon] = await models.image.get({ url: `${config.app.defaultFolder}/dislikeIcon.png` }) }
      return dislikeIcon
    },
  },
  ChoiceQuestion: {
    ...sharedResolver,
    default: async parent => ((Object.prototype.hasOwnProperty.call(parent.toObject(), 'choiceDefault')
      && parent.choiceDefault !== null && parent.choiceDefault !== '') ? createHashFromId(parent.choiceDefault) : null),
    choices: async parent => ((Object.prototype.hasOwnProperty.call(parent.toObject(), 'choices')
      && parent.choices !== null && parent.choices.length !== 0) ? parent.choices : null),
  },
  RegulatorQuestion: {
    ...sharedResolver,
    default: async parent => ((Object.prototype.hasOwnProperty.call(parent.toObject(), 'regulatorDefault')
      && parent.regulatorDefault !== null && parent.regulatorDefault !== '') ? parent.regulatorDefault : null),
    labels: async parent => ((Object.prototype.hasOwnProperty.call(parent.toObject(), 'labels')
      && parent.labels !== null && parent.labels.length !== 0) ? parent.labels : null),
  },
  RankingQuestion: sharedResolver,
  FavoriteQuestion: sharedResolver,
  Item: {
    id: async ({ id }) => createHashFromId(id),
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
    id: async ({ id }) => createHashFromId(id),
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
    id: async ({ id }) => createHashFromId(id),
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
