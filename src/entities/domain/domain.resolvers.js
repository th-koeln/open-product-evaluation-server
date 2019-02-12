const _ = require('underscore')
const { withFilter } = require('graphql-yoga')
const { getMatchingId, createHashFromId } = require('../../utils/idStore')
const { ADMIN, USER, CLIENT } = require('../../utils/roles')
const { decode } = require('../../utils/authUtils')
const { SUB_DOMAIN } = require('../../utils/pubsubChannels')
const {
  getSortObjectFromRequest,
  getPaginationLimitFromRequest,
  getPaginationOffsetFromRequest,
  getQueryObjectForFilter,
} = require('../../utils/dbQueryBuilder')

const hasStatePremissions = async (auth, domainId, models) => {
  const [surveyDomain] = await models.domain.get({ _id: domainId })
  if (!(auth.role === CLIENT || auth.role === ADMIN || (auth.role === USER && (surveyDomain.owners
    .indexOf(auth.id) > -1)))) { return false }
  if (auth.role === CLIENT) {
    if (!Object.prototype.hasOwnProperty.call(auth.client.toObject(), 'domain')
      || auth.client.domain === null
      || auth.client.domain === ''
      || surveyDomain.id !== auth.client.domain) { return false }
  }
  return true
}

const getFilteredDomains = async (domains, types, models) => {
  try {
    const surveyIds = domains.reduce((acc, foundDomain) => ((foundDomain.activeSurvey && foundDomain.activeSurvey !== '')
      ? [...acc, foundDomain.activeSurvey] : acc), [])

    const matchingSurveys = await models.survey.get({
      _id: { $in: surveyIds },
      $and: [
        { types: { $not: { $elemMatch: { $nin: types } } } },
        { types: { $exists: true } },
      ],
    })

    const matchingIds = matchingSurveys.map(survey => survey.id)

    return domains.reduce((acc, domain) => ((matchingIds
      .indexOf(domain.activeSurvey) > -1) ? [...acc, domain] : acc), [])
  } catch (e) {
    throw new Error('No matching domain found.')
  }
}

const filterDomainsIfTypesWereProvided = async (args, domains, models) => {
  let filteredDomains = domains
  if (args.types && args.types !== null && args.types.length > 0) {
    filteredDomains = await getFilteredDomains(domains, _.uniq(args.types), models)
  }
  return filteredDomains
}

const getDomainsForClient = async (models, limit, offset, sort, filter) => {
  try {
    return await models.domain
      .get({ ...filter, activeSurvey: { $ne: null }, isPublic: true }, limit, offset, sort)
  } catch (e) {
    throw new Error('No public domain found.')
  }
}

const getDomainsForUser = async (auth, models, limit, offset, sort, filter) => {
  if (auth.role === ADMIN) {
    return models.domain.get({ ...filter }, limit, offset, sort)
  }
  return models.domain.get({ ...filter, owners: auth.id }, limit, offset, sort)
}

const keyExists = (object, keyName) => Object.prototype
  .hasOwnProperty.call(object.toObject(), keyName)

