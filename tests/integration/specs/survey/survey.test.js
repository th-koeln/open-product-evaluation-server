// TODO SurveyUpdate ReorderQuestions
// TODO SurveyUpdate should not update public surveys


const users = require('../../seeds/user/user')
const surveys = require('../../seeds/survey/survey')
const domains = require('../../seeds/domain/domain')
const { Seeder } = require('mongo-seeding')
const config = require('../../../../config')
const request = require('../../helper/requests')
const { getSeedID } = require('../../helper/helpers')

const seeder = new Seeder(config.seeder)
const collections = seeder.readCollectionsFromPath(config.seeder.inputPath)

/* Functions for Querys */

function createSurveyQuery(surveyTitle, surveyDescription, isActive) {
  return {
    query: `mutation {
      createSurvey(data: {title: "${surveyTitle}", description: "${surveyDescription}", isActive: ${isActive}}) {
        survey {
          creator{
            firstName
          }
          title
          description
          isActive
          types
          questions {
            id
          }
          domains {
            id
          }
        }
      }
    }`,
  }
}

function updateSurveyQuery(surveyID, surveyTitle, surveyDescription, isActive) {
  return {
    query: `mutation {
      updateSurvey(surveyID: "${surveyID}", data: {title: "${surveyTitle}", description: "${surveyDescription}", isActive: ${isActive}}) {
        survey {
          creator{
            firstName
          }
          title
          description
          isActive
          types
          questions {
            id
          }
          domains {
            id
          }
        }
      }
    }`,
  }
}

function deleteSurveyQuery(surveyID) {
  return {
    query: `mutation {
      deleteSurvey(surveyID:"${surveyID}"){
        success
      }
    }`,
  }
}

function surveysQuery() {
  return {
    query: `{
      surveys {
        creator{
          firstName
        }
        title
        description
        isActive
        types
        questions {
          id
        }
        domains {
          id
        }
      }
    }`,
  }
}

function surveyQuery(surveyID) {
  return {
    query: `{
      survey(surveyID:"${surveyID}"){
        creator{
          firstName
        }
        title
        description
        isActive
        types
        questions {
          id
        }
        domains {
          id
        }
      }
    }`,
  }
}

/* Tests */

