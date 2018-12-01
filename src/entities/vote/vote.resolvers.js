const { getMatchingId, createHashFromId } = require('../../utils/idStore')
const { ADMIN, USER, DEVICE } = require('../../utils/roles')
const { decode } = require('../../utils/authUtils')
const { withFilter } = require('graphql-yoga')
const { SUB_ANSWERS, SUB_VOTES } = require('../../utils/pubsubChannels')

const sharedResolvers = {
  question: async parent => createHashFromId(parent.question),
}

const getDeviceDependencies = async (auth, models) => {
  if (!(auth.role === DEVICE)) throw new Error('Not authorized or no permissions.')
  const { device } = auth

  if (!(Object.prototype.hasOwnProperty.call(device.toObject(), 'domain')
    && device.domain !== null && device.domain !== '')) throw new Error('This Device is not connected to a Domain.')
  const [domain] = await models.domain.get({ _id: device.domain })

  if (!(Object.prototype.hasOwnProperty.call(domain.toObject(), 'activeSurvey')
    && domain.activeSurvey !== null && domain.activeSurvey !== '')) throw new Error('The Domain€ of this Device is not connected to a Survey.')
  const [survey] = await models.survey.get({ _id: domain.activeSurvey })

  return {
    device,
    domain,
    survey,
  }
}

const deviceIsAllowedToSeeVote = async (device, survey, models) => {
  if (Object.prototype.hasOwnProperty.call(device.toObject(), 'domain')
    && device.domain !== null && device.domain !== '') {
    const domainIds = (await models.domain.get({ activeSurvey: survey.id }))
      .reduce((acc, domain) => [...acc, domain.id], [])

    return domainIds.indexOf(device.domain) > -1
  } return false
}

