const surveyModel = require('./survey.model')()
const userModel = require('../user/user.model')()
const questionModel = require('../question/question.model')()
const voteModel = require('../vote/vote.model')()
const contextModel = require('../context/context.model')()
const { isUser, userIdIsMatching } = require('../../utils/authUtils')
const idStore = require('../../utils/idStore')
const _ = require('underscore')

module.exports = {
  Mutation: {
    createSurvey: async (parent, args, context, info) => {
      try {
        const { auth } = context.request
        if (!isUser(auth)) { throw new Error('Not authorized or no permissions.') }
        const data = { ...args.data, creator: idStore.getMatchingId(auth.user.id) }
        const survey = await surveyModel.insert(data)
        return {
          survey,
        }
      } catch (e) {
        throw e
      }
    },
  },
  Survey: {
    id: async (parent, args, context, info) => idStore.createHashFromId(parent.id),
    creator: async (parent, args, context, info) => {
      try {
        const { auth } = context.request
        if (!userIdIsMatching(auth, idStore.createHashFromId(parent.creator))) {
          throw new Error('Not authorized or no permissions.')
        }
        return (await userModel.get({ _id: parent.creator }))[0]
      } catch (e) {
        throw e
      }
    },
    types: async (parent, args, context, info) => {
      // TODO: has to be tested when question was implemented
      try {
        const questions = await questionModel.get({ survey: parent.id })
        return (questions.length === 0) ? null : _.uniq((questions).map(question => question.type))
      } catch (e) {
        throw e
      }
    },
    questions: async (parent, args, context, info) => {
      // TODO: has to be tested when question was implemented
      try {
        const questions = await questionModel.get({ survey: parent.id })
        if (questions.length === 0) return null
        /** Convert array of ids to Object with id:index pairs* */
        const sortObj = parent.questions.reduce((acc, id, index) => ({ ...acc, [`${id}`]: index }), {})
        /** Sort questions depending on the former Array of ids * */
        return _.sortBy(questions, question => sortObj[question.id])
      } catch (e) {
        throw e
      }
    },
    votes: async (parent, args, context, info) => {
      // TODO: has to be tested when vote was implemented
      try {
        const votes = await voteModel.get({ survey: parent.id })
        return (votes.length === 0) ? null : votes
      } catch (e) {
        throw e
      }
    },
    contexts: async (parent, args, context, info) => {
      // TODO: has to be tested when context was implemented
      try {
        const contexts = await contextModel.get({ survey: parent.id })
        return (contexts.length === 0) ? null : contexts
      } catch (e) {
        throw e
      }
    },
  },
}
