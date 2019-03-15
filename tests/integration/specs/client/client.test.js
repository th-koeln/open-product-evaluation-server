const users = require('../../seeds/user/user')
const clients = require('../../seeds/client/client')
const domains = require('../../seeds/domain/domain')
const { Seeder } = require('mongo-seeding')
const config = require('../../../../config')
const request = require('../../helper/requests')
const { getSeedID } = require('../../helper/helpers')
const {
  createClientQuery,
  updateClientQuery,
  setClientOwnerQuery,
  deleteClientQuery,
  clientQuery
} = require('../../queries/client.queries.js')


const seeder = new Seeder(config.seeder)
const collections = seeder.readCollectionsFromPath(config.seeder.inputPath)

/* Tests */

describe.skip('Client', () => {
  describe.skip('Anonym', async () => {
    beforeAll(async () => {
      await seeder.import(collections)
    })
    it('should create a Client [Mutation]', async () => {
      const query = createClientQuery('TestDevie')
      const res = await request.anon(query)
      const { data, errors } = res
      expect(data.createClient.client).toMatchSnapshot()
      expect(data.createClient.token.length).toBeGreaterThan(0)
      expect(errors).toBeUndefined()
    })
    it.skip('should deny creation of existing Client [Mutation]', async () => {
      const query = createClientQuery('TestDevie')
      const res = await request.anon(query)
      const { data, errors } = res
      expect(data).toBeNull()
      expect(errors.length).toBeGreaterThan(0)
    })
  })
  describe.skip('Admin', async () => {
    let jwtToken = ''
    beforeAll(async () => {
      await seeder.import(collections)
      const expected = users[1]
      const query = {
        query: `mutation {
          login(data: {email: "${expected.email}", password: "password"}) {
            token
            user {
              id
              firstName
              lastName
              email
            }
          }
        }`,
      }
      const { data, errors } = await request.anon(query)
      data.login.token.should.be.a('string')
      expect(errors).toBeUndefined()
      const { login: { token } } = data
      jwtToken = token
    })
    it('should return all clients [Query]', async () => {
      const query = clientsQuery()
      const { data, errors } = await request.user(query, jwtToken)
      expect(errors).toBeUndefined()
      expect(data).toMatchSnapshot()
    })
    it('should return client owned by User [Query]', async () => {
      const client = clients[3]
      const query = clientQuery(getSeedID(client))
      const { data, errors } = await request.user(query, jwtToken)
      expect(errors).toBeUndefined()
      expect(data).toMatchSnapshot()
    })
    it('should return client not owned by User [Query]', async () => {
      const client = clients[1]
      const query = clientQuery(getSeedID(client))
      const { data, errors } = await request.user(query, jwtToken)
      expect(errors).toBeUndefined()
      expect(data).toMatchSnapshot()
    })
    it('should create client [Mutation]', async () => {
      const query = createClientQuery('TestClient')
      const res = await request.anon(query)
      const { data, errors } = res
      expect(data.createClient.client).toMatchSnapshot()
      expect(data.createClient.token.length).toBeGreaterThan(0)
      expect(errors).toBeUndefined()
    })
    it('should update client owned by User [Mutation]', async () => {
      const client = clients[3]
      const domain = domains[0]
      const query = updateClientQuery(getSeedID(client), 'RenamedTestClient', getSeedID(domain))
      const { data, errors } = await request.user(query, jwtToken)
      expect(errors).toBeUndefined()
      expect(data).toMatchSnapshot()
    })
    it('should set owner of client owned by User [Mutation]', async () => {
      const client = clients[3]
      const user = users[0]
      const query = setClientOwnerQuery(getSeedID(client), user.email)
      const { data, errors } = await request.user(query, jwtToken)
      expect(errors).toBeUndefined()
      expect(data).toMatchSnapshot()
    })
    it('should update client not owned by User [Mutation]', async () => {
      const client = clients[1]
      const domain = domains[0]
      const query = updateClientQuery(getSeedID(client), 'RenamedTestClient', getSeedID(domain))
      const { data, errors } = await request.user(query, jwtToken)
      expect(errors).toBeUndefined()
      expect(data).toMatchSnapshot()
    })
    it('should set owner of client not owned by User [Mutation]', async () => {
      const client = clients[1]
      const user = users[0]
      const query = setClientOwnerQuery(getSeedID(client), user.email)
      const { data, errors } = await request.user(query, jwtToken)
      expect(errors).toBeUndefined()
      expect(data).toMatchSnapshot()
    })
    it('should delete client owned by user [Mutation]', async () => {
      const client = clients[3]
      const query = deleteClientQuery(getSeedID(client))
      const { data, errors } = await request.user(query, jwtToken)
      expect(errors).toBeUndefined()
      expect(data.deleteClient.success).toBe(true)
    })
    it('should delete client not owned by user [Mutation]', async () => {
      const client = clients[1]
      const query = deleteClientQuery(getSeedID(client))
      const { data, errors } = await request.user(query, jwtToken)
      expect(errors).toBeUndefined()
      expect(data.deleteClient.success).toBe(true)
    })
  })
  describe('User', async () => {
    let jwtToken = ''
    beforeAll(async () => {
      await seeder.import(collections)
      const expected = users[0]
      const query = {
        query: `mutation {
          login(data: {email: "${expected.email}", password: "password"}) {
            token
            user {
              id
              firstName
              lastName
              email
            }
          }
        }`,
      }
      const { data, errors } = await request.anon(query)
      data.login.token.should.be.a('string')
      expect(errors).toBeUndefined()
      const { login: { token } } = data
      jwtToken = token
    })
    it('should return all clients [Query]', async () => {
      const query = clientsQuery()
      const { data, errors } = await request.user(query, jwtToken)
      expect(errors).toBeUndefined()
      expect(data).toMatchSnapshot()
    })
    it('should return client owned by User [Query]', async () => {
      const client = clients[0]
      const query = clientQuery(getSeedID(client))
      const { data, errors } = await request.user(query, jwtToken)
      expect(errors).toBeUndefined()
      expect(data).toMatchSnapshot()
    })
    it('should not return client not owned by User [Query]', async () => {
      const client = clients[3]
      const query = clientQuery(getSeedID(client))
      const { data, errors } = await request.user(query, jwtToken)
      expect(data).toBeNull()
      expect(errors.length).toBeGreaterThan(0)
    })
    it('should create client [Mutation]', async () => {
      const query = createClientQuery('TestClient')
      const res = await request.anon(query)
      const { data, errors } = res
      expect(data.createClient.client).toMatchSnapshot()
      expect(data.createClient.token.length).toBeGreaterThan(0)
      expect(errors).toBeUndefined()
    })
    it('should update client owned by User [Mutation]', async () => {
      const client = clients[0]
      const domain = domains[0]
      const query = updateClientQuery(getSeedID(client), 'RenamedTestClient', getSeedID(domain))
      const { data, errors } = await request.user(query, jwtToken)
      expect(errors).toBeUndefined()
      expect(data).toMatchSnapshot()
    })
    it('should set owner of client owned by User [Mutation]', async () => {
      const client = clients[0]
      const user = users[0]
      const query = setClientOwnerQuery(getSeedID(client), user.email)
      const { data, errors } = await request.user(query, jwtToken)
      expect(errors).toBeUndefined()
      expect(data).toMatchSnapshot()
    })
    it('should not update client not owned by User [Mutation]', async () => {
      const client = clients[3]
      const domain = domains[0]
      const query = updateClientQuery(getSeedID(client), 'RenamedTestClient', getSeedID(domain))
      const { data, errors } = await request.user(query, jwtToken)
      expect(data).toBeNull()
      expect(errors.length).toBeGreaterThan(0)
    })
    it('should not set owner of client not owned by User [Mutation]', async () => {
      const client = clients[3]
      const user = users[0]
      const query = setClientOwnerQuery(getSeedID(client), user.email)
      const { data, errors } = await request.user(query, jwtToken)
      expect(data).toBeNull()
      expect(errors.length).toBeGreaterThan(0)
    })
    it('should delete client owned by user [Mutation]', async () => {
      const client = clients[0]
      const query = deleteClientQuery(getSeedID(client))
      const { data, errors } = await request.user(query, jwtToken)
      expect(errors).toBeUndefined()
      expect(data.deleteClient.success).toBe(true)
    })
    it('should not delete client not owned by user [Mutation]', async () => {
      const client = clients[3]
      const query = deleteClientQuery(getSeedID(client))
      const { data, errors } = await request.user(query, jwtToken)
      expect(data).toBeNull()
      expect(errors.length).toBeGreaterThan(0)
    })
  })
  describe('Client', async () => {
    let jwtToken = ''
    beforeAll(async () => {
      await seeder.import(collections)
      const query = {
        query: `mutation{
          createClient(data:{name:"TestClient"}){
            token
         }}`,
      }
      const { data, errors } = await request.anon(query)
      data.createClient.token.should.be.a('string')
      expect(errors).toBeUndefined()
      const { createClient: { token } } = data
      jwtToken = token
    })
    it.skip('should not return all clients [Query]', async () => {
      const query = clientsQuery()
      const { data, errors } = await request.user(query, jwtToken)
      expect(data).toBeNull()
      expect(errors.length).toBeGreaterThan(0)
    })
    it('should not return other client [Query]', async () => {
      const client = clients[0]
      const query = clientQuery(getSeedID(client))
      const { data, errors } = await request.user(query, jwtToken)
      expect(data).toBeNull()
      expect(errors.length).toBeGreaterThan(0)
    })
    it('should not update other client [Mutation]', async () => {
      const client = clients[0]
      const domain = domains[0]
      const query = updateClientQuery(getSeedID(client), 'RenamedTestClient', getSeedID(domain))
      const { data, errors } = await request.user(query, jwtToken)
      expect(data).toBeNull()
      expect(errors.length).toBeGreaterThan(0)
    })
    it('should not delete other client [Mutation]', async () => {
      const client = clients[3]
      const query = deleteClientQuery(getSeedID(client))
      const { data, errors } = await request.user(query, jwtToken)
      expect(data).toBeNull()
      expect(errors.length).toBeGreaterThan(0)
    })
  })
})
