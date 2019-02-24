const Question = require('../question/question.schema')
const mongoose = require('mongoose')

const { Schema } = mongoose

const DataSet = new Schema({
  total: {
    type: Number,
    required: [true, 'needs to be a Number'],
  },
  label: {
    type: String,
    required: [true, 'needs to be a String'],
  },
}, { timestamps: { createdAt: 'creationDate', updatedAt: 'lastUpdate' } })

const Evaluation  = new Schema({
  metric: {
    type: String,
    required: [true, 'needs to be a String'],
  },
  data: {
    type: [DataSet],
    required: true,
  },
}, { timestamps: { createdAt: 'creationDate', updatedAt: 'lastUpdate' } })

const Summary = new Schema({
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
  value: String,
  evaluations: {
    type: [Evaluation],
    required: true,
  },
}, { timestamps: { createdAt: 'creationDate', updatedAt: 'lastUpdate' } })

const Version = new Schema({
  survey: {
    type: Schema.Types.ObjectId,
    get: id => ((id) ? id.toString() : null),
    required: [true, 'needs to be an ID'],
  },
  to:  {
    type: Date,
    required: [false, 'needs to be a Date']
  },
  questions: {
    type: [Question],
    required: false,
  },
  versionNumber: {
    type: Number,
    required: [true, 'needs to be a Number']
  },
  summaries: [Summary],
}, { timestamps: { createdAt: 'from' } })

module.exports = Version
