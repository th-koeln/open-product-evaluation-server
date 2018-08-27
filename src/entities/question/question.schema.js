const mongoose = require('mongoose')

const { Schema } = mongoose

const Item = new Schema({
  image: { type: Schema.Types.ObjectId, required: true, get: q => q.toString() },
  label: { type: String, required: true },
})

const ChoiceDescription = new Schema({
  image: { type: Schema.Types.ObjectId, required: true, get: q => q.toString() },
  label: { type: String, required: true },
  code: { type: String, required: true },
})

const Label = new Schema({
  image: { type: Schema.Types.ObjectId, required: true, get: q => q.toString() },
  label: { type: String, required: true },
  value: { type: Number, required: true },
})

const Question = new Schema({
  user: { type: Schema.Types.ObjectId, required: true, get: q => q.toString() },
  survey: { type: Schema.Types.ObjectId, required: true },
  type: { type: String, enum: ['CHOICE', 'FAVORITE', 'LIKE', 'LIKEDISLIKE', 'RANKING', 'REGULATOR'], required: true },
  items: [Item],
  value: { type: String, required: true },
  description: { type: String, default: '' },
  likeIcon: Schema.Types.ObjectId,
  dislikeIcon: Schema.Types.ObjectId,
  choices: [ChoiceDescription],
  default: Schema.Types.Mixed,
  labels: [Label],
  stepSize: { type: Number, default: 1 },
  min: { type: Number, default: 0 },
  max: { type: Number, default: 10 },
}, { timestamps: { createdAt: 'creationDate', updatedAt: 'lastUpdate' } })

module.exports = Question
