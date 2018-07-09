const surveyModel = require('./survey.model')()
const userModel = require('../user/user.model')()
const questionModel = require('../question/question.model')()
const voteModel = require('../vote/vote.model')()
const contextModel = require('../context/context.model')()
const imageModel = require('../image/image.model')()
const { isUser, isAdmin, userIdIsMatching } = require('../../utils/authUtils')
const idStore = require('../../utils/idStore')
const _ = require('underscore')

module.exports = {
  Query: {
    surveys: async (parent, args, { request }, info) => {
      try {
        const { auth } = request
        if (!isUser(auth)) { throw new Error('Not authorized or no permissions.') }
        if (isAdmin(auth)) return await surveyModel.get({})
        return await surveyModel.get({ creator: idStore.getMatchingId(auth.user.id) })
      } catch (e) {
        throw e
      }
    },
    survey: async (parent, { surveyID }, { request }, info) => {
      try {
        const { auth } = request
        if (!isUser(auth)) { throw new Error('Not authorized or no permissions.') }
        const [survey] = await surveyModel.get({ _id: idStore.getMatchingId(surveyID) })
        if (!userIdIsMatching(auth, idStore.createHashFromId(survey.creator))) { throw new Error('Not authorized or no permissions.') }
        return survey
      } catch (e) {
        throw e
      }
    },
  },
  Mutation: {
    createSurvey: async (parent, { data }, { request }, info) => {
      try {
        const { auth } = request
        if (!isUser(auth)) { throw new Error('Not authorized or no permissions.') }
        const updatedData = { ...data, creator: idStore.getMatchingId(auth.user.id) }
        const survey = await surveyModel.insert(updatedData)
        return { survey }
      } catch (e) {
        throw e
      }
    },
    updateSurvey: async (parent, { data, surveyID }, { request }, info) => {
      try {
        const { auth } = request
        if (!isUser(auth)) { throw new Error('Not authorized or no permissions.') }
        const matchingId = idStore.getMatchingId(surveyID)
        const [survey] = await surveyModel.get({ _id: matchingId })
        if (!userIdIsMatching(auth, idStore.createHashFromId(survey.creator))) { throw new Error('Not authorized or no permissions.') }
        const [updatedSurvey] = await surveyModel.update({ _id: matchingId }, data)
        // TODO:
        //  - notify subscription
        return { survey: updatedSurvey }
      } catch (e) {
        throw e
      }
    },
    deleteSurvey: async (parent, { surveyID }, { request }, info) => {
      try {
        const { auth } = request
        if (!isUser(auth)) { throw new Error('Not authorized or no permissions.') }
        const matchingId = idStore.getMatchingId(surveyID)
        const [survey] = await surveyModel.get({ _id: matchingId })
        if (!userIdIsMatching(auth, idStore.createHashFromId(survey.creator))) { throw new Error('Not authorized or no permissions.') }
        const result = await surveyModel.delete({ _id: matchingId })
        // TODO:
        //  - notify subscription
        return { success: result.n > 0 }
      } catch (e) {
        throw e
      }
    },
  },
  Survey: {
    id: async (parent, args, context, info) => idStore.createHashFromId(parent.id),
    creator: async (parent, args, { request }, info) => {
      try {
        const { auth } = request
        if (!userIdIsMatching(auth, idStore.createHashFromId(parent.creator))) { throw new Error('Not authorized or no permissions.') }
        return (await userModel.get({ _id: parent.creator }))[0]
      } catch (e) {
        throw e
      }
    },
    types: async (parent, args, context, info) => {
      try {
        const questions = await questionModel.get({ survey: parent.id })
        return _.uniq((questions).map(question => question.type))
      } catch (e) {
        throw e
      }
    },
    questions: async (parent, args, context, info) => {
      try {
        const questions = await questionModel.get({ survey: parent.id })
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
        return await voteModel.get({ survey: parent.id })
      } catch (e) {
        throw e
      }
    },
    contexts: async (parent, args, { request }, info) => {
      // TODO: has to be tested when context was implemented
      try {
        const { auth } = request
        if (!userIdIsMatching(auth, idStore.createHashFromId(parent.creator))) { throw new Error('Not authorized or no permissions.') }
        return await contextModel.get({ survey: parent.id })
      } catch (e) {
        throw e
      }
    },
    images: async (parent, args, context, info) => {
      try {
        return await imageModel.get({ survey: parent.id })
      } catch (e) {
        throw e
      }
    },
  },
}
