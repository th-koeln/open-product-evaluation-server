const mongoose = require('mongoose')

const { Schema } = mongoose

const ImageData = new Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  hash: { type: String, required: true },
  tags: [String],
  url: { type: String, required: true },
}, { timestamps: { createdAt: 'creationDate' } })

ImageData.methods.toClient = function toClient() {
  const obj = this.toObject()
  obj.id = obj._id
  delete obj._id

  return obj
}

module.exports = ImageData
