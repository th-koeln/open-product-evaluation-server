const mongoose = require('mongoose')

const { Schema } = mongoose

const State = new Schema({
  key: { type: String, required: true },
  value: { type: String, required: true },
}, { _id: false })

module.exports = State
