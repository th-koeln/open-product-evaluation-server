const mongoose = require('mongoose')

const { Schema } = mongoose

const Item = new Schema({
  image: { type: Schema.Types.ObjectId, get: q => q.toString() },
  label: String,
})

const ChoiceDescription = new Schema({
  image: { type: Schema.Types.ObjectId, get: q => q.toString() },
  label: String,
  code: String,
})

const Label = new Schema({
  image: { type: Schema.Types.ObjectId, get: q => q.toString() },
  label: String,
  value: Number,
})

const Question = new Schema({
  user: { type: Schema.Types.ObjectId, required: true, get: q => q.toString() },
  survey: { type: Schema.Types.ObjectId, required: true },
  type: { type: String, enum: ['CHOICE', 'FAVORITE', 'LIKE', 'LIKEDISLIKE', 'RANKING', 'REGULATOR'], required: true },
  items: [Item],
  value: String,
  description: String,
  likeIcon: Schema.Types.ObjectId,
  dislikeIcon: Schema.Types.ObjectId,
  choices: [ChoiceDescription],
  choiceDefault: String,
  labels: [Label],
  stepSize: { type: Number, default: 1 },
  min: { type: Number, default: 0 },
  max: { type: Number, default: 10 },
  regulatorDefault: { type: Number, default: 5 },
}, { timestamps: { createdAt: 'creationDate', updatedAt: 'lastUpdate' } })

module.exports = Question
