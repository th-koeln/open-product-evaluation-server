const users = require('../seeds/data/user/user')
const clients = require('../seeds/data/client/client')
const domains = require('../seeds/data/domain/domain')
const { seedDatabase } = require('mongo-seeding')
const config = require('../config')
const request = require('./requesthelper')
const { getSeedID } = require('./helpers')

/* Functions for Querys */

function createClientQuery(name) {
  return {
    query: `mutation {
        createClient(data: {name: "TestClient"}) {
          client {
            name
            domain {
              id
            }
          }
          token
        }
      }`,
  }
}

function updateClientQuery(clientID, clientName, domain, owners) {
  return {
    query: `mutation {
      updateClient(clientID:"${clientID}", data:{name:"${clientName}",domain:"${domain}", owners: ${JSON.stringify(owners)} }){
        client{
          id
          name
          domain{
            id
          }
          owners{
            id
          }
        }
      }
    }`,
  }
}

function deleteClientQuery(clientID) {
  return {
    query: `mutation {
      deleteClient(clientID:"${clientID}"){
        success
      }
    }`,
  }
}

function clientsQuery() {
  return {
    query: `{
      clients {
        id
        name
        domain {
          id
        }
        owners {
          id
        }
      }
    }`,
  }
}

function clientQuery(clientID) {
  return {
    query: `{
      client(clientID: "${clientID}") {
        id
        name
        domain {
          id
        }
        owners{
          id
        }
      }
    }`,
  }
}

/* Tests */

describe('Client', () => {
  describe('Anonym', async () => {
    beforeAll(() => seedDatabase(config.seeder))
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
  describe('Admin', async () => {
    let jwtToken = ''
    beforeAll(async () => {
      await seedDatabase(config.seeder)
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
      const user = users[0]
      const query = updateClientQuery(getSeedID(client), 'RenamedTestClient', getSeedID(domain), [user.email])
      const { data, errors } = await request.user(query, jwtToken)
      expect(errors).toBeUndefined()
      expect(data).toMatchSnapshot()
    })
    it('should update client not owned by User [Mutation]', async () => {
      const client = clients[1]
      const domain = domains[0]
      const user = users[0]
      const query = updateClientQuery(getSeedID(client), 'RenamedTestClient', getSeedID(domain), [user.email])
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
      await seedDatabase(config.seeder)
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
      const user = users[0]
      const query = updateClientQuery(getSeedID(client), 'RenamedTestClient', getSeedID(domain), [user.email])
      const { data, errors } = await request.user(query, jwtToken)
      expect(errors).toBeUndefined()
      expect(data).toMatchSnapshot()
    })
    it('should not update client not owned by User [Mutation]', async () => {
      const client = clients[3]
      const domain = domains[0]
      const user = users[0]
      const query = updateClientQuery(getSeedID(client), 'RenamedTestClient', getSeedID(domain), [user.email])
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
      await seedDatabase(config.seeder)
      const query = {
        query: `mutation{createClient(data:{name:"TestClient"}){
          token
       }}`,
      }
      const { data, errors } = await request.anon(query)
      data.createClient.token.should.be.a('string')
      expect(errors).toBeUndefined()
      const { createClient: { token } } = data
      jwtToken = token
    })
    it('should not return all clients [Query]', async () => {
      const query = clientsQuery()
      const { data, errors } = await request.user(query, jwtToken)
      expect(data).toBeNull()
      expect(errors.length).toBeGreaterThan(0)
    })
    it('should not return client owned by User [Query]', async () => {
      const client = clients[0]
      const query = clientQuery(getSeedID(client))
      const { data, errors } = await request.user(query, jwtToken)
      expect(data).toBeNull()
      expect(errors.length).toBeGreaterThan(0)
    })
    it('should update client [Mutation]', async () => {
      const client = clients[0]
      const domain = domains[0]
      const user = users[0]
      const query = updateClientQuery(getSeedID(client), 'RenamedTestClient', getSeedID(domain), [getSeedID(user)])
      const { data, errors } = await request.user(query, jwtToken)
      expect(data).toBeNull()
      expect(errors.length).toBeGreaterThan(0)
    })
    it('should not delete client [Mutation]', async () => {
      const client = clients[3]
      const query = deleteClientQuery(getSeedID(client))
      const { data, errors } = await request.user(query, jwtToken)
      expect(data).toBeNull()
      expect(errors.length).toBeGreaterThan(0)
    })
  })
})
