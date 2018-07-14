const mongoose = require('mongoose')

const { Schema } = mongoose

const ImageData = new Schema({
  user: { type: Schema.Types.ObjectId, required: true },
  survey: Schema.Types.ObjectId,
  question: Schema.Types.ObjectId,
  name: { type: String, required: true },
  type: { type: String, required: true },
  hash: { type: String, required: true },
  tags: [String],
  url: { type: String, required: true },
}, { timestamps: { createdAt: 'creationDate' } })

ImageData.virtual('id').get(function addId() {
  return this._id.toString()
})

module.exports = ImageData
