const mongoose = require('mongoose')

const { Schema } = mongoose

const Client = new Schema({
  name: { type: String, required: [true, 'needs to be a String'] },
  domain: { type: Schema.Types.ObjectId, get: id => ((id) ? id.toString() : null) },
  owners: {
    type: [Schema.Types.ObjectId],
    get: (arr) => {
      if (arr) {
        return arr.map(id => id.toString())
      }
      return []
    },
  },
  code: { type: String, required: [false, 'needs to be a String'] },
}, { timestamps: { createdAt: 'creationDate', updatedAt: 'lastUpdate' } })

module.exports = Client
