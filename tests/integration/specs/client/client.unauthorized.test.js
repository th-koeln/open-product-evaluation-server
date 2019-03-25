const users = require('../../../seeds/data/user/user')
const clients = require('../../../seeds/data/client/client')
const domains = require('../../../seeds/data/domain/domain')
const { Seeder } = require('mongo-seeding')
const config = require('../../../../config')
const { unauthRequest } = require('../../helper/requests')
const { getSeedID, getNotMatchingID } = require('../../helper/helpers')
const {
  clientAmountQuery,
  createPermanentClientMutation,
  createTemporaryClientMutation,
  loginClientMutation,
  clientsQuery,
  clientQuery,
  updateClientMutation,
  deleteClientMutation,
  setClientOwnerMutation,
  removeClientOwnerMutation
} = require('../../queries/client.queries.js')

const seeder = new Seeder(config.seeder)
const collections = seeder.readCollectionsFromPath(config.seeder.inputPath)

describe('Unauthorized', () => {
  beforeEach(async () => {
    await seeder.import(collections)
  })

  describe('should', async () => {
    it('create a permanent client', async () => {
      const query = createPermanentClientMutation('TestClient', users[0].email)
      const res = await unauthRequest(query)
      const { data, errors } = res

      expect(errors).toBeUndefined()
      expect(data.createPermanentClient.client).toMatchSnapshot()
      expect(data.createPermanentClient.code).not.toBeNull()
      expect(data.createPermanentClient.token).not.toBeNull()
    })
    it('login as a permanent client', async () => {
      const query = loginClientMutation(users[0].email, clients[2].code)
      const res = await unauthRequest(query)
      const { data, errors } = res

      expect(errors).toBeUndefined()
      expect(data.loginClient.client).toMatchSnapshot()
      expect(data.loginClient.code).not.toBeNull()
      expect(data.loginClient.token).not.toBeNull()
    })
    it('create a temporary client', async () => {
      const query = createTemporaryClientMutation(getSeedID(domains[0]))
      const res = await unauthRequest(query)
      const { data, errors } = res

      expect(errors).toBeUndefined()
      expect(data.createTemporaryClient.client).toMatchSnapshot()
      expect(data.createTemporaryClient.token).not.toBeNull()
    })
  })
  describe('should not', async () => {
    it('get the amount of clients', async () => {
      const query = clientAmountQuery()
      const res = await unauthRequest(query)
      const { data, errors } = res

      expect(data.clientAmount).toBeNull()
      expect(errors.length).toBeGreaterThan(0)
    })
    it('find any when querying for clients', async () => {
      const query = clientsQuery()
      const res = await unauthRequest(query)
      const { data, errors } = res

      expect(data.clients).toBeNull()
      expect(errors.length).toBeGreaterThan(0)
    })
    it('find it when querying for a specific client', async () => {
      const query = clientQuery(getSeedID(clients[0]))
      const res = await unauthRequest(query)
      const { data, errors } = res

      expect(data).toBeNull()
      expect(errors.length).toBeGreaterThan(0)
    })
    it('create a permanent Client with an email that does not belong to a user', async () => {
      const query = createPermanentClientMutation('TestClient', 'noUser@found.com')
      const res = await unauthRequest(query)
      const { data, errors } = res

      expect(data).toBeNull()
      expect(errors.length).toBeGreaterThan(0)
    })
    it('login as a permanent Client with an email that does not belong to a owner', async () => {
      const query = loginClientMutation('notMy@owner.com', clients[2].code)
      const res = await unauthRequest(query)
      const { data, errors } = res

      expect(data).toBeNull()
      expect(errors.length).toBeGreaterThan(0)
    })
    it('login as a permanent Client with an invalid code', async () => {
      const query = loginClientMutation(users[0].email, 'invalidCode')
      const res = await unauthRequest(query)
      const { data, errors } = res

      expect(data).toBeNull()
      expect(errors.length).toBeGreaterThan(0)
    })
    it('create a temporary Client with an ID that does not belong to a domain', async () => {
      const query = createTemporaryClientMutation(getNotMatchingID())
      const res = await unauthRequest(query)
      const { data, errors } = res

      expect(data).toBeNull()
      expect(errors.length).toBeGreaterThan(0)
    })
    it('update a client', async () => {
      const query = updateClientMutation(getSeedID(clients[0]),
        { name: 'notAllowedNameChange' },
        true
      )

      const res = await unauthRequest(query)
      const { data, errors } = res

      expect(data).toBeNull()
      expect(errors.length).toBeGreaterThan(0)
    })
    it('delete a client', async () => {
      const query = deleteClientMutation(getSeedID(clients[0]))
      const res = await unauthRequest(query)
      const { data, errors } = res

      expect(data).toBeNull()
      expect(errors.length).toBeGreaterThan(0)
    })
    it('set an owner for a client', async () => {
      const query = setClientOwnerMutation(getSeedID(clients[0]), users[0].email)
      const res = await unauthRequest(query)
      const { data, errors } = res

      expect(data).toBeNull()
      expect(errors.length).toBeGreaterThan(0)
    })
    it('remove an owner of a client', async () => {
      const query = removeClientOwnerMutation(getSeedID(clients[0]), getSeedID(users[1]))
      const res = await unauthRequest(query)
      const { data, errors } = res

      expect(data).toBeNull()
      expect(errors.length).toBeGreaterThan(0)
    })
  })
})
