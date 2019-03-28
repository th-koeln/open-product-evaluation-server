const surveys = require('../../../seeds/data/survey/survey')
const questions = require('../../../seeds/data/question/question')
const users = require('../../../seeds/data/user/user')
const { Seeder } = require('mongo-seeding')
const config = require('../../../../config')
const { unauthRequest, authRequest } = require('../../helper/requests')
const { getSeedID } = require('../../helper/helpers')
const {
  voteAmountQuery,
  votesQuery,
  setAnswerMutation,
  removeAnswerMutation,
} = require('../../requests/vote.requests')
const { loginUserMutation } = require('../../requests/user.requests')

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
    it('get amount of votes of an owned survey', async () => {
      const query = voteAmountQuery(getSeedID(surveys[0]))
      const { data, errors } = await authRequest(query, jwt)

      expect(errors).toBeUndefined()
      expect(data.voteAmount).toBe(5)
    })
    it('get current votes of an owned survey', async () => {
      const query = votesQuery(getSeedID(surveys[0]))
      const { data, errors } = await authRequest(query, jwt)

      expect(errors).toBeUndefined()
      expect(data.votes).toMatchSnapshot()
    })
    it('get amount of votes of a not owned survey', async () => {
      const query = voteAmountQuery(getSeedID(surveys[1]))
      const { data, errors } = await authRequest(query, jwt)

      expect(errors).toBeUndefined()
      expect(data.voteAmount).toBe(5)
    })
    it('get current votes of a not owned survey', async () => {
      const query = votesQuery(getSeedID(surveys[1]))
      const { data, errors } = await authRequest(query, jwt)

      expect(errors).toBeUndefined()
      expect(data.votes).toMatchSnapshot()
    })
  })

  describe('should not', async () => {
    it('set a LikeAnswer for a LikeQuestion of any owned survey', async () => {
      const query = setAnswerMutation(getSeedID(questions[0]), { liked: true })
      const { data, errors } = await authRequest(query, jwt)

      expect(data).toBeNull()
      expect(errors.length).toBeGreaterThan(0)
    })
    it('set a LikeDislikeAnswer for a LikeDislikeQuestion of any owned survey', async () => {
      const query = setAnswerMutation(getSeedID(questions[1]), { liked: true })
      const { data, errors } = await authRequest(query, jwt)

      expect(data).toBeNull()
      expect(errors.length).toBeGreaterThan(0)
    })
    it('set a ChoiceAnswer for a ChoiceQuestion of any owned survey', async () => {
      const query = setAnswerMutation(
        getSeedID(questions[2]),
        { choice: getSeedID(questions[2].choices[0]) },
      )
      const { data, errors } = await authRequest(query, jwt)

      expect(data).toBeNull()
      expect(errors.length).toBeGreaterThan(0)
    })
    it('set a RegulatorAnswer for a RegulatorQuestion of any owned survey', async () => {
      const query = setAnswerMutation(
        getSeedID(questions[3]),
        { rating: 4 },
      )
      const { data, errors } = await authRequest(query, jwt)

      expect(data).toBeNull()
      expect(errors.length).toBeGreaterThan(0)
    })
    it('set a FavoriteAnswer for a FavoriteQuestion of any owned survey', async () => {
      const query = setAnswerMutation(
        getSeedID(questions[4]),
        { favoriteItem: getSeedID(questions[4].items[0]) },
      )
      const { data, errors } = await authRequest(query, jwt)

      expect(data).toBeNull()
      expect(errors.length).toBeGreaterThan(0)
    })
    it('set a RankingAnswer for a RankingQuestion of any owned survey', async () => {
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
      const { data, errors } = await authRequest(query, jwt)

      expect(data).toBeNull()
      expect(errors.length).toBeGreaterThan(0)
    })
    it('remove an answer for a question of any owned survey', async () => {
      const query = removeAnswerMutation(getSeedID(questions[0]))
      const { data, errors } = await authRequest(query, jwt)

      expect(data).toBeNull()
      expect(errors.length).toBeGreaterThan(0)
    })
    it('set a LikeAnswer for a LikeQuestion of any not owned survey', async () => {
      const query = setAnswerMutation(getSeedID(questions[6]), { liked: true })
      const { data, errors } = await authRequest(query, jwt)

      expect(data).toBeNull()
      expect(errors.length).toBeGreaterThan(0)
    })
    it('set a LikeDislikeAnswer for a LikeDislikeQuestion of any not owned survey', async () => {
      const query = setAnswerMutation(getSeedID(questions[7]), { liked: true })
      const { data, errors } = await authRequest(query, jwt)

      expect(data).toBeNull()
      expect(errors.length).toBeGreaterThan(0)
    })
    it('set a ChoiceAnswer for a ChoiceQuestion of any not owned survey', async () => {
      const query = setAnswerMutation(
        getSeedID(questions[8]),
        { choice: getSeedID(questions[8].choices[0]) },
      )
      const { data, errors } = await authRequest(query, jwt)

      expect(data).toBeNull()
      expect(errors.length).toBeGreaterThan(0)
    })
    it('set a RegulatorAnswer for a RegulatorQuestion of any not owned survey', async () => {
      const query = setAnswerMutation(
        getSeedID(questions[9]),
        { rating: 4 },
      )
      const { data, errors } = await authRequest(query, jwt)

      expect(data).toBeNull()
      expect(errors.length).toBeGreaterThan(0)
    })
    it('set a FavoriteAnswer for a FavoriteQuestion of any not owned survey', async () => {
      const query = setAnswerMutation(
        getSeedID(questions[10]),
        { favoriteItem: getSeedID(questions[10].items[0]) },
      )
      const { data, errors } = await authRequest(query, jwt)

      expect(data).toBeNull()
      expect(errors.length).toBeGreaterThan(0)
    })
    it('set a RankingAnswer for a RankingQuestion of any not owned survey', async () => {
      const query = setAnswerMutation(
        getSeedID(questions[11]),
        { rankedItems: [
          getSeedID(questions[11].items[3]),
          getSeedID(questions[11].items[1]),
          getSeedID(questions[11].items[0]),
          getSeedID(questions[11].items[2]),
        ] },
      )
      const { data, errors } = await authRequest(query, jwt)

      expect(data).toBeNull()
      expect(errors.length).toBeGreaterThan(0)
    })
    it('remove an answer for a question of any not owned survey', async () => {
      const query = removeAnswerMutation(getSeedID(questions[6]))
      const { data, errors } = await authRequest(query, jwt)

      expect(data).toBeNull()
      expect(errors.length).toBeGreaterThan(0)
    })
  })
})
