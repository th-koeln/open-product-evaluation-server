const {
  ensureDir,
  remove,
  pathExists,
} = require('fs-extra')
const sharp = require('sharp')
const streamBuffers = require('stream-buffers')
const shortId = require('shortid')
const config = require('../../config')
const { createHashFromId } = require('./id.store')

const mimeList = ['jpeg', 'png', 'gif', 'bmp', 'webp']
const imageSizes = [1200, 992, 768, 576]

module.exports = (models, eventEmitter) => {
  const isImage = (mimetype) => {
    const types = mimetype.split('/')
    return types[0] === 'image' && mimeList.indexOf(types[1].toLowerCase()) !== -1
  }

  const saveImage = async (file, user) => {
    const { createReadStream, filename, mimetype } = file
    if (!isImage(mimetype)) { throw new Error('File is not an Image.') }

    return new Promise((resolve, reject) => {
      const incomingFileStream = createReadStream()
      const fileBufferStream = new streamBuffers.WritableStreamBuffer()
      const userFolder = `${config.app.imageFolder}/${createHashFromId(user)}`
      const mime = mimetype.split('/')[1]
      const hash = shortId.generate()

      ensureDir(userFolder)
        .then(() => {
          incomingFileStream
            .pipe(fileBufferStream)
            .on('finish', async () => {
              const myBuffer = fileBufferStream.getContents()

              await Promise.all(imageSizes.map(async (size) => {
                await ensureDir(`${userFolder}/${size}`)
                return sharp(myBuffer)
                  .resize(size)
                  .toFile(`${userFolder}/${size}/${hash}.${mime}`)
              }))

              resolve({
                name: filename,
                type: mime,
                hash,
                url: `${config.app.imageRoute}/${hash}.${mime}`,
              })
            })
            .on('error', () => reject(new Error('Image upload failed.')))
        })
    })
  }

  const removeImage = async (image, user) => {
    try {
      await models.image.get({ name: image.name, type: image.type, hash: image.hash })
    } catch (e) {
      const userFolder = `${config.app.imageFolder}/${createHashFromId(user)}`

      if (await pathExists(userFolder)) {
        await Promise.all(imageSizes.map(async (size) => {
          const sizeFolder = `${userFolder}/${size}`

          if (await pathExists(sizeFolder)) {
            const filePath = `${sizeFolder}/${image.hash}.${image.type}`

            if (await pathExists(filePath)) {
              await remove(filePath)
            }
          }
        }))
      }
    }
  }

  const removeUserFolder = async (user) => {
    const userFolder = `${config.app.imageFolder}/${createHashFromId(user)}`

    if (await pathExists(userFolder)) {
      await remove(userFolder)
    }
  }

  const getImagePath = async (image, size) => {
    const userFolder = `${config.app.imageFolder}/${createHashFromId(image.user)}`

    if (await pathExists(userFolder)) {
      const matchingSize = (size >= imageSizes[0])
        ? imageSizes[0]
        : imageSizes.reduce((acc, imageSize) => ((size <= imageSize) ? imageSize : acc), 0)

      const sizeFolder = `${userFolder}/${matchingSize}`

      if (await pathExists(sizeFolder)) {
        const filePath = `${sizeFolder}/${image.hash}.${image.type}`

        if (await pathExists(filePath)) {
          return filePath
        }
      }
    }

    throw new Error('Image not found.')
  }

  eventEmitter.on('Image/Delete', async (deletedImages) => {
    const deletePromises = deletedImages.map(image => removeImage(image, image.user))
    await Promise.all(deletePromises)
  })

  eventEmitter.on('User/Delete', async (deletedUsers) => {
    const deletePromises = deletedUsers.map(user => removeUserFolder(user.id))
    await Promise.all(deletePromises)
  })

  return Object.freeze({
    saveImage,
    removeImage,
    getImagePath,
  })
}
