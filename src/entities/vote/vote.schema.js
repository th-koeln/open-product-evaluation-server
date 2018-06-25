

const mongoose = require('mongoose')

const { Schema } = mongoose

const Answer = new Schema({
  question: { type: Schema.Types.ObjectId, required: true },
  liked: Boolean,
  choiceCode: String,
  rating: Number,
  normalized: Number,
  rankedImages: [Schema.Types.ObjectId],
  favoriteImage: Schema.Types.ObjectId,
}, { _id: false })

Answer.methods.toClient = function toClient() {
  const obj = this.toObject()
  delete obj._id

  return obj
}

const Vote = new Schema({
  context: { type: Schema.Types.ObjectId, required: true },
  answers: { type: [Answer], required: true },
}, { timestamps: { createdAt: 'creationDate' } })

Vote.methods.toClient = function toClient() {
  const obj = this.toObject()
  obj.id = obj._id
  delete obj._id

  return obj
}

module.exports = { Vote, Answer }