module.exports = {
  SortableDomainField: {
    CREATION_DATE: 'creationDate',
    LAST_UPDATE: 'lastUpdate',
    NAME: 'name',
    ACTIVE_SURVEY: 'activeSurvey',
    ACTIVE_QUESTION: 'activeQuestion',
    IS_PUBLIC: 'isPublic',
    OWNERS: 'owners',
  },
  Query: {
    domains: async (parent, args, { request, models }) => {
      try {
        const { auth } = request

        const limit = getPaginationLimitFromRequest(args.pagination)
        const offset = getPaginationOffsetFromRequest(args.pagination)
        const sort = getSortObjectFromRequest(args.sortBy)
        const filter = getQueryObjectForFilter(args.filterBy)

        switch (auth.role) {
          case CLIENT: {
            const domains = await getDomainsForClient(models, limit, offset, sort, filter)
            return filterDomainsIfTypesWereProvided(args, domains, models)
          }
          case USER: {
            const domains = await getDomainsForUser(auth, models, limit, offset, sort, filter)
            return filterDomainsIfTypesWereProvided(args, domains, models)
          }
          case ADMIN: {
            const domains = await getDomainsForUser(auth, models, limit, offset, sort, filter)
            return filterDomainsIfTypesWereProvided(args, domains, models)
          }
          default:
            throw new Error('Not authorized or no permissions.')
        }
      } catch (e) {
        throw e
      }
    },
    domain: async (parent, args, { models }) => {
      try {
        const [surveyDomain] = await models
          .domain.get({ _id: getMatchingId(args.domainID) })
        return surveyDomain
      } catch (e) {
        throw e
      }
    },
    state: async (parent, args, { request, models }) => {
      try {
        const { auth } = request
        const [surveyDomain] = await models.domain
          .get({ _id: getMatchingId(args.domainID) })
        const foundState = surveyDomain.states.find(state => state.key === args.key)

        switch (auth.role) {
          case ADMIN: {
            if (!foundState) { throw new Error('No State found.') }
            return foundState
          }

          case USER: {
            if (surveyDomain.owners.indexOf(auth.id) > -1) {
              if (!foundState) { throw new Error('No State found.') }
              return foundState
            }
            break
          }

          case CLIENT: {
            if ((Object.prototype.hasOwnProperty.call(auth.client.toObject(), 'domain')
            && auth.client.domain !== null
            && auth.client.domain !== ''
            && surveyDomain.id === auth.client.domain)) {
              if (!foundState) { throw new Error('No State found.') }
              return foundState
            }
            break
          }
          default:
            throw new Error('Not authorized or no permissions.')
        }

        throw new Error('Not authorized or no permissions.')
      } catch (e) {
        throw e
      }
    },
    domainAmount: async (parent, args, { request, models }) => {
      try {
        return (await module.exports.Query.domains(parent, args, { request, models })).length
      } catch (e) {
        return 0
      }
    },
  },
  Mutation: {
    createDomain: async (parent, args, { models, request }) => {
      try {
        const { auth } = request
        const newDomain = {
          owners: [auth.id],
          ...args.data,
        }
        const insertedDomain = (await models.domain.insert(newDomain))
        return {
          domain: insertedDomain,
        }
      } catch (e) {
        throw e
      }
    },
    updateDomain: async (parent, { data, domainID }, { models, request }) => {
      try {
        const { auth } = request

        const [domainFromID] = await models.domain
          .get({ _id: getMatchingId(domainID) })

        const prepareAndDoDomainUpdate = async () => {
          const inputData = data

          if (Object.prototype.hasOwnProperty.call(inputData, 'activeSurvey')) {
            if (inputData.activeSurvey) {
              inputData.activeSurvey = getMatchingId(inputData.activeSurvey)
              await models.survey.get({ _id: inputData.activeSurvey })
              if (!inputData.activeQuestion) { inputData.activeQuestion = null }
            } else { inputData.activeQuestion = null }
          }

          if (inputData.activeQuestion) {
            if (!domainFromID.activeSurvey && !inputData.activeSurvey) { throw new Error('Cant set activeQuestion when domain has no survey.') }
            inputData.activeQuestion = getMatchingId(inputData.activeQuestion)

            const surveyId = (inputData.activeSurvey)
              ? inputData.activeSurvey
              : domainFromID.activeSurvey

            const surveyQuestionIds = (await models.question.get({ survey: surveyId }))
              .map(question => question.id)

            if (!surveyQuestionIds.includes(inputData.activeQuestion)) { throw new Error('Question not found in survey.') }
          }

          const [newDomain] = await models.domain
            .update({ _id: getMatchingId(domainID) }, inputData)
          return { domain: newDomain }
        }

        switch (auth.role) {
          case ADMIN:
            return prepareAndDoDomainUpdate()

          case USER:
            if (domainFromID.owners.indexOf(auth.id) > -1) {
              return prepareAndDoDomainUpdate()
            }
            break

          case CLIENT:
            if (Object.keys(data).length > 1 || !Object.keys(data).includes('activeQuestion')) {
              throw new Error('Clients are only allowed to update the "activeQuestion" attribute.')
            }

            if (auth.client.domain && auth.client.domain === domainFromID.id) {
              return prepareAndDoDomainUpdate()
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
    deleteDomain: async (parent, { domainID }, { models, request }) => {
      try {
        const { auth } = request
        const matchingDomainId = getMatchingId(domainID)
        const [domainFromID] = await models.domain
          .get({ _id: matchingDomainId })

        if (auth.role === ADMIN || domainFromID.owners.indexOf(auth.id) > -1) {
          await models.domain.delete({ _id: matchingDomainId })
          return { success: true }
        }

        throw new Error('Not authorized or no permissions.')
      } catch (e) {
        throw e
      }
    },
    setDomainOwner: async (parent, { domainID, email }, { models, request }) => {
      try {
        const { auth } = request
        const matchingDomainId = getMatchingId(domainID)
        const [domainFromID] = await models.domain
          .get({ _id: matchingDomainId })
        const lowerCaseEmail = email.toLowerCase()

        if (auth.role === ADMIN || domainFromID.owners.indexOf(auth.id) > -1) {
          const [user] = await models.user.get({ email: lowerCaseEmail })

          if (domainFromID.owners.indexOf(user.id) > -1) {
            return { domain: domainFromID }
          }

          const [updatedDomain] = await models.domain.update(
            { _id: matchingDomainId },
            { $push: { owners: user.id } },
          )

          return { domain: updatedDomain }
        }

        throw new Error('Not authorized or no permissions.')
      } catch (e) {
        throw e
      }
    },
    removeDomainOwner: async (parent, { domainID, ownerID }, { models, request }) => {
      try {
        const { auth } = request
        const matchingDomainId = getMatchingId(domainID)
        const [domainFromID] = await models.domain
          .get({ _id: matchingDomainId })
        const matchingOwnerId = getMatchingId(ownerID)

        if (auth.role === ADMIN || domainFromID.owners.indexOf(auth.id) > -1) {
          if (domainFromID.owners.indexOf(matchingOwnerId) === -1) {
            return { success: true }
          }

          const [updatedDomain] = await models.domain.update(
            { _id: matchingDomainId },
            { $pull: { owners: matchingOwnerId } },
          )

          return { success: updatedDomain.owners.indexOf(matchingOwnerId) === -1 }
        }

        throw new Error('Not authorized or no permissions.')
      } catch (e) {
        throw e
      }
    },
    setState: async (parent, { data, domainID }, { models, request }) => {
      try {
        const { auth } = request
        const matchingDomainId = getMatchingId(domainID)

        const hasAccess = await hasStatePremissions(auth, matchingDomainId, models)

        if (!hasAccess) { throw new Error('Not authorized or no permissions.') }

        const state = await models.domain
          .setState(matchingDomainId, data.key, data.value)
        return { state }
      } catch (e) {
        throw e
      }
    },
    removeState: async (parent, { data, domainID }, { models, request }) => {
      try {
        const { auth } = request
        const matchingDomainId = getMatchingId(domainID)

        const hasAccess = await hasStatePremissions(auth, matchingDomainId, models)

        if (!hasAccess) { throw new Error('Not authorized or no permissions.') }

        await models.domain.removeState(matchingDomainId, data.key)

        return { success: true }
      } catch (e) {
        throw e
      }
    },
  },
  Subscription: {
    domainUpdate: {
      async subscribe(rootValue, args, context) {
        if (!context.connection.context.Authorization) { throw new Error('Not authorized or no permissions.') }
        const auth = decode(context.connection.context.Authorization)
        const matchingDomainId = getMatchingId(args.domainID)
        const [desiredDomain] = await context.models.domain.get({ _id: matchingDomainId })

        switch (auth.type) {
          case 'user': {
            if (!auth.isAdmin) {
              if (!desiredDomain.owners.includes(auth.id)) { throw new Error('Not authorized or no permissions.') }
            }
            break
          }

          case 'client': {
            const matchingClientId = getMatchingId(auth.id)
            const clientsOfDomain = await context.models.client.get({ domain: matchingDomainId })
            const clientIds = clientsOfDomain.map(client => client.id)

            if (!clientIds.includes(matchingClientId)) { throw new Error('Not authorized or no permissions.') }
            break
          }

          default: throw new Error('Not authorized or no permissions.')
        }

        return withFilter(
          (__, ___, { pubsub }) => pubsub.asyncIterator(SUB_DOMAIN),
          (payload, variables) => payload.domainUpdate
            .domain.id === getMatchingId(variables.domainID),
        )(rootValue, args, context)
      },
    },
  },
  Domain: {
    owners: async (parent, args, { request, models }) => {
      if (!keyExists(parent, 'owners') || parent.owners === null || parent.owners.length === 0) { return null }
      const { auth } = request
      const [surveyDomain] = await models.domain.get({ _id: parent.id })
      switch (auth.role) {
        case ADMIN:
          return models.user.get({ _id: { $in: parent.owners } })

        case USER:
          if (!(surveyDomain.owners.indexOf(auth.id) > -1)) { throw new Error('Not authorized or no permissions.') }
          return models.user.get({ _id: { $in: parent.owners } })

        default:
          throw new Error('Not authorized or no permissions.')
      }
    },
    clients: async (parent, args, { models }) => {
      try {
        const clients = await models.client.get({ domain: parent.id })
        return (clients.length === 0) ? null : clients
      } catch (e) {
        return null
      }
    },
    activeSurvey: async (parent, args, { models }) => {
      if (!keyExists(parent, 'activeSurvey') || parent.activeSurvey === null || parent.activeSurvey === '') { return null }
      return (await models.survey.get({ _id: parent.activeSurvey }))[0]
    },
    activeQuestion: async (parent, args, { models }) => {
      if (!keyExists(parent, 'activeQuestion') || parent.activeQuestion === null || parent.activeQuestion === '') { return null }
      return (await models.question.get({ _id: parent.activeQuestion }))[0]
    },
    states: async (parent) => {
      if (!keyExists(parent, 'states') || parent.states === null || parent.states.length === 0) { return null }
      return parent.states
    },
    id: async parent => createHashFromId(parent.id),
  },
}
