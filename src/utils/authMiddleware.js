const userModel = require('../entities/user/user.model')
const deviceModel = require('../entities/device/device.model')
const { getMatchingId } = require('./idStore')
const authUtils = require('./authUtils')
const { ADMIN, USER, DEVICE } = require('./roles')

module.exports = async (req, res, next) => {
  try {
    const auth = req.get('Authorization')
    if (auth) {
      const authObject = authUtils.decode(auth)
      const matchingId = getMatchingId(authObject.id)
      let role
      let entity
      switch (authObject.type) {
        case 'user': {
          [entity] = await userModel.get({ _id: matchingId })
          role = USER
          if (entity.isAdmin) role = ADMIN
          break
        }
        case 'device': {
          [entity] = await deviceModel.get({ _id: matchingId })
          role = DEVICE
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
    console.log(e)
    res.send({
      data: null,
      errors: [
        { message: 'Authorization failed' },
      ],
    })
  }
}
