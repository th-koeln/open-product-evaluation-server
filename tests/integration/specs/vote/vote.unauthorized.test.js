const surveys = require('../../../seeds/data/survey/survey')
const questions = require('../../../seeds/data/question/question')
const { Seeder } = require('mongo-seeding')
const config = require('../../../../config')
const { unauthRequest } = require('../../helper/requests')
const { getSeedID } = require('../../helper/helpers')
const {
  voteAmountQuery,
  votesQuery,
  setAnswerMutation,
  removeAnswerMutation,
} = require('../../requests/vote.requests')

const seeder = new Seeder(config.seeder)
const collections = seeder.readCollectionsFromPath(config.seeder.inputPath)

describe('Unauthorized', () => {
  beforeEach(async () => {
    await seeder.import(collections)
  })

  describe('should not', async () => {
    it('get amount of votes of any survey', async () => {
      const query = voteAmountQuery(getSeedID(surveys[0]))
      const { data, errors } = await unauthRequest(query)

      expect(data.voteAmount).toBeNull()
      expect(errors.length).toBeGreaterThan(0)
    })
    it('get current votes of any survey', async () => {
      const query = votesQuery(getSeedID(surveys[0]))
      const { data, errors } = await unauthRequest(query)

      expect(data.votes).toBeNull()
      expect(errors.length).toBeGreaterThan(0)
    })
    it('set a LikeAnswer for a LikeQuestion of any survey', async () => {
      const query = setAnswerMutation(getSeedID(questions[0]), { liked: true })
      const { data, errors } = await unauthRequest(query)

      expect(data).toBeNull()
      expect(errors.length).toBeGreaterThan(0)
    })
    it('set a LikeDislikeAnswer for a LikeDislikeQuestion of any survey', async () => {
      const query = setAnswerMutation(getSeedID(questions[1]), { liked: true })
      const { data, errors } = await unauthRequest(query)

      expect(data).toBeNull()
      expect(errors.length).toBeGreaterThan(0)
    })
    it('set a ChoiceAnswer for a ChoiceQuestion of any survey', async () => {
      const query = setAnswerMutation(
        getSeedID(questions[2]),
        { choice: getSeedID(questions[2].choices[0]) },
      )
      const { data, errors } = await unauthRequest(query)

      expect(data).toBeNull()
      expect(errors.length).toBeGreaterThan(0)
    })
    it('set a RegulatorAnswer for a RegulatorQuestion of any survey', async () => {
      const query = setAnswerMutation(
        getSeedID(questions[3]),
        { rating: 4 },
      )
      const { data, errors } = await unauthRequest(query)

      expect(data).toBeNull()
      expect(errors.length).toBeGreaterThan(0)
    })
    it('set a FavoriteAnswer for a FavoriteQuestion of any survey', async () => {
      const query = setAnswerMutation(
        getSeedID(questions[4]),
        { favoriteItem: getSeedID(questions[4].items[0]) },
      )
      const { data, errors } = await unauthRequest(query)

      expect(data).toBeNull()
      expect(errors.length).toBeGreaterThan(0)
    })
    it('set a RankingAnswer for a RankingQuestion of any survey', async () => {
      const query = setAnswerMutation(
        getSeedID(questions[5]),
        { rankedItems: [
          getSeedID(questions[5].items[3]),
          getSeedID(questions[5].items[1]),
          getSeedID(questions[5].items[0]),
          getSeedID(questions[5].items[2]),
          getSeedID(questions[5].items[4]),
        ] },
      )
      const { data, errors } = await unauthRequest(query)

      expect(data).toBeNull()
      expect(errors.length).toBeGreaterThan(0)
    })
    it('remove an answer for a question of any survey', async () => {
      const query = removeAnswerMutation(getSeedID(questions[0]))
      const { data, errors } = await unauthRequest(query)

      expect(data).toBeNull()
      expect(errors.length).toBeGreaterThan(0)
    })
  })
})
