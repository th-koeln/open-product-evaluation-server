const mongoose = require('mongoose')

const { Schema } = mongoose

const Answer = new Schema({
  creationDate: { type: Date, required: true },
  question: {
    type: Schema.Types.ObjectId,
    get: id => ((id) ? id.toString() : null),
    required: [true, 'needs to be an ID'],
  },
  type: {
    type: String,
    enum: ['CHOICE', 'FAVORITE', 'LIKE', 'LIKEDISLIKE', 'RANKING', 'REGULATOR'],
    required: [true, 'needs to be a String'],
  },
  liked: Boolean,
  choice: {
    type: Schema.Types.ObjectId,
    get: id => ((id) ? id.toString() : null),
  },
  rating: Number,
  normalized: Number,
  rankedItems: {
    type: [Schema.Types.ObjectId],
    get: (arr) => {
      if (arr) { return arr.map(id => id.toString()) }
      return []
    },
  },
  favoriteItem: {
    type: Schema.Types.ObjectId,
    get: id => ((id) ? id.toString() : null),
  },
}, { _id: false })

const Vote = new Schema({
  survey: {
    type: Schema.Types.ObjectId,
    get: id => ((id) ? id.toString() : null),
    required: [true, 'needs to be an ID'],
  },
  domain: {
    type: Schema.Types.ObjectId,
    get: id => ((id) ? id.toString() : null),
    required: [true, 'needs to be an ID'],
  },
  client: {
    type: Schema.Types.ObjectId,
    get: id => ((id) ? id.toString() : null),
    required: [true, 'needs to be an ID'],
  },
  answers: { type: [Answer], required: true },
}, { timestamps: { createdAt: 'creationDate' } })

module.exports = Vote
