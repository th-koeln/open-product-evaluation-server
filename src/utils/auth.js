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

const isUser = authObject => (authObject && Object.prototype.hasOwnProperty.call(authObject, 'user'))

const isClient = authObject => (authObject && Object.prototype.hasOwnProperty.call(authObject, 'client'))

const isAdmin = authObject => (isUser(authObject) && authObject.user.isAdmin)

// eslint-disable-next-line
const userIdIsMatching = (authObject, wishedId) => (isAdmin(authObject) || (isUser(authObject) && authObject.user.id === wishedId))

// eslint-disable-next-line
const clientIdIsMatching = (authObject, wishedId) => (isClient(authObject) && authObject.client.id === wishedId)

module.exports = {
  encodeUser,
  encodeClient,
  decode,
  isUser,
  isClient,
  isAdmin,
  userIdIsMatching,
  clientIdIsMatching,
}
