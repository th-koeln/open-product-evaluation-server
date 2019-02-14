const { getMatchingId } = require('../store/id.store')
const { decode } = require('../utils/auth')
const { ADMIN, USER, CLIENT } = require('../utils/roles')

module.exports = models => async (req, res, next) => {
  try {
    const auth = req.get('Authorization')
    if (auth) {
      const authObject = decode(auth)
      const matchingId = getMatchingId(authObject.id)
      let role
      let entity
      switch (authObject.type) {
        case 'user': {
          [entity] = await models.user.get({ _id: matchingId })
          role = USER
          if (entity.isAdmin) { role = ADMIN }
          break
        }
        case 'client': {
          [entity] = await models.client.get({ _id: matchingId })
          role = CLIENT
          break
        }
        default: throw new Error('Unknown entity.')
      }

      req.auth = { [authObject.type]: entity }
      req.auth.id = entity.id
      req.auth.role = role
    }

    next()
  } catch (e) {
    res.send({
      data: null,
      errors: [
        { message: 'Authorization failed' },
      ],
    })
  }
}
