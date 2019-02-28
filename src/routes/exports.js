const archiver = require('archiver')

const config = require('../../config')
const csvCreator = require('../visualization/csv.creator')
const { getMatchingId } = require('../store/id.store')

module.exports = (models) => {
  const getExport =  async (req, res) => {
    const { surveyID, versionNumber } = req.params
    let version

    try {
      [version] = await models.version.get({
        versionNumber,
        survey: getMatchingId(surveyID),
      })
    } catch (e) {
      res.status(404).send()
      return
    }

    try{
      const csvData = await csvCreator.createCSVForVersion(version, models)

      const archive = archiver('zip', {
        zlib: { level: 9 },
      })

      res.attachment(`version${versionNumber}.zip`)

      archive.pipe(res)

      Object.keys(csvData).forEach((key) => {
        archive.append(csvData[key], { name: `${key}.csv` })
      })

      archive.finalize()
    } catch (e) {
      res.status(500).send(e.message)
    }
  }

  const addExportsRoute = (express) =>
    express.use(`${config.app.exportRoute}/:surveyID/:versionNumber`, getExport)

  return Object.freeze({
    addExportsRoute
  })
}

