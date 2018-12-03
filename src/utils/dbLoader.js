/**
 * Created by Dennis Dubbert on 22.06.18.
 */

const domainModel = require('../entities/domain/domain.model')
const clientModel = require('../entities/client/client.model')
const imageModel = require('../entities/image/image.model')
const questionModel = require('../entities/question/question.model')
const surveyModel = require('../entities/survey/survey.model')
const userModel = require('../entities/user/user.model')
const voteModel = require('../entities/vote/vote.model')

const mongoose = require('mongoose')

mongoose.Promise = Promise
const config = require('../../config')

let db

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
    db = await mongoose.connect(`mongodb://localhost/${config.db.name}`)
    console.log('connecting db')
  },
}
