const { ObjectId } = require('mongodb')

const clients = [
  {
    '_id' : ObjectId('5c8e47153ad86943f22d6a19'),
    'owners' : [
      ObjectId('a1881c06eec96db9901c7bbf')
    ],
    'name' : 'Tablet in der Eingangshalle der TH',
    'code' : 'FKYBFHNUQ',
    'lifetime' : 'PERMANENT',
    'creationDate' : '2019-03-17T13:09:41.754Z',
    'lastUpdate' : '2019-03-17T13:10:15.765Z',
    'domain' : '5c8e470c3ad86943f22d6a14'
  },
  {
    '_id' : ObjectId('5c8e471b3ad86943f22d6a1b'),
    'owners' : [
      ObjectId('a1881c06eec96db9901c7bbf')
    ],
    'name' : 'Bildschirm in der Eingangshalle der TH',
    'code' : 'P3VMP72GQ',
    'lifetime' : 'PERMANENT',
    'creationDate' : '2019-03-17T13:09:47.786Z',
    'lastUpdate' : '2019-03-17T13:10:00.392Z',
    'domain' : ObjectId('5c8e470c3ad86943f22d6a14')
  },
  {
    '_id' : ObjectId('5c8e48ef3ad86943f22d6b12'),
    'owners' : [
      ObjectId('b3daa77b4c04a9551b8781d0')
    ],
    'name' : 'Markttablet',
    'code' : 'P3DRU72GQ',
    'lifetime' : 'PERMANENT',
    'creationDate' : '2019-03-17T13:17:35.571Z',
    'lastUpdate' : '2019-03-17T13:17:54.056Z',
    'domain' : ObjectId('5c8e48df3ad86943f22d6b0d')
  },
  {
    '_id' : ObjectId('5c8e48f73ad86943f22d6b14'),
    'owners' : [
      ObjectId('b3daa77b4c04a9551b8781d0')
    ],
    'name' : 'Litfaßsäule am Markt',
    'code' : 'FKWGG72UQ',
    'lifetime' : 'PERMANENT',
    'creationDate' : '2019-03-17T13:17:43.791Z',
    'lastUpdate' : '2019-03-17T13:17:51.430Z',
    'domain' : ObjectId('5c8e48df3ad86943f22d6b0d')
  },
  {
    '_id' : ObjectId('5c940c1b4c581f58a2e642a0'),
    'owners' : [],
    'name' : 'Temporary Client',
    'lifetime' : 'TEMPORARY',
    'creationDate' : '2019-03-21T22:11:39.056Z',
    'lastUpdate' : '2019-03-21T22:11:39.056Z',
    'domain' : ObjectId('5c8e48df3ad86943f22d6b0d'),
  }
]

module.exports = clients
