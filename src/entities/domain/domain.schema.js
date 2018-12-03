const mongoose = require('mongoose')

const { Schema } = mongoose

const State = new Schema({
  key: { type: String, required: true },
  value: { type: String, required: true },
}, { _id: false })

const Domain = new Schema({
  name: { type: String, required: true },
  activeQuestion: { type: Schema.Types.ObjectId, get: id => ((id) ? id.toString() : null) },
  activeSurvey: { type: Schema.Types.ObjectId, get: id => ((id) ? id.toString() : null) },
  owners: [String],
  states: [State],
}, { timestamps: { createdAt: 'creationDate', updatedAt: 'lastUpdate' } })

module.exports = Domain
