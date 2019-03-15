const jwt = require('jsonwebtoken')
const config = require('../../config')

const encodeUser = (id, isAdmin) => jwt.sign({
  id,
  isAdmin,
  type: 'user',
}, config.app.jwtSecret)

const encodeClient = (id, lifetime) => jwt.sign({
  id,
  lifetime,
  type: 'client',
}, config.app.jwtSecret)

const decode = (auth) => {
  const token = auth.replace('Bearer ', '')
  return jwt.verify(token, config.app.jwtSecret)
}

module.exports = {
  encodeUser,
  encodeClient,
  decode,
}
