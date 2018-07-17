/**
 * Created by Dennis Dubbert on 07.07.18.
 */
// TODO: this is only a prototype. Extend functionality (real hashes etc.)
const {
  createWriteStream, ensureDir, remove, pathExists, readdir, existsSync,
} = require('fs-extra')
const config = require('../../config')
const crypto = require('crypto')
const { createHashFromId } = require('./idStore')

const mimeList = ['jpeg', 'png', 'gif', 'bmp', 'webp']

const isImage = (mimetype) => {
  const types = mimetype.split('/')
  return types[0] === 'image' && mimeList.indexOf(types[1].toLowerCase()) !== -1
}

const getAllowedFilenameAndHash = (filename, mime, userFolder) => {
  const name = filename.replace(/\.[^/.]+$/, '')
  let allowedFilename = `${name}.${mime}`
  let hash = crypto.createHash('md5').update(name).digest('hex')
  let counter = 1
  while (existsSync(`${userFolder}/${hash}.${mime}`)) {
    allowedFilename = `${name + counter}.${mime}`
    hash = crypto.createHash('md5').update(name + counter).digest('hex')
    counter += 1
  }
  return { allowedFilename, hash }
}

const saveImage = async (file, user) => {
  const { stream, filename, mimetype } = file
  if (!isImage(mimetype)) throw new Error('File is not an Image.')
  return new Promise((resolve, reject) => {
    const userFolder = `${config.app.imageFolder}/${createHashFromId(user)}`
    const mime = mimetype.split('/')[1]
    const { allowedFilename, hash } = getAllowedFilenameAndHash(filename, mime, userFolder)
    ensureDir(userFolder).then(() => {
      stream
        .pipe(createWriteStream(`${userFolder}/${hash}.${mime}`))
        .on('finish', () => resolve({
          name: allowedFilename,
          type: mime,
          hash,
          url: `${config.app.rootURL}:${config.app.port}/${userFolder}/${hash}.${mime}`,
        }))
        .on('error', () => reject(new Error('Image upload failed.')))
    })
  })
}

const removeImage = async (hash, mime, user) => {
  const userFolder = `${config.app.imageFolder}/${createHashFromId(user)}`
  const filePath = `${userFolder}/${hash}.${mime}`
  if (await pathExists(userFolder)) {
    if (await pathExists(filePath)) await remove(filePath)

    if ((await readdir(userFolder)).length === 0) await remove(userFolder)
  }
}

module.exports = {
  saveImage,
  removeImage,
}
