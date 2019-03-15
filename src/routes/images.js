const config = require('../../config')

module.exports = (models, imageStore) => {
  const getImage =  async (req, res) => {
    const { imageHash, imageType } = req.params
    const { size } = req.query

    try {
      const neededSize = (size) ? Number(size) : 992
      const [image] = await models.image.get({
        hash: imageHash,
        type: imageType,
      })

      const imagePath = await imageStore.getImagePath(image, neededSize)
      res.sendFile(imagePath, `${imageHash}.${imageType}`)
    } catch (e) {
      res.status(404).send()
    }
  }

  const addImagesRoute = (express) =>
    express.use(`${config.app.imageRoute}/:imageHash.:imageType`, getImage)

  return Object.freeze({
    addImagesRoute
  })
}
