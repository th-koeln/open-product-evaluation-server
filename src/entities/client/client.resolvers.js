const { getMatchingId, createHashFromId } = require('../../utils/idStore')
const { encodeClient, decode } = require('../../utils/authUtils')
const { ADMIN, USER, CLIENT } = require('../../utils/roles')
const { withFilter } = require('graphql-yoga')
const { SUB_CLIENT } = require('../../utils/pubsubChannels')

const keyExists = (object, keyName) => Object.prototype
  .hasOwnProperty.call(object.toObject(), keyName)

module.exports = {
  Query: {
    clients: async (parent, args, { request, models }) => {
      try {
        const { auth } = request
        switch (auth.role) {
          case ADMIN:
            return await models.client.get()

          case USER:
            return await models.client.get({ owners: auth.user.email })

          case CLIENT:
            if (keyExists(auth.client, 'domain')
            && auth.client.domain !== null
            && auth.client.domain !== '') { return await models.client.get({ domain: auth.client.domain }) }
            return [auth.client]

          default:
            throw new Error('Not authorized or no permissions.')
        }
      } catch (e) {
        throw e
      }
    },
    client: async (parent, { clientID }, { request, models }) => {
      try {
        const { auth } = request
        const [client] = await models.client.get({ _id: getMatchingId(clientID) })

        switch (auth.role) {
          case ADMIN:
            return client

          case USER:
            if (client.owners.indexOf(auth.user.email) > -1) { return client }
            break

          case CLIENT:
            if (client.id === auth.id) { return client }
            break

          default:
            throw new Error('No permissions.')
        }
        throw new Error('No permissions.')
      } catch (e) {
        throw e
      }
    },
  },
  Mutation: {
    createClient: async (parent, { clientID, data }, { request, models }) => {
      try {
        const { auth } = request
        const newClient = (auth && auth.role === USER) ? {
          owners: [auth.user.email],
          ...data,
        } : data
        const client = await models.client.insert(newClient)
        return {
          client,
          token: encodeClient(createHashFromId(client.id)),
        }
      } catch (e) {
        throw e
      }
    },
    updateClient: async (parent, { clientID, data }, { request, models }) => {
      const matchingClientId = getMatchingId(clientID)

      async function updateClient() {
        const inputData = data
        if (inputData.domain) {
          inputData.domain = getMatchingId(inputData.domain)
          await models.domain.get({ _id: inputData.domain })
        }

        if (inputData.owners) {
          inputData.owners = inputData.owners.map(owner => owner.toLowerCase())
          const users = await models.user.get({ email: { $in: inputData.owners } })
          if (inputData.owners.length !== users.length) { throw new Error('Not all owners where found.') }
        }

        const [newClient] = await models.client
          .update({ _id: matchingClientId }, inputData)

        return { client: newClient }
      }

      try {
        const { auth } = request

        const [client] = await models.client.get({ _id: matchingClientId })

        switch (auth.role) {
          case ADMIN:
            return updateClient()

          case USER:
            if (client.owners.indexOf(auth.user.email) > -1) { return updateClient() }
            break

          case CLIENT:
            if (auth.id === client.id) { return updateClient() }
            break

          default:
            throw new Error('Not authorized or no permissions.')
        }
        throw new Error('Not authorized or no permissions.')
      } catch (e) {
        throw e
      }
    },
    deleteClient: async (parent, { clientID }, { request, models }) => {
      const matchingId = getMatchingId(clientID)

      async function deleteClient() {
        await models.client.delete({ _id: matchingId })
        return { success: true }
      }

      try {
        const { auth } = request
        const [client] = await models.client.get({ _id: matchingId })
        switch (auth.role) {
          case ADMIN:
            return deleteClient()

          case USER:
            if (client.owners.indexOf(auth.user.email) > -1) { return deleteClient() }
            break

          case CLIENT:
            if (auth.id === client.id) { return deleteClient() }
            break

          default:
            throw new Error('Not authorized or no permissions.')
        }
        throw new Error('Not authorized or no permissions.')
      } catch (e) {
        throw e
      }
    },
    setClientOwner: async (parent, { clientID, owner }, { models, request }) => {
      try {
        const { auth } = request
        const matchingClientId = getMatchingId(clientID)
        const [clientFromID] = await models.client
          .get({ _id: matchingClientId })
        const lowerCaseOwner = owner.toLowerCase()

        const setOwner = async () => {
          await models.user.get({ email: lowerCaseOwner })

          const [updatedClient] = await models.client.update(
            { _id: matchingClientId },
            { $push: { owners: lowerCaseOwner } },
          )

          return { client: updatedClient }
        }

        switch (auth.role) {
          case ADMIN:
            return setOwner()

          case USER:
            if (clientFromID.owners.indexOf(auth.user.email) > -1) {
              return setOwner()
            }
            break

          case CLIENT:
            if (auth.id === clientFromID.id) {
              return setOwner()
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
    removeClientOwner: async (parent, { clientID, owner }, { models, request }) => {
      try {
        const { auth } = request
        const matchingClientId = getMatchingId(clientID)
        const [clientFromID] = await models.client
          .get({ _id: matchingClientId })
        const lowerCaseOwner = owner.toLowerCase()

        const removeOwner = async () => {
          const [updatedClient] = await models.client.update(
            { _id: matchingClientId },
            { $pull: { owners: lowerCaseOwner } },
          )

          return { success: updatedClient.owners.indexOf(lowerCaseOwner) === -1 }
        }

        switch (auth.role) {
          case ADMIN:
            return removeOwner()

          case USER:
            if (clientFromID.owners.indexOf(auth.user.email) > -1) {
              return removeOwner()
            }
            break

          case CLIENT:
            if (auth.id === clientFromID.id) {
              return removeOwner()
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
  Subscription: {
    clientUpdate: {
      async subscribe(rootValue, args, context) {
        if (!context.connection.context.Authorization) { throw new Error('Not authorized or no permissions.') }
        const auth = decode(context.connection.context.Authorization)
        const matchingClientId = getMatchingId(args.clientID)
        const [desiredClient] = await context.models.client.get({ _id: matchingClientId })

        switch (auth.type) {
          case 'user': {
            if (!auth.isAdmin) {
              if (!desiredClient.owners.includes(auth.user.email)) { throw new Error('Not authorized or no permissions.') }
            }
            break
          }

          case 'client': {
            const matchingAuthClientId = getMatchingId(auth.id)

            if (matchingClientId === matchingAuthClientId) { break }

            if (!desiredClient.domain) { throw new Error('Not authorized or no permissions.') }

            const clientsOfDomainOfDesiredClient = await context.models
              .client.get({ domain: desiredClient.domain })
            const clientIds = clientsOfDomainOfDesiredClient.map(client => client.id)

            if (!clientIds.includes(matchingAuthClientId)) { throw new Error('Not authorized or no permissions.') }
            break
          }

          default: throw new Error('Not authorized or no permissions.')
        }

        return withFilter(
          (__, ___, { pubsub }) => pubsub.asyncIterator(SUB_CLIENT),
          (payload, variables) => payload.clientUpdate
            .client.id === getMatchingId(variables.clientID),
        )(rootValue, args, context)
      },
    },
  },
  Client: {
    id: async parent => createHashFromId(parent.id),
    owners: async (parent, args, { models, request }) => {
      const { auth } = request
      if (!keyExists(parent, 'owners') || parent.owners === null || parent.owners.length === 0) { return null }
      switch (auth.role) {
        case ADMIN:
          return models.user.get({ email: { $in: parent.owners } })

        case USER:
          if (parent.owners.indexOf(auth.user.email) > -1) {
            return models.user.get({ email: { $in: parent.owners } })
          }
          break

        default:
          throw new Error('Not authorized or no permissions.')
      }
      throw new Error('Not authorized or no permissions.')
    },
    domain: async (parent, args, { models }) => {
      if (!keyExists(parent, 'domain') || parent.domain === null || parent.domain === '') { return null }
      return (await models.domain.get({ _id: parent.domain }))[0]
    },
  },

}
