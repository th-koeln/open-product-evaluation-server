/**
 * Created by Dennis Dubbert on 22.06.18.
 */


const util = require('util')
const mongoose = require('mongoose')

mongoose.Promise = Promise
const { lstat, readdir } = require('fs')

const lstatAsync = util.promisify(lstat)
const readdirAsync = util.promisify(readdir)

const pathModule = require('path')

const MODULE_PATH = pathModule.join(__dirname, '../entities')
const dbModules = {}

const loadModules = async (path, db) => {
  try {
    const stat = await lstatAsync(path)
    if (stat.isDirectory()) {
      const files = await readdirAsync(path)
      let f
      const l = files.length
      const dbCreations = []
      for (let i = 0; i < l; i += 1) {
        f = pathModule.join(path, files[i])
        dbCreations.push(loadModules(f, db))
      }
      await Promise.all(dbCreations)
    } else {
      const filenameParts = pathModule.basename(path).split('.')
      if (filenameParts.length === 3 && filenameParts[1] === 'model') {
        dbModules[filenameParts[0]] = require(path)(db)
      }
    }
  } catch (e) {
    throw e
  }
}

module.exports.setup = async (dbName) => {
  try {
    const db = await mongoose.connect(`mongodb://localhost/${dbName}`)
    await loadModules(MODULE_PATH, db)
    console.log('db ready')
    return dbModules
  } catch (e) {
    throw e
  }
}
