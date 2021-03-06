const { ObjectId } = require('mongodb')

const user = [
  {
    '_id' : ObjectId('b3daa77b4c04a9551b8781d0'),
    'creationDate' : '2019-03-15T10:55:44.167Z',
    'lastUpdate' : '2019-03-15T10:55:44.167Z',
    'firstName' : 'John',
    'lastName' : 'Doe',
    'passwordData' : {
      'salt' : '531049bd93c9841c',
      'passwordHash' : '2059afbceab6ff0a61cff44737a486765da85266dfa4ed6c2b0cc26de378185ea31be69822973524e5562b00cad7bbffd5cdab6ee2c20f3d23eb252f24db464e'
    },
    'email' : 'john@doe.com',
    'isAdmin' : false
  },
  {
    '_id' : ObjectId('a1881c06eec96db9901c7bbf'),
    'creationDate' : '2019-03-17T10:55:44.167Z',
    'lastUpdate' : '2019-03-17T10:55:44.167Z',
    'firstName' : 'Jane',
    'lastName' : 'Doe',
    'passwordData' : {
      'salt' : '1425a1e0701552c8',
      'passwordHash' : '350810e5a42912ddc2961afeb7837f187b9bd4fa17c82c2b7432711750ec3374b29fb410d362d18d343df8cff53df99eeabaec0770d63bf5b6c24d5f90d2ab5e'
    },
    'email' : 'jane@doe.com',
    'isAdmin' : true
  },
  {
    '_id' : ObjectId('0b7f849446d3383546d15a48'),
    'creationDate' : '2019-03-16T10:55:44.167Z',
    'lastUpdate' : '2019-03-16T10:55:44.167Z',
    'firstName' : 'Jake',
    'lastName' : 'Doe',
    'passwordData' : {
      'salt' : 'b9c91eba254797fd',
      'passwordHash' : '50036542ba68763a319740ebcd86a8595ca68d03c9e2d2ad2328996bdbeeb29726f6d9670eee4f3361896db0da026a2274ae21baa9f58431a0571905c31dd3f7'
    },
    'email' : 'jake@doe.com',
    'isAdmin' : true
  }
]

module.exports = user