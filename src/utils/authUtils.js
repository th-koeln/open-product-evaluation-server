/**
 * Created by Dennis Dubbert on 23.06.18.
 */


const jwt = require('jsonwebtoken')

module.exports.encodeUser = (id, isAdmin) => jwt.sign({
  id,
  isAdmin,
  type: 'user',
}, process.env.JWT_SECRET)

module.exports.encodeDevice = id => jwt.sign({
  id,
  type: 'device',
}, process.env.JWT_SECRET)

module.exports.decode = (auth) => {
  const token = auth.replace('Bearer ', '')
  return jwt.verify(token, process.env.JWT_SECRET)
}