module.exports = {
  Query: {
    votes: async (parent, { surveyID }, { request, models }) => {
      try {
        const { auth } = request
        const [survey] = await models.survey.get({ _id: getMatchingId(surveyID) })

        switch (auth.role) {
          case ADMIN:
            return models.vote.get({ survey: survey.id })

          case USER:
            if (survey.creator === auth.id) return models.vote.get({ survey: survey.id })
            break

          case DEVICE:
            if (await deviceIsAllowedToSeeVote(auth.device, survey, models)) {
              return models.vote.get({ survey: survey.id })
            }
            break

          default:
            throw new Error('Not authorized or no permissions.')
        }
        throw new Error('Not authorized or no permissions.')
      } catch (e) {
        throw e
      }
    },
  },
  Mutation: {
    createAnswer: async (parent, { data }, { request, answerStore, models }) => {
      try {
        if (Object.keys(data).length !== 2) throw new Error('Illegal amount of arguments.')
        const { auth } = request
        const deviceDependencies = await getDeviceDependencies(auth, models)
        const inputData = data
        inputData.question = getMatchingId(inputData.questionID)
        delete inputData.questionID
        return answerStore.createAnswer(deviceDependencies, data)
      } catch (e) {
        throw e
      }
    },
  },
  Subscription: {
    answerUpdate: {
      async subscribe(rootValue, args, context) {
        if (!context.connection.context.Authorization) throw new Error('Not authorized or no permissions.')
        const auth = decode(context.connection.context.Authorization)
        const matchingDeviceId = getMatchingId(args.deviceID)
        const matchingDomainId = getMatchingId(args.domainID)
        const [desiredDevice] = await context.models.device.get({ _id: matchingDeviceId })

        if (!desiredDevice.domain || desiredDevice.domain !== matchingDomainId) throw new Error('Selected client is not inside of selected domain.')

        switch (auth.type) {
          case 'user': {
            if (!auth.isAdmin) {
              const matchingUserId = getMatchingId(auth.id)
              if (!desiredDevice.owners.includes(matchingUserId)) throw new Error('Not authorized or no permissions.')
            }
            break
          }

          case 'device': {
            const matchingAuthDeviceId = getMatchingId(auth.id)

            if (matchingDeviceId === matchingAuthDeviceId) break

            if (!desiredDevice.domain) throw new Error('Not authorized or no permissions.')

            const devicesOfDomainOfDesiredDevice =
              await context.models.device.get({ domain: desiredDevice.domain })
            const deviceIds = devicesOfDomainOfDesiredDevice.map(device => device.id)

            if (!deviceIds.includes(matchingAuthDeviceId)) throw new Error('Not authorized or no permissions.')
            break
          }

          default: throw new Error('Not authorized or no permissions.')
        }

        return withFilter(
          (__, ___, { pubsub }) => pubsub.asyncIterator(SUB_ANSWERS),
          (payload, variables) =>
            (payload.answerUpdate.deviceId === getMatchingId(variables.deviceID)
              && payload.answerUpdate.domainId === getMatchingId(variables.domainID)),
        )(rootValue, args, context)
      },
    },
    newVote: {
      async subscribe(rootValue, args, context) {
        if (!context.connection.context.Authorization) throw new Error('Not authorized or no permissions.')
        const auth = decode(context.connection.context.Authorization)
        const matchingSurveyId = getMatchingId(args.surveyID)
        const [desiredSurvey] = await context.models.survey.get({ _id: matchingSurveyId })

        switch (auth.type) {
          case 'user': {
            if (!auth.isAdmin) {
              const matchingUserId = getMatchingId(auth.id)
              if (desiredSurvey.creator !== matchingUserId) throw new Error('Not authorized or no permissions.')
            }
            break
          }

          case 'device': {
            const matchingAuthDeviceId = getMatchingId(auth.id)

            const [device] = await context.models.device.get({ _id: matchingAuthDeviceId })

            if (!device.domain) throw new Error('Not authorized or no permissions.')

            const [deviceDomain] = await context.models.domain.get({ _id: device.domain })

            if (deviceDomain.activeSurvey !== matchingSurveyId) throw new Error('Not authorized or no permissions.')
            break
          }

          default: throw new Error('Not authorized or no permissions.')
        }

        return withFilter(
          (__, ___, { pubsub }) => pubsub.asyncIterator(SUB_VOTES),
          (payload, variables) =>
            payload.newVote.surveyId === getMatchingId(variables.surveyID),
        )(rootValue, args, context)
      },
    },
  },
  Vote: {
    id: async parent => createHashFromId(parent.id),
    domain: async parent => ((Object.prototype.hasOwnProperty.call(parent.toObject(), 'domain')
        && parent.domain !== null && parent.domain !== '') ? createHashFromId(parent.domain) : null),
    device: async parent => ((Object.prototype.hasOwnProperty.call(parent.toObject(), 'device')
      && parent.device !== null && parent.device !== '') ? createHashFromId(parent.device) : null),
  },
  Answer: {
    __resolveType(obj) {
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
  ChoiceAnswer: {
    ...sharedResolvers,
    choice: async parent => ((Object.prototype.hasOwnProperty.call((parent.toObject) ? parent.toObject() : parent, 'choice')
      && parent.choice !== null
      && parent.choice !== '')
      ? createHashFromId(parent.choice) : null),
  },
  RegulatorAnswer: sharedResolvers,
  RankingAnswer: {
    ...sharedResolvers,
    rankedItems: async parent => ((Object.prototype.hasOwnProperty.call((parent.toObject) ? parent.toObject() : parent, 'rankedItems')
        && parent.rankedItems !== null
        && parent.rankedItems.length !== 0)
      ? parent.rankedItems.map(item => createHashFromId(item)) : null),
  },
  FavoriteAnswer: {
    ...sharedResolvers,
    favoriteItem: async parent => ((Object.prototype.hasOwnProperty.call((parent.toObject) ? parent.toObject() : parent, 'favoriteItem')
      && parent.favoriteItem !== null
      && parent.favoriteItem !== '')
      ? createHashFromId(parent.favoriteItem) : null),
  },
}
