/**
 * Created by Dennis Dubbert on 23.06.18.
 */


const jwt = require('jsonwebtoken')
const config = require('../../config')

module.exports.encodeUser = (id, isAdmin) => jwt.sign({
  id,
  isAdmin,
  type: 'user',
}, config.app.jwtSecret)

module.exports.encodeDevice = id => jwt.sign({
  id,
  type: 'device',
}, config.app.jwtSecret)

module.exports.decode = (auth) => {
  const token = auth.replace('Bearer ', '')
  return jwt.verify(token, config.app.jwtSecret)
}
