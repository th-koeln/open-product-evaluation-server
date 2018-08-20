const { getMatchingId } = require('./idStore')
const { decode } = require('./authUtils')

module.exports = models => async (req, res, next) => {
  try {
    const auth = req.get('Authorization')
    if (auth) {
      const authObject = decode(auth)
      const matchingId = getMatchingId(authObject.id)

      let entity
      switch (authObject.type) {
        case 'user': {
          [entity] = await models.user.get({ _id: matchingId })
          break
        }
        case 'device': {
          [entity] = await models.device.get({ _id: matchingId })
          break
        }
        default: throw new Error('Unknown entity.')
      }

      req.auth = { [authObject.type]: entity }
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
