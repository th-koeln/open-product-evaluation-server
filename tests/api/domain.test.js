const users = require('../../seeds/data/user/user')
const surveys = require('../../seeds/data/survey/survey')
const questions = require('../../seeds/data/question/question')
const domains = require('../../seeds/data/domain/domain')
const clients = require('../../seeds/data/client/client')
const { seedDatabase } = require('mongo-seeding')
const config = require('../../config')
const request = require('./requesthelper')
const { getSeedID, getClientToken } = require('./helpers')

/* Functions for Querys */

function createDomainQuery(name) {
  return {
    query: `mutation {
      createDomain(data: {name: "${name}"}) {
        domain {
          name
          activeQuestion{
            description
          }
          activeSurvey{
            title
          }
          owners {
            email
          }
          clients {
            name
          }
          states {
            key
          }
        }
      }
    }`,
  }
}

function updateDomainQuery(domainID, domainName, activeQuestion, activeSurvey) {
  return {
    query: `mutation {
      updateDomain(domainID: "${domainID}", data: {name: "${domainName}", activeQuestion: "${activeQuestion}", activeSurvey: "${activeSurvey}"}) {
        domain {
          name
          activeQuestion{
            description
          }
          activeSurvey{
            title
          }
          owners {
            email
          }
          clients {
            name
          }
          states {
            key
          }
        }
      }
    }`,
  }
}

function deleteDomainQuery(domainID) {
  return {
    query: `mutation {
      deleteDomain(domainID: "${domainID}") {
        success
      }
    }`,
  }
}

function domainsQuery() {
  return {
    query: `{
      domains {
        name
        activeQuestion{
          description
        }
        activeSurvey{
          title
        }
        owners {
          email
        }
        clients {
          name
        }
        states {
          key
        }
      }
    }
    `,
  }
}

function domainQuery(domainID) {
  return {
    query: `{
      domain(domainID: "${domainID}") {
        name
        activeQuestion{
          description
        }
        activeSurvey{
          title
        }
        owners {
          email
        }
        clients {
          name
        }
        states {
          key
        }
      }
    }`,
  }
}

/* Tests */

