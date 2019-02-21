const Question = require('../question/question.schema')
const mongoose = require('mongoose')

const { Schema } = mongoose

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
  }
}, { timestamps: { createdAt: 'from' } })

module.exports = Version
