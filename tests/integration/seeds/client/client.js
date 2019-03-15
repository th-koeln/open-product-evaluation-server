const shortId = require('shortid')
const { getObjectID } = require('../../helper/helpers.js')

const clients = [
  {
    _id: getObjectID('client1'),
    creationDate: new Date(),
    lastUpdate: new Date(),
    name: 'Forum Fernseher',
    domain: getObjectID('domain1'),
    owners: [getObjectID('user1')],
    code: shortId.generate(),
    lifetime: 'PERMANENT',
  },
  {
    _id: getObjectID('client2'),
    creationDate: new Date(),
    lastUpdate: new Date(),
    name: 'Forum Tablet',
    domain: getObjectID('domain1'),
    owners: [getObjectID('user1')],
    code: shortId.generate(),
    lifetime: 'PERMANENT',
  },
  {
    _id: getObjectID('client3'),
    creationDate: new Date(),
    lastUpdate: new Date(),
    name: 'Mensa Kiosk',
    domain: getObjectID('domain2'),
    owners: [getObjectID('user2')],
    code: shortId.generate(),
    lifetime: 'PERMANENT',
  },
  {
    _id: getObjectID('client4'),
    creationDate: new Date(),
    lastUpdate: new Date(),
    name: 'Mensa Tablet',
    domain: getObjectID('domain2'),
    owners: [getObjectID('user2')],
    code: shortId.generate(),
    lifetime: 'PERMANENT',
  },
]

module.exports = clients
