const imageModel = {}
module.exports = imageModel

const imageSchema = require('./image.schema')
const dbLoader = require('../../utils/dbLoader')
const { removeImage } = require('../../utils/imageStore')

const Image = dbLoader.getDB().model('image', imageSchema, 'image')

imageModel.get = async (find, limit, offset, sort) => {
  try {
    const images = await Image.find(find).limit(limit).skip(offset).sort(sort)
    if (images.length === 0) throw new Error('No Image found.')
    return images
  } catch (e) {
    throw e
  }
}

imageModel.insert = async (object) => {
  try {
    return (await new Image(object).save())
  } catch (e) {
    throw e
  }
}

imageModel.update = async (where, data) => {
  try {
    const result = await Image.updateMany(where, data)
    if (result.nMatched === 0) throw new Error('No Image found.')
    if (result.nModified === 0) throw new Error('Image update failed.')
    const updatedImages = await Image.find(where)
    return updatedImages
  } catch (e) {
    throw e
  }
}

imageModel.delete = async (where) => {
  try {
    const images = await Image.find(where)
    const deletableImages = images.reduce((acc, image) => {
      const pathParts = image.url.split('/')
      return (pathParts.indexOf('default') === -1) ? [...acc, image] : acc
    }, [])
    const deletableImageIds = deletableImages.map(image => `${image.id}`)
    const result = await Image.deleteMany({ _id: { $in: deletableImageIds } })
    if (result.n === 0) throw new Error('Image deletion failed.')
    const deletePromises =
      deletableImages.map(image => removeImage(image.name, `${image.user}`))
    await Promise.all(deletePromises)
    return result
  } catch (e) {
    throw e
  }
}
