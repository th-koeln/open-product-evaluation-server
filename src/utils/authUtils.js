/**
 * Created by Dennis Dubbert on 23.06.18.
 */


const jwt = require('jsonwebtoken')

const SECRET = 'hiimatestkey' // TODO: -> to config

module.exports.encodeUser = (id, isAdmin) => jwt.sign({
  id,
  isAdmin,
  type: 'user',
}, SECRET)

module.exports.encodeDevice = id => jwt.sign({
  id,
  type: 'device',
}, SECRET)

module.exports.decode = (auth) => {
  const token = auth.replace('Bearer ', '')
  return jwt.verify(token, SECRET)
}
