const imageSchema = require('./image.schema')
const dbLoader = require('../../utils/dbLoader')

module.exports = () => {
  const Image = dbLoader.getDB().model('image', imageSchema, 'image')

  return Object.freeze({
    get: async (find, limit, offset, sort) => {
      try {
        const images = await Image.find(find).limit(limit).skip(offset).sort(sort)
        if (images.length === 0) throw new Error('Image not found.')
        return images
      } catch (e) {
        throw e
      }
    },
    insert: async (object) => {
    },
    update: async (where, data) => {
    },
    delete: async (where) => {
    },
  })
}
