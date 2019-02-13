const mongoose = require('mongoose')

const { Schema } = mongoose

const Password = new Schema({
  passwordHash: { type: String, required: [true, 'needs to be a String'] },
  salt: { type: String, required: [true, 'needs to be a String'] },
})

const User = new Schema({
  firstName: { type: String, required: [true, 'needs to be a String'] },
  lastName: { type: String, required: [true, 'needs to be a String'] },
  email: { type: String, required: [true, 'needs to be a String'] },
  passwordData: { type: Password, required: true },
  isAdmin: { type: Boolean, default: false, required: [true, 'needs to be a Boolean'] },
}, { timestamps: { createdAt: 'creationDate', updatedAt: 'lastUpdate' } })

module.exports = User
