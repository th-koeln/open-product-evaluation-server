const config = require('../../../config')
const { ADMIN } = require('../../utils/roles')

module.exports = {
  Mutation: {
    setSurveyPreviewImage: async (parent, { data, image }, { request, models, imageStore }) => {
      const { auth } = request
      const [survey] = await models.survey.get({ _id: data.surveyID })

      if (!(auth.role === ADMIN || auth.id === survey.creator)) {
        throw new Error('Not authorized or no permissions.')
      }

      let oldImage
      try {
        oldImage = await models.image.get({ survey: survey.id })
      } catch (e) { oldImage = null }

      if (oldImage) {
        await models.image.delete({ _id: oldImage.id })
      }

      const upload = await imageStore.saveImage(await image, survey.creator)

      upload.user = survey.creator
      upload.survey = survey.id

      try {
        return { image: await models.image.insert(upload) }
      } catch (e) {
        await imageStore.removeImage(upload.name, auth.user.id)
        throw new Error('Image upload failed. Try again later.')
      }
    },
    removeSurveyPreviewImage: async (parent, { surveyID }, { request, models }) => {
      const { auth } = request

      const [{ user: creatorId }] = await models.image.get({ survey: surveyID })
      if (!(auth.role === ADMIN || auth.id === creatorId)) {
        throw new Error('Not authorized or no permissions.')
      }

      const result = await models.image.delete({ survey: surveyID })

      return { success: result.n > 0 }
    },
  },
  ImageData: {
    url: async ({ url }) => `${config.app.rootURL}:${config.app.port}${url}`,
  },
}
