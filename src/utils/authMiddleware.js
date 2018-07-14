const userModel = require('../entities/user/user.model')
const deviceModel = require('../entities/device/device.model')
const { getMatchingId } = require('./idStore')
const authUtils = require('./authUtils')

module.exports = async (req, res, next) => {
  try {
    const auth = req.get('Authorization')
    if (auth) {
      const authObject = authUtils.decode(auth)
      const matchingId = getMatchingId(authObject.id)

      let entity
      switch (authObject.type) {
        case 'user': {
          [entity] = await userModel.get({ _id: matchingId })
          break
        }
        case 'device': {
          [entity] = await deviceModel.get({ _id: matchingId })
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
