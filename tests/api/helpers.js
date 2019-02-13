const { createHashFromId } = require('../src/utils/idStore')
const { encodeClient } = require('../src/utils/authUtils')

module.exports = {
  getSeedID: o => createHashFromId(o._id.toHexString()),
  getClientToken: o => encodeClient(createHashFromId(o._id.toHexString())),
}
