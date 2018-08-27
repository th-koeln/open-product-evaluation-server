const mongoose = require('mongoose')

const { Schema } = mongoose

const ImageData = new Schema({
  user: { type: Schema.Types.ObjectId, required: true, get: u => u.toString() },
  survey: { type: Schema.Types.ObjectId, get: u => u.toString() },
  question: { type: Schema.Types.ObjectId, get: u => u.toString() },
  item: { type: Schema.Types.ObjectId, get: u => u.toString() },
  label: { type: Schema.Types.ObjectId, get: u => u.toString() },
  choice: { type: Schema.Types.ObjectId, get: u => u.toString() },
  name: { type: String, required: true },
  type: { type: String, required: true },
  hash: { type: String, required: true },
  tags: [String],
  url: { type: String, required: true },
}, { timestamps: { createdAt: 'creationDate' } })

module.exports = ImageData
