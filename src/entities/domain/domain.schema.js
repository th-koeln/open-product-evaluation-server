const mongoose = require('mongoose')

const { Schema } = mongoose

const State = new Schema({
  key: { type: String, required: [true, 'needs to be a String'] },
  value: { type: String, required: [true, 'needs to be a String'] },
}, { _id: false })

const Domain = new Schema({
  name: { type: String, required: [true, 'needs to be a String'] },
  activeQuestion: { type: Schema.Types.ObjectId, get: id => ((id) ? id.toString() : null) },
  activeSurvey: { type: Schema.Types.ObjectId, get: id => ((id) ? id.toString() : null) },
  owners: {
    type: [Schema.Types.ObjectId],
    get: (arr) => {
      if (arr) {
        return arr.map(id => id.toString())
      }
      return []
    },
  },
  states: [State],
}, { timestamps: { createdAt: 'creationDate', updatedAt: 'lastUpdate' } })

module.exports = Domain