describe.skip('Survey', () => {
  describe('Admin', async () => {
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
    it('should return all surveys [Query]', async () => {
      const query = surveysQuery()
      const { data, errors } = await request.user(query, jwtToken)
      expect(errors).toBeUndefined()
      expect(data).toMatchSnapshot()
    })
    it('should return survey owned by User [Query]', async () => {
      const survey = surveys[1]
      const query = surveyQuery(getSeedID(survey))
      const { data, errors } = await request.user(query, jwtToken)
      expect(errors).toBeUndefined()
      expect(data).toMatchSnapshot()
    })
    it('should return survey not owned by User [Query]', async () => {
      const survey = surveys[0]
      const query = surveyQuery(getSeedID(survey))
      const { data, errors } = await request.user(query, jwtToken)
      expect(errors).toBeUndefined()
      expect(data).toMatchSnapshot()
    })
    it('should create survey [Mutation]', async () => {
      const query = createSurveyQuery('TestSurvey', 'TestDescription', false)
      const res = await request.user(query, jwtToken)
      const { data, errors } = res
      expect(data).toMatchSnapshot()
      expect(errors).toBeUndefined()
    })
    it('should update survey owned by User [Mutation]', async () => {
      const survey = surveys[1]
      const query = updateSurveyQuery(getSeedID(survey), 'RenamedTestSurvey', 'UpdatedSurveyDescription', false)
      const { data, errors } = await request.user(query, jwtToken)
      console.log(errors)
      expect(errors).toBeUndefined()
      expect(data).toMatchSnapshot()
    })
    it('should update survey not owned by User [Mutation]', async () => {
      const survey = surveys[0]
      const query = updateSurveyQuery(getSeedID(survey), 'RenamedTestSurvey', 'UpdatedSurveyDescription', false)
      const { data, errors } = await request.user(query, jwtToken)
      expect(errors).toBeUndefined()
      expect(data).toMatchSnapshot()
    })
    it('should delete survey owned by user [Mutation]', async () => {
      const survey = surveys[1]
      const query = deleteSurveyQuery(getSeedID(survey))
      const { data, errors } = await request.user(query, jwtToken)
      expect(errors).toBeUndefined()
      expect(data.deleteSurvey.success).toBe(true)
    })
    it('should delete survey not owned by user [Mutation]', async () => {
      const survey = surveys[0]
      const query = deleteSurveyQuery(getSeedID(survey))
      const { data, errors } = await request.user(query, jwtToken)
      expect(errors).toBeUndefined()
      expect(data.deleteSurvey.success).toBe(true)
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
    it('should return all surveys [Query]', async () => {
      const query = surveysQuery()
      const { data, errors } = await request.user(query, jwtToken)
      expect(errors).toBeUndefined()
      expect(data).toMatchSnapshot()
    })
    it('should return survey owned by User [Query]', async () => {
      const survey = surveys[0]
      const query = surveyQuery(getSeedID(survey))
      const { data, errors } = await request.user(query, jwtToken)
      expect(errors).toBeUndefined()
      expect(data).toMatchSnapshot()
    })
    it('should not return survey not owned by User [Query]', async () => {
      const survey = surveys[1]
      const query = surveyQuery(getSeedID(survey))
      const { data, errors } = await request.user(query, jwtToken)
      expect(data).toBeNull()
      expect(errors.length).toBeGreaterThan(0)
    })
    it('should create survey [Mutation]', async () => {
      const query = createSurveyQuery('TestSurvey', 'TestDescription', false)
      const res = await request.user(query, jwtToken)
      const { data, errors } = res
      expect(data).toMatchSnapshot()
      expect(errors).toBeUndefined()
    })
    it('should update survey owned by User [Mutation]', async () => {
      const survey = surveys[0]
      const query = updateSurveyQuery(getSeedID(survey), 'RenamedTestSurvey', 'UpdatedSurveyDescription', false)
      const { data, errors } = await request.user(query, jwtToken)
      expect(errors).toBeUndefined()
      expect(data).toMatchSnapshot()
    })
    it('should not update survey not owned by User [Mutation]', async () => {
      const survey = surveys[1]
      const query = updateSurveyQuery(getSeedID(survey), 'RenamedTestSurvey', 'UpdatedSurveyDescription', false)
      const { data, errors } = await request.user(query, jwtToken)
      expect(data).toBeNull()
      expect(errors.length).toBeGreaterThan(0)
    })
    it('should delete survey owned by user [Mutation]', async () => {
      const survey = surveys[0]
      const query = deleteSurveyQuery(getSeedID(survey))
      const { data, errors } = await request.user(query, jwtToken)
      expect(errors).toBeUndefined()
      expect(data.deleteSurvey.success).toBe(true)
    })
    it('should not delete survey not owned by user [Mutation]', async () => {
      const survey = surveys[1]
      const query = deleteSurveyQuery(getSeedID(survey))
      const { data, errors } = await request.user(query, jwtToken)
      expect(data).toBeNull()
      expect(errors.length).toBeGreaterThan(0)
    })
  })
  describe.skip('Client', async () => {
    let jwtToken = ''
    beforeAll(async () => {
      await seeder.import(collections)
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
    it('should not return all surveys [Query]', async () => {
      const query = surveysQuery()
      const { data, errors } = await request.user(query, jwtToken)
      expect(data).toBeNull()
      expect(errors.length).toBeGreaterThan(0)
    })
    it('should not return survey owned by User [Query]', async () => {
      const survey = surveys[0]
      const query = surveyQuery(getSeedID(survey))
      const { data, errors } = await request.user(query, jwtToken)
      expect(data).toBeNull()
      expect(errors.length).toBeGreaterThan(0)
    })
    it('should update survey [Mutation]', async () => {
      const survey = surveys[0]
      const domain = domains[0]
      const user = users[0]
      const query = updateSurveyQuery(getSeedID(survey), 'RenamedTestSurvey', getSeedID(domain), [getSeedID(user)])
      const { data, errors } = await request.user(query, jwtToken)
      expect(data).toBeNull()
      expect(errors.length).toBeGreaterThan(0)
    })
    it('should not delete survey [Mutation]', async () => {
      const survey = surveys[3]
      const query = deleteSurveyQuery(getSeedID(survey))
      const { data, errors } = await request.user(query, jwtToken)
      expect(data).toBeNull()
      expect(errors.length).toBeGreaterThan(0)
    })
  })
})
