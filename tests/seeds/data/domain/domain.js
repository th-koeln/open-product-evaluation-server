const { ObjectId } = require('mongodb')

const domains = [
  {
    '_id' : ObjectId('5c8e470c3ad86943f22d6a14'),
    'owners' : [ 
      ObjectId('a1881c06eec96db9901c7bbf')
    ],
    'isPublic' : false,
    'name' : 'TH Eingangshalle',
    'states' : [],
    'creationDate' : '2019-03-17T13:09:32.235Z',
    'lastUpdate' : '2019-03-17T13:10:17.439Z',
    'activeQuestion' : null,
    'activeSurvey' : ObjectId('5c8e45d13ad86943f22d6983')
  },
  {
    '_id' : ObjectId('5c8e48df3ad86943f22d6b0d'),
    'owners' : [ 
      ObjectId('b3daa77b4c04a9551b8781d0')
    ],
    'isPublic' : true,
    'name' : 'Kölner Markt',
    'states' : [],
    'creationDate' : '2019-03-17T13:17:19.865Z',
    'lastUpdate' : '2019-03-17T13:19:16.353Z',
    'activeSurvey' : ObjectId('5c8e478a3ad86943f22d6a92'),
    'activeQuestion' : null
  }
]

module.exports = domains