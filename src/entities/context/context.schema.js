const mongoose = require('mongoose')

const { Schema } = mongoose

const State = new Schema({
  key: { type: String, required: true },
  value: { type: String, required: true },
}, { _id: false })

const Context = new Schema({
  name: { type: String, required: true },
  activeQuestion: Schema.Types.ObjectId,
  activeSurvey: Schema.Types.ObjectId,
  owners: { type: [Schema.Types.ObjectId], get: arr => arr.map(id => id.toString()) },
  states: [State],
}, { timestamps: { createdAt: 'creationDate', updatedAt: 'lastUpdate' } })

Context.virtual('id').get(function addId() {
  return this._id.toString()
})

module.exports = Context
