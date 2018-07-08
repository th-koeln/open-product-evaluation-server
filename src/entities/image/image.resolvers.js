const { saveImage, removeImage } = require('../../utils/imageStore')
const { getMatchingId, createHashFromId } = require('../../utils/idStore')
const { isUser, userIdIsMatching } = require('../../utils/authUtils')
const imageModel = require('./image.model')()
const surveyModel = require('../survey/survey.model')()

module.exports = {
  Mutation: {
    createImage: async (parent, { data, image }, { request }, info) => {
      try {
        // TODO: Check for already uploaded images and their size -> cancel if limit already reached
        const { auth } = request
        let survey
        if (data.surveyID) [survey] = (await surveyModel.get({ _id: getMatchingId(data.surveyID) }))
        if (!isUser(auth) || (survey && !userIdIsMatching(auth, createHashFromId(survey.creator)))) { throw new Error('Not authorized or no permissions.') }
        const upload = await saveImage(await image, auth.user.id)

        upload.user = getMatchingId(auth.user.id)
        if (survey) upload.survey = survey.id

        let imageData
        try {
          imageData = await imageModel.insert(upload)
        } catch (e) {
          removeImage(upload.name, auth.user.id)
        }

        return {
          image: imageData,
        }
      } catch (e) {
        throw e
      }
    },
  },
  ImageData: {
    id: async (parent, args, context, info) => createHashFromId(parent.id),
    tags: async (parent, args, context, info) => ((parent.tags.length === 0) ? null : parent.tags),
  },
}
