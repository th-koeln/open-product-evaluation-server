const { createHashFromId } = require('../../src/store/id.store')
const { encodeClient } = require('../../src/utils/auth')

module.exports = {
  getSeedID: o => createHashFromId(o._id.toHexString()),
  getClientToken: o => encodeClient(createHashFromId(o._id.toHexString())),
}
