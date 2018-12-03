const { getMatchingId, createHashFromId } = require('../../utils/idStore')
const { ADMIN, USER, CLIENT } = require('../../utils/roles')
const { decode } = require('../../utils/authUtils')
const { withFilter } = require('graphql-yoga')
const { SUB_ANSWERS, SUB_VOTES } = require('../../utils/pubsubChannels')

const sharedResolvers = {
  question: async parent => createHashFromId(parent.question),
}

const getClientDependencies = async (auth, models) => {
  if (!(auth.role === CLIENT)) { throw new Error('Not authorized or no permissions.') }
  const { client } = auth

  if (!(Object.prototype.hasOwnProperty.call(client.toObject(), 'domain')
    && client.domain !== null && client.domain !== '')) { throw new Error('This Client is not connected to a Domain.') }
  const [domain] = await models.domain.get({ _id: client.domain })

  if (!(Object.prototype.hasOwnProperty.call(domain.toObject(), 'activeSurvey')
    && domain.activeSurvey !== null && domain.activeSurvey !== '')) { throw new Error('The Domain€ of this Client is not connected to a Survey.') }
  const [survey] = await models.survey.get({ _id: domain.activeSurvey })

  return {
    client,
    domain,
    survey,
  }
}

const clientIsAllowedToSeeVote = async (client, survey, models) => {
  if (Object.prototype.hasOwnProperty.call(client.toObject(), 'domain')
    && client.domain !== null && client.domain !== '') {
    const domainIds = (await models.domain.get({ activeSurvey: survey.id }))
      .reduce((acc, domain) => [...acc, domain.id], [])

    return domainIds.indexOf(client.domain) > -1
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
            if (survey.creator === auth.id) { return models.vote.get({ survey: survey.id }) }
            break

          case CLIENT:
            if (await clientIsAllowedToSeeVote(auth.client, survey, models)) {
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
        if (Object.keys(data).length !== 2) { throw new Error('Illegal amount of arguments.') }
        const { auth } = request
        const clientDependencies = await getClientDependencies(auth, models)
        const inputData = data
        inputData.question = getMatchingId(inputData.questionID)
        delete inputData.questionID
        return answerStore.createAnswer(clientDependencies, data)
      } catch (e) {
        throw e
      }
    },
  },
  Subscription: {
    answerUpdate: {
      async subscribe(rootValue, args, context) {
        if (!context.connection.context.Authorization) { throw new Error('Not authorized or no permissions.') }
        const auth = decode(context.connection.context.Authorization)
        const matchingClientId = getMatchingId(args.clientID)
        const matchingDomainId = getMatchingId(args.domainID)
        const [desiredClient] = await context.models.client.get({ _id: matchingClientId })

        if (!desiredClient.domain || desiredClient.domain !== matchingDomainId) { throw new Error('Selected client is not inside of selected domain.') }

        switch (auth.type) {
          case 'user': {
            if (!auth.isAdmin) {
              const matchingUserId = getMatchingId(auth.id)
              if (!desiredClient.owners.includes(matchingUserId)) { throw new Error('Not authorized or no permissions.') }
            }
            break
          }

          case 'client': {
            const matchingAuthClientId = getMatchingId(auth.id)

            if (matchingClientId === matchingAuthClientId) { break }

            if (!desiredClient.domain) { throw new Error('Not authorized or no permissions.') }

            const clientsOfDomainOfDesiredClient =
              await context.models.client.get({ domain: desiredClient.domain })
            const clientIds = clientsOfDomainOfDesiredClient.map(client => client.id)

            if (!clientIds.includes(matchingAuthClientId)) { throw new Error('Not authorized or no permissions.') }
            break
          }

          default: throw new Error('Not authorized or no permissions.')
        }

        return withFilter(
          (__, ___, { pubsub }) => pubsub.asyncIterator(SUB_ANSWERS),
          (payload, variables) =>
            (payload.answerUpdate.clientId === getMatchingId(variables.clientID)
              && payload.answerUpdate.domainId === getMatchingId(variables.domainID)),
        )(rootValue, args, context)
      },
    },
    newVote: {
      async subscribe(rootValue, args, context) {
        if (!context.connection.context.Authorization) { throw new Error('Not authorized or no permissions.') }
        const auth = decode(context.connection.context.Authorization)
        const matchingSurveyId = getMatchingId(args.surveyID)
        const [desiredSurvey] = await context.models.survey.get({ _id: matchingSurveyId })

        switch (auth.type) {
          case 'user': {
            if (!auth.isAdmin) {
              const matchingUserId = getMatchingId(auth.id)
              if (desiredSurvey.creator !== matchingUserId) { throw new Error('Not authorized or no permissions.') }
            }
            break
          }

          case 'client': {
            const matchingAuthClientId = getMatchingId(auth.id)

            const [client] = await context.models.client.get({ _id: matchingAuthClientId })

            if (!client.domain) { throw new Error('Not authorized or no permissions.') }

            const [clientDomain] = await context.models.domain.get({ _id: client.domain })

            if (clientDomain.activeSurvey !== matchingSurveyId) { throw new Error('Not authorized or no permissions.') }
            break
          }

          default: throw new Error('Not authorized or no permissions.')
        }

        return withFilter(
          (__, ___, { pubsub }) => pubsub.asyncIterator(SUB_VOTES),
          (payload, variables) => payload.newVote.surveyId === getMatchingId(variables.surveyID),
        )(rootValue, args, context)
      },
    },
  },
  Vote: {
    id: async parent => createHashFromId(parent.id),
    domain: async parent => ((Object.prototype.hasOwnProperty.call(parent.toObject(), 'domain')
        && parent.domain !== null && parent.domain !== '') ? createHashFromId(parent.domain) : null),
    client: async parent => ((Object.prototype.hasOwnProperty.call(parent.toObject(), 'client')
      && parent.client !== null && parent.client !== '') ? createHashFromId(parent.client) : null),
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
