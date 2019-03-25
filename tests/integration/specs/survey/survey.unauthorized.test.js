const surveys = require('../../../seeds/data/survey/survey')
const questions = require('../../../seeds/data/question/question')
const { Seeder } = require('mongo-seeding')
const config = require('../../../../config')
const { unauthRequest } = require('../../helper/requests')
const { getSeedID } = require('../../helper/helpers')
const {
  surveyAmountQuery,
  surveysQuery,
  surveyQuery,
  createSurveyMutation,
  updateSurveyMutation,
  deleteSurveyMutation,
} = require('../../queries/survey.queries')

const seeder = new Seeder(config.seeder)
const collections = seeder.readCollectionsFromPath(config.seeder.inputPath)

describe('Unauthorized', () => {
  beforeEach(async () => {
    await seeder.import(collections)
  })

  describe('should not', async () => {
    it('get the amount of surveys', async () => {
      const query = surveyAmountQuery()
      const { data, errors } = await unauthRequest(query)

      expect(data.surveyAmount).toBeNull()
      expect(errors.length).toBeGreaterThan(0)
    })
    it('get any survey when querying for surveys', async () => {
      const query = surveysQuery()
      const { data, errors } = await unauthRequest(query)

      expect(data.surveys).toBeNull()
      expect(errors.length).toBeGreaterThan(0)
    })
    it('get survey when querying for a specific survey', async () => {
      const query = surveyQuery(getSeedID(surveys[0]))
      const { data, errors } = await unauthRequest(query)

      expect(data).toBeNull()
      expect(errors.length).toBeGreaterThan(0)
    })
    it('create a survey', async () => {
      const query = createSurveyMutation({ title: 'My new Survey' })
      const { data, errors } = await unauthRequest(query)

      expect(data).toBeNull()
      expect(errors.length).toBeGreaterThan(0)
    })
    it('update title of any survey', async () => {
      const query = updateSurveyMutation(
        getSeedID(surveys[0]),
        { title: 'New title' },
      )
      const { data, errors } = await unauthRequest(query)

      expect(data).toBeNull()
      expect(errors.length).toBeGreaterThan(0)
    })
    it('update description of any survey', async () => {
      const query = updateSurveyMutation(
        getSeedID(surveys[0]),
        { description: 'New description' },
      )
      const { data, errors } = await unauthRequest(query)

      expect(data).toBeNull()
      expect(errors.length).toBeGreaterThan(0)
    })
    it('update isActive of any survey', async () => {
      const query = updateSurveyMutation(
        getSeedID(surveys[0]),
        { isActive: true },
      )
      const { data, errors } = await unauthRequest(query)

      expect(data).toBeNull()
      expect(errors.length).toBeGreaterThan(0)
    })
    it('update questionOrder of any survey', async () => {
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
      const { data, errors } = await unauthRequest(query)

      expect(data).toBeNull()
      expect(errors.length).toBeGreaterThan(0)
    })
    it('delete any survey', async () => {
      const query = deleteSurveyMutation(getSeedID(surveys[0]))
      const { data, errors } = await unauthRequest(query)

      expect(data).toBeNull()
      expect(errors.length).toBeGreaterThan(0)
    })
  })
})
