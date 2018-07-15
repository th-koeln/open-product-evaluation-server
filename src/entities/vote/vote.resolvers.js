const voteModel = require('./vote.model')
const contextModel = require('../context/context.model')
const surveyModel = require('../survey/survey.model')
const { getMatchingId, createHashFromId } = require('../../utils/idStore')
const { isDevice, isUser, userIdIsMatching } = require('../../utils/authUtils')
const { createAnswer } = require('../../utils/answerStore')

const sharedResolvers = {
  question: async (parent, args, context, info) => createHashFromId(parent.question),
}

const getDeviceDependencies = async (auth) => {
  if (!isDevice(auth)) throw new Error('Not authorized or no permissions.')
  const { device } = auth

  if (!(Object.prototype.hasOwnProperty.call(device.toObject(), 'context')
    && device.context !== null && device.context !== '')) throw new Error('This Device is not connected to a Context.')
  const [context] = await contextModel.get({ _id: device.context })

  if (!(Object.prototype.hasOwnProperty.call(context.toObject(), 'activeSurvey')
    && context.activeSurvey !== null && context.activeSurvey !== '')) throw new Error('The Context of this Device is not connected to a Survey.')
  const [survey] = await surveyModel.get({ _id: context.activeSurvey })

  return {
    device,
    context,
    survey,
  }
}

const deviceIsAllowedToSeeVote = async (device, survey) => {
  if (Object.prototype.hasOwnProperty.call(device.toObject(), 'context')
    && device.context !== null && device.context !== '') {
    const contextIds = (await contextModel.get({ activeSurvey: survey.id }))
      .reduce((acc, context) => [...acc, `${context.id}`], [])

    return contextIds.indexOf(`${device.context}`) > -1
  } return false
}

module.exports = {
  Query: {
    votes: async (parent, { surveyID }, { request }, info) => {
      try {
        const { auth } = request
        const [survey] = await surveyModel.get({ _id: getMatchingId(surveyID) })

        if (!(isUser(auth) && userIdIsMatching(auth, `${survey.creator}`))
          && !(isDevice(auth) && await deviceIsAllowedToSeeVote(auth.device, survey))) throw new Error('Not authorized or no permissions.')

        return voteModel.get({ survey: survey.id })
      } catch (e) {
        throw e
      }
    },
  },
  Mutation: {
    createAnswer: async (parent, { data }, { request }, info) => {
      try {
        if (Object.keys(data).length !== 2) throw new Error('Illegal amount of arguments.')
        const { auth } = request
        const deviceDependencies = await getDeviceDependencies(auth)
        const inputData = data
        inputData.question = getMatchingId(inputData.questionID)
        delete inputData.questionID
        return createAnswer(deviceDependencies, data)
      } catch (e) {
        throw e
      }
    },
  },
  Vote: {
    id: async (parent, args, context, info) => createHashFromId(parent.id),
    context: async (parent, args, context, info) => ((Object.prototype.hasOwnProperty.call(parent.toObject(), 'context')
        && parent.context !== null && parent.context !== '') ? createHashFromId(parent.context) : null),
    device: async (parent, args, context, info) => ((Object.prototype.hasOwnProperty.call(parent.toObject(), 'device')
      && parent.device !== null && parent.device !== '') ? createHashFromId(parent.device) : null),
  },
  Answer: {
    __resolveType(obj, context, info) {
      switch (obj.type) {
        case 'LIKE': return 'LikeAnswer'
        case 'LIKEDISLIKE': return 'LikeDislikeAnswer'
        case 'CHOICE': return 'ChoiceAnswer'
        case 'REGULATOR': return 'RegulatorAnswer'
        case 'RANKING': return 'RankingAnswer'
        case 'FAVORITE': return 'FavoriteAnswer'
        default: throw new Error('Unkown Answer')
      }
    },
  },
  LikeAnswer: sharedResolvers,
  LikeDislikeAnswer: sharedResolvers,
  ChoiceAnswer: sharedResolvers,
  RegulatorAnswer: sharedResolvers,
  RankingAnswer: {
    ...sharedResolvers,
    rankedImages: async (parent, args, context, info) => ((Object.prototype.hasOwnProperty.call(parent.toObject(), 'rankedImages')
        && parent.rankedImages !== null
        && parent.rankedImages.length !== 0)
      ? parent.rankedImages.map(image => createHashFromId(image)) : null),
  },
  FavoriteAnswer: {
    ...sharedResolvers,
    favoriteImage: async (parent, args, context, info) => ((Object.prototype.hasOwnProperty.call(parent.toObject(), 'favoriteImage')
        && parent.favoriteImage !== null
        && parent.favoriteImage !== '')
      ? createHashFromId(parent.favoriteImage) : null),
  },
}
