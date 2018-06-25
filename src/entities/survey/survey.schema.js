

const mongoose = require('mongoose')

const { Schema } = mongoose
const { Vote } = require('../vote/vote.schema')
const Question = require('../question/question.schema')
const ImageData = require('../image/image.schema')

const Survey = new Schema({
  creator: { type: Schema.Types.ObjectId, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  isPublic: { type: Boolean, default: false },
  types: [{ type: String, enum: ['CHOICE', 'FAVORITE', 'LIKE', 'LIKEDISLIKE', 'RANKING', 'REGULATOR'] }],
  questions: [Question],
  votes: [Vote],
  contexts: [Schema.Types.ObjectId],
  images: [ImageData],
}, { timestamps: { createdAt: 'creationDate', updatedAt: 'lastUpdate' } })

Survey.methods.toClient = function toClient() {
  const obj = this.toObject()
  obj.id = obj._id
  delete obj._id

  return obj
}

module.exports = Survey
