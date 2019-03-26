const users = require('../../../seeds/data/user/user')
const clients = require('../../../seeds/data/client/client')
const domains = require('../../../seeds/data/domain/domain')
const { Seeder } = require('mongo-seeding')
const config = require('../../../../config')
const { unauthRequest, authRequest } = require('../../helper/requests')
const { getSeedID, getNotMatchingID, getClientToken } = require('../../helper/helpers')
const {
  clientAmountQuery,
  clientsQuery,
  clientQuery,
  loginClientMutation,
  updateClientMutation,
  deleteClientMutation,
  setClientOwnerMutation,
  removeClientOwnerMutation
} = require('../../requests/client.requests.js')
const { TEMPORARY } = require('../../../../src/utils/lifetime')

const seeder = new Seeder(config.seeder)
const collections = seeder.readCollectionsFromPath(config.seeder.inputPath)

describe('Client', () => {
  describe('that is permanent', () => {
    const user = users[0]
    const client = clients[2]
    let jwt = ''

    beforeEach(async () => {
      await seeder.import(collections)

      const query = loginClientMutation(user.email, client.code)
      const { data, errors } = await unauthRequest(query)

      expect(data.loginClient).not.toBeNull()
      expect(errors).toBeUndefined()

      const { loginClient: { token } } = data
      jwt = token
    })

    describe('should', async () => {
      it('get amount of clients that are in the same domain', async () => {
        const query = clientAmountQuery()
        const res = await authRequest(query, jwt)
        const { data, errors } = res

        expect(errors).toBeUndefined()
        expect(data.clientAmount).toBe(3)
      })
      it('find all clients of the connected domain when querying for clients', async () => {
        const query = clientsQuery()
        const res = await authRequest(query, jwt)
        const { data, errors } = res

        expect(errors).toBeUndefined()
        expect(data.clients).toMatchSnapshot()
      })
      it('find itself when querying for a specific client', async () => {
        const query = clientQuery(getSeedID(clients[2]), true)
        const res = await authRequest(query, jwt)
        const { data, errors } = res

        expect(errors).toBeUndefined()
        expect(data.client).toMatchSnapshot()
      })
      it('find a client that is connected to the same domain', async () => {
        const query = clientQuery(getSeedID(clients[3]))
        const res = await authRequest(query, jwt)
        const { data, errors } = res

        expect(errors).toBeUndefined()
        expect(data.client).toMatchSnapshot()
      })
      it('update name of itself', async () => {
        const query = updateClientMutation(
          getSeedID(clients[2]),
          { name: 'newName' },
          true,
        )
        const res = await authRequest(query, jwt)
        const { data, errors } = res

        expect(errors).toBeUndefined()
        expect(data.updateClient.client).toMatchSnapshot()
      })
      it('set new domain for itself', async () => {
        const query = updateClientMutation(
          getSeedID(clients[2]),
          { domain: getSeedID(domains[0]) },
          true,
        )
        const res = await authRequest(query, jwt)
        const { data, errors } = res

        expect(errors).toBeUndefined()
        expect(data.updateClient.client).toMatchSnapshot()
      })
      it('remove domain from itself', async () => {
        const query = updateClientMutation(
          getSeedID(clients[2]),
          { domain: null },
          true,
        )
        const res = await authRequest(query, jwt)
        const { data, errors } = res

        expect(errors).toBeUndefined()
        expect(data.updateClient.client).toMatchSnapshot()
      })
      it('delete itself', async () => {
        const query = deleteClientMutation(getSeedID(clients[2]))
        const res = await authRequest(query, jwt)
        const { data, errors } = res

        expect(errors).toBeUndefined()
        expect(data.deleteClient.success).toBe(true)
      })
      it('set an owner for itself', async () => {
        const query = setClientOwnerMutation(getSeedID(clients[2]), users[1].email)
        const res = await authRequest(query, jwt)
        const { data, errors } = res

        expect(errors).toBeUndefined()
        expect(data.setClientOwner.client).toMatchSnapshot()
      })
      it('remove an owner from itself', async () => {
        const query = removeClientOwnerMutation(getSeedID(clients[2]), getSeedID(users[0]))
        const res = await authRequest(query, jwt)
        const { data, errors } = res

        expect(errors).toBeUndefined()
        expect(data.removeClientOwner.success).toBe(true)
      })
      it('be deleted when it has no more owners', async () => {
        const query = removeClientOwnerMutation(getSeedID(clients[2]), getSeedID(users[0]))
        const res = await authRequest(query, jwt)
        const { data, errors } = res

        expect(errors).toBeUndefined()
        expect(data.removeClientOwner.success).toBe(true)

        const findQuery = clientQuery(getSeedID(clients[2]))
        const findRes = await authRequest(findQuery, jwt)
        const { data: findData, errors: findErrors } = findRes

        expect(findData).toBeNull()
        expect(findErrors.length).toBeGreaterThan(0)
      })
    })
    describe('should not', async () => {
      it('find it when querying for another client that is not in the same domain', async () => {
        const query = clientQuery(getSeedID(clients[0]))
        const res = await authRequest(query, jwt)
        const { data, errors } = res

        expect(data).toBeNull()
        expect(errors.length).toBeGreaterThan(0)
      })
      it('see owners of another client', async () => {
        const query = clientQuery(getSeedID(clients[3]), true)
        const res = await authRequest(query, jwt)
        const { data, errors } = res

        expect(data.client.owners).toBeNull()
        expect(errors.length).toBeGreaterThan(0)
      })
      it('update name of another client', async () => {
        const query = updateClientMutation(
          getSeedID(clients[3]),
          { name: 'newName' },
          true,
        )
        const res = await authRequest(query, jwt)
        const { data, errors } = res

        expect(data).toBeNull()
        expect(errors.length).toBeGreaterThan(0)
      })
      it('set new domain for another client', async () => {
        const query = updateClientMutation(
          getSeedID(clients[3]),
          { domain: getSeedID(domains[1]) },
        )
        const res = await authRequest(query, jwt)
        const { data, errors } = res

        expect(data).toBeNull()
        expect(errors.length).toBeGreaterThan(0)
      })
      it('set a non existing domain for itself', async () => {
        const query = updateClientMutation(getSeedID(clients[2]),
          { domain: getNotMatchingID() },
        )

        const res = await authRequest(query, jwt)
        const { data, errors } = res

        expect(data).toBeNull()
        expect(errors.length).toBeGreaterThan(0)
      })
      it('set an empty name for itself', async () => {
        const query = updateClientMutation(getSeedID(clients[2]),
          { name: null },
        )

        const res = await authRequest(query, jwt)
        const { data, errors } = res

        expect(data).toBeNull()
        expect(errors.length).toBeGreaterThan(0)
      })
      it('remove domain from another client', async () => {
        const query = updateClientMutation(
          getSeedID(clients[3]),
          { domain: null },
        )
        const res = await authRequest(query, jwt)
        const { data, errors } = res

        expect(data).toBeNull()
        expect(errors.length).toBeGreaterThan(0)
      })
      it('delete another client', async () => {
        const query = deleteClientMutation(getSeedID(clients[3]))
        const res = await authRequest(query, jwt)
        const { data, errors } = res

        expect(data).toBeNull()
        expect(errors.length).toBeGreaterThan(0)
      })
      it('delete a non existing client', async () => {
        const query = deleteClientMutation(getNotMatchingID())

        const res = await authRequest(query, jwt)
        const { data, errors } = res

        expect(data).toBeNull()
        expect(errors.length).toBeGreaterThan(0)
      })
      it('set an owner for another client', async () => {
        const query = setClientOwnerMutation(getSeedID(clients[3]), users[1].email)
        const res = await authRequest(query, jwt)
        const { data, errors } = res

        expect(data).toBeNull()
        expect(errors.length).toBeGreaterThan(0)
      })
      it('set a non existing owner for itself', async () => {
        const query = setClientOwnerMutation(getSeedID(clients[2]), 'notFound@user.com')

        const res = await authRequest(query, jwt)
        const { data, errors } = res

        expect(data).toBeNull()
        expect(errors.length).toBeGreaterThan(0)
      })
      it('remove an owner from another client', async () => {
        const query = removeClientOwnerMutation(getSeedID(clients[3]), getSeedID(users[0]))
        const res = await authRequest(query, jwt)
        const { data, errors } = res

        expect(data).toBeNull()
        expect(errors.length).toBeGreaterThan(0)
      })
      it('remove a non existing owner from itself', async () => {
        const query = removeClientOwnerMutation(getNotMatchingID(), getSeedID(users[2]))
        const res = await authRequest(query, jwt)
        const { data, errors } = res

        expect(data).toBeNull()
        expect(errors.length).toBeGreaterThan(0)
      })
    })
  })

  describe('that is temporary', () => {
    const client = clients[4]
    let jwt = ''

    beforeEach(async () => {
      await seeder.import(collections)

      jwt = getClientToken(client, TEMPORARY)
    })

    describe('should', async () => {
      it('get amount of clients that are in the same domain', async () => {
        const query = clientAmountQuery()
        const res = await authRequest(query, jwt)
        const { data, errors } = res

        expect(errors).toBeUndefined()
        expect(data.clientAmount).toBe(3)
      })
      it('find all clients of the connected domain when querying for clients', async () => {
        const query = clientsQuery()
        const res = await authRequest(query, jwt)
        const { data, errors } = res

        expect(errors).toBeUndefined()
        expect(data.clients).toMatchSnapshot()
      })
      it('find itself when querying for a specific client', async () => {
        const query = clientQuery(getSeedID(clients[4]))
        const res = await authRequest(query, jwt)
        const { data, errors } = res

        expect(errors).toBeUndefined()
        expect(data.client).toMatchSnapshot()
      })
      it('find a client that is connected to the same domain', async () => {
        const query = clientQuery(getSeedID(clients[3]))
        const res = await authRequest(query, jwt)
        const { data, errors } = res

        expect(errors).toBeUndefined()
        expect(data.client).toMatchSnapshot()
      })
      it('remove domain from itself', async () => {
        const query = updateClientMutation(
          getSeedID(clients[4]),
          { domain: null },
          true,
        )
        const res = await authRequest(query, jwt)
        const { data, errors } = res

        expect(errors).toBeUndefined()
        expect(data.updateClient.client).toMatchSnapshot()
      })
      it('delete itself', async () => {
        const query = deleteClientMutation(getSeedID(clients[4]))
        const res = await authRequest(query, jwt)
        const { data, errors } = res

        expect(errors).toBeUndefined()
        expect(data.deleteClient.success).toBe(true)
      })
      it('be deleted when it has no domain', async () => {
        const query = updateClientMutation(
          getSeedID(clients[4]),
          { domain: null },
          true,
        )
        const res = await authRequest(query, jwt)
        const { data, errors } = res

        expect(errors).toBeUndefined()
        expect(data.updateClient.client).toMatchSnapshot()

        const findQuery = clientQuery(getSeedID(clients[4]))
        const findRes = await authRequest(findQuery, jwt)
        const { data: findData, errors: findErrors } = findRes

        expect(findData).toBeNull()
        expect(findErrors.length).toBeGreaterThan(0)
      })
    })
    describe('should not', async () => {
      it('find it when querying for another client that is not in the same domain', async () => {
        const query = clientQuery(getSeedID(clients[0]))
        const res = await authRequest(query, jwt)
        const { data, errors } = res

        expect(data).toBeNull()
        expect(errors.length).toBeGreaterThan(0)
      })
      it('see owners of another client', async () => {
        const query = clientQuery(getSeedID(clients[3]), true)
        const res = await authRequest(query, jwt)
        const { data, errors } = res

        expect(data.client.owners).toBeNull()
        expect(errors.length).toBeGreaterThan(0)
      })

      it('update name of itself', async () => {
        const query = updateClientMutation(
          getSeedID(clients[4]),
          { name: 'newName' },
          true,
        )
        const res = await authRequest(query, jwt)
        const { data, errors } = res

        expect(data).toBeNull()
        expect(errors.length).toBeGreaterThan(0)
      })
      it('update name of another client', async () => {
        const query = updateClientMutation(
          getSeedID(clients[3]),
          { name: 'newName' },
          true,
        )
        const res = await authRequest(query, jwt)
        const { data, errors } = res

        expect(data).toBeNull()
        expect(errors.length).toBeGreaterThan(0)
      })
      it('set new domain for itself', async () => {
        const query = updateClientMutation(
          getSeedID(clients[4]),
          { domain: getSeedID(domains[0]) },
          true,
        )
        const res = await authRequest(query, jwt)
        const { data, errors } = res

        expect(data).toBeNull()
        expect(errors.length).toBeGreaterThan(0)
      })
      it('set new domain for another client', async () => {
        const query = updateClientMutation(
          getSeedID(clients[3]),
          { domain: getSeedID(domains[1]) },
        )
        const res = await authRequest(query, jwt)
        const { data, errors } = res

        expect(data).toBeNull()
        expect(errors.length).toBeGreaterThan(0)
      })
      it('set a non existing domain for itself', async () => {
        const query = updateClientMutation(getSeedID(clients[2]),
          { domain: getNotMatchingID() },
        )

        const res = await authRequest(query, jwt)
        const { data, errors } = res

        expect(data).toBeNull()
        expect(errors.length).toBeGreaterThan(0)
      })
      it('remove domain from another client', async () => {
        const query = updateClientMutation(
          getSeedID(clients[3]),
          { domain: null },
        )
        const res = await authRequest(query, jwt)
        const { data, errors } = res

        expect(data).toBeNull()
        expect(errors.length).toBeGreaterThan(0)
      })
      it('delete another client', async () => {
        const query = deleteClientMutation(getSeedID(clients[3]))
        const res = await authRequest(query, jwt)
        const { data, errors } = res

        expect(data).toBeNull()
        expect(errors.length).toBeGreaterThan(0)
      })
      it('delete a non existing client', async () => {
        const query = deleteClientMutation(getNotMatchingID())

        const res = await authRequest(query, jwt)
        const { data, errors } = res

        expect(data).toBeNull()
        expect(errors.length).toBeGreaterThan(0)
      })
      it('set an owner for another client', async () => {
        const query = setClientOwnerMutation(getSeedID(clients[3]), users[1].email)
        const res = await authRequest(query, jwt)
        const { data, errors } = res

        expect(data).toBeNull()
        expect(errors.length).toBeGreaterThan(0)
      })
      it('set an owner for itself', async () => {
        const query = setClientOwnerMutation(getSeedID(clients[4]), users[1].email)
        const res = await authRequest(query, jwt)
        const { data, errors } = res

        expect(data).toBeNull()
        expect(errors.length).toBeGreaterThan(0)
      })
      it('remove an owner from itself', async () => {
        const query = removeClientOwnerMutation(getSeedID(clients[4]), getSeedID(users[0]))
        const res = await authRequest(query, jwt)
        const { data, errors } = res

        expect(data).toBeNull()
        expect(errors.length).toBeGreaterThan(0)
      })
      it('remove an owner from another client', async () => {
        const query = removeClientOwnerMutation(getSeedID(clients[3]), getSeedID(users[0]))
        const res = await authRequest(query, jwt)
        const { data, errors } = res

        expect(data).toBeNull()
        expect(errors.length).toBeGreaterThan(0)
      })
    })
  })
})