describe('Domain', () => {
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
    it('should return all domains [Query]', async () => {
      const query = domainsQuery()
      const { data, errors } = await request.user(query, jwtToken)
      expect(errors).toBeUndefined()
      expect(data).toMatchSnapshot()
    })
    it('should return domain owned by User [Query]', async () => {
      const domain = domains[0]
      const query = domainQuery(getSeedID(domain))
      const { data, errors } = await request.user(query, jwtToken)
      expect(errors).toBeUndefined()
      expect(data).toMatchSnapshot()
    })
    it('should return domain not owned by User [Query]', async () => {
      const domain = domains[1]
      const query = domainQuery(getSeedID(domain))
      const { data, errors } = await request.user(query, jwtToken)
      expect(errors).toBeUndefined()
      expect(data).toMatchSnapshot()
    })
    it('should create domain [Mutation]', async () => {
      const query = createDomainQuery('TestDomain')
      const res = await request.user(query, jwtToken)
      const { data, errors } = res
      expect(data).toMatchSnapshot()
      expect(errors).toBeUndefined()
    })
    it('should update domain owned by User [Mutation]', async () => {
      const domain = domains[1]
      const question = questions[0]
      const survey = surveys[0]
      const query = updateDomainQuery(getSeedID(domain), 'RenamedTestDomain', getSeedID(question), getSeedID(survey))
      const { data, errors } = await request.user(query, jwtToken)
      expect(errors).toBeUndefined()
      expect(data).toMatchSnapshot()
    })
    it('should update domain not owned by User [Mutation]', async () => {
      const domain = domains[0]
      const question = questions[0]
      const survey = surveys[0]
      const query = updateDomainQuery(getSeedID(domain), 'RenamedTestDomain', getSeedID(question), getSeedID(survey))
      const { data, errors } = await request.user(query, jwtToken)
      expect(errors).toBeUndefined()
      expect(data).toMatchSnapshot()
    })
    it('should delete domain owned by user [Mutation]', async () => {
      const domain = domains[0]
      const query = deleteDomainQuery(getSeedID(domain))
      const { data, errors } = await request.user(query, jwtToken)
      expect(errors).toBeUndefined()
      expect(data.deleteDomain.success).toBe(true)
    })
    it('should delete domain not owned by user [Mutation]', async () => {
      const domain = domains[1]
      const query = deleteDomainQuery(getSeedID(domain))
      const { data, errors } = await request.user(query, jwtToken)
      expect(errors).toBeUndefined()
      expect(data.deleteDomain.success).toBe(true)
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
    it('should return all domains [Query]', async () => {
      const query = domainsQuery()
      const { data, errors } = await request.user(query, jwtToken)
      expect(errors).toBeUndefined()
      expect(data).toMatchSnapshot()
    })
    it('should return domain owned by User [Query]', async () => {
      const domain = domains[0]
      const query = domainQuery(getSeedID(domain))
      const { data, errors } = await request.user(query, jwtToken)
      expect(errors).toBeUndefined()
      expect(data).toMatchSnapshot()
    })
    it('should return domain not owned by User [Query]', async () => {
      const domain = domains[1]
      const query = domainQuery(getSeedID(domain))
      const { data, errors } = await request.user(query, jwtToken)
      expect(errors.length).toBe(1)
      expect(errors[0].path).toEqual(['domain', 'owners'])
      expect(data).toMatchSnapshot()
    })
    it('should create domain [Mutation]', async () => {
      const query = createDomainQuery('TestDomain')
      const res = await request.user(query, jwtToken)
      const { data, errors } = res
      expect(data).toMatchSnapshot()
      expect(errors).toBeUndefined()
    })
    it('should update domain owned by User [Mutation]', async () => {
      const domain = domains[0]
      const question = questions[0]
      const survey = surveys[0]
      const query = updateDomainQuery(getSeedID(domain), 'RenamedTestDomain', getSeedID(question), getSeedID(survey))
      const { data, errors } = await request.user(query, jwtToken)
      expect(errors).toBeUndefined()
      expect(data).toMatchSnapshot()
    })
    it('should not update domain not owned by User [Mutation]', async () => {
      const domain = domains[1]
      const question = questions[0]
      const survey = surveys[0]
      const query = updateDomainQuery(getSeedID(domain), 'RenamedTestDomain', getSeedID(question), getSeedID(survey))
      const { data, errors } = await request.user(query, jwtToken)
      expect(data).toBeNull()
      expect(errors.length).toBeGreaterThan(0)
    })
    it('should delete domain owned by user [Mutation]', async () => {
      const domain = domains[0]
      const query = deleteDomainQuery(getSeedID(domain))
      const { data, errors } = await request.user(query, jwtToken)
      expect(errors).toBeUndefined()
      expect(data.deleteDomain.success).toBe(true)
    })
    it('should not delete domain not owned by user [Mutation]', async () => {
      const domain = domains[1]
      const query = deleteDomainQuery(getSeedID(domain))
      const { data, errors } = await request.user(query, jwtToken)
      expect(data).toBeNull()
      expect(errors.length).toBeGreaterThan(0)
    })
  })
  describe.skip('Client', async () => {
    let jwtToken = ''
    beforeAll(async () => {
      await seedDatabase(config.seeder)
      const client = clients[1]
      jwtToken = getClientToken(client)
    })
    it('should return domains assigned to [Query]', async () => {
      const query = domainsQuery()
      const { data, errors } = await request.user(query, jwtToken)
      expect(errors[0].path).toEqual(['domains', 0, 'owners'])
      expect(data).toMatchSnapshot()
    })
    it('should return domain [Query]', async () => {
      const domain = domains[0]
      const query = domainQuery(getSeedID(domain))
      const { data, errors } = await request.user(query, jwtToken)
      expect(errors[0].path).toEqual(['domain', 'owners'])
      expect(data).toMatchSnapshot()
    })
  })
})
