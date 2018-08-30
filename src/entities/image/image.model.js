const imageSchema = require('./image.schema')
const { removeImage } = require('../../utils/imageStore')

module.exports = (db, eventEmitter) => {
  const imageModel = {}

  const Image = db.model('image', imageSchema, 'image')

  imageModel.get = async (find, limit, offset, sort) => {
    try {
      const images = await Image.find(find)
        .limit(limit)
        .skip(offset)
        .sort(sort)
      if (images.length === 0) throw new Error('No Image found.')
      return images
    } catch (e) {
      throw e
    }
  }

  imageModel.insert = async (object) => {
    try {
      const image = await new Image(object).save()

      eventEmitter.emit('Image/Insert', image)

      return image
    } catch (e) {
      throw e
    }
  }

  imageModel.update = async (where, data) => {
    try {
      const oldImages = await Image.find(where)
      const result = await Image.updateMany(where, data)
      if (result.nMatched === 0) throw new Error('No Image found.')
      if (result.nModified === 0) throw new Error('Image update failed.')
      const updatedImages = await Image.find(where)

      eventEmitter.emit('Image/Update', updatedImages, oldImages)

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

      const notDeletedImages = await Image.find({ _id: { $in: deletableImageIds } })
      const deletedImages = deletableImages.filter(image => !notDeletedImages.includes(image))

      const deletePromises =
        deletedImages.map(image => removeImage(image, `${image.user}`))
      await Promise.all(deletePromises)

      eventEmitter.emit('Image/Delete', deletedImages)

      return result
    } catch (e) {
      throw e
    }
  }

  /** EventEmitter reactions * */

  /** Delete Images of deleted Surveys * */
  eventEmitter.on('Survey/Delete', async (deletedSurveys) => {
    try {
      const deletedIds = deletedSurveys.map(survey => survey.id)
      await imageModel.delete({ survey: { $in: deletedIds } })
    } catch (e) {
      // TODO:
      // ggf. Modul erstellen, welches fehlgeschlagene DB-Zugriffe
      // in bestimmten abständen wiederholt
      // (nur für welche, die nicht ausschlaggebend für erfolg der query sind)
      console.log(e)
    }
  })

  //  TODO: improve / rework !!!!!!!!!!!
  /** Delete Images that are not referenced in any Question * */
  eventEmitter.on('Image/Removed', async (removedImages) => {
    try {
      await imageModel.delete({ _id: { $in: removedImages } })
    } catch (e) {
      console.log(e)
    }
  })

  return Object.freeze(imageModel)
}
