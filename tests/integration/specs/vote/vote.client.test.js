const clients = require('../../../seeds/data/client/client')
const surveys = require('../../../seeds/data/survey/survey')
const questions = require('../../../seeds/data/question/question')
const users = require('../../../seeds/data/user/user')
const { Seeder } = require('mongo-seeding')
const config = require('../../../../config')
const { unauthRequest, authRequest } = require('../../helper/requests')
const { getSeedID, getClientToken, promiseTimeout } = require('../../helper/helpers')
const {
  voteAmountQuery,
  votesQuery,
  setAnswerMutation,
  removeAnswerMutation,
} = require('../../requests/vote.requests')
const { loginClientMutation, clientQuery } = require('../../requests/client.requests')
const { loginUserMutation } = require('../../requests/user.requests')
const { surveyQuery } = require('../../requests/survey.requests')
const { TEMPORARY } = require('../../../../src/utils/lifetime')

const seeder = new Seeder(config.seeder)
const collections = seeder.readCollectionsFromPath(config.seeder.inputPath)

describe('Client', () => {
  describe('that is permanent', () => {
    const admin = users[1]
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

    describe('should', async () => {
      it('get amount of votes of a connected survey', async () => {
        const query = voteAmountQuery(getSeedID(surveys[1]))
        const { data, errors } = await authRequest(query, jwt)

        expect(errors).toBeUndefined()
        expect(data.voteAmount).toBe(5)
      })
      it('get current votes of a connected survey', async () => {
        const query = votesQuery(getSeedID(surveys[1]))
        const { data, errors } = await authRequest(query, jwt)

        expect(errors).toBeUndefined()
        expect(data.votes).toMatchSnapshot()
      })
      it('get 0 as amount of votes of a not connected survey', async () => {
        const query = voteAmountQuery(getSeedID(surveys[0]))
        const { data, errors } = await authRequest(query, jwt)

        expect(errors).toBeUndefined()
        expect(data.voteAmount).toBe(0)
      })
      it('set a LikeAnswer for a LikeQuestion of a connected survey', async () => {
        const query = setAnswerMutation(getSeedID(questions[6]), { liked: true })
        const { data, errors } = await authRequest(query, jwt)

        expect(errors).toBeUndefined()
        expect(data).toMatchSnapshot()
      })
      it('set a LikeDislikeAnswer for a LikeDislikeQuestion of any not owned survey', async () => {
        const query = setAnswerMutation(getSeedID(questions[7]), { liked: true })
        const { data, errors } = await authRequest(query, jwt)

        expect(errors).toBeUndefined()
        expect(data).toMatchSnapshot()
      })
      it('set a ChoiceAnswer for a ChoiceQuestion of any not owned survey', async () => {
        const query = setAnswerMutation(
          getSeedID(questions[8]),
          { choice: getSeedID(questions[8].choices[0]) },
        )
        const { data, errors } = await authRequest(query, jwt)

        expect(errors).toBeUndefined()
        expect(data).toMatchSnapshot()
      })
      it('set a RegulatorAnswer for a RegulatorQuestion of any not owned survey', async () => {
        const query = setAnswerMutation(
          getSeedID(questions[9]),
          { rating: 4 },
        )
        const { data, errors } = await authRequest(query, jwt)

        expect(errors).toBeUndefined()
        expect(data).toMatchSnapshot()
      })
      it('set a FavoriteAnswer for a FavoriteQuestion of any not owned survey', async () => {
        const query = setAnswerMutation(
          getSeedID(questions[10]),
          { favoriteItem: getSeedID(questions[10].items[0]) },
        )
        const { data, errors } = await authRequest(query, jwt)

        expect(errors).toBeUndefined()
        expect(data).toMatchSnapshot()
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

        expect(errors).toBeUndefined()
        expect(data).toMatchSnapshot()
      })
      it('remove an answer for a question of any not owned survey', async () => {
        const setQuery = setAnswerMutation(getSeedID(questions[6]), { liked: true })
        const { errors: setErrors } = await authRequest(setQuery, jwt)

        expect(setErrors).toBeUndefined()

        const query = removeAnswerMutation(getSeedID(questions[6]))
        const { data, errors } = await authRequest(query, jwt)

        expect(errors).toBeUndefined()
        expect(data.removeAnswer.success).toBe(true)
      })
      it('create vote after all answers where provided', async () => {
        const likeQuery = setAnswerMutation(getSeedID(questions[6]), { liked: true })
        const { data: likeData, errors: likeErrors } = await authRequest(likeQuery, jwt)

        expect(likeErrors).toBeUndefined()
        expect(likeData.setAnswer.voteCreated).toBe(false)

        const dislikeQuery = setAnswerMutation(getSeedID(questions[7]), { liked: true })
        const { data: dislikeData, errors: dislikeErrors } = await authRequest(dislikeQuery, jwt)

        expect(dislikeErrors).toBeUndefined()
        expect(dislikeData.setAnswer.voteCreated).toBe(false)

        const choiceQuery = setAnswerMutation(
          getSeedID(questions[8]),
          { choice: getSeedID(questions[8].choices[0]) },
        )
        const { data: choiceData, errors: choiceErrors } = await authRequest(choiceQuery, jwt)

        expect(choiceErrors).toBeUndefined()
        expect(choiceData.setAnswer.voteCreated).toBe(false)

        const regulatorQuery = setAnswerMutation(
          getSeedID(questions[9]),
          { rating: 4 },
        )
        const { data: regulatorData, errors: regulatorErrors } = await authRequest(regulatorQuery, jwt)

        expect(regulatorErrors).toBeUndefined()
        expect(regulatorData.setAnswer.voteCreated).toBe(false)

        const favoriteQuery = setAnswerMutation(
          getSeedID(questions[10]),
          { favoriteItem: getSeedID(questions[10].items[0]) },
        )
        const { data: favoriteData, errors: favoriteErrors } = await authRequest(favoriteQuery, jwt)

        expect(favoriteErrors).toBeUndefined()
        expect(favoriteData.setAnswer.voteCreated).toBe(false)

        const rankingQuery = setAnswerMutation(
          getSeedID(questions[11]),
          { rankedItems: [
            getSeedID(questions[11].items[3]),
            getSeedID(questions[11].items[1]),
            getSeedID(questions[11].items[0]),
            getSeedID(questions[11].items[2]),
          ] },
        )
        const { data: rankingData, errors: rankingErrors } = await authRequest(rankingQuery, jwt)

        expect(rankingErrors).toBeUndefined()
        expect(rankingData.setAnswer.voteCreated).toBe(true)

        const query = votesQuery(getSeedID(surveys[1]))
        const { data, errors } = await authRequest(query, jwt)

        expect(errors).toBeUndefined()
        expect(data.votes).toMatchSnapshot()
      })
      it('reset already given answer on second call', async () => {
        const likeQuery = setAnswerMutation(getSeedID(questions[6]), { liked: true })
        const { data: likeData, errors: likeErrors } = await authRequest(likeQuery, jwt)

        expect(likeErrors).toBeUndefined()
        expect(likeData.setAnswer.voteCreated).toBe(false)

        const like2Query = setAnswerMutation(getSeedID(questions[6]), { liked: false })
        const { data: like2Data, errors: like2Errors } = await authRequest(like2Query, jwt)

        expect(like2Errors).toBeUndefined()
        expect(like2Data.setAnswer.voteCreated).toBe(false)

        const dislikeQuery = setAnswerMutation(getSeedID(questions[7]), { liked: true })
        const { data: dislikeData, errors: dislikeErrors } = await authRequest(dislikeQuery, jwt)

        expect(dislikeErrors).toBeUndefined()
        expect(dislikeData.setAnswer.voteCreated).toBe(false)

        const choiceQuery = setAnswerMutation(
          getSeedID(questions[8]),
          { choice: getSeedID(questions[8].choices[0]) },
        )
        const { data: choiceData, errors: choiceErrors } = await authRequest(choiceQuery, jwt)

        expect(choiceErrors).toBeUndefined()
        expect(choiceData.setAnswer.voteCreated).toBe(false)

        const regulatorQuery = setAnswerMutation(
          getSeedID(questions[9]),
          { rating: 4 },
        )
        const { data: regulatorData, errors: regulatorErrors } = await authRequest(regulatorQuery, jwt)

        expect(regulatorErrors).toBeUndefined()
        expect(regulatorData.setAnswer.voteCreated).toBe(false)

        const favoriteQuery = setAnswerMutation(
          getSeedID(questions[10]),
          { favoriteItem: getSeedID(questions[10].items[0]) },
        )
        const { data: favoriteData, errors: favoriteErrors } = await authRequest(favoriteQuery, jwt)

        expect(favoriteErrors).toBeUndefined()
        expect(favoriteData.setAnswer.voteCreated).toBe(false)

        const favorite2Query = setAnswerMutation(
          getSeedID(questions[10]),
          { favoriteItem: getSeedID(questions[10].items[1]) },
        )
        const { data: favorite2Data, errors: favorite2Errors } = await authRequest(favorite2Query, jwt)

        expect(favorite2Errors).toBeUndefined()
        expect(favorite2Data.setAnswer.voteCreated).toBe(false)

        const rankingQuery = setAnswerMutation(
          getSeedID(questions[11]),
          { rankedItems: [
            getSeedID(questions[11].items[3]),
            getSeedID(questions[11].items[1]),
            getSeedID(questions[11].items[0]),
            getSeedID(questions[11].items[2]),
          ] },
        )
        const { data: rankingData, errors: rankingErrors } = await authRequest(rankingQuery, jwt)

        expect(rankingErrors).toBeUndefined()
        expect(rankingData.setAnswer.voteCreated).toBe(true)

        const query = votesQuery(getSeedID(surveys[1]))
        const { data, errors } = await authRequest(query, jwt)

        expect(errors).toBeUndefined()
        expect(data.votes).toMatchSnapshot()
      })
      it('create vote and update results', async () => {
        const likeQuery = setAnswerMutation(getSeedID(questions[6]), { liked: true })
        const { data: likeData, errors: likeErrors } = await authRequest(likeQuery, jwt)

        expect(likeErrors).toBeUndefined()
        expect(likeData.setAnswer.voteCreated).toBe(false)

        const dislikeQuery = setAnswerMutation(getSeedID(questions[7]), { liked: true })
        const { data: dislikeData, errors: dislikeErrors } = await authRequest(dislikeQuery, jwt)

        expect(dislikeErrors).toBeUndefined()
        expect(dislikeData.setAnswer.voteCreated).toBe(false)

        const choiceQuery = setAnswerMutation(
          getSeedID(questions[8]),
          { choice: getSeedID(questions[8].choices[0]) },
        )
        const { data: choiceData, errors: choiceErrors } = await authRequest(choiceQuery, jwt)

        expect(choiceErrors).toBeUndefined()
        expect(choiceData.setAnswer.voteCreated).toBe(false)

        const regulatorQuery = setAnswerMutation(
          getSeedID(questions[9]),
          { rating: 4 },
        )
        const { data: regulatorData, errors: regulatorErrors } = await authRequest(regulatorQuery, jwt)

        expect(regulatorErrors).toBeUndefined()
        expect(regulatorData.setAnswer.voteCreated).toBe(false)

        const favoriteQuery = setAnswerMutation(
          getSeedID(questions[10]),
          { favoriteItem: getSeedID(questions[10].items[0]) },
        )
        const { data: favoriteData, errors: favoriteErrors } = await authRequest(favoriteQuery, jwt)

        expect(favoriteErrors).toBeUndefined()
        expect(favoriteData.setAnswer.voteCreated).toBe(false)

        const rankingQuery = setAnswerMutation(
          getSeedID(questions[11]),
          { rankedItems: [
            getSeedID(questions[11].items[3]),
            getSeedID(questions[11].items[1]),
            getSeedID(questions[11].items[0]),
            getSeedID(questions[11].items[2]),
          ] },
        )
        const { data: rankingData, errors: rankingErrors } = await authRequest(rankingQuery, jwt)

        expect(rankingErrors).toBeUndefined()
        expect(rankingData.setAnswer.voteCreated).toBe(true)

        const adminQuery = loginUserMutation(admin.email, 'password')
        const { data: adminData, errors: adminErrors } = await unauthRequest(adminQuery)

        expect(adminData.login).not.toBeNull()
        expect(adminErrors).toBeUndefined()

        const { login: { token: adminToken } } = adminData

        const query = surveyQuery(getSeedID(surveys[1]))
        const { data, errors } = await authRequest(query, adminToken)

        expect(errors).toBeUndefined()
        expect(data).toMatchSnapshot()
      })
      it('be able to answer again after creating vote', async () => {
        const likeQuery = setAnswerMutation(getSeedID(questions[6]), { liked: true })
        const { data: likeData, errors: likeErrors } = await authRequest(likeQuery, jwt)

        expect(likeErrors).toBeUndefined()
        expect(likeData.setAnswer.voteCreated).toBe(false)

        const dislikeQuery = setAnswerMutation(getSeedID(questions[7]), { liked: true })
        const { data: dislikeData, errors: dislikeErrors } = await authRequest(dislikeQuery, jwt)

        expect(dislikeErrors).toBeUndefined()
        expect(dislikeData.setAnswer.voteCreated).toBe(false)

        const choiceQuery = setAnswerMutation(
          getSeedID(questions[8]),
          { choice: getSeedID(questions[8].choices[0]) },
        )
        const { data: choiceData, errors: choiceErrors } = await authRequest(choiceQuery, jwt)

        expect(choiceErrors).toBeUndefined()
        expect(choiceData.setAnswer.voteCreated).toBe(false)

        const regulatorQuery = setAnswerMutation(
          getSeedID(questions[9]),
          { rating: 4 },
        )
        const { data: regulatorData, errors: regulatorErrors } = await authRequest(regulatorQuery, jwt)

        expect(regulatorErrors).toBeUndefined()
        expect(regulatorData.setAnswer.voteCreated).toBe(false)

        const favoriteQuery = setAnswerMutation(
          getSeedID(questions[10]),
          { favoriteItem: getSeedID(questions[10].items[0]) },
        )
        const { data: favoriteData, errors: favoriteErrors } = await authRequest(favoriteQuery, jwt)

        expect(favoriteErrors).toBeUndefined()
        expect(favoriteData.setAnswer.voteCreated).toBe(false)

        const rankingQuery = setAnswerMutation(
          getSeedID(questions[11]),
          { rankedItems: [
            getSeedID(questions[11].items[3]),
            getSeedID(questions[11].items[1]),
            getSeedID(questions[11].items[0]),
            getSeedID(questions[11].items[2]),
          ] },
        )
        const { data: rankingData, errors: rankingErrors } = await authRequest(rankingQuery, jwt)

        expect(rankingErrors).toBeUndefined()
        expect(rankingData.setAnswer.voteCreated).toBe(true)

        const { data, errors } = await authRequest(likeQuery, jwt)

        expect(errors).toBeUndefined()
        expect(data).toMatchSnapshot()
      })
      it('be able to answer all questions with null (neutral) and still create a vote', async () => {
        const likeQuery = setAnswerMutation(getSeedID(questions[6]), { liked: null })
        const { data: likeData, errors: likeErrors } = await authRequest(likeQuery, jwt)

        expect(likeErrors).toBeUndefined()
        expect(likeData.setAnswer.voteCreated).toBe(false)

        const dislikeQuery = setAnswerMutation(getSeedID(questions[7]), { liked: null })
        const { data: dislikeData, errors: dislikeErrors } = await authRequest(dislikeQuery, jwt)

        expect(dislikeErrors).toBeUndefined()
        expect(dislikeData.setAnswer.voteCreated).toBe(false)

        const choiceQuery = setAnswerMutation(
          getSeedID(questions[8]),
          { choice: null },
        )
        const { data: choiceData, errors: choiceErrors } = await authRequest(choiceQuery, jwt)

        expect(choiceErrors).toBeUndefined()
        expect(choiceData.setAnswer.voteCreated).toBe(false)

        const regulatorQuery = setAnswerMutation(
          getSeedID(questions[9]),
          { rating: null },
        )
        const { data: regulatorData, errors: regulatorErrors } = await authRequest(regulatorQuery, jwt)

        expect(regulatorErrors).toBeUndefined()
        expect(regulatorData.setAnswer.voteCreated).toBe(false)

        const favoriteQuery = setAnswerMutation(
          getSeedID(questions[10]),
          { favoriteItem: null },
        )
        const { data: favoriteData, errors: favoriteErrors } = await authRequest(favoriteQuery, jwt)

        expect(favoriteErrors).toBeUndefined()
        expect(favoriteData.setAnswer.voteCreated).toBe(false)

        const rankingQuery = setAnswerMutation(
          getSeedID(questions[11]),
          { rankedItems: null },
        )
        const { data: rankingData, errors: rankingErrors } = await authRequest(rankingQuery, jwt)

        expect(rankingErrors).toBeUndefined()
        expect(rankingData.setAnswer.voteCreated).toBe(true)
      })
    })

    describe('should not', async () => {
      it('get current votes of any not owned survey', async () => {
        const query = votesQuery(getSeedID(surveys[0]))
        const { data, errors } = await authRequest(query, jwt)

        expect(data.votes).toBeNull()
        expect(errors.length).toBeGreaterThan(0)
      })
      it('set a LikeAnswer for a LikeQuestion of any not connected survey', async () => {
        const query = setAnswerMutation(getSeedID(questions[0]), { liked: true })
        const { data, errors } = await authRequest(query, jwt)

        expect(data).toBeNull()
        expect(errors.length).toBeGreaterThan(0)
      })
      it('set a LikeDislikeAnswer for a LikeDislikeQuestion of any not connected survey', async () => {
        const query = setAnswerMutation(getSeedID(questions[1]), { liked: true })
        const { data, errors } = await authRequest(query, jwt)

        expect(data).toBeNull()
        expect(errors.length).toBeGreaterThan(0)
      })
      it('set a ChoiceAnswer for a ChoiceQuestion of any not connected survey', async () => {
        const query = setAnswerMutation(
          getSeedID(questions[2]),
          { choice: getSeedID(questions[2].choices[0]) },
        )
        const { data, errors } = await authRequest(query, jwt)

        expect(data).toBeNull()
        expect(errors.length).toBeGreaterThan(0)
      })
      it('set a RegulatorAnswer for a RegulatorQuestion of any not connected survey', async () => {
        const query = setAnswerMutation(
          getSeedID(questions[3]),
          { rating: 4 },
        )
        const { data, errors } = await authRequest(query, jwt)

        expect(data).toBeNull()
        expect(errors.length).toBeGreaterThan(0)
      })
      it('set a FavoriteAnswer for a FavoriteQuestion of any not connected survey', async () => {
        const query = setAnswerMutation(
          getSeedID(questions[4]),
          { favoriteItem: getSeedID(questions[4].items[0]) },
        )
        const { data, errors } = await authRequest(query, jwt)

        expect(data).toBeNull()
        expect(errors.length).toBeGreaterThan(0)
      })
      it('set a RankingAnswer for a RankingQuestion of any not connected survey', async () => {
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
      it('set a LikeAnswer for a LikeQuestion with more than the liked attribute', async () => {
        const query = setAnswerMutation(
          getSeedID(questions[6]),
          { liked: true, choice: getSeedID(questions[8].choices[0]) },
        )
        const { data, errors } = await authRequest(query, jwt)

        expect(data).toBeNull()
        expect(errors.length).toBeGreaterThan(0)
      })
      it('set a LikeAnswer for a LikeQuestion with choice as answer', async () => {
        const query = setAnswerMutation(
          getSeedID(questions[6]),
          { choice: getSeedID(questions[8].choices[0]) },
        )
        const { data, errors } = await authRequest(query, jwt)

        expect(data).toBeNull()
        expect(errors.length).toBeGreaterThan(0)
      })
      it('set a LikeAnswer for a LikeQuestion with rating as answer', async () => {
        const query = setAnswerMutation(
          getSeedID(questions[6]),
          { rating: 3 },
        )
        const { data, errors } = await authRequest(query, jwt)

        expect(data).toBeNull()
        expect(errors.length).toBeGreaterThan(0)
      })
      it('set a LikeAnswer for a LikeQuestion with favoriteItem as answer', async () => {
        const query = setAnswerMutation(
          getSeedID(questions[6]),
          { favoriteItem: getSeedID(questions[6].items[0]) },
        )
        const { data, errors } = await authRequest(query, jwt)

        expect(data).toBeNull()
        expect(errors.length).toBeGreaterThan(0)
      })
      it('set a LikeAnswer for a LikeQuestion with rankedItems as answer', async () => {
        const query = setAnswerMutation(
          getSeedID(questions[6]),
          { rankedItems: [
            getSeedID(questions[6].items[0]),
          ] },
        )
        const { data, errors } = await authRequest(query, jwt)

        expect(data).toBeNull()
        expect(errors.length).toBeGreaterThan(0)
      })
      it('set a LikeDislikeAnswer for a LikeDislikeQuestion with more than the liked attribute', async () => {
        const query = setAnswerMutation(
          getSeedID(questions[7]),
          { liked: true, choice: getSeedID(questions[8].choices[0]) },
        )
        const { data, errors } = await authRequest(query, jwt)

        expect(data).toBeNull()
        expect(errors.length).toBeGreaterThan(0)
      })
      it('set a LikeDislikeAnswer for a LikeDislikeQuestion with choice as answer', async () => {
        const query = setAnswerMutation(
          getSeedID(questions[7]),
          { choice: getSeedID(questions[8].choices[0]) },
        )
        const { data, errors } = await authRequest(query, jwt)

        expect(data).toBeNull()
        expect(errors.length).toBeGreaterThan(0)
      })
      it('set a LikeDislikeAnswer for a LikeDislikeQuestion with rating as answer', async () => {
        const query = setAnswerMutation(
          getSeedID(questions[7]),
          { rating: 3 },
        )
        const { data, errors } = await authRequest(query, jwt)

        expect(data).toBeNull()
        expect(errors.length).toBeGreaterThan(0)
      })
      it('set a LikeDislikeAnswer for a LikeDislikeQuestion with favoriteItem as answer', async () => {
        const query = setAnswerMutation(
          getSeedID(questions[7]),
          { favoriteItem: getSeedID(questions[7].items[0]) },
        )
        const { data, errors } = await authRequest(query, jwt)

        expect(data).toBeNull()
        expect(errors.length).toBeGreaterThan(0)
      })
      it('set a LikeDislikeAnswer for a LikeDislikeQuestion with rankedItems as answer', async () => {
        const query = setAnswerMutation(
          getSeedID(questions[7]),
          { rankedItems: [
            getSeedID(questions[7].items[0]),
          ] },
        )
        const { data, errors } = await authRequest(query, jwt)

        expect(data).toBeNull()
        expect(errors.length).toBeGreaterThan(0)
      })
      it('set a ChoiceAnswer for a ChoiceQuestion with more than the choice attribute', async () => {
        const query = setAnswerMutation(
          getSeedID(questions[8]),
          { liked: true, choice: getSeedID(questions[8].choices[0]) },
        )
        const { data, errors } = await authRequest(query, jwt)

        expect(data).toBeNull()
        expect(errors.length).toBeGreaterThan(0)
      })
      it('set a ChoiceAnswer for a ChoiceQuestion with a choice from another question', async () => {
        const query = setAnswerMutation(
          getSeedID(questions[8]),
          { choice: getSeedID(questions[2].choices[0]) },
        )
        const { data, errors } = await authRequest(query, jwt)

        expect(data).toBeNull()
        expect(errors.length).toBeGreaterThan(0)
      })
      it('set a ChoiceAnswer for a ChoiceQuestion with liked as answer', async () => {
        const query = setAnswerMutation(
          getSeedID(questions[8]),
          { liked: true },
        )
        const { data, errors } = await authRequest(query, jwt)

        expect(data).toBeNull()
        expect(errors.length).toBeGreaterThan(0)
      })
      it('set a ChoiceAnswer for a ChoiceQuestion with rating as answer', async () => {
        const query = setAnswerMutation(
          getSeedID(questions[8]),
          { rating: 3 },
        )
        const { data, errors } = await authRequest(query, jwt)

        expect(data).toBeNull()
        expect(errors.length).toBeGreaterThan(0)
      })
      it('set a ChoiceAnswer for a ChoiceQuestion with favoriteItem as answer', async () => {
        const query = setAnswerMutation(
          getSeedID(questions[8]),
          { favoriteItem: getSeedID(questions[8].items[0]) },
        )
        const { data, errors } = await authRequest(query, jwt)

        expect(data).toBeNull()
        expect(errors.length).toBeGreaterThan(0)
      })
      it('set a ChoiceAnswer for a ChoiceQuestion with rankedItems as answer', async () => {
        const query = setAnswerMutation(
          getSeedID(questions[8]),
          { rankedItems: [
            getSeedID(questions[8].items[2]),
            getSeedID(questions[8].items[1]),
            getSeedID(questions[8].items[0]),
          ] },
        )
        const { data, errors } = await authRequest(query, jwt)

        expect(data).toBeNull()
        expect(errors.length).toBeGreaterThan(0)
      })
      it('set a RegulatorAnswer for a RegulatorQuestion with more than the rating attribute', async () => {
        const query = setAnswerMutation(
          getSeedID(questions[9]),
          { liked: true, rating: 3 },
        )
        const { data, errors } = await authRequest(query, jwt)

        expect(data).toBeNull()
        expect(errors.length).toBeGreaterThan(0)
      })
      it('set a RegulatorAnswer for a RegulatorQuestion with a value that is greater than the maximum', async () => {
        const query = setAnswerMutation(
          getSeedID(questions[9]),
          { rating: 20 },
        )
        const { data, errors } = await authRequest(query, jwt)

        expect(data).toBeNull()
        expect(errors.length).toBeGreaterThan(0)
      })
      it('set a RegulatorAnswer for a RegulatorQuestion with a value that is smaller than the minimum', async () => {
        const query = setAnswerMutation(
          getSeedID(questions[9]),
          { rating: -10 },
        )
        const { data, errors } = await authRequest(query, jwt)

        expect(data).toBeNull()
        expect(errors.length).toBeGreaterThan(0)
      })
      it('set a RegulatorAnswer for a RegulatorQuestion with liked as answer', async () => {
        const query = setAnswerMutation(
          getSeedID(questions[9]),
          { liked: true },
        )
        const { data, errors } = await authRequest(query, jwt)

        expect(data).toBeNull()
        expect(errors.length).toBeGreaterThan(0)
      })
      it('set a RegulatorAnswer for a RegulatorQuestion with choice as answer', async () => {
        const query = setAnswerMutation(
          getSeedID(questions[9]),
          { choice: getSeedID(questions[8].choices[0]) },
        )
        const { data, errors } = await authRequest(query, jwt)

        expect(data).toBeNull()
        expect(errors.length).toBeGreaterThan(0)
      })
      it('set a RegulatorAnswer for a RegulatorQuestion with favoriteItem as answer', async () => {
        const query = setAnswerMutation(
          getSeedID(questions[9]),
          { favoriteItem: getSeedID(questions[8].items[0]) },
        )
        const { data, errors } = await authRequest(query, jwt)

        expect(data).toBeNull()
        expect(errors.length).toBeGreaterThan(0)
      })
      it('set a RegulatorAnswer for a RegulatorQuestion with rankedItems as answer', async () => {
        const query = setAnswerMutation(
          getSeedID(questions[9]),
          { rankedItems: [
            getSeedID(questions[8].items[2]),
            getSeedID(questions[8].items[1]),
            getSeedID(questions[8].items[0]),
          ] },
        )
        const { data, errors } = await authRequest(query, jwt)

        expect(data).toBeNull()
        expect(errors.length).toBeGreaterThan(0)
      })
      it('set a FavoriteAnswer for a FavoriteQuestion with more than the favoriteItem attribute', async () => {
        const query = setAnswerMutation(
          getSeedID(questions[10]),
          { liked: true, favoriteItem: getSeedID(questions[10].items[0]) },
        )
        const { data, errors } = await authRequest(query, jwt)

        expect(data).toBeNull()
        expect(errors.length).toBeGreaterThan(0)
      })
      it('set a FavoriteAnswer for a FavoriteQuestion with an item from another question', async () => {
        const query = setAnswerMutation(
          getSeedID(questions[10]),
          { favoriteItem: getSeedID(questions[11].items[0]) },
        )
        const { data, errors } = await authRequest(query, jwt)

        expect(data).toBeNull()
        expect(errors.length).toBeGreaterThan(0)
      })
      it('set a FavoriteAnswer for a FavoriteQuestion with liked as answer', async () => {
        const query = setAnswerMutation(
          getSeedID(questions[10]),
          { liked: true },
        )
        const { data, errors } = await authRequest(query, jwt)

        expect(data).toBeNull()
        expect(errors.length).toBeGreaterThan(0)
      })
      it('set a FavoriteAnswer for a FavoriteQuestion with choice as answer', async () => {
        const query = setAnswerMutation(
          getSeedID(questions[10]),
          { choice: getSeedID(questions[8].choices[0]) },
        )
        const { data, errors } = await authRequest(query, jwt)

        expect(data).toBeNull()
        expect(errors.length).toBeGreaterThan(0)
      })
      it('set a FavoriteAnswer for a FavoriteQuestion with rating as answer', async () => {
        const query = setAnswerMutation(
          getSeedID(questions[10]),
          { rating: 3 },
        )
        const { data, errors } = await authRequest(query, jwt)

        expect(data).toBeNull()
        expect(errors.length).toBeGreaterThan(0)
      })
      it('set a FavoriteAnswer for a FavoriteQuestion with rankedItems as answer', async () => {
        const query = setAnswerMutation(
          getSeedID(questions[10]),
          { rankedItems: [
            getSeedID(questions[10].items[4]),
            getSeedID(questions[10].items[3]),
            getSeedID(questions[10].items[2]),
            getSeedID(questions[10].items[1]),
            getSeedID(questions[10].items[0]),
          ] },
        )
        const { data, errors } = await authRequest(query, jwt)

        expect(data).toBeNull()
        expect(errors.length).toBeGreaterThan(0)
      })
      it('set a RankingAnswer for a RankingQuestion with more than the rankedItems attribute', async () => {
        const query = setAnswerMutation(
          getSeedID(questions[11]),
          { liked: true, rankedItems: [
            getSeedID(questions[11].items[3]),
            getSeedID(questions[11].items[2]),
            getSeedID(questions[11].items[1]),
            getSeedID(questions[11].items[0]),
          ] },
        )
        const { data, errors } = await authRequest(query, jwt)

        expect(data).toBeNull()
        expect(errors.length).toBeGreaterThan(0)
      })
      it('set a RankingAnswer for a RankingQuestion with missing item', async () => {
        const query = setAnswerMutation(
          getSeedID(questions[11]),
          { rankedItems: [
            getSeedID(questions[11].items[2]),
            getSeedID(questions[11].items[1]),
            getSeedID(questions[11].items[0]),
          ] },
        )
        const { data, errors } = await authRequest(query, jwt)

        expect(data).toBeNull()
        expect(errors.length).toBeGreaterThan(0)
      })
      it('set a RankingAnswer for a RankingQuestion with a bonus item from another question', async () => {
        const query = setAnswerMutation(
          getSeedID(questions[11]),
          { rankedItems: [
            getSeedID(questions[10].items[0]),
            getSeedID(questions[11].items[3]),
            getSeedID(questions[11].items[2]),
            getSeedID(questions[11].items[1]),
            getSeedID(questions[11].items[0]),
          ] },
        )
        const { data, errors } = await authRequest(query, jwt)

        expect(data).toBeNull()
        expect(errors.length).toBeGreaterThan(0)
      })
      it('set a RankingAnswer for a RankingQuestion with liked as answer', async () => {
        const query = setAnswerMutation(
          getSeedID(questions[11]),
          { liked: true },
        )
        const { data, errors } = await authRequest(query, jwt)

        expect(data).toBeNull()
        expect(errors.length).toBeGreaterThan(0)
      })
      it('set a RankingAnswer for a RankingQuestion with choice as answer', async () => {
        const query = setAnswerMutation(
          getSeedID(questions[11]),
          { choice: getSeedID(questions[8].choices[0]) },
        )
        const { data, errors } = await authRequest(query, jwt)

        expect(data).toBeNull()
        expect(errors.length).toBeGreaterThan(0)
      })
      it('set a RankingAnswer for a RankingQuestion with rating as answer', async () => {
        const query = setAnswerMutation(
          getSeedID(questions[11]),
          { rating: 3 },
        )
        const { data, errors } = await authRequest(query, jwt)

        expect(data).toBeNull()
        expect(errors.length).toBeGreaterThan(0)
      })
      it('set a RankingAnswer for a RankingQuestion with favoriteItem as answer', async () => {
        const query = setAnswerMutation(
          getSeedID(questions[11]),
          { favoriteItem: getSeedID(questions[11].items[0]) },
        )
        const { data, errors } = await authRequest(query, jwt)

        expect(data).toBeNull()
        expect(errors.length).toBeGreaterThan(0)
      })
    })
  })

  describe('that is temporary', () => {
    const admin = users[1]
    const client = clients[4]
    let jwt = ''

    beforeEach(async () => {
      await seeder.import(collections)

      jwt = getClientToken(client, TEMPORARY)
    })

    describe('should', async () => {
      it('get amount of votes of a connected survey', async () => {
        const query = voteAmountQuery(getSeedID(surveys[1]))
        const { data, errors } = await authRequest(query, jwt)

        expect(errors).toBeUndefined()
        expect(data.voteAmount).toBe(5)
      })
      it('get current votes of a connected survey', async () => {
        const query = votesQuery(getSeedID(surveys[1]))
        const { data, errors } = await authRequest(query, jwt)

        expect(errors).toBeUndefined()
        expect(data.votes).toMatchSnapshot()
      })
      it('get 0 as amount of votes of a not connected survey', async () => {
        const query = voteAmountQuery(getSeedID(surveys[0]))
        const { data, errors } = await authRequest(query, jwt)

        expect(errors).toBeUndefined()
        expect(data.voteAmount).toBe(0)
      })
      it('set a LikeAnswer for a LikeQuestion of a connected survey', async () => {
        const query = setAnswerMutation(getSeedID(questions[6]), { liked: true })
        const { data, errors } = await authRequest(query, jwt)

        expect(errors).toBeUndefined()
        expect(data).toMatchSnapshot()
      })
      it('set a LikeDislikeAnswer for a LikeDislikeQuestion of any not owned survey', async () => {
        const query = setAnswerMutation(getSeedID(questions[7]), { liked: true })
        const { data, errors } = await authRequest(query, jwt)

        expect(errors).toBeUndefined()
        expect(data).toMatchSnapshot()
      })
      it('set a ChoiceAnswer for a ChoiceQuestion of any not owned survey', async () => {
        const query = setAnswerMutation(
          getSeedID(questions[8]),
          { choice: getSeedID(questions[8].choices[0]) },
        )
        const { data, errors } = await authRequest(query, jwt)

        expect(errors).toBeUndefined()
        expect(data).toMatchSnapshot()
      })
      it('set a RegulatorAnswer for a RegulatorQuestion of any not owned survey', async () => {
        const query = setAnswerMutation(
          getSeedID(questions[9]),
          { rating: 4 },
        )
        const { data, errors } = await authRequest(query, jwt)

        expect(errors).toBeUndefined()
        expect(data).toMatchSnapshot()
      })
      it('set a FavoriteAnswer for a FavoriteQuestion of any not owned survey', async () => {
        const query = setAnswerMutation(
          getSeedID(questions[10]),
          { favoriteItem: getSeedID(questions[10].items[0]) },
        )
        const { data, errors } = await authRequest(query, jwt)

        expect(errors).toBeUndefined()
        expect(data).toMatchSnapshot()
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

        expect(errors).toBeUndefined()
        expect(data).toMatchSnapshot()
      })
      it('remove an answer for a question of any not owned survey', async () => {
        const setQuery = setAnswerMutation(getSeedID(questions[6]), { liked: true })
        const { errors: setErrors } = await authRequest(setQuery, jwt)

        expect(setErrors).toBeUndefined()

        const query = removeAnswerMutation(getSeedID(questions[6]))
        const { data, errors } = await authRequest(query, jwt)

        expect(errors).toBeUndefined()
        expect(data.removeAnswer.success).toBe(true)
      })
      it('create vote after all answers where provided', async () => {
        const likeQuery = setAnswerMutation(getSeedID(questions[6]), { liked: true })
        const { data: likeData, errors: likeErrors } = await authRequest(likeQuery, jwt)

        expect(likeErrors).toBeUndefined()
        expect(likeData.setAnswer.voteCreated).toBe(false)

        const dislikeQuery = setAnswerMutation(getSeedID(questions[7]), { liked: true })
        const { data: dislikeData, errors: dislikeErrors } = await authRequest(dislikeQuery, jwt)

        expect(dislikeErrors).toBeUndefined()
        expect(dislikeData.setAnswer.voteCreated).toBe(false)

        const choiceQuery = setAnswerMutation(
          getSeedID(questions[8]),
          { choice: getSeedID(questions[8].choices[0]) },
        )
        const { data: choiceData, errors: choiceErrors } = await authRequest(choiceQuery, jwt)

        expect(choiceErrors).toBeUndefined()
        expect(choiceData.setAnswer.voteCreated).toBe(false)

        const regulatorQuery = setAnswerMutation(
          getSeedID(questions[9]),
          { rating: 4 },
        )
        const { data: regulatorData, errors: regulatorErrors } = await authRequest(regulatorQuery, jwt)

        expect(regulatorErrors).toBeUndefined()
        expect(regulatorData.setAnswer.voteCreated).toBe(false)

        const favoriteQuery = setAnswerMutation(
          getSeedID(questions[10]),
          { favoriteItem: getSeedID(questions[10].items[0]) },
        )
        const { data: favoriteData, errors: favoriteErrors } = await authRequest(favoriteQuery, jwt)

        expect(favoriteErrors).toBeUndefined()
        expect(favoriteData.setAnswer.voteCreated).toBe(false)

        const rankingQuery = setAnswerMutation(
          getSeedID(questions[11]),
          { rankedItems: [
            getSeedID(questions[11].items[3]),
            getSeedID(questions[11].items[1]),
            getSeedID(questions[11].items[0]),
            getSeedID(questions[11].items[2]),
          ] },
        )
        const { data: rankingData, errors: rankingErrors } = await authRequest(rankingQuery, jwt)

        expect(rankingErrors).toBeUndefined()
        expect(rankingData.setAnswer.voteCreated).toBe(true)

        const adminQuery = loginUserMutation(admin.email, 'password')
        const { data: adminData, errors: adminErrors } = await unauthRequest(adminQuery)

        expect(adminData.login).not.toBeNull()
        expect(adminErrors).toBeUndefined()

        const { login: { token: adminToken } } = adminData

        const query = votesQuery(getSeedID(surveys[1]))
        const { data, errors } = await authRequest(query, adminToken)

        expect(errors).toBeUndefined()
        expect(data.votes).toMatchSnapshot()
      })
      it('be deleted after creating a vote', async () => {
        const likeQuery = setAnswerMutation(getSeedID(questions[6]), { liked: true })
        const { data: likeData, errors: likeErrors } = await authRequest(likeQuery, jwt)

        expect(likeErrors).toBeUndefined()
        expect(likeData.setAnswer.voteCreated).toBe(false)

        const dislikeQuery = setAnswerMutation(getSeedID(questions[7]), { liked: true })
        const { data: dislikeData, errors: dislikeErrors } = await authRequest(dislikeQuery, jwt)

        expect(dislikeErrors).toBeUndefined()
        expect(dislikeData.setAnswer.voteCreated).toBe(false)

        const choiceQuery = setAnswerMutation(
          getSeedID(questions[8]),
          { choice: getSeedID(questions[8].choices[0]) },
        )
        const { data: choiceData, errors: choiceErrors } = await authRequest(choiceQuery, jwt)

        expect(choiceErrors).toBeUndefined()
        expect(choiceData.setAnswer.voteCreated).toBe(false)

        const regulatorQuery = setAnswerMutation(
          getSeedID(questions[9]),
          { rating: 4 },
        )
        const { data: regulatorData, errors: regulatorErrors } = await authRequest(regulatorQuery, jwt)

        expect(regulatorErrors).toBeUndefined()
        expect(regulatorData.setAnswer.voteCreated).toBe(false)

        const favoriteQuery = setAnswerMutation(
          getSeedID(questions[10]),
          { favoriteItem: getSeedID(questions[10].items[0]) },
        )
        const { data: favoriteData, errors: favoriteErrors } = await authRequest(favoriteQuery, jwt)

        expect(favoriteErrors).toBeUndefined()
        expect(favoriteData.setAnswer.voteCreated).toBe(false)

        const rankingQuery = setAnswerMutation(
          getSeedID(questions[11]),
          { rankedItems: [
            getSeedID(questions[11].items[3]),
            getSeedID(questions[11].items[1]),
            getSeedID(questions[11].items[0]),
            getSeedID(questions[11].items[2]),
          ] },
        )
        const { data: rankingData, errors: rankingErrors } = await authRequest(rankingQuery, jwt)

        expect(rankingErrors).toBeUndefined()
        expect(rankingData.setAnswer.voteCreated).toBe(true)

        const adminQuery = loginUserMutation(admin.email, 'password')
        const { data: adminData, errors: adminErrors } = await unauthRequest(adminQuery)

        expect(adminData.login).not.toBeNull()
        expect(adminErrors).toBeUndefined()

        const { login: { token: adminToken } } = adminData

        const query = clientQuery(getSeedID(clients[4]))
        const { data, errors } = await authRequest(query, adminToken)

        expect(data).toBeNull()
        expect(errors.length).toBeGreaterThan(0)
      })
      it('reset already given answer on second call', async () => {
        const likeQuery = setAnswerMutation(getSeedID(questions[6]), { liked: true })
        const { data: likeData, errors: likeErrors } = await authRequest(likeQuery, jwt)

        expect(likeErrors).toBeUndefined()
        expect(likeData.setAnswer.voteCreated).toBe(false)

        const like2Query = setAnswerMutation(getSeedID(questions[6]), { liked: false })
        const { data: like2Data, errors: like2Errors } = await authRequest(like2Query, jwt)

        expect(like2Errors).toBeUndefined()
        expect(like2Data.setAnswer.voteCreated).toBe(false)

        const dislikeQuery = setAnswerMutation(getSeedID(questions[7]), { liked: true })
        const { data: dislikeData, errors: dislikeErrors } = await authRequest(dislikeQuery, jwt)

        expect(dislikeErrors).toBeUndefined()
        expect(dislikeData.setAnswer.voteCreated).toBe(false)

        const choiceQuery = setAnswerMutation(
          getSeedID(questions[8]),
          { choice: getSeedID(questions[8].choices[0]) },
        )
        const { data: choiceData, errors: choiceErrors } = await authRequest(choiceQuery, jwt)

        expect(choiceErrors).toBeUndefined()
        expect(choiceData.setAnswer.voteCreated).toBe(false)

        const regulatorQuery = setAnswerMutation(
          getSeedID(questions[9]),
          { rating: 4 },
        )
        const { data: regulatorData, errors: regulatorErrors } = await authRequest(regulatorQuery, jwt)

        expect(regulatorErrors).toBeUndefined()
        expect(regulatorData.setAnswer.voteCreated).toBe(false)

        const favoriteQuery = setAnswerMutation(
          getSeedID(questions[10]),
          { favoriteItem: getSeedID(questions[10].items[0]) },
        )
        const { data: favoriteData, errors: favoriteErrors } = await authRequest(favoriteQuery, jwt)

        expect(favoriteErrors).toBeUndefined()
        expect(favoriteData.setAnswer.voteCreated).toBe(false)

        const favorite2Query = setAnswerMutation(
          getSeedID(questions[10]),
          { favoriteItem: getSeedID(questions[10].items[1]) },
        )
        const { data: favorite2Data, errors: favorite2Errors } = await authRequest(favorite2Query, jwt)

        expect(favorite2Errors).toBeUndefined()
        expect(favorite2Data.setAnswer.voteCreated).toBe(false)

        const rankingQuery = setAnswerMutation(
          getSeedID(questions[11]),
          { rankedItems: [
            getSeedID(questions[11].items[3]),
            getSeedID(questions[11].items[1]),
            getSeedID(questions[11].items[0]),
            getSeedID(questions[11].items[2]),
          ] },
        )
        const { data: rankingData, errors: rankingErrors } = await authRequest(rankingQuery, jwt)

        expect(rankingErrors).toBeUndefined()
        expect(rankingData.setAnswer.voteCreated).toBe(true)

        const adminQuery = loginUserMutation(admin.email, 'password')
        const { data: adminData, errors: adminErrors } = await unauthRequest(adminQuery)

        expect(adminData.login).not.toBeNull()
        expect(adminErrors).toBeUndefined()

        const { login: { token: adminToken } } = adminData

        const query = votesQuery(getSeedID(surveys[1]))
        const { data, errors } = await authRequest(query, adminToken)

        expect(errors).toBeUndefined()
        expect(data.votes).toMatchSnapshot()
      })
      it('create vote and update results', async () => {
        const likeQuery = setAnswerMutation(getSeedID(questions[6]), { liked: true })
        const { data: likeData, errors: likeErrors } = await authRequest(likeQuery, jwt)

        expect(likeErrors).toBeUndefined()
        expect(likeData.setAnswer.voteCreated).toBe(false)

        const dislikeQuery = setAnswerMutation(getSeedID(questions[7]), { liked: true })
        const { data: dislikeData, errors: dislikeErrors } = await authRequest(dislikeQuery, jwt)

        expect(dislikeErrors).toBeUndefined()
        expect(dislikeData.setAnswer.voteCreated).toBe(false)

        const choiceQuery = setAnswerMutation(
          getSeedID(questions[8]),
          { choice: getSeedID(questions[8].choices[0]) },
        )
        const { data: choiceData, errors: choiceErrors } = await authRequest(choiceQuery, jwt)

        expect(choiceErrors).toBeUndefined()
        expect(choiceData.setAnswer.voteCreated).toBe(false)

        const regulatorQuery = setAnswerMutation(
          getSeedID(questions[9]),
          { rating: 4 },
        )
        const { data: regulatorData, errors: regulatorErrors } = await authRequest(regulatorQuery, jwt)

        expect(regulatorErrors).toBeUndefined()
        expect(regulatorData.setAnswer.voteCreated).toBe(false)

        const favoriteQuery = setAnswerMutation(
          getSeedID(questions[10]),
          { favoriteItem: getSeedID(questions[10].items[0]) },
        )
        const { data: favoriteData, errors: favoriteErrors } = await authRequest(favoriteQuery, jwt)

        expect(favoriteErrors).toBeUndefined()
        expect(favoriteData.setAnswer.voteCreated).toBe(false)

        const rankingQuery = setAnswerMutation(
          getSeedID(questions[11]),
          { rankedItems: [
            getSeedID(questions[11].items[3]),
            getSeedID(questions[11].items[1]),
            getSeedID(questions[11].items[0]),
            getSeedID(questions[11].items[2]),
          ] },
        )
        const { data: rankingData, errors: rankingErrors } = await authRequest(rankingQuery, jwt)

        expect(rankingErrors).toBeUndefined()
        expect(rankingData.setAnswer.voteCreated).toBe(true)

        const adminQuery = loginUserMutation(admin.email, 'password')
        const { data: adminData, errors: adminErrors } = await unauthRequest(adminQuery)

        expect(adminData.login).not.toBeNull()
        expect(adminErrors).toBeUndefined()

        const { login: { token: adminToken } } = adminData

        const query = surveyQuery(getSeedID(surveys[1]))
        const { data, errors } = await authRequest(query, adminToken)

        expect(errors).toBeUndefined()
        expect(data).toMatchSnapshot()
      })
      it('be able to answer all questions with null (neutral) and still create a vote', async () => {
        const likeQuery = setAnswerMutation(getSeedID(questions[6]), { liked: null })
        const { data: likeData, errors: likeErrors } = await authRequest(likeQuery, jwt)

        expect(likeErrors).toBeUndefined()
        expect(likeData.setAnswer.voteCreated).toBe(false)

        const dislikeQuery = setAnswerMutation(getSeedID(questions[7]), { liked: null })
        const { data: dislikeData, errors: dislikeErrors } = await authRequest(dislikeQuery, jwt)

        expect(dislikeErrors).toBeUndefined()
        expect(dislikeData.setAnswer.voteCreated).toBe(false)

        const choiceQuery = setAnswerMutation(
          getSeedID(questions[8]),
          { choice: null },
        )
        const { data: choiceData, errors: choiceErrors } = await authRequest(choiceQuery, jwt)

        expect(choiceErrors).toBeUndefined()
        expect(choiceData.setAnswer.voteCreated).toBe(false)

        const regulatorQuery = setAnswerMutation(
          getSeedID(questions[9]),
          { rating: null },
        )
        const { data: regulatorData, errors: regulatorErrors } = await authRequest(regulatorQuery, jwt)

        expect(regulatorErrors).toBeUndefined()
        expect(regulatorData.setAnswer.voteCreated).toBe(false)

        const favoriteQuery = setAnswerMutation(
          getSeedID(questions[10]),
          { favoriteItem: null },
        )
        const { data: favoriteData, errors: favoriteErrors } = await authRequest(favoriteQuery, jwt)

        expect(favoriteErrors).toBeUndefined()
        expect(favoriteData.setAnswer.voteCreated).toBe(false)

        const rankingQuery = setAnswerMutation(
          getSeedID(questions[11]),
          { rankedItems: null },
        )
        const { data: rankingData, errors: rankingErrors } = await authRequest(rankingQuery, jwt)

        expect(rankingErrors).toBeUndefined()
        expect(rankingData.setAnswer.voteCreated).toBe(true)
      })
    })

    describe('should not', async () => {
      it('be able to answer again after creating vote', async () => {
        const likeQuery = setAnswerMutation(getSeedID(questions[6]), { liked: true })
        const { data: likeData, errors: likeErrors } = await authRequest(likeQuery, jwt)

        expect(likeErrors).toBeUndefined()
        expect(likeData.setAnswer.voteCreated).toBe(false)

        const dislikeQuery = setAnswerMutation(getSeedID(questions[7]), { liked: true })
        const { data: dislikeData, errors: dislikeErrors } = await authRequest(dislikeQuery, jwt)

        expect(dislikeErrors).toBeUndefined()
        expect(dislikeData.setAnswer.voteCreated).toBe(false)

        const choiceQuery = setAnswerMutation(
          getSeedID(questions[8]),
          { choice: getSeedID(questions[8].choices[0]) },
        )
        const { data: choiceData, errors: choiceErrors } = await authRequest(choiceQuery, jwt)

        expect(choiceErrors).toBeUndefined()
        expect(choiceData.setAnswer.voteCreated).toBe(false)

        const regulatorQuery = setAnswerMutation(
          getSeedID(questions[9]),
          { rating: 4 },
        )
        const { data: regulatorData, errors: regulatorErrors } = await authRequest(regulatorQuery, jwt)

        expect(regulatorErrors).toBeUndefined()
        expect(regulatorData.setAnswer.voteCreated).toBe(false)

        const favoriteQuery = setAnswerMutation(
          getSeedID(questions[10]),
          { favoriteItem: getSeedID(questions[10].items[0]) },
        )
        const { data: favoriteData, errors: favoriteErrors } = await authRequest(favoriteQuery, jwt)

        expect(favoriteErrors).toBeUndefined()
        expect(favoriteData.setAnswer.voteCreated).toBe(false)

        const rankingQuery = setAnswerMutation(
          getSeedID(questions[11]),
          { rankedItems: [
            getSeedID(questions[11].items[3]),
            getSeedID(questions[11].items[1]),
            getSeedID(questions[11].items[0]),
            getSeedID(questions[11].items[2]),
          ] },
        )
        const { data: rankingData, errors: rankingErrors } = await authRequest(rankingQuery, jwt)

        expect(rankingErrors).toBeUndefined()
        expect(rankingData.setAnswer.voteCreated).toBe(true)

        await promiseTimeout()

        const { data, errors } = await authRequest(likeQuery, jwt)

        expect(data).toBeNull()
        expect(errors.length).toBeGreaterThan(0)
      })
      it('get current votes of any not owned survey', async () => {
        const query = votesQuery(getSeedID(surveys[0]))
        const { data, errors } = await authRequest(query, jwt)

        expect(data.votes).toBeNull()
        expect(errors.length).toBeGreaterThan(0)
      })
      it('set a LikeAnswer for a LikeQuestion of any not connected survey', async () => {
        const query = setAnswerMutation(getSeedID(questions[0]), { liked: true })
        const { data, errors } = await authRequest(query, jwt)

        expect(data).toBeNull()
        expect(errors.length).toBeGreaterThan(0)
      })
      it('set a LikeDislikeAnswer for a LikeDislikeQuestion of any not connected survey', async () => {
        const query = setAnswerMutation(getSeedID(questions[1]), { liked: true })
        const { data, errors } = await authRequest(query, jwt)

        expect(data).toBeNull()
        expect(errors.length).toBeGreaterThan(0)
      })
      it('set a ChoiceAnswer for a ChoiceQuestion of any not connected survey', async () => {
        const query = setAnswerMutation(
          getSeedID(questions[2]),
          { choice: getSeedID(questions[2].choices[0]) },
        )
        const { data, errors } = await authRequest(query, jwt)

        expect(data).toBeNull()
        expect(errors.length).toBeGreaterThan(0)
      })
      it('set a RegulatorAnswer for a RegulatorQuestion of any not connected survey', async () => {
        const query = setAnswerMutation(
          getSeedID(questions[3]),
          { rating: 4 },
        )
        const { data, errors } = await authRequest(query, jwt)

        expect(data).toBeNull()
        expect(errors.length).toBeGreaterThan(0)
      })
      it('set a FavoriteAnswer for a FavoriteQuestion of any not connected survey', async () => {
        const query = setAnswerMutation(
          getSeedID(questions[4]),
          { favoriteItem: getSeedID(questions[4].items[0]) },
        )
        const { data, errors } = await authRequest(query, jwt)

        expect(data).toBeNull()
        expect(errors.length).toBeGreaterThan(0)
      })
      it('set a RankingAnswer for a RankingQuestion of any not connected survey', async () => {
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
      it('set a LikeAnswer for a LikeQuestion with more than the liked attribute', async () => {
        const query = setAnswerMutation(
          getSeedID(questions[6]),
          { liked: true, choice: getSeedID(questions[8].choices[0]) },
        )
        const { data, errors } = await authRequest(query, jwt)

        expect(data).toBeNull()
        expect(errors.length).toBeGreaterThan(0)
      })
      it('set a LikeAnswer for a LikeQuestion with choice as answer', async () => {
        const query = setAnswerMutation(
          getSeedID(questions[6]),
          { choice: getSeedID(questions[8].choices[0]) },
        )
        const { data, errors } = await authRequest(query, jwt)

        expect(data).toBeNull()
        expect(errors.length).toBeGreaterThan(0)
      })
      it('set a LikeAnswer for a LikeQuestion with rating as answer', async () => {
        const query = setAnswerMutation(
          getSeedID(questions[6]),
          { rating: 3 },
        )
        const { data, errors } = await authRequest(query, jwt)

        expect(data).toBeNull()
        expect(errors.length).toBeGreaterThan(0)
      })
      it('set a LikeAnswer for a LikeQuestion with favoriteItem as answer', async () => {
        const query = setAnswerMutation(
          getSeedID(questions[6]),
          { favoriteItem: getSeedID(questions[6].items[0]) },
        )
        const { data, errors } = await authRequest(query, jwt)

        expect(data).toBeNull()
        expect(errors.length).toBeGreaterThan(0)
      })
      it('set a LikeAnswer for a LikeQuestion with rankedItems as answer', async () => {
        const query = setAnswerMutation(
          getSeedID(questions[6]),
          { rankedItems: [
            getSeedID(questions[6].items[0]),
          ] },
        )
        const { data, errors } = await authRequest(query, jwt)

        expect(data).toBeNull()
        expect(errors.length).toBeGreaterThan(0)
      })
      it('set a LikeDislikeAnswer for a LikeDislikeQuestion with more than the liked attribute', async () => {
        const query = setAnswerMutation(
          getSeedID(questions[7]),
          { liked: true, choice: getSeedID(questions[8].choices[0]) },
        )
        const { data, errors } = await authRequest(query, jwt)

        expect(data).toBeNull()
        expect(errors.length).toBeGreaterThan(0)
      })
      it('set a LikeDislikeAnswer for a LikeDislikeQuestion with choice as answer', async () => {
        const query = setAnswerMutation(
          getSeedID(questions[7]),
          { choice: getSeedID(questions[8].choices[0]) },
        )
        const { data, errors } = await authRequest(query, jwt)

        expect(data).toBeNull()
        expect(errors.length).toBeGreaterThan(0)
      })
      it('set a LikeDislikeAnswer for a LikeDislikeQuestion with rating as answer', async () => {
        const query = setAnswerMutation(
          getSeedID(questions[7]),
          { rating: 3 },
        )
        const { data, errors } = await authRequest(query, jwt)

        expect(data).toBeNull()
        expect(errors.length).toBeGreaterThan(0)
      })
      it('set a LikeDislikeAnswer for a LikeDislikeQuestion with favoriteItem as answer', async () => {
        const query = setAnswerMutation(
          getSeedID(questions[7]),
          { favoriteItem: getSeedID(questions[7].items[0]) },
        )
        const { data, errors } = await authRequest(query, jwt)

        expect(data).toBeNull()
        expect(errors.length).toBeGreaterThan(0)
      })
      it('set a LikeDislikeAnswer for a LikeDislikeQuestion with rankedItems as answer', async () => {
        const query = setAnswerMutation(
          getSeedID(questions[7]),
          { rankedItems: [
            getSeedID(questions[7].items[0]),
          ] },
        )
        const { data, errors } = await authRequest(query, jwt)

        expect(data).toBeNull()
        expect(errors.length).toBeGreaterThan(0)
      })
      it('set a ChoiceAnswer for a ChoiceQuestion with more than the choice attribute', async () => {
        const query = setAnswerMutation(
          getSeedID(questions[8]),
          { liked: true, choice: getSeedID(questions[8].choices[0]) },
        )
        const { data, errors } = await authRequest(query, jwt)

        expect(data).toBeNull()
        expect(errors.length).toBeGreaterThan(0)
      })
      it('set a ChoiceAnswer for a ChoiceQuestion with a choice from another question', async () => {
        const query = setAnswerMutation(
          getSeedID(questions[8]),
          { choice: getSeedID(questions[2].choices[0]) },
        )
        const { data, errors } = await authRequest(query, jwt)

        expect(data).toBeNull()
        expect(errors.length).toBeGreaterThan(0)
      })
      it('set a ChoiceAnswer for a ChoiceQuestion with liked as answer', async () => {
        const query = setAnswerMutation(
          getSeedID(questions[8]),
          { liked: true },
        )
        const { data, errors } = await authRequest(query, jwt)

        expect(data).toBeNull()
        expect(errors.length).toBeGreaterThan(0)
      })
      it('set a ChoiceAnswer for a ChoiceQuestion with rating as answer', async () => {
        const query = setAnswerMutation(
          getSeedID(questions[8]),
          { rating: 3 },
        )
        const { data, errors } = await authRequest(query, jwt)

        expect(data).toBeNull()
        expect(errors.length).toBeGreaterThan(0)
      })
      it('set a ChoiceAnswer for a ChoiceQuestion with favoriteItem as answer', async () => {
        const query = setAnswerMutation(
          getSeedID(questions[8]),
          { favoriteItem: getSeedID(questions[8].items[0]) },
        )
        const { data, errors } = await authRequest(query, jwt)

        expect(data).toBeNull()
        expect(errors.length).toBeGreaterThan(0)
      })
      it('set a ChoiceAnswer for a ChoiceQuestion with rankedItems as answer', async () => {
        const query = setAnswerMutation(
          getSeedID(questions[8]),
          { rankedItems: [
            getSeedID(questions[8].items[2]),
            getSeedID(questions[8].items[1]),
            getSeedID(questions[8].items[0]),
          ] },
        )
        const { data, errors } = await authRequest(query, jwt)

        expect(data).toBeNull()
        expect(errors.length).toBeGreaterThan(0)
      })
      it('set a RegulatorAnswer for a RegulatorQuestion with more than the rating attribute', async () => {
        const query = setAnswerMutation(
          getSeedID(questions[9]),
          { liked: true, rating: 3 },
        )
        const { data, errors } = await authRequest(query, jwt)

        expect(data).toBeNull()
        expect(errors.length).toBeGreaterThan(0)
      })
      it('set a RegulatorAnswer for a RegulatorQuestion with a value that is greater than the maximum', async () => {
        const query = setAnswerMutation(
          getSeedID(questions[9]),
          { rating: 20 },
        )
        const { data, errors } = await authRequest(query, jwt)

        expect(data).toBeNull()
        expect(errors.length).toBeGreaterThan(0)
      })
      it('set a RegulatorAnswer for a RegulatorQuestion with a value that is smaller than the minimum', async () => {
        const query = setAnswerMutation(
          getSeedID(questions[9]),
          { rating: -10 },
        )
        const { data, errors } = await authRequest(query, jwt)

        expect(data).toBeNull()
        expect(errors.length).toBeGreaterThan(0)
      })
      it('set a RegulatorAnswer for a RegulatorQuestion with liked as answer', async () => {
        const query = setAnswerMutation(
          getSeedID(questions[9]),
          { liked: true },
        )
        const { data, errors } = await authRequest(query, jwt)

        expect(data).toBeNull()
        expect(errors.length).toBeGreaterThan(0)
      })
      it('set a RegulatorAnswer for a RegulatorQuestion with choice as answer', async () => {
        const query = setAnswerMutation(
          getSeedID(questions[9]),
          { choice: getSeedID(questions[8].choices[0]) },
        )
        const { data, errors } = await authRequest(query, jwt)

        expect(data).toBeNull()
        expect(errors.length).toBeGreaterThan(0)
      })
      it('set a RegulatorAnswer for a RegulatorQuestion with favoriteItem as answer', async () => {
        const query = setAnswerMutation(
          getSeedID(questions[9]),
          { favoriteItem: getSeedID(questions[8].items[0]) },
        )
        const { data, errors } = await authRequest(query, jwt)

        expect(data).toBeNull()
        expect(errors.length).toBeGreaterThan(0)
      })
      it('set a RegulatorAnswer for a RegulatorQuestion with rankedItems as answer', async () => {
        const query = setAnswerMutation(
          getSeedID(questions[9]),
          { rankedItems: [
            getSeedID(questions[8].items[2]),
            getSeedID(questions[8].items[1]),
            getSeedID(questions[8].items[0]),
          ] },
        )
        const { data, errors } = await authRequest(query, jwt)

        expect(data).toBeNull()
        expect(errors.length).toBeGreaterThan(0)
      })
      it('set a FavoriteAnswer for a FavoriteQuestion with more than the favoriteItem attribute', async () => {
        const query = setAnswerMutation(
          getSeedID(questions[10]),
          { liked: true, favoriteItem: getSeedID(questions[10].items[0]) },
        )
        const { data, errors } = await authRequest(query, jwt)

        expect(data).toBeNull()
        expect(errors.length).toBeGreaterThan(0)
      })
      it('set a FavoriteAnswer for a FavoriteQuestion with an item from another question', async () => {
        const query = setAnswerMutation(
          getSeedID(questions[10]),
          { favoriteItem: getSeedID(questions[11].items[0]) },
        )
        const { data, errors } = await authRequest(query, jwt)

        expect(data).toBeNull()
        expect(errors.length).toBeGreaterThan(0)
      })
      it('set a FavoriteAnswer for a FavoriteQuestion with liked as answer', async () => {
        const query = setAnswerMutation(
          getSeedID(questions[10]),
          { liked: true },
        )
        const { data, errors } = await authRequest(query, jwt)

        expect(data).toBeNull()
        expect(errors.length).toBeGreaterThan(0)
      })
      it('set a FavoriteAnswer for a FavoriteQuestion with choice as answer', async () => {
        const query = setAnswerMutation(
          getSeedID(questions[10]),
          { choice: getSeedID(questions[8].choices[0]) },
        )
        const { data, errors } = await authRequest(query, jwt)

        expect(data).toBeNull()
        expect(errors.length).toBeGreaterThan(0)
      })
      it('set a FavoriteAnswer for a FavoriteQuestion with rating as answer', async () => {
        const query = setAnswerMutation(
          getSeedID(questions[10]),
          { rating: 3 },
        )
        const { data, errors } = await authRequest(query, jwt)

        expect(data).toBeNull()
        expect(errors.length).toBeGreaterThan(0)
      })
      it('set a FavoriteAnswer for a FavoriteQuestion with rankedItems as answer', async () => {
        const query = setAnswerMutation(
          getSeedID(questions[10]),
          { rankedItems: [
            getSeedID(questions[10].items[4]),
            getSeedID(questions[10].items[3]),
            getSeedID(questions[10].items[2]),
            getSeedID(questions[10].items[1]),
            getSeedID(questions[10].items[0]),
          ] },
        )
        const { data, errors } = await authRequest(query, jwt)

        expect(data).toBeNull()
        expect(errors.length).toBeGreaterThan(0)
      })
      it('set a RankingAnswer for a RankingQuestion with more than the rankedItems attribute', async () => {
        const query = setAnswerMutation(
          getSeedID(questions[11]),
          { liked: true, rankedItems: [
            getSeedID(questions[11].items[3]),
            getSeedID(questions[11].items[2]),
            getSeedID(questions[11].items[1]),
            getSeedID(questions[11].items[0]),
          ] },
        )
        const { data, errors } = await authRequest(query, jwt)

        expect(data).toBeNull()
        expect(errors.length).toBeGreaterThan(0)
      })
      it('set a RankingAnswer for a RankingQuestion with missing item', async () => {
        const query = setAnswerMutation(
          getSeedID(questions[11]),
          { rankedItems: [
            getSeedID(questions[11].items[2]),
            getSeedID(questions[11].items[1]),
            getSeedID(questions[11].items[0]),
          ] },
        )
        const { data, errors } = await authRequest(query, jwt)

        expect(data).toBeNull()
        expect(errors.length).toBeGreaterThan(0)
      })
      it('set a RankingAnswer for a RankingQuestion with a bonus item from another question', async () => {
        const query = setAnswerMutation(
          getSeedID(questions[11]),
          { rankedItems: [
            getSeedID(questions[10].items[0]),
            getSeedID(questions[11].items[3]),
            getSeedID(questions[11].items[2]),
            getSeedID(questions[11].items[1]),
            getSeedID(questions[11].items[0]),
          ] },
        )
        const { data, errors } = await authRequest(query, jwt)

        expect(data).toBeNull()
        expect(errors.length).toBeGreaterThan(0)
      })
      it('set a RankingAnswer for a RankingQuestion with liked as answer', async () => {
        const query = setAnswerMutation(
          getSeedID(questions[11]),
          { liked: true },
        )
        const { data, errors } = await authRequest(query, jwt)

        expect(data).toBeNull()
        expect(errors.length).toBeGreaterThan(0)
      })
      it('set a RankingAnswer for a RankingQuestion with choice as answer', async () => {
        const query = setAnswerMutation(
          getSeedID(questions[11]),
          { choice: getSeedID(questions[8].choices[0]) },
        )
        const { data, errors } = await authRequest(query, jwt)

        expect(data).toBeNull()
        expect(errors.length).toBeGreaterThan(0)
      })
      it('set a RankingAnswer for a RankingQuestion with rating as answer', async () => {
        const query = setAnswerMutation(
          getSeedID(questions[11]),
          { rating: 3 },
        )
        const { data, errors } = await authRequest(query, jwt)

        expect(data).toBeNull()
        expect(errors.length).toBeGreaterThan(0)
      })
      it('set a RankingAnswer for a RankingQuestion with favoriteItem as answer', async () => {
        const query = setAnswerMutation(
          getSeedID(questions[11]),
          { favoriteItem: getSeedID(questions[11].items[0]) },
        )
        const { data, errors } = await authRequest(query, jwt)

        expect(data).toBeNull()
        expect(errors.length).toBeGreaterThan(0)
      })
    })
  })
})

