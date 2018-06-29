const surveyModel = require('./survey.model')()
const { isUser } = require('../../utils/authUtils')
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
}
