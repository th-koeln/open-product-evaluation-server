const { createHashFromId } = require('../src/utils/idStore')

module.exports = {
  getSeedID: o => createHashFromId(o._id.toHexString()),
}
