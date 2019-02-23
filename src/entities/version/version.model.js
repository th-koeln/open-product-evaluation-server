const versionSchema = require('./version.schema')

module.exports = (db, eventEmitter) => {
  const versionModel = {}

  const Version = db.model('versionEntry', versionSchema, 'versionEntry')

  versionModel.get = async (find, limit, offset, sort) => {
    try {
      const versions = await Version.find(find)
        .collation({ locale: 'en' })
        .limit(limit)
        .skip(offset)
        .sort(sort)
      if (versions.length === 0) {
        throw new Error('No Version found')
      }
      return versions
    } catch (e) {
      throw e
    }
  }

  versionModel.insert = async (object) => {
    try {
      const version = await new Version(object).save()

      eventEmitter.emit('Version/Insert', version)

      return version
    } catch (e) {
      throw e
    }
  }

  versionModel.update = async (where, data) => {
    try {
      const result = await Version.updateMany(where, data, { runValidators: true })
      if (result.nMatched === 0) {
        throw new Error('No Version found.')
      }
      if (result.nModified === 0) {
        throw new Error('Version update failed.')
      }
      const updatedVersions = await Version.find(where)

      eventEmitter.emit('Version/Update', updatedVersions)

      return updatedVersions
    } catch (e) {
      throw e
    }
  }

  versionModel.delete = async (where) => {
    try {
      const versions = await Version.find(where)
      if (versions.length === 0) {
        throw new Error('No Version found.')
      }
      const result = await Version.deleteMany(where)
      if (result.n === 0) {
        throw new Error('Version deletion failed.')
      }

      eventEmitter.emit('Version/Delete', versions)

      return result
    } catch (e) {
      throw e
    }
  }

  /** EventEmitter reactions * */

  /** Delete Versions of deleted surveys * */
  eventEmitter.on('Survey/Delete', async (deletedSurveys) => {
    try {
      const deletedIds = deletedSurveys.map(survey => survey.id)
      await versionModel.delete({ survey: { $in: deletedIds } })
    } catch (e) {
      // TODO:
      // ggf. Modul erstellen, welches fehlgeschlagene DB-Zugriffe
      // in bestimmten abständen wiederholt
      // (nur für welche, die nicht ausschlaggebend für erfolg der query sind)
      console.log(e)
    }
  })

  return Object.freeze(versionModel)
}
