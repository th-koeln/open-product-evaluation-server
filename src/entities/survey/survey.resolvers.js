const _ = require('underscore')
const { ADMIN, USER } = require('../../utils/roles')
const {
  getSortObjectFromRequest,
  getPaginationLimitFromRequest,
  getPaginationOffsetFromRequest,
  createSurveyFilter,
} = require('../../utils/filter')
const { sortObjectsByIdArray } = require('../../utils/sort')
const { createVersionIfNeeded } = require('../../controls/version.control')

module.exports = {
  SortableSurveyField: {
    CREATION_DATE: 'creationDate',
    LAST_UPDATE: 'lastUpdate',
    CREATOR: 'creator',
    TITLE: 'title',
    IS_ACTIVE: 'isActive',
  },
  Query: {
    surveys: async (parent, { sortBy, pagination, filterBy }, { request, models }) => {
      try {
        const { auth } = request

        const limit = getPaginationLimitFromRequest(pagination)
        const offset = getPaginationOffsetFromRequest(pagination)
        const sort = getSortObjectFromRequest(sortBy)
        const filter = await createSurveyFilter(filterBy, models)

        switch (auth.role) {
          case ADMIN:
            return await models.survey.get({ ...filter }, limit, offset, sort)

          case USER:
            return await models.survey.get({
              $and : [
                filter,
                { creator: auth.id },
              ],
            }, limit, offset, sort)

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
        const [survey] = await models.survey.get({ _id: surveyID })

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
    surveyAmount: async (parent, args, { request, models }) => {
      try {
        return (await module.exports.Query.surveys(parent, args, { request, models })).length
      } catch (e) {
        return 0
      }
    },
  },
  Mutation: {
    createSurvey: async (parent, { data }, { request, models }) => {
      try {
        const { auth } = request
        const updatedData = { ...data, creator: auth.user.id }
        const survey = await models.survey.insert(updatedData)

        await models.version.insert({
          survey: survey.id,
          versionNumber: 1
        })

        return { survey }
      } catch (e) {
        throw e
      }
    },
    updateSurvey: async (parent, { data, surveyID }, { request, models }) => {
      const { auth } = request

      async function updateSurvey(survey) {
        const updatedData = data
        /** check if all questions of request are already in survey * */
        if (updatedData.questionOrder) {
          updatedData.questionOrder = _.uniq(updatedData.questionOrder)

          const presentQuestions = (await models.question.get({ survey: survey.id }))
            .map(question => question.id)

          if (_.difference(updatedData.questionOrder, presentQuestions).length !== 0) {
            throw new Error('Adding new Questions is not allowed in Survey update.')
          }

          await createVersionIfNeeded(survey.id, models)
        }

        const [updatedSurvey] = await models.survey.update({ _id: surveyID }, updatedData)

        return { survey: updatedSurvey }
      }

      try {
        const [survey] = await models.survey.get({ _id: surveyID })

        const updateHasKeyIsActive =
          (Object.prototype.hasOwnProperty.call(data, 'isActive') && data.isActive !== null)

        // eslint-disable-next-line
        if ((survey.isActive && (!updateHasKeyIsActive || (updateHasKeyIsActive && data.isActive)))) {
          throw new Error('Survey needs to be inactive for updates.')
        }

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
        const [survey] = await models.survey.get({ _id: surveyID })
        switch (auth.role) {
          case ADMIN: {
            const result = await models.survey.delete({ _id: surveyID })
            return { success: result.n > 0 }
          }

          case USER:
            if (survey.creator === auth.id) {
              const result = await models.survey.delete({ _id: surveyID })
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

        return sortObjectsByIdArray(parent.questionOrder, questions)
      } catch (e) {
        return null
      }
    },
    results: async parent => parent,
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
    previewImage: async (parent, args, { models }) => {
      try {
        return (await models.image.get({ survey: parent.id }))[0]
      } catch (e) {
        return null
      }
    },
  },
}
