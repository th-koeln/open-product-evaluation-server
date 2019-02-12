const mongoose = require('mongoose')

const { Schema } = mongoose

const Item = new Schema({
  image: {
    type: Schema.Types.ObjectId,
    get: q => ((q) ? q.toString() : null),
  },
  label: String,
})

const ChoiceDescription = new Schema({
  image: {
    type: Schema.Types.ObjectId,
    get: q => ((q) ? q.toString() : null),
  },
  label: String,
  code: String,
})

const Label = new Schema({
  image: {
    type: Schema.Types.ObjectId,
    get: q => ((q) ? q.toString() : null),
  },
  label: String,
  value: Number,
})

const Question = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    required: [true, 'needs to be an ID'],
    get: q => q.toString(),
  },
  survey: {
    type: Schema.Types.ObjectId,
    required: [true, 'needs to be an ID'],
    get: q => q.toString(),
  },
  type: {
    type: String,
    enum: ['CHOICE', 'FAVORITE', 'LIKE', 'LIKEDISLIKE', 'RANKING', 'REGULATOR'],
    required: [true, 'needs to be a String'],
  },
  items: [Item],
  itemOrder: {
    type: [Schema.Types.ObjectId],
    get: (arr) => {
      if (arr) { return arr.map(id => id.toString()) }
      return []
    },
  },
  value: String,
  description: String,
  likeIcon: {
    type: Schema.Types.ObjectId,
    get: q => ((q) ? q.toString() : null),
  },
  dislikeIcon: {
    type: Schema.Types.ObjectId,
    get: q => ((q) ? q.toString() : null),
  },
  choices: [ChoiceDescription],
  choiceOrder: {
    type: [Schema.Types.ObjectId],
    get: (arr) => {
      if (arr) { return arr.map(id => id.toString()) }
      return []
    },
  },
  choiceDefault: String,
  labels: [Label],
  labelOrder: {
    type: [Schema.Types.ObjectId],
    get: (arr) => {
      if (arr) { return arr.map(id => id.toString()) }
      return []
    },
  },
  stepSize: { type: Number, default: 1 },
  min: { type: Number, default: 0 },
  max: { type: Number, default: 10 },
  regulatorDefault: { type: Number, default: 5 },
}, { timestamps: { createdAt: 'creationDate', updatedAt: 'lastUpdate' } })

module.exports = Question
