const { getMatchingId, createHashFromId } = require('../../utils/idStore')
const { userIdIsMatching } = require('../../utils/authUtils')
const config = require('../../../config')

module.exports = {
  Mutation: {
    createBonusImage: async (parent, { data, image }, { auth, models, imageStore }) => {
      try {
        // TODO: Check for already uploaded images and their size -> cancel if limit already reached
        const [survey] = await models.survey.get({ _id: getMatchingId(data.surveyID) })

        if (!userIdIsMatching(auth, survey.creator)) { throw new Error('Not authorized or no permissions.') }
        const upload = await imageStore.saveImage(await image, auth.user.id)

        upload.user = auth.user.id
        upload.survey = survey.id

        try {
          return { image: await models.image.insert(upload) }
        } catch (e) {
          await imageStore.removeImage(upload.name, auth.user.id)
          throw new Error('Image upload failed. Try again later.')
        }
      } catch (e) {
        throw e
      }
    },
    updateImage: async (parent, { data, imageID }, { auth, models }) => {
      const matchingId = getMatchingId(imageID)

      const [{ user: creatorId }] = await models.image.get({ _id: matchingId })
      if (!userIdIsMatching(auth, creatorId)) { throw new Error('Not authorized or no permissions.') }

      const [imageData] = await models.image.update({ _id: matchingId }, data)

      return {
        image: imageData,
      }
    },
  },
  ImageData: {
    id: async ({ id }) => createHashFromId(id),
    tags: async ({ tags }) => ((tags.length === 0) ? null : tags),
    url: async ({ url }) => `${config.app.rootURL}:${config.app.port}/${url}`,
  },
}
