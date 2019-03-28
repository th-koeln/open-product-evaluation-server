const users = require('../../../seeds/data/user/user')
const clients = require('../../../seeds/data/client/client')
const surveys = require('../../../seeds/data/survey/survey')
const questions = require('../../../seeds/data/question/question')
const { Seeder } = require('mongo-seeding')
const config = require('../../../../config')
const { authRequest, unauthRequest } = require('../../helper/requests')
const { getSeedID, getClientToken } = require('../../helper/helpers')
const {
  surveyAmountQuery,
  surveysQuery,
  surveyQuery,
  createSurveyMutation,
  updateSurveyMutation,
  deleteSurveyMutation,
} = require('../../requests/survey.requests')
const { loginClientMutation } = require('../../requests/client.requests')
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

    describe('should not', async () => {
      it('get the amount of surveys', async () => {
        const query = surveyAmountQuery()
        const { data, errors } = await authRequest(query, jwt)

        expect(data.surveyAmount).toBeNull()
        expect(errors.length).toBeGreaterThan(0)
      })
      it('get any survey when querying for surveys', async () => {
        const query = surveysQuery()
        const { data, errors } = await authRequest(query, jwt)

        expect(data.surveys).toBeNull()
        expect(errors.length).toBeGreaterThan(0)
      })
      it('get any survey when querying for a specific survey', async () => {
        const query = surveyQuery(getSeedID(surveys[1]))
        const { data, errors } = await authRequest(query, jwt)

        expect(data).toBeNull()
        expect(errors.length).toBeGreaterThan(0)
      })
      it('create a survey', async () => {
        const query = createSurveyMutation({ title: 'My new Survey' })
        const { data, errors } = await authRequest(query, jwt)

        expect(data).toBeNull()
        expect(errors.length).toBeGreaterThan(0)
      })
      it('update title of any survey', async () => {
        const query = updateSurveyMutation(
          getSeedID(surveys[1]),
          { title: 'New title' },
        )
        const { data, errors } = await authRequest(query, jwt)

        expect(data).toBeNull()
        expect(errors.length).toBeGreaterThan(0)
      })
      it('update description of any survey', async () => {
        const query = updateSurveyMutation(
          getSeedID(surveys[0]),
          { description: 'New description' },
        )
        const { data, errors } = await authRequest(query, jwt)

        expect(data).toBeNull()
        expect(errors.length).toBeGreaterThan(0)
      })
      it('update isActive of any survey', async () => {
        const query = updateSurveyMutation(
          getSeedID(surveys[1]),
          { isActive: true },
        )
        const { data, errors } = await authRequest(query, jwt)

        expect(data).toBeNull()
        expect(errors.length).toBeGreaterThan(0)
      })
      it('update questionOrder of any survey', async () => {
        const query = updateSurveyMutation(
          getSeedID(surveys[1]),
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
      it('delete any survey', async () => {
        const query = deleteSurveyMutation(getSeedID(surveys[1]))
        const { data, errors } = await authRequest(query, jwt)

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

    describe('should not', async () => {
      it('get the amount of surveys', async () => {
        const query = surveyAmountQuery()
        const { data, errors } = await authRequest(query, jwt)

        expect(data.surveyAmount).toBeNull()
        expect(errors.length).toBeGreaterThan(0)
      })
      it('get any survey when querying for surveys', async () => {
        const query = surveysQuery()
        const { data, errors } = await authRequest(query, jwt)

        expect(data.surveys).toBeNull()
        expect(errors.length).toBeGreaterThan(0)
      })
      it('get any survey when querying for a specific survey', async () => {
        const query = surveyQuery(getSeedID(surveys[1]))
        const { data, errors } = await authRequest(query, jwt)

        expect(data).toBeNull()
        expect(errors.length).toBeGreaterThan(0)
      })
      it('create a survey', async () => {
        const query = createSurveyMutation({ title: 'My new Survey' })
        const { data, errors } = await authRequest(query, jwt)

        expect(data).toBeNull()
        expect(errors.length).toBeGreaterThan(0)
      })
      it('update title of any survey', async () => {
        const query = updateSurveyMutation(
          getSeedID(surveys[1]),
          { title: 'New title' },
        )
        const { data, errors } = await authRequest(query, jwt)

        expect(data).toBeNull()
        expect(errors.length).toBeGreaterThan(0)
      })
      it('update description of any survey', async () => {
        const query = updateSurveyMutation(
          getSeedID(surveys[0]),
          { description: 'New description' },
        )
        const { data, errors } = await authRequest(query, jwt)

        expect(data).toBeNull()
        expect(errors.length).toBeGreaterThan(0)
      })
      it('update isActive of any survey', async () => {
        const query = updateSurveyMutation(
          getSeedID(surveys[1]),
          { isActive: true },
        )
        const { data, errors } = await authRequest(query, jwt)

        expect(data).toBeNull()
        expect(errors.length).toBeGreaterThan(0)
      })
      it('update questionOrder of any survey', async () => {
        const query = updateSurveyMutation(
          getSeedID(surveys[1]),
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
      it('delete any survey', async () => {
        const query = deleteSurveyMutation(getSeedID(surveys[1]))
        const { data, errors } = await authRequest(query, jwt)

        expect(data).toBeNull()
        expect(errors.length).toBeGreaterThan(0)
      })
    })
  })
})
