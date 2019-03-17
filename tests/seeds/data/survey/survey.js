const { ObjectId } = require('mongodb')

const surveys = [
  {
    '_id' : ObjectId('5c8e45d13ad86943f22d6983'),
    'types' : [ 
      'LIKE', 
      'LIKEDISLIKE', 
      'CHOICE', 
      'REGULATOR', 
      'FAVORITE', 
      'RANKING'
    ],
    'isActive' : true,
    'questionOrder' : [ 
      ObjectId('5c8e45d33ad86943f22d6989'), 
      ObjectId('5c8e45e33ad86943f22d698d'), 
      ObjectId('5c8e45f93ad86943f22d6997'), 
      ObjectId('5c8e46163ad86943f22d69ad'), 
      ObjectId('5c8e46563ad86943f22d69c7'), 
      ObjectId('5c8e46b03ad86943f22d69e0')
    ],
    'title' : 'Umfrage zur Zufriedenheit an der Technischen Hochschule Köln',
    'description' : 'Diese Umfrage versucht zu ermitteln, wie zufrieden die Studierenden mit der Technischen Hochschule Köln sind.',
    'creator' : ObjectId('a1881c06eec96db9901c7bbf'),
    'creationDate' : '2019-03-17T13:04:17.916Z',
    'lastUpdate' : '2019-03-17T13:08:44.234Z',
  },{
    '_id' : ObjectId('5c8e478a3ad86943f22d6a92'),
    'types' : [ 
      'LIKE', 
      'LIKEDISLIKE', 
      'CHOICE', 
      'REGULATOR', 
      'FAVORITE', 
      'RANKING'
    ],
    'isActive' : true,
    'questionOrder' : [ 
      ObjectId('5c8e478c3ad86943f22d6a98'), 
      ObjectId('5c8e478f3ad86943f22d6a9b'), 
      ObjectId('5c8e47913ad86943f22d6a9e'), 
      ObjectId('5c8e47943ad86943f22d6aa1'), 
      ObjectId('5c8e47993ad86943f22d6aa4'), 
      ObjectId('5c8e479d3ad86943f22d6aa7')
    ],
    'title' : 'Umfrage zum Konsumverhalten von Obst',
    'description' : 'Diese Umfrage versucht zu ermitteln, welches Konsumverhalten Menschen gegenüber Obst an den Tag legen.',
    'creator' : ObjectId('b3daa77b4c04a9551b8781d0'),
    'creationDate' : '2019-03-17T13:11:38.318Z',
    'lastUpdate' : '2019-03-17T13:19:09.111Z',
  }
]

module.exports = surveys