const users = require('../../../seeds/data/user/user')
const surveys = require('../../../seeds/data/survey/survey')
const questions = require('../../../seeds/data/question/question')
const domains = require('../../../seeds/data/domain/domain')
const { Seeder } = require('mongo-seeding')
const config = require('../../../../config')
const { unauthRequest, authRequest } = require('../../helper/requests')
const { getSeedID, promiseTimeout, getNotMatchingID } = require('../../helper/helpers')
const {
  surveyAmountQuery,
  surveysQuery,
  surveyQuery,
  createSurveyMutation,
  updateSurveyMutation,
  deleteSurveyMutation,
} = require('../../requests/survey.requests')
const { loginUserMutation } = require('../../requests/user.requests')
const { domainQuery } = require('../../requests/domain.requests')
const { votesQuery } = require('../../requests/vote.requests')

const seeder = new Seeder(config.seeder)
const collections = seeder.readCollectionsFromPath(config.seeder.inputPath)

describe('Admin', () => {
  const user = users[1]
  let jwt = ''

  beforeEach(async () => {
    await seeder.import(collections)
    const query = loginUserMutation(user.email, 'password')
    const { data, errors } = await unauthRequest(query)

    expect(data.login).not.toBeNull()
    expect(errors).toBeUndefined()

    const { login: { token } } = data
    jwt = token
  })

  describe('should', async () => {
    it('get the amount of all surveys', async () => {
      const query = surveyAmountQuery()
      const res = await authRequest(query, jwt)
      const { data, errors } = res

      expect(errors).toBeUndefined()
      expect(data.surveyAmount).toBe(2)
    })
    it('get all surveys when querying for surveys', async () => {
      const query = surveysQuery()
      const { data, errors } = await authRequest(query, jwt)

      expect(errors).toBeUndefined()
      expect(data.surveys).toMatchSnapshot()
    })
    it('get owned survey and see creator when querying for a specific survey', async () => {
      const query = surveyQuery(getSeedID(surveys[0]), true)
      const { data, errors } = await authRequest(query, jwt)

      expect(errors).toBeUndefined()
      expect(data.survey).toMatchSnapshot()
    })
    it('get not owned / created survey and see creator when querying for a specific survey', async () => {
      const query = surveyQuery(getSeedID(surveys[1]), true)
      const { data, errors } = await authRequest(query, jwt)

      expect(errors).toBeUndefined()
      expect(data.survey).toMatchSnapshot()
    })
    it('update isActive of owned active survey', async () => {
      const query = updateSurveyMutation(
        getSeedID(surveys[0]),
        { isActive: false }
      )
      const { data, errors } = await authRequest(query, jwt)

      expect(errors).toBeUndefined()
      expect(data.updateSurvey).toMatchSnapshot()
    })
    it('update isActive of owned inactive survey', async () => {
      const query = updateSurveyMutation(
        getSeedID(surveys[0]),
        { isActive: false }
      )
      const { errors } = await authRequest(query, jwt)

      expect(errors).toBeUndefined()

      const activateQuery = updateSurveyMutation(
        getSeedID(surveys[0]),
        { isActive: true }
      )
      const { data: activateData, errors: activateErrors } = await authRequest(activateQuery, jwt)

      expect(activateErrors).toBeUndefined()
      expect(activateData.updateSurvey).toMatchSnapshot()
    })
    it('update title of owned inactive survey', async () => {
      const query = updateSurveyMutation(
        getSeedID(surveys[0]),
        { title: 'New title', isActive: false }
      )
      const { data, errors } = await authRequest(query, jwt)

      expect(errors).toBeUndefined()
      expect(data.updateSurvey).toMatchSnapshot()
    })
    it('update description of owned inactive survey', async () => {
      const query = updateSurveyMutation(
        getSeedID(surveys[0]),
        { description: 'New description', isActive: false }
      )
      const { data, errors } = await authRequest(query, jwt)

      expect(errors).toBeUndefined()
      expect(data.updateSurvey).toMatchSnapshot()
    })
    it('update questionOrder of owned inactive survey', async () => {
      const query = updateSurveyMutation(
        getSeedID(surveys[0]),
        {
          questionOrder: [
            getSeedID(questions[5]),
            getSeedID(questions[4]),
            getSeedID(questions[3]),
            getSeedID(questions[2]),
            getSeedID(questions[1]),
            getSeedID(questions[0]),
          ],
          isActive: false,
        }
      )
      const { data, errors } = await authRequest(query, jwt)

      expect(errors).toBeUndefined()
      expect(data.updateSurvey).toMatchSnapshot()
    })
    it('update isActive of not owned active survey', async () => {
      const query = updateSurveyMutation(
        getSeedID(surveys[1]),
        { isActive: false }
      )
      const { data, errors } = await authRequest(query, jwt)

      expect(errors).toBeUndefined()
      expect(data.updateSurvey).toMatchSnapshot()
    })
    it('update isActive of not owned inactive survey', async () => {
      const query = updateSurveyMutation(
        getSeedID(surveys[1]),
        { isActive: false }
      )
      const { errors } = await authRequest(query, jwt)

      expect(errors).toBeUndefined()

      const activateQuery = updateSurveyMutation(
        getSeedID(surveys[1]),
        { isActive: true }
      )
      const { data: activateData, errors: activateErrors } = await authRequest(activateQuery, jwt)

      expect(activateErrors).toBeUndefined()
      expect(activateData.updateSurvey).toMatchSnapshot()
    })
    it('update title of not owned inactive survey', async () => {
      const query = updateSurveyMutation(
        getSeedID(surveys[1]),
        { title: 'New title', isActive: false }
      )
      const { data, errors } = await authRequest(query, jwt)

      expect(errors).toBeUndefined()
      expect(data.updateSurvey).toMatchSnapshot()
    })
    it('update description of not owned inactive survey', async () => {
      const query = updateSurveyMutation(
        getSeedID(surveys[1]),
        { description: 'New description', isActive: false }
      )
      const { data, errors } = await authRequest(query, jwt)

      expect(errors).toBeUndefined()
      expect(data.updateSurvey).toMatchSnapshot()
    })
    it('update questionOrder of not owned inactive survey', async () => {
      const query = updateSurveyMutation(
        getSeedID(surveys[1]),
        {
          questionOrder: [
            getSeedID(questions[11]),
            getSeedID(questions[10]),
            getSeedID(questions[9]),
            getSeedID(questions[8]),
            getSeedID(questions[7]),
            getSeedID(questions[6]),
          ],
          isActive: false,
        }
      )
      const { data, errors } = await authRequest(query, jwt)

      expect(errors).toBeUndefined()
      expect(data.updateSurvey).toMatchSnapshot()
    })
    it('update description of inactive survey to be empty', async () => {
      const query = updateSurveyMutation(
        getSeedID(surveys[1]),
        { description: '', isActive: false }
      )
      const { data, errors } = await authRequest(query, jwt)

      expect(errors).toBeUndefined()
      expect(data.updateSurvey).toMatchSnapshot()
    })
    it('remove survey from domains by setting it inactive', async () => {
      const query = updateSurveyMutation(
        getSeedID(surveys[1]), { isActive: false }
      )
      const { errors } = await authRequest(query, jwt)

      expect(errors).toBeUndefined()

      await promiseTimeout()

      const domQuery = domainQuery(getSeedID(domains[1]))
      const { data: domainData, errors: errorsData } = await authRequest(domQuery, jwt)

      expect(errorsData).toBeUndefined()
      expect(domainData.domain).toMatchSnapshot()
    })
    it('delete owned survey', async () => {
      const query = deleteSurveyMutation(getSeedID(surveys[0]))
      const { data, errors } = await authRequest(query, jwt)

      expect(errors).toBeUndefined()
      expect(data.deleteSurvey.success).toBe(true)
    })
    it('delete not owned survey', async () => {
      const query = deleteSurveyMutation(getSeedID(surveys[1]))
      const { data, errors } = await authRequest(query, jwt)

      expect(errors).toBeUndefined()
      expect(data.deleteSurvey.success).toBe(true)
    })
    it('remove survey from domains by deleting it', async () => {
      const query = deleteSurveyMutation(getSeedID(surveys[1]))
      const { errors } = await authRequest(query, jwt)

      expect(errors).toBeUndefined()

      await promiseTimeout()

      const domQuery = domainQuery(getSeedID(domains[1]))
      const { data: domainData, errors: errorsData } = await authRequest(domQuery, jwt)

      expect(errorsData).toBeUndefined()
      expect(domainData.domain).toMatchSnapshot()
    })
    it('delete votes of survey by deleting the survey', async () => {
      const query = deleteSurveyMutation(getSeedID(surveys[1]))
      const { errors } = await authRequest(query, jwt)

      expect(errors).toBeUndefined()

      await promiseTimeout()

      const vQuery = votesQuery(getSeedID(surveys[1]))
      const { data: votesData, errors: votesErrors } = await authRequest(vQuery, jwt)

      expect(votesData.votes).toBeNull()
      expect(votesErrors.length).toBeGreaterThan(0)
    })
  })
  describe('should not', async () => {
    it('get not existing survey', async () => {
      const query = surveyQuery(getNotMatchingID())
      const { data, errors } = await authRequest(query, jwt)

      expect(data).toBeNull()
      expect(errors.length).toBeGreaterThan(0)
    })
    it('create a survey with empty title', async () => {
      const query = createSurveyMutation({ title: '' })
      const { data, errors } = await authRequest(query, jwt)

      expect(data).toBeNull()
      expect(errors.length).toBeGreaterThan(0)
    })
    it('update title of active survey', async () => {
      const query = updateSurveyMutation(
        getSeedID(surveys[0]),
        { title: 'New title' },
      )
      const { data, errors } = await authRequest(query, jwt)

      expect(data).toBeNull()
      expect(errors.length).toBeGreaterThan(0)
    })
    it('update description of active survey', async () => {
      const query = updateSurveyMutation(
        getSeedID(surveys[0]),
        { description: 'New description' },
      )
      const { data, errors } = await authRequest(query, jwt)

      expect(data).toBeNull()
      expect(errors.length).toBeGreaterThan(0)
    })
    it('update questionOrder of active survey', async () => {
      const query = updateSurveyMutation(
        getSeedID(surveys[0]),
        { questionOrder: [
          getSeedID(questions[5]),
          getSeedID(questions[4]),
          getSeedID(questions[3]),
          getSeedID(questions[2]),
          getSeedID(questions[1]),
          getSeedID(questions[0]),
        ]},
      )
      const { data, errors } = await authRequest(query, jwt)

      expect(data).toBeNull()
      expect(errors.length).toBeGreaterThan(0)
    })
    it('update title of survey to be empty', async () => {
      const query = updateSurveyMutation(
        getSeedID(surveys[0]),
        { title: '' },
      )
      const { data, errors } = await authRequest(query, jwt)

      expect(data).toBeNull()
      expect(errors.length).toBeGreaterThan(0)
    })
    it('update questionOrder of survey with missing question', async () => {
      const query = updateSurveyMutation(
        getSeedID(surveys[0]),
        { questionOrder: [
          getSeedID(questions[4]),
          getSeedID(questions[3]),
          getSeedID(questions[2]),
          getSeedID(questions[1]),
          getSeedID(questions[0]),
        ]},
      )
      const { data, errors } = await authRequest(query, jwt)

      expect(data).toBeNull()
      expect(errors.length).toBeGreaterThan(0)
    })
    it('update questionOrder of survey with bonus question (question of other survey)', async () => {
      const query = updateSurveyMutation(
        getSeedID(surveys[0]),
        { questionOrder: [
          getSeedID(questions[6]),
          getSeedID(questions[5]),
          getSeedID(questions[4]),
          getSeedID(questions[3]),
          getSeedID(questions[2]),
          getSeedID(questions[1]),
          getSeedID(questions[0]),
        ]},
      )
      const { data, errors } = await authRequest(query, jwt)

      expect(data).toBeNull()
      expect(errors.length).toBeGreaterThan(0)
    })
    it('delete not existing survey', async () => {
      const query = deleteSurveyMutation(getNotMatchingID())
      const { data, errors } = await authRequest(query, jwt)

      expect(data).toBeNull()
      expect(errors.length).toBeGreaterThan(0)
    })
  })
})
