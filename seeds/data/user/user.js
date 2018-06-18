const getObjectID = require('../../helper.js')

const user = [
  {
    _id: getObjectID('user1'),
    creationDate: new Date(),
    lastUpdate: new Date(),
    firstname: 'John',
    lastname: 'Doe',
    email: 'john@doe.com',
  },
  {
    _id: getObjectID('user2'),
    creationDate: new Date(),
    lastUpdate: new Date(),
    firstname: 'Jane',
    lastname: 'Doe',
    email: 'Jane@doe.com',
  },
  {
    _id: getObjectID('user3'),
    creationDate: new Date(),
    lastUpdate: new Date(),
    firstname: 'Jake',
    lastname: 'Doe',
    email: 'Jake@doe.com',
  },
]

module.exports = user
