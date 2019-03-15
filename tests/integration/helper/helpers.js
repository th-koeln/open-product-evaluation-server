const { createHashFromId } = require('../../../src/store/id.store')
const { encodeClient } = require('../../../src/utils/auth')
const { ObjectId } = require('mongodb')
const { createHash } = require('crypto')

const getObjectID = (name) => {
  const hash = createHash('sha1')
    .update(name, 'utf8')
    .digest('hex')

  return new ObjectId(hash.substring(0, 24))
}

module.exports = {
  getSeedID: o => createHashFromId(o._id.toHexString()),
  getClientToken: o => encodeClient(createHashFromId(o._id.toHexString())),
  getObjectID
}
