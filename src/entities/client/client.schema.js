const mongoose = require('mongoose')

const { Schema } = mongoose

const Client = new Schema({
  name: { type: String, required: true },
  domain: { type: Schema.Types.ObjectId, get: id => ((id) ? id.toString() : null) },
  owners: [String],
}, { timestamps: { createdAt: 'creationDate', updatedAt: 'lastUpdate' } })

module.exports = Client
