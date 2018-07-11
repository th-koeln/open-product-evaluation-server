const deviceModel = require('../device/device.model')
const contextModel = require('../context/context.model')
const surveyModel = require('../survey/survey.model')
const { getMatchingId, createHashFromId } = require('../../utils/idStore')
const { isDevice } = require('../../utils/authUtils')

const sharedResolvers = {
  question: async (parent, args, context, info) => createHashFromId(parent.question),
}

const getDeviceDependencies = async (auth) => {
  if (!isDevice(auth)) throw new Error('Not authorized or no permissions.')
  const [device] = await deviceModel.get({ _id: getMatchingId(auth.device.id) })

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

module.exports = {
  Mutation: {
    createAnswer: async (parent, { data }, { request }, info) => {
      try {
        const { auth } = request
        const deviceDependencies = getDeviceDependencies(auth)
        console.log(deviceDependencies)
        /** Call answerStore to store the Answer * */
        /** If answerStore returns vote, persist it in DB * */
      } catch (e) {
        throw e
      }
    },
  },
  Vote: {
    id: async (parent, args, context, info) => createHashFromId(parent.id),
    context: async (parent, args, context, info) => ((Object.prototype.hasOwnProperty.call(parent.toObject(), 'context')
        && parent.context !== null && parent.context !== '') ? createHashFromId(parent.context) : null),
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
  RankingAnswer: sharedResolvers,
  FavoriteAnswer: sharedResolvers,
}
