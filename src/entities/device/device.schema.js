const mongoose = require('mongoose')

const { Schema } = mongoose

const Device = new Schema({
  name: { type: String, required: true },
  context: Schema.Types.ObjectId,
  owners: [Schema.Types.ObjectId],
}, { timestamps: { createdAt: 'creationDate', updatedAt: 'lastUpdate' } })

Device.methods.toClient = function toClient() {
  const obj = this.toObject()
  obj.id = obj._id
  delete obj._id

  return obj
}

module.exports = Device

