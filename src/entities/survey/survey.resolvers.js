const surveyModel = require('./survey.model')()
const userModel = require('../user/user.model')()
const { isUser, userIdIsMatching } = require('../../utils/authUtils')
const idStore = require('../../utils/idStore')

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
  },
  creator: async (parent, args, context, info) => {
    try {
      const { auth } = context.request
      if (!userIdIsMatching(auth, idStore.createHashFromId(parent.creator))) { throw new Error('Not authorized or no permissions.') }
      return (await userModel.get({ _id: parent.creator }))[0]
    } catch (e) {
      throw e
    }
  },
}
