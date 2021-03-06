const { createHashFromId } = require('../../../src/store/id.store')
const { encodeClient } = require('../../../src/utils/auth')
const { inspect } = require('util')

const getRequestParameterString = (parameterObject) => {
  const parameterString = inspect(parameterObject, null, null)
  return parameterString.replace(/'/g, '"').substring(1, parameterString.length - 1)
}

module.exports = {
  getSeedID: o => createHashFromId(o._id.toHexString()),
  getNotMatchingID: () => createHashFromId('5c9ce3611c9080bcf558ba3f'),
  getClientToken: (o, lifetime) => encodeClient(createHashFromId(o._id.toHexString()), lifetime),
  getRequestString: (type, requestName, responseAttributeString, parameterObject) => {
    return `${type} {
      ${requestName} ${(parameterObject) ? `( ${ getRequestParameterString(parameterObject) } )` : ''}
      {
        ${responseAttributeString}
      }
    }`
  },
  promiseTimeout: () => {
    return new Promise((resolve) => {
      setTimeout(() => { resolve() }, 2000)
    })
  }
}
