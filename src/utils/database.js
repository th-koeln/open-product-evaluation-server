const chalk = require('chalk')
const mongoose = require('mongoose')
const domainModel = require('../entities/domain/domain.model')
const clientModel = require('../entities/client/client.model')
const imageModel = require('../entities/image/image.model')
const questionModel = require('../entities/question/question.model')
const surveyModel = require('../entities/survey/survey.model')
const userModel = require('../entities/user/user.model')
const voteModel = require('../entities/vote/vote.model')


mongoose.Promise = Promise
const config = require('../../config')

const db = mongoose.connection

db.once('connected', () => {
  console.log(chalk.bold.cyan('MongoDB connected.'))
})

db.on('disconnected', () => {
  console.log(chalk.bold.bgRed.black('DB disconnected.'))
  throw new Error('MongoDB connection lost.')
})

module.exports = {
  getModels: (eventEmitter) => {
    const modules = {}

    modules.domain = domainModel(db, eventEmitter)
    modules.client = clientModel(db, eventEmitter)
    modules.image = imageModel(db, eventEmitter)
    modules.question = questionModel(db, eventEmitter)
    modules.survey = surveyModel(db, eventEmitter)
    modules.user = userModel(db, eventEmitter)
    modules.vote = voteModel(db, eventEmitter)

    return modules
  },
  connectDB: async () => {
    try {
      await mongoose.connect(`mongodb://${config.db.host}:${config.db.port}/${config.db.name}`)
    } catch (e) {
      throw new Error('MongoDB connection failed.')
    }
  },
}
