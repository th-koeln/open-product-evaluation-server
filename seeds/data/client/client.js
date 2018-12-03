const getObjectID = require('../../helper.js')

const clients = [
  {
    _id: getObjectID('client1'),
    creationDate: new Date(),
    lastUpdate: new Date(),
    name: 'Forum Fernseher',
    domain: getObjectID('domain1'),
    owners: [getObjectID('user1')],
  },
  {
    _id: getObjectID('client2'),
    creationDate: new Date(),
    lastUpdate: new Date(),
    name: 'Forum Tablet',
    domain: getObjectID('domain1'),
    owners: [],
  },
  {
    _id: getObjectID('client3'),
    creationDate: new Date(),
    lastUpdate: new Date(),
    name: 'Mensa Kiosk',
    domain: getObjectID('domain2'),
    owners: [],
  },
  {
    _id: getObjectID('client4'),
    creationDate: new Date(),
    lastUpdate: new Date(),
    name: 'Mensa Tablet',
    domain: getObjectID('domain2'),
    owners: [getObjectID('user2')],
  },
]

module.exports = clients
