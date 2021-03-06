const { withFilter } = require('graphql-yoga')
const { getMatchingId } = require('../../store/id.store')
const { ADMIN, USER, CLIENT } = require('../../utils/roles')
const { decode } = require('../../utils/auth')
const { SUB_ANSWERS, SUB_VOTES } = require('../../subscriptions/channels')
const {
  getSortObjectFromRequest,
  getPaginationLimitFromRequest,
  getPaginationOffsetFromRequest,
  createVoteFilter,
} = require('../../utils/filter')
const { stringExists, arrayExists } = require('../../utils/checks')


const getClientDependencies = async (auth, models) => {
  if (!(auth.role === CLIENT)) { throw new Error('Not authorized or no permissions.') }
  const { client } = auth

  if (!stringExists(client.toObject(), 'domain')) {
    throw new Error('This Client is not connected to a Domain.')
  }

  const [domain] = await models.domain.get({ _id: client.domain })

  if (!stringExists(domain.toObject(), 'activeSurvey')) {
    throw new Error('The Domain€ of this Client is not connected to a Survey.')
  }

  const [survey] = await models.survey.get({ _id: domain.activeSurvey })

  return {
    client,
    domain,
    survey,
  }
}

const clientIsAllowedToSeeVote = async (client, survey, models) => {
  if (stringExists(client.toObject(), 'domain')) {
    const domainIds = (await models.domain.get({ activeSurvey: survey.id }))
      .reduce((acc, domain) => [...acc, domain.id], [])

    return domainIds.indexOf(client.domain) > -1
  } return false
}

module.exports = {
  SortableVoteField: {
    CREATION_DATE: 'creationDate',
    DOMAIN: 'domain',
    CLIENT: 'client',
  },
  Query: {
    votes: async (parent,
      {
        surveyID,
        sortBy,
        pagination,
        filterBy,
      }, { request, models }) => {
      try {
        const { auth } = request
        const [survey] = await models.survey.get({ _id: surveyID })
        const [currentVersion] = await models.version.get(
          { survey: surveyID },
          null,
          null,
          { versionNumber: 'Descending' },
        )

        const limit = getPaginationLimitFromRequest(pagination)
        const offset = getPaginationOffsetFromRequest(pagination)
        const sort = getSortObjectFromRequest(sortBy)
        const filter = await createVoteFilter(filterBy, models)

        switch (auth.role) {
          case ADMIN:
            return models.vote.get({ ...filter, version: currentVersion.id }, limit, offset, sort)

          case USER:
            if (survey.creator === auth.id) {
              return models.vote.get({ ...filter, version: currentVersion.id }, limit, offset, sort)
            }
            break

          case CLIENT:
            if (await clientIsAllowedToSeeVote(auth.client, survey, models)) {
              return models.vote.get({ ...filter, version: currentVersion.id }, limit, offset, sort)
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
    voteAmount: async (parent, args, { request, models }) => {
      try {
        return (await module.exports.Query.votes(parent, args, { request, models })).length
      } catch (e) {
        return 0
      }
    },
  },
  Mutation: {
    setAnswer: async (parent, { data }, { request, answerStore, models }) => {
      try {
        if (Object.keys(data).length !== 2) {
          throw new Error('Illegal amount of arguments.')
        }

        const { auth } = request
        const clientDependencies = await getClientDependencies(auth, models)
        const inputData = data
        inputData.question = inputData.questionID
        delete inputData.questionID
        return answerStore.createAnswer(clientDependencies, data)
      } catch (e) {
        throw e
      }
    },
    removeAnswer: async (parent, { questionID }, { request, answerStore, models }) => {
      const { auth } = request

      const clientDependencies = await getClientDependencies(auth, models)
      return {
        success: answerStore.removeAnswerForQuestion(questionID, clientDependencies),
      }
    },
  },
  Subscription: {
    answerUpdate: {
      async subscribe(rootValue, args, context) {
        if (!context.connection.context.Authorization) {
          throw new Error('Not authorized or no permissions.')
        }

        const auth = decode(context.connection.context.Authorization)
        const { clientID } = args
        const { domainID } = args

        const [desiredDomain] = await context.models.domain.get({ _id: domainID })

        if (clientID) {
          const [desiredClient] = await context.models.client.get({ _id: clientID })

          if (!desiredClient.domain || desiredClient.domain !== domainID) {
            throw new Error('Not authorized or no permissions.')
          }
        }

        switch (auth.type) {
          case 'user': {
            if (!auth.isAdmin) {
              const matchingUserId = getMatchingId(auth.id)
              if (!desiredDomain.owners.includes(matchingUserId)) {
                throw new Error('Not authorized or no permissions.')
              }
            }

            break
          }

          case 'client': {
            try {
              const matchingAuthClientId = getMatchingId(auth.id)
              const [requestingClient] = await context.models.client.get({ _id: matchingAuthClientId })

              if (!requestingClient.domain || requestingClient.domain !== domainID) {
                throw new Error()
              }
            } catch (e) { throw new Error('Not authorized or no permissions.') }

            break
          }

          default: throw new Error('Not authorized or no permissions.')
        }

        return withFilter(
          (__, ___, { pubsub }) => pubsub.asyncIterator(SUB_ANSWERS),
          // eslint-disable-next-line
          (payload, variables) => {
            if (variables.clientID) {
              return (payload.answerUpdate.clientId === variables.clientID
                && payload.answerUpdate.domainId === variables.domainID)
            }

            return payload.answerUpdate.domainId === variables.domainID
          },
        )(rootValue, args, context)
      },
    },
    voteUpdate: {
      async subscribe(rootValue, args, context) {
        if (!context.connection.context.Authorization) {
          throw new Error('Not authorized or no permissions.')
        }

        const auth = decode(context.connection.context.Authorization)
        const { surveyID } = args
        const [desiredSurvey] = await context.models.survey.get({ _id: surveyID })

        switch (auth.type) {
          case 'user': {
            if (!auth.isAdmin) {
              const matchingUserId = getMatchingId(auth.id)
              if (desiredSurvey.creator !== matchingUserId) {
                throw new Error('Not authorized or no permissions.')
              }
            }
            break
          }

          case 'client': {
            const matchingAuthClientId = getMatchingId(auth.id)

            const [client] = await context.models.client.get({ _id: matchingAuthClientId })

            if (!client.domain) { throw new Error('Not authorized or no permissions.') }

            const [clientDomain] = await context.models.domain.get({ _id: client.domain })

            if (clientDomain.activeSurvey !== surveyID) {
              throw new Error('Not authorized or no permissions.')
            }
            break
          }

          default: throw new Error('Not authorized or no permissions.')
        }

        return withFilter(
          (__, ___, { pubsub }) => pubsub.asyncIterator(SUB_VOTES),
          (payload, variables) => payload.voteUpdate.surveyId === variables.surveyID,
        )(rootValue, args, context)
      },
    },
  },
  Vote: {
    domain: async parent =>
      (stringExists(parent, 'domain')
        ? parent.domain : null),
    client: async parent =>
      (stringExists(parent, 'client')
        ? parent.client : null),
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
  ChoiceAnswer: {
    choice: async parent =>
      (stringExists(parent, 'choice')
        ? parent.choice : null),
  },
  RankingAnswer: {
    rankedItems: async parent =>
      (arrayExists(parent, 'rankedItems')
        ? parent.rankedItems.map(item => item) : null),
  },
  FavoriteAnswer: {
    favoriteItem: async parent =>
      (stringExists(parent, 'favoriteItem')
        ? parent.favoriteItem : null),
  },
}
