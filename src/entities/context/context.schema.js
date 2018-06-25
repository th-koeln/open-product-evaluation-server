const mongoose = require('mongoose')

const { Schema } = mongoose
const State = require('../state/state.schema')

const Context = new Schema({
  name: { type: String, required: true },
  activeQuestion: Schema.Types.ObjectId,
  activeSurvey: Schema.Types.ObjectId,
  owners: [Schema.Types.ObjectId],
  devices: [Schema.Types.ObjectId],
  states: [State],
}, { timestamps: { createdAt: 'creationDate', updatedAt: 'lastUpdate' } })

Context.methods.toClient = function toClient() {
  const obj = this.toObject()
  obj.id = obj._id
  delete obj._id

  return obj
}

module.exports = Context
