/**
 * Created by Dennis Dubbert on 07.07.18.
 */
// TODO: this is only a prototype. Extend functionality (real hashes etc.)
const {
  createWriteStream, ensureDir, remove, pathExists, readdir, existsSync,
} = require('fs-extra')
const config = require('../../config')
const { createHashFromId } = require('./idStore')

const mimeList = ['jpeg', 'png', 'gif', 'bmp', 'webp']

const isImage = (mimetype) => {
  const types = mimetype.split('/')
  return types[0] === 'image' && mimeList.indexOf(types[1].toLowerCase()) !== -1
}

const getAllowedFilename = (filename, mimetype, userFolder) => {
  const mime = mimetype.split('/')[1]
  const name = filename.replace(/\.[^/.]+$/, '')
  let allowedFilename = `${name}.${mime}`
  let counter = 1
  while (existsSync(`${userFolder}/${allowedFilename}`)) {
    allowedFilename = `${name + counter}.${mime}`
    counter += 1
  }
  return allowedFilename
}

const saveImage = async (file, user) => {
  const { stream, filename, mimetype } = file
  if (!isImage(mimetype)) throw new Error('File is not an Image.')
  return new Promise((resolve, reject) => {
    const userFolder = `${config.app.imageFolder}/${createHashFromId(user)}`
    const allowedFilename = getAllowedFilename(filename, mimetype, userFolder)
    ensureDir(userFolder).then(() => {
      stream
        .pipe(createWriteStream(`${userFolder}/${allowedFilename}`))
        .on('finish', () => resolve({
          name: allowedFilename,
          type: mimetype,
          hash: 'hash',
          url: `${config.app.rootURL}:${config.app.port}/${userFolder}/${allowedFilename}`,
        }))
        .on('error', () => reject(new Error('Image upload failed.')))
    })
  })
}

const removeImage = async (filename, user) => {
  const userFolder = `${config.app.imageFolder}/${createHashFromId(user)}`
  const filePath = `${userFolder}/${filename}`
  if (await pathExists(userFolder)) {
    if (await pathExists(filePath)) await remove(filePath)

    if ((await readdir(userFolder)).length === 0) await remove(userFolder)
  }
}

module.exports = {
  saveImage,
  removeImage,
}
