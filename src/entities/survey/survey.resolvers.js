const _ = require('underscore')
const { getMatchingId, createHashFromId } = require('../../utils/idStore')
const { ADMIN, USER } = require('../../utils/roles')

module.exports = {
  Query: {
    surveys: async (parent, args, { request, models }) => {
      try {
        const { auth } = request

        switch (auth.role) {
          case ADMIN:
            return await models.survey.get({})

          case USER:
            return await models.survey.get({ creator: auth.user.id })

          default:
            throw new Error('Not authorized or no permissions.')
        }
      } catch (e) {
        throw e
      }
    },
    survey: async (parent, { surveyID }, { request, models }) => {
      try {
        const { auth } = request
        const [survey] = await models.survey.get({ _id: getMatchingId(surveyID) })

        switch (auth.role) {
          case ADMIN:
            return survey

          case USER:
            if (survey.creator === auth.id) { return survey }
            break
          default:
            throw new Error('Not authorized or no permissions.')
        }

        throw new Error('Not authorized or no permissions.')
      } catch (e) {
        throw e
      }
    },
  },
  Mutation: {
    createSurvey: async (parent, { data }, { request, models }) => {
      try {
        const { auth } = request
        const updatedData = { ...data, creator: auth.user.id }
        const survey = await models.survey.insert(updatedData)
        return { survey }
      } catch (e) {
        throw e
      }
    },
    updateSurvey: async (parent, { data, surveyID }, { request, models }) => {
      const { auth } = request
      const matchingId = getMatchingId(surveyID)

      async function updateSurvey(survey) {
        const updatedData = data
        /** check if all questions of request are already in survey * */
        if (updatedData.questionOrder) {
          updatedData.questionOrder = _.uniq(updatedData.questionOrder)
            .map(questionId => getMatchingId(questionId))

          const presentQuestions = (await models.question.get({ survey: survey.id }))
            .map(question => question.id)

          if (_.difference(updatedData.questionOrder, presentQuestions).length !== 0) { throw new Error('Adding new Questions is not allowed in Survey update.') }
        }

        const [updatedSurvey] = await models.survey.update({ _id: matchingId }, updatedData)

        return { survey: updatedSurvey }
      }

      try {
        const [survey] = await models.survey.get({ _id: matchingId })

        const updateHasKeyIsPublic = (Object.prototype.hasOwnProperty.call(data, 'isActive') && data.isActive !== null)

        if ((survey.isActive && (!updateHasKeyIsPublic || (updateHasKeyIsPublic && data.isActive)))) { throw new Error('Survey needs to be inactive for updates.') }

        switch (auth.role) {
          case ADMIN:
            return updateSurvey(survey)

          case USER:
            if (survey.creator === auth.id) { return updateSurvey(survey) }
            break
          default:
            throw new Error('Not authorized or no permissions.')
        }

        throw new Error('Not authorized or no permissions.')
      } catch (e) {
        throw e
      }
    },
    deleteSurvey: async (parent, { surveyID }, { request, models }) => {
      try {
        const { auth } = request
        const matchingId = getMatchingId(surveyID)
        const [survey] = await models.survey.get({ _id: matchingId })
        switch (auth.role) {
          case ADMIN: {
            const result = await models.survey.delete({ _id: matchingId })
            return { success: result.n > 0 }
          }

          case USER:
            if (survey.creator === auth.id) {
              const result = await models.survey.delete({ _id: matchingId })
              return { success: result.n > 0 }
            }
            break
          default:
            throw new Error('Not authorized or no permissions.')
        }
        throw new Error('Not authorized or no permissions.')
      } catch (e) {
        throw e
      }
    },
  },
  Survey: {
    id: async parent => createHashFromId(parent.id),
    creator: async (parent, args, { request, models }) => {
      try {
        const { auth } = request
        switch (auth.role) {
          case ADMIN:
            return (await models.user.get({ _id: parent.creator }))[0]
          case USER:
            if (parent.creator === auth.id) {
              return (await models.user.get({ _id: parent.creator }))[0]
            }
            break
          default:
            throw new Error('Not authorized or no permissions.')
        }
        throw new Error('Not authorized or no permissions.')
      } catch (e) {
        throw e
      }
    },
    types: async parent => (
      (Object.prototype.hasOwnProperty.call(parent.toObject(), 'types')
        && parent.types !== null
        && parent.types.length > 0) ? parent.types : null),
    questions: async (parent, args, { models }) => {
      try {
        const questions = await models.question.get({ survey: parent.id })
        /** Convert array of ids to Object with id:index pairs* */
        const sortObj = parent.questionOrder.reduce((acc, id, index) => ({
          ...acc,
          [id]: index,
        }), {})
        /** Sort questions depending on the former Array of ids * */
        return _.sortBy(questions, question => sortObj[question.id])
      } catch (e) {
        return null
      }
    },
    votes: async (parent, args, { models }) => {
      try {
        return await models.vote.get({ survey: parent.id })
      } catch (e) {
        return null
      }
    },
    domains: async (parent, args, { request, models }) => {
      try {
        const { auth } = request
        switch (auth.role) {
          case ADMIN:
            try {
              return await models.domain.get({ activeSurvey: parent.id })
            } catch (e) {
              return null
            }
          case USER:
            if (parent.creator === auth.id) {
              try {
                return await models.domain.get({ activeSurvey: parent.id })
              } catch (e) {
                return null
              }
            }
            break
          default:
            throw new Error('Not authorized or no permissions.')
        }
        throw new Error('Not authorized or no permissions.')
      } catch (e) {
        throw e
      }
    },
    images: async (parent, args, { models }) => {
      try {
        return await models.image.get({ survey: parent.id })
      } catch (e) {
        return null
      }
    },
  },
}
