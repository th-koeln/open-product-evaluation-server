const { saveImage, removeImage } = require('../../utils/imageStore')
const { getMatchingId, createHashFromId } = require('../../utils/idStore')
const { userIdIsMatching } = require('../../utils/authUtils')
const config = require('../../../config')
//  const shortId = require('shortid')
//  const _ = require('underscore')

// const imagesArePresentInDB = async (questionData) => {
//   const images = _.uniq(Object.keys(questionData).reduce((acc, key) => {
//     const keyImages = []
//     if ((key === 'items' || key === 'labels'
//      || key === 'choices') && questionData[key] !== null) {
//       questionData[key].forEach((object) => {
//         if (Object.prototype.hasOwnProperty.call(object, 'image') && object.image !== null)
//          keyImages.push(object.image)
//       })
//     }
//     return [...acc, ...keyImages]
//   }, []))
//
//   let presentImages
//   try {
//     presentImages = await imageModel.get({ _id: { $in: images } })
//   } catch (e) {
//     return false
//   }
//
//   return images.length === presentImages.length
// }
//
// const iterateQuestionAndCorrectIds = (questionData) => {
//   const updatedQuestionData = questionData
//   Object.keys(updatedQuestionData).forEach((key) => {
//     if (key === 'surveyID')
//       updatedQuestionData[key] = getMatchingId(updatedQuestionData.surveyID)
//     if ((key === 'items' || key === 'labels'
//      || key === 'choices') && updatedQuestionData[key] !== null) {
//       updatedQuestionData[key] = updatedQuestionData[key].map((object) => {
//         const updatedObject = object
//         if (key === 'choices' && !Object.prototype.hasOwnProperty.call(object, 'code')) {
//           updatedObject.code = shortId.generate()
//           if (Object.prototype.hasOwnProperty.call(updatedQuestionData, 'default')
//            && updatedQuestionData.default === updatedObject.label) {
//             updatedQuestionData.default = updatedObject.code
//           }
//         }
//         if (Object.prototype.hasOwnProperty.call(updatedObject, 'image'))
//          updatedObject.image = getMatchingId(updatedObject.image)
//         return updatedObject
//       })
//     }
//   })
//   if (Object.prototype.hasOwnProperty.call(updatedQuestionData, 'surveyID')) {
//     updatedQuestionData.survey = updatedQuestionData.surveyID
//     delete updatedQuestionData.surveyID
//   }
//   return updatedQuestionData
// }

// const createQuestion = async (data, auth) => {
//   const matchingSurveyID = getMatchingId(data.surveyID)
//   const [survey] = await surveyModel.get({ _id: matchingSurveyID })
//   if (!isUser(auth) || (survey && !userIdIsMatching(auth, `${survey.creator}`))) {
//    throw new Error('Not authorized or no permissions.')
//   }
//   const updatedData = iterateQuestionAndCorrectIds(data)
//   updatedData.user = survey.creator
//
//   if (!(await imagesArePresentInDB(updatedData)))
//     throw new Error('Not all Images were found. Can´t create Question.')
//
//   await questionModel.insert(updatedData)
//   const [updatedSurvey] = await surveyModel.get({ _id: matchingSurveyID })
//   return updatedSurvey
// }

const uploadIcon = async (key, data, question, models) => {
  const [survey] = await models.survey.get({ _id: question.survey })
  const upload = await saveImage(await data[key], survey.creator)

  upload.user = survey.creator
  upload.question = question.id

  try {
    await models.image.insert(upload)
  } catch (e) {
    await removeImage(upload.name, survey.creator)
  }

  try {
    if (question[key] !== null) {
      const oldIcon = await models.image.get({
        _id: question[key],
      })

      await models.image.delete({ _id: question[key] })

      await removeImage(oldIcon.name, survey.creator)
    }
  } catch (e) {
    console.log('removing old image from disk failed.')
  }

  return upload
}

const processQuestionUpdate = async (data, question, models) => {
  const updatedData = data
  if (updatedData.likeIcon) {
    const likeIconData = await uploadIcon('likeIcon', data, question, models)
    updatedData.likeIcon = likeIconData.id
  }

  if (updatedData.dislikeIcon) {
    const dislikeIconData = await uploadIcon('dislikeIcon', data, question, models)
    updatedData.dislikeIcon = dislikeIconData.id
  }

  return models.question.update({ _id: question.id }, updatedData)
}

