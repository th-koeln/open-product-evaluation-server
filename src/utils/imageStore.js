/**
 * Created by Dennis Dubbert on 07.07.18.
 */
// TODO: this is only a prototype. Extend functionality (real hashes etc.)
const {
  createWriteStream, ensureDir, remove, pathExists, readdir,
} = require('fs-extra')
const config = require('../../config')

const mimeList = ['jpeg', 'png', 'gif', 'bmp', 'webp']

const isImage = (mimetype) => {
  const types = mimetype.split('/')
  return types[0] === 'image' && mimeList.indexOf(types[1].toLowerCase()) !== -1
}

const saveImage = async (file, user) => {
  const { stream, filename, mimetype } = file
  if (!isImage(mimetype)) throw new Error('File is not an Image.')
  return new Promise((resolve, reject) => {
    const userFolder = `${config.app.imageFolder}/${user}`
    ensureDir(userFolder).then(() => {
      stream
        .pipe(createWriteStream(`${userFolder}/${filename}`))
        .on('finish', () => resolve({
          name: filename,
          type: mimetype,
          hash: 'hash',
          url: `http://localhost:${config.app.port}/${userFolder}/${filename}`, // TODO: define real URL
        }))
        .on('error', () => reject(new Error('Image upload failed.')))
    })
  })
}

const removeImage = async (filename, user) => {
  const userFolder = `${config.app.imageFolder}/${user}`
  const filePath = `${userFolder}/${filename}`
  if ((await pathExists(filePath))) { await remove(filePath) }
  if ((await readdir(userFolder)).length === 0) { await remove(userFolder) }
}

module.exports = {
  saveImage,
  removeImage,
}
