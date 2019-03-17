const { ObjectId } = require('mongodb')

const questions = [
  {
    '_id' : ObjectId('5c8e45d33ad86943f22d6989'),
    'itemOrder' : [],
    'choiceOrder' : [],
    'labelOrder' : [],
    'stepSize' : 1,
    'min' : 0,
    'max' : 10,
    'regulatorDefault' : 5,
    'value' : 'Sind Sie Student der TH Köln?',
    'description' : null,
    'type' : 'LIKE',
    'survey' : ObjectId('5c8e45d13ad86943f22d6983'),
    'user' : ObjectId('a1881c06eec96db9901c7bbf'),
    'items' : [],
    'choices' : [],
    'labels' : [],
    'creationDate' : '2019-03-17T13:04:19.609Z',
    'lastUpdate' : '2019-03-17T13:04:26.986Z',
  },
  {
    '_id' : ObjectId('5c8e45e33ad86943f22d698d'),
    'itemOrder' : [ 
      ObjectId('5c8e45ee3ad86943f22d6991'), 
      ObjectId('5c8e45f23ad86943f22d6994')
    ],
    'choiceOrder' : [],
    'labelOrder' : [],
    'stepSize' : 1,
    'min' : 0,
    'max' : 10,
    'regulatorDefault' : 5,
    'value' : 'Sind Sie zufrieden mit der Mensa am Campus Gummersbach?',
    'description' : null,
    'type' : 'LIKEDISLIKE',
    'survey' : ObjectId('5c8e45d13ad86943f22d6983'),
    'user' : ObjectId('a1881c06eec96db9901c7bbf'),
    'items' : [ 
      {
        '_id' : ObjectId('5c8e45ee3ad86943f22d6991'),
        'label' : 'Mensa'
      }, 
      {
        '_id' : ObjectId('5c8e45f23ad86943f22d6994'),
        'label' : 'Küche'
      }
    ],
    'choices' : [],
    'labels' : [],
    'creationDate' : '2019-03-17T13:04:35.988Z',
    'lastUpdate' : '2019-03-17T13:04:55.727Z',
  },
  {
    '_id' : ObjectId('5c8e45f93ad86943f22d6997'),
    'itemOrder' : [],
    'choiceOrder' : [ 
      ObjectId('5c8e46033ad86943f22d699b'), 
      ObjectId('5c8e460a3ad86943f22d699e'), 
      ObjectId('5c8e460c3ad86943f22d69a1'), 
      ObjectId('5c8e460e3ad86943f22d69a4'), 
      ObjectId('5c8e460f3ad86943f22d69a7'), 
      ObjectId('5c8e46113ad86943f22d69aa')
    ],
    'labelOrder' : [],
    'stepSize' : 1,
    'min' : 0,
    'max' : 10,
    'regulatorDefault' : 5,
    'value' : 'Wie oft sind Sie durchschnittlich pro Woche in der Hochschule?',
    'description' : null,
    'type' : 'CHOICE',
    'survey' : ObjectId('5c8e45d13ad86943f22d6983'),
    'user' : ObjectId('a1881c06eec96db9901c7bbf'),
    'items' : [],
    'choices' : [ 
      {
        '_id' : ObjectId('5c8e46033ad86943f22d699b'),
        'label' : 'Niemals',
        'code' : 'A'
      }, 
      {
        '_id' : ObjectId('5c8e460a3ad86943f22d699e'),
        'label' : '1',
        'code' : 'B'
      }, 
      {
        '_id' : ObjectId('5c8e460c3ad86943f22d69a1'),
        'label' : '2',
        'code' : 'C'
      }, 
      {
        '_id' : ObjectId('5c8e460e3ad86943f22d69a4'),
        'label' : '3',
        'code' : 'D'
      }, 
      {
        '_id' : ObjectId('5c8e460f3ad86943f22d69a7'),
        'label' : '4',
        'code' : 'E'
      }, 
      {
        '_id' : ObjectId('5c8e46113ad86943f22d69aa'),
        'label' : 'Mehr als 4',
        'code' : 'F'
      }
    ],
    'labels' : [],
    'creationDate' : '2019-03-17T13:04:57.429Z',
    'lastUpdate' : '2019-03-17T13:05:24.799Z',
  },
  {
    '_id' : ObjectId('5c8e46163ad86943f22d69ad'),
    'itemOrder' : [ 
      ObjectId('5c8e46423ad86943f22d69be'), 
      ObjectId('5c8e46493ad86943f22d69c1'), 
      ObjectId('5c8e464e3ad86943f22d69c4')
    ],
    'choiceOrder' : [],
    'labelOrder' : [ 
      ObjectId('5c8e46293ad86943f22d69b2'), 
      ObjectId('5c8e462f3ad86943f22d69b6'), 
      ObjectId('5c8e46383ad86943f22d69ba')
    ],
    'stepSize' : 1,
    'min' : 1,
    'max' : 10,
    'regulatorDefault' : 5,
    'value' : 'Wie zufrieden sind Sie mit dem Essen in der Mensa?',
    'description' : null,
    'type' : 'REGULATOR',
    'survey' : ObjectId('5c8e45d13ad86943f22d6983'),
    'user' : ObjectId('a1881c06eec96db9901c7bbf'),
    'items' : [ 
      {
        '_id' : ObjectId('5c8e46423ad86943f22d69be'),
        'label' : 'Pommes mit Currywurst'
      }, 
      {
        '_id' : ObjectId('5c8e46493ad86943f22d69c1'),
        'label' : 'Borscht'
      }, 
      {
        '_id' : ObjectId('5c8e464e3ad86943f22d69c4'),
        'label' : 'Paniertes Schollenfilet'
      }
    ],
    'choices' : [],
    'labels' : [ 
      {
        '_id' : ObjectId('5c8e46293ad86943f22d69b2'),
        'label' : 'Nicht zufrieden :x',
        'value' : 1
      }, 
      {
        '_id' : ObjectId('5c8e462f3ad86943f22d69b6'),
        'label' : 'Ganz okay',
        'value' : 5
      }, 
      {
        '_id' : ObjectId('5c8e46383ad86943f22d69ba'),
        'label' : 'Voll Zufrieden',
        'value' : 10
      }
    ],
    'creationDate' : '2019-03-17T13:05:26.856Z',
    'lastUpdate' : '2019-03-17T13:06:29.640Z',
  },{
    '_id' : ObjectId('5c8e46563ad86943f22d69c7'),
    'itemOrder' : [ 
      ObjectId('5c8e46833ad86943f22d69cb'), 
      ObjectId('5c8e46893ad86943f22d69ce'), 
      ObjectId('5c8e468f3ad86943f22d69d1'), 
      ObjectId('5c8e46953ad86943f22d69d4'), 
      ObjectId('5c8e469b3ad86943f22d69d7'), 
      ObjectId('5c8e46a03ad86943f22d69da'), 
      ObjectId('5c8e46a93ad86943f22d69dd')
    ],
    'choiceOrder' : [],
    'labelOrder' : [],
    'stepSize' : 1,
    'min' : 0,
    'max' : 10,
    'regulatorDefault' : 5,
    'value' : 'Welchen Professor finden Sie am kompetentesten?',
    'description' : null,
    'type' : 'FAVORITE',
    'survey' : ObjectId('5c8e45d13ad86943f22d6983'),
    'user' : ObjectId('a1881c06eec96db9901c7bbf'),
    'items' : [ 
      {
        '_id' : ObjectId('5c8e46833ad86943f22d69cb'),
        'label' : 'Prof. Fischer'
      }, 
      {
        '_id' : ObjectId('5c8e46893ad86943f22d69ce'),
        'label' : 'Prof. Noss'
      }, 
      {
        '_id' : ObjectId('5c8e468f3ad86943f22d69d1'),
        'label' : 'Prof. Kohls'
      }, 
      {
        '_id' : ObjectId('5c8e46953ad86943f22d69d4'),
        'label' : 'Prof. Eisemann'
      }, 
      {
        '_id' : ObjectId('5c8e469b3ad86943f22d69d7'),
        'label' : 'Prof. Kornacher'
      }, 
      {
        '_id' : ObjectId('5c8e46a03ad86943f22d69da'),
        'label' : 'Prof. Hartmann'
      }, 
      {
        '_id' : ObjectId('5c8e46a93ad86943f22d69dd'),
        'label' : 'Prof. Winter'
      }
    ],
    'choices' : [],
    'labels' : [],
    'creationDate' : '2019-03-17T13:06:30.871Z',
    'lastUpdate' : '2019-03-17T13:07:59.718Z',
  },
  {
    '_id' : ObjectId('5c8e46b03ad86943f22d69e0'),
    'itemOrder' : [ 
      ObjectId('5c8e46bb3ad86943f22d69e4'), 
      ObjectId('5c8e46c13ad86943f22d69e7'), 
      ObjectId('5c8e46c63ad86943f22d69ea'), 
      ObjectId('5c8e46cc3ad86943f22d69ed'), 
      ObjectId('5c8e46d23ad86943f22d69f0')
    ],
    'choiceOrder' : [],
    'labelOrder' : [],
    'stepSize' : 1,
    'min' : 0,
    'max' : 10,
    'regulatorDefault' : 5,
    'value' : 'Sortieren Sie diese Fächer nach dem subjektiven Lerngewinn.',
    'description' : null,
    'type' : 'RANKING',
    'survey' : ObjectId('5c8e45d13ad86943f22d6983'),
    'user' : ObjectId('a1881c06eec96db9901c7bbf'),
    'items' : [ 
      {
        '_id' : ObjectId('5c8e46bb3ad86943f22d69e4'),
        'label' : 'Mathematik 1 und 2'
      }, 
      {
        '_id' : ObjectId('5c8e46c13ad86943f22d69e7'),
        'label' : 'Algorithmen und Programmierung 1 und 2'
      }, 
      {
        '_id' : ObjectId('5c8e46c63ad86943f22d69ea'),
        'label' : 'Theoretische Informatik'
      }, 
      {
        '_id' : ObjectId('5c8e46cc3ad86943f22d69ed'),
        'label' : 'Mensch-Computer-Interaktion'
      }, 
      {
        '_id' : ObjectId('5c8e46d23ad86943f22d69f0'),
        'label' : 'Computergrafik und Animation'
      }
    ],
    'choices' : [],
    'labels' : [],
    'creationDate' : '2019-03-17T13:08:00.660Z',
    'lastUpdate' : '2019-03-17T13:08:40.399Z',
  },
  {
    '_id' : ObjectId('5c8e478c3ad86943f22d6a98'),
    'itemOrder' : [ 
      ObjectId('5c8e47d23ad86943f22d6ab2')
    ],
    'choiceOrder' : [],
    'labelOrder' : [],
    'stepSize' : 1,
    'min' : 0,
    'max' : 10,
    'regulatorDefault' : 5,
    'value' : 'Wie gefallen Ihnen diese Kirschen?',
    'description' : null,
    'type' : 'LIKE',
    'survey' : ObjectId('5c8e478a3ad86943f22d6a92'),
    'user' : ObjectId('b3daa77b4c04a9551b8781d0'),
    'items' : [ 
      {
        '_id' : ObjectId('5c8e47d23ad86943f22d6ab2'),
        'label' : 'Kirschen'
      }
    ],
    'choices' : [],
    'labels' : [],
    'creationDate' : '2019-03-17T13:11:40.287Z',
    'lastUpdate' : '2019-03-17T13:12:52.719Z',
  },{
    '_id' : ObjectId('5c8e478f3ad86943f22d6a9b'),
    'itemOrder' : [ 
      ObjectId('5c8e47bc3ad86943f22d6aab'), 
      ObjectId('5c8e47be3ad86943f22d6aae')
    ],
    'choiceOrder' : [],
    'labelOrder' : [],
    'stepSize' : 1,
    'min' : 0,
    'max' : 10,
    'regulatorDefault' : 5,
    'value' : 'Essen Sie gerne Obst?',
    'description' : null,
    'type' : 'LIKEDISLIKE',
    'survey' : ObjectId('5c8e478a3ad86943f22d6a92'),
    'user' : ObjectId('b3daa77b4c04a9551b8781d0'),
    'items' : [ 
      {
        '_id' : ObjectId('5c8e47bc3ad86943f22d6aab'),
        'label' : 'Kirschen'
      }, 
      {
        '_id' : ObjectId('5c8e47be3ad86943f22d6aae'),
        'label' : 'Äpfel'
      }
    ],
    'choices' : [],
    'labels' : [],
    'creationDate' : '2019-03-17T13:11:43.180Z',
    'lastUpdate' : '2019-03-17T13:12:34.522Z',
  },{
    '_id' : ObjectId('5c8e47913ad86943f22d6a9e'),
    'itemOrder' : [ 
      ObjectId('5c8e48383ad86943f22d6ad4'), 
      ObjectId('5c8e483f3ad86943f22d6ad7'), 
      ObjectId('5c8e48413ad86943f22d6ada')
    ],
    'choiceOrder' : [ 
      ObjectId('5c8e47ef3ad86943f22d6ac8'), 
      ObjectId('5c8e47e23ad86943f22d6ab6'), 
      ObjectId('5c8e47e43ad86943f22d6ab9'), 
      ObjectId('5c8e47e53ad86943f22d6abc')
    ],
    'labelOrder' : [],
    'stepSize' : 1,
    'min' : 0,
    'max' : 10,
    'regulatorDefault' : 5,
    'value' : 'Wie viel geben Sie für Obst in der Woche aus?',
    'description' : null,
    'type' : 'CHOICE',
    'survey' : ObjectId('5c8e478a3ad86943f22d6a92'),
    'user' : ObjectId('b3daa77b4c04a9551b8781d0'),
    'items' : [ 
      {
        '_id' : ObjectId('5c8e48383ad86943f22d6ad4'),
        'label' : 'Bananen'
      }, 
      {
        '_id' : ObjectId('5c8e483f3ad86943f22d6ad7'),
        'label' : 'Äpfel'
      }, 
      {
        '_id' : ObjectId('5c8e48413ad86943f22d6ada'),
        'label' : 'Kiwis'
      }
    ],
    'choices' : [ 
      {
        '_id' : ObjectId('5c8e47e23ad86943f22d6ab6'),
        'label' : 'Weniger als 10 Euro',
        'code' : 'A'
      }, 
      {
        '_id' : ObjectId('5c8e47e43ad86943f22d6ab9'),
        'label' : 'Mehr als 10 Euro und weniger als 20 Euro',
        'code' : 'B'
      }, 
      {
        '_id' : ObjectId('5c8e47e53ad86943f22d6abc'),
        'label' : 'Mehr als 20 Euro',
        'code' : 'C'
      }, 
      {
        '_id' : ObjectId('5c8e47ef3ad86943f22d6ac8'),
        'label' : 'Gar nichts',
        'code' : 'G'
      }
    ],
    'labels' : [],
    'creationDate' : '2019-03-17T13:11:45.968Z',
    'lastUpdate' : '2019-03-17T13:14:45.981Z',
  },{
    '_id' : ObjectId('5c8e47943ad86943f22d6aa1'),
    'itemOrder' : [],
    'choiceOrder' : [],
    'labelOrder' : [ 
      ObjectId('5c8e48563ad86943f22d6ae0'), 
      ObjectId('5c8e48593ad86943f22d6ae3')
    ],
    'stepSize' : 1,
    'min' : 0,
    'max' : 5,
    'regulatorDefault' : 3,
    'value' : 'Wie viel Obst essen Sie am Tag?',
    'description' : null,
    'type' : 'REGULATOR',
    'survey' : ObjectId('5c8e478a3ad86943f22d6a92'),
    'user' : ObjectId('b3daa77b4c04a9551b8781d0'),
    'items' : [],
    'choices' : [],
    'labels' : [ 
      {
        '_id' : ObjectId('5c8e48563ad86943f22d6ae0'),
        'label' : 'Nichts',
        'value' : 1
      }, 
      {
        '_id' : ObjectId('5c8e48593ad86943f22d6ae3'),
        'label' : 'Sehr viel',
        'value' : 5
      }
    ],
    'creationDate' : '2019-03-17T13:11:48.825Z',
    'lastUpdate' : '2019-03-17T13:15:08.591Z',
  },{
    '_id' : ObjectId('5c8e47993ad86943f22d6aa4'),
    'itemOrder' : [ 
      ObjectId('5c8e48743ad86943f22d6ae7'), 
      ObjectId('5c8e48773ad86943f22d6aea'), 
      ObjectId('5c8e487a3ad86943f22d6aed'), 
      ObjectId('5c8e487d3ad86943f22d6af0'), 
      ObjectId('5c8e48813ad86943f22d6af3')
    ],
    'choiceOrder' : [],
    'labelOrder' : [],
    'stepSize' : 1,
    'min' : 0,
    'max' : 10,
    'regulatorDefault' : 5,
    'value' : 'Was ist ihr Lieblingsobst?',
    'description' : null,
    'type' : 'FAVORITE',
    'survey' : ObjectId('5c8e478a3ad86943f22d6a92'),
    'user' : ObjectId('b3daa77b4c04a9551b8781d0'),
    'items' : [ 
      {
        '_id' : ObjectId('5c8e48743ad86943f22d6ae7'),
        'label' : 'Kirschen'
      }, 
      {
        '_id' : ObjectId('5c8e48773ad86943f22d6aea'),
        'label' : 'Bananen'
      }, 
      {
        '_id' : ObjectId('5c8e487a3ad86943f22d6aed'),
        'label' : 'Äpfel'
      }, 
      {
        '_id' : ObjectId('5c8e487d3ad86943f22d6af0'),
        'label' : 'Birnen'
      }, 
      {
        '_id' : ObjectId('5c8e48813ad86943f22d6af3'),
        'label' : 'Erdbeeren'
      }
    ],
    'choices' : [],
    'labels' : [],
    'creationDate' : '2019-03-17T13:11:53.417Z',
    'lastUpdate' : '2019-03-17T13:15:52.366Z',
  },
  {
    '_id' : ObjectId('5c8e479d3ad86943f22d6aa7'),
    'itemOrder' : [ 
      ObjectId('5c8e48a53ad86943f22d6af7'), 
      ObjectId('5c8e48a93ad86943f22d6afa'), 
      ObjectId('5c8e48ab3ad86943f22d6afd'), 
      ObjectId('5c8e48b03ad86943f22d6b00')
    ],
    'choiceOrder' : [],
    'labelOrder' : [],
    'stepSize' : 1,
    'min' : 0,
    'max' : 10,
    'regulatorDefault' : 5,
    'value' : 'Welches Obst essen Sie am häufigsten?',
    'description' : null,
    'type' : 'RANKING',
    'survey' : ObjectId('5c8e478a3ad86943f22d6a92'),
    'user' : ObjectId('b3daa77b4c04a9551b8781d0'),
    'items' : [ 
      {
        '_id' : ObjectId('5c8e48a53ad86943f22d6af7'),
        'label' : 'Äpfel'
      }, 
      {
        '_id' : ObjectId('5c8e48a93ad86943f22d6afa'),
        'label' : 'Bananen'
      }, 
      {
        '_id' : ObjectId('5c8e48ab3ad86943f22d6afd'),
        'label' : 'Heidelbeeren'
      }, 
      {
        '_id' : ObjectId('5c8e48b03ad86943f22d6b00'),
        'label' : 'Erdbeeren'
      }
    ],
    'choices' : [],
    'labels' : [],
    'creationDate' : '2019-03-17T13:11:57.198Z',
    'lastUpdate' : '2019-03-17T13:16:43.989Z',
  }
]

module.exports = questions