// const updateQuestion = async (parent, { data, questionID }, { request }, info) => {
//   if (!(await imagesArePresentInDB(updatedData)))
//    throw new Error('Not all Images were found. Can´t create Question.')
//
//   await questionModel.update({ _id: matchingQuestionID }, updatedData)
//   const [updatedSurvey] = await surveyModel.get({ _id: question.survey })
//   return { survey: updatedSurvey }
// }

const sharedResolver = {
  id: async (parent, args, context, info) => createHashFromId(parent.id),
  value: async (parent, args, context, info) => ((Object.prototype.hasOwnProperty.call(parent.toObject(), 'value')
    && parent.value !== null && parent.value !== '') ? parent.value : null),
  description: async (parent, args, context, info) => ((Object.prototype.hasOwnProperty.call(parent.toObject(), 'description')
    && parent.description !== null && parent.description !== '') ? parent.description : null),
  items: async (parent, args, context, info) => ((Object.prototype.hasOwnProperty.call(parent.toObject(), 'items')
    && parent.items !== null && parent.items.length !== 0) ? parent.items : null),
}

module.exports = {
  Mutation: {
    createQuestion: async (parent, { data }, { request, models }, info) => {
      const { auth } = request
      const matchingSurveyID = getMatchingId(data.surveyID)
      const [survey] = await models.survey.get({ _id: matchingSurveyID })

      if (!userIdIsMatching(auth, survey.creator)) { throw new Error('Not authorized or no permissions.') }

      const updatedData = data
      updatedData.survey = matchingSurveyID
      delete updatedData.surveyID
      updatedData.user = survey.creator

      return { question: await models.question.insert(updatedData) }
    },
    updateQuestion: async (parent, { data, questionID }, { request, models }, info) => {
      const { auth } = request
      const matchingQuestionID = getMatchingId(questionID)
      const [question] = await models.question.get({ _id: matchingQuestionID })

      if (!userIdIsMatching(auth, question.user)) { throw new Error('Not authorized or no permissions.') }

      return { question: await processQuestionUpdate(data, question, models, auth) }
    },
    deleteQuestion: async (parent, { questionID }, { request, models }, info) => {
      const { auth } = request
      const matchingQuestionID = getMatchingId(questionID)
      const [question] = await models.question.get({ _id: matchingQuestionID })

      if (!userIdIsMatching(auth, `${question.user}`)) { throw new Error('Not authorized or no permissions.') }

      const result = await models.question.delete({ _id: matchingQuestionID })
      return { success: result.n > 0 }
    },
    createItem: async (parent, { data }, { request, models }, info) => {
      console.log('penis')
    },
    updateItem: async (parent, { data, questionID, itemID }, { request, models }, info) => {
      console.log('penis')
    },
    deleteItem: async (parent, { data, questionID, itemID }, { request, models }, info) => {
      console.log('penis')
    },
    createLabel: async (parent, { data }, { request, models }, info) => {
      console.log('penis')
    },
    updateLabel: async (parent, { data, questionID, labelID }, { request, models }, info) => {
      console.log('penis')
    },
    deleteLabel: async (parent, { data, questionID, labelID }, { request, models }, info) => {
      console.log('penis')
    },
    createChoice: async (parent, { data }, { request, models }, info) => {
      console.log('penis')
    },
    updateChoice: async (parent, { data, questionID, choiceID }, { request, models }, info) => {
      console.log('penis')
    },
    deleteChoice: async (parent, { data, questionID, choiceID }, { request, models }, info) => {
      console.log('penis')
    },
    /*  createLikeQuestion: async (parent, { data }, { request }, info) => {
      try {
        const { auth } = request
        const updatedData = { ...data, type: 'LIKE' }
        if (Object.prototype.hasOwnProperty.call(updatedData, 'likeIcon'))
          updatedData.likeIcon = getMatchingId(updatedData.likeIcon)
        return { survey: await createQuestion(updatedData, auth) }
      } catch (e) {
        throw e
      }
    },
    createLikeDislikeQuestion: async (parent, { data }, { request }, info) => {
      try {
        const { auth } = request
        const updatedData = { ...data, type: 'LIKEDISLIKE' }
        if (Object.prototype.hasOwnProperty.call(updatedData, 'likeIcon'))
          updatedData.likeIcon = getMatchingId(updatedData.likeIcon)
        if (Object.prototype.hasOwnProperty.call(updatedData, 'dislikeIcon'))
          updatedData.dislikeIcon = getMatchingId(updatedData.dislikeIcon)
        return { survey: await createQuestion(updatedData, auth) }
      } catch (e) {
        throw e
      }
    },
    createChoiceQuestion: async (parent, { data }, { request }, info) => {
      try {
        const { auth } = request
        const updatedData = { ...data, type: 'CHOICE' }
        return { survey: await createQuestion(updatedData, auth) }
      } catch (e) {
        throw e
      }
    },
    createRegulatorQuestion: async (parent, { data }, { request }, info) => {
      try {
        const { auth } = request
        const updatedData = { ...data, type: 'REGULATOR' }
        return { survey: await createQuestion(updatedData, auth) }
      } catch (e) {
        throw e
      }
    },
    createRankingQuestion: async (parent, { data }, { request }, info) => {
      try {
        const { auth } = request
        const updatedData = { ...data, type: 'RANKING' }
        return { survey: await createQuestion(updatedData, auth) }
      } catch (e) {
        throw e
      }
    },
    createFavoriteQuestion: async (parent, { data }, { request }, info) => {
      try {
        const { auth } = request
        const updatedData = { ...data, type: 'FAVORITE' }
        return { survey: await createQuestion(updatedData, auth) }
      } catch (e) {
        throw e
      }
    },
    updateLikeQuestion: updateQuestion,
    updateLikeDislikeQuestion: updateQuestion,
    updateChoiceQuestion: updateQuestion,
    updateRegulatorQuestion: updateQuestion,
    updateRankingQuestion: updateQuestion,
    updateFavoriteQuestion: updateQuestion, */
  },
  Question: {
    __resolveType(obj, context, info) {
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
    likeIcon: async (parent, args, { models }, info) => {
      let likeIcon
      if (Object.prototype.hasOwnProperty.call(parent.toObject(), 'likeIcon') && parent.likeIcon !== null) {
        [likeIcon] = await models.image.get({ _id: parent.likeIcon })
      } else [likeIcon] = await models.image.get({ url: `${config.app.defaultFolder}/likeIcon.png` })
      return likeIcon
    },
  },
  LikeDislikeQuestion: {
    ...sharedResolver,
    likeIcon: async (parent, args, { models }, info) => {
      let likeIcon
      if (Object.prototype.hasOwnProperty.call(parent.toObject(), 'likeIcon') && parent.likeIcon !== null) {
        [likeIcon] = await models.image.get({ _id: parent.likeIcon })
      } else [likeIcon] = await models.image.get({ url: `${config.app.defaultFolder}/likeIcon.png` })
      return likeIcon
    },
    dislikeIcon: async (parent, args, { models }, info) => {
      let dislikeIcon
      if (Object.prototype.hasOwnProperty.call(parent.toObject(), 'dislikeIcon') && parent.dislikeIcon !== null) {
        [dislikeIcon] = await models.image.get({ _id: parent.dislikeIcon })
      } else [dislikeIcon] = await models.image.get({ url: `${config.app.defaultFolder}/dislikeIcon.png` })
      return dislikeIcon
    },
  },
  ChoiceQuestion: {
    ...sharedResolver,
    default: async (parent, args, context, info) => ((Object.prototype.hasOwnProperty.call(parent.toObject(), 'choiceDefault')
      && parent.choiceDefault !== null && parent.choiceDefault !== '') ? parent.choiceDefault : null),
    choices: async (parent, args, context, info) => ((Object.prototype.hasOwnProperty.call(parent.toObject(), 'choices')
      && parent.choices !== null && parent.choices.length !== 0) ? parent.choices : null),
  },
  RegulatorQuestion: {
    ...sharedResolver,
    default: async (parent, args, context, info) => ((Object.prototype.hasOwnProperty.call(parent.toObject(), 'regulatorDefault')
      && parent.regulatorDefault !== null && parent.regulatorDefault !== '') ? parent.regulatorDefault : null),
    labels: async (parent, args, context, info) => ((Object.prototype.hasOwnProperty.call(parent.toObject(), 'labels')
      && parent.labels !== null && parent.labels.length !== 0) ? parent.labels : null),
  },
  RankingQuestion: sharedResolver,
  FavoriteQuestion: sharedResolver,
  Item: {
    image: async ({ image }, args, { models }, info) => {
      const [imageData] = await models.image.get({ _id: image })
      return imageData
    },
  },
  Label: {
    image: async (parent, args, { models }, info) => {
      const imageData = (Object.prototype.hasOwnProperty.call(parent.toObject(), 'image')
        && parent.image !== null) ? (await models.image.get({ _id: parent.image }))[0] : null
      return imageData
    },
  },
  ChoiceDescription: {
    image: async (parent, args, { models }, info) => {
      const imageData = (Object.prototype.hasOwnProperty.call(parent.toObject(), 'image')
        && parent.image !== null) ? (await models.image.get({ _id: parent.image }))[0] : null
      return imageData
    },
  },
}
