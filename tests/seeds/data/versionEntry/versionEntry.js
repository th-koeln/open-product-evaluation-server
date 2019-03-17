const { ObjectId } = require('mongodb')

const versionEntries = [
  {
    '_id': ObjectId('a8399ebb0bc1f371786801c9'),
    'versionNumber': 1,
    'survey': ObjectId('5c8e45d13ad86943f22d6983'),
    'from': '2019-03-17T14:01:50.445Z',
    'questions': [
      {
        '_id': ObjectId('5c8e45d33ad86943f22d6989'),
        'itemOrder': [],
        'choiceOrder': [],
        'labelOrder': [],
        'stepSize': 1,
        'min': 0,
        'max': 10,
        'regulatorDefault': 5,
        'value': 'Sind Sie Student der TH Köln?',
        'description': null,
        'type': 'LIKE',
        'survey': ObjectId('5c8e45d13ad86943f22d6983'),
        'user': ObjectId('a1881c06eec96db9901c7bbf'),
        'items': [],
        'choices': [],
        'labels': [],
        'creationDate': '2019-03-17T13:04:19.609Z',
        'lastUpdate': '2019-03-17T13:04:26.986Z'
      },
      {
        '_id': ObjectId('5c8e45e33ad86943f22d698d'),
        'itemOrder': [
          ObjectId('5c8e45ee3ad86943f22d6991'),
          ObjectId('5c8e45f23ad86943f22d6994')
        ],
        'choiceOrder': [],
        'labelOrder': [],
        'stepSize': 1,
        'min': 0,
        'max': 10,
        'regulatorDefault': 5,
        'value': 'Sind Sie zufrieden mit der Mensa am Campus Gummersbach?',
        'description': null,
        'type': 'LIKEDISLIKE',
        'survey': ObjectId('5c8e45d13ad86943f22d6983'),
        'user': ObjectId('a1881c06eec96db9901c7bbf'),
        'items': [
          {
            '_id': ObjectId('5c8e45ee3ad86943f22d6991'),
            'label': 'Mensa'
          },
          {
            '_id': ObjectId('5c8e45f23ad86943f22d6994'),
            'label': 'Küche'
          }
        ],
        'choices': [],
        'labels': [],
        'creationDate': '2019-03-17T13:04:35.988Z',
        'lastUpdate': '2019-03-17T13:04:55.727Z'
      },
      {
        '_id': ObjectId('5c8e45f93ad86943f22d6997'),
        'itemOrder': [],
        'choiceOrder': [
          ObjectId('5c8e46033ad86943f22d699b'),
          ObjectId('5c8e460a3ad86943f22d699e'),
          ObjectId('5c8e460c3ad86943f22d69a1'),
          ObjectId('5c8e460e3ad86943f22d69a4'),
          ObjectId('5c8e460f3ad86943f22d69a7'),
          ObjectId('5c8e46113ad86943f22d69aa')
        ],
        'labelOrder': [],
        'stepSize': 1,
        'min': 0,
        'max': 10,
        'regulatorDefault': 5,
        'value': 'Wie oft sind Sie durchschnittlich pro Woche in der Hochschule?',
        'description': null,
        'type': 'CHOICE',
        'survey': ObjectId('5c8e45d13ad86943f22d6983'),
        'user': ObjectId('a1881c06eec96db9901c7bbf'),
        'items': [],
        'choices': [
          {
            '_id': ObjectId('5c8e46033ad86943f22d699b'),
            'label': 'Niemals',
            'code': 'A'
          },
          {
            '_id': ObjectId('5c8e460a3ad86943f22d699e'),
            'label': '1',
            'code': 'B'
          },
          {
            '_id': ObjectId('5c8e460c3ad86943f22d69a1'),
            'label': '2',
            'code': 'C'
          },
          {
            '_id': ObjectId('5c8e460e3ad86943f22d69a4'),
            'label': '3',
            'code': 'D'
          },
          {
            '_id': ObjectId('5c8e460f3ad86943f22d69a7'),
            'label': '4',
            'code': 'E'
          },
          {
            '_id': ObjectId('5c8e46113ad86943f22d69aa'),
            'label': 'Mehr als 4',
            'code': 'F'
          }
        ],
        'labels': [],
        'creationDate': '2019-03-17T13:04:57.429Z',
        'lastUpdate': '2019-03-17T13:05:24.799Z'
      },
      {
        '_id': ObjectId('5c8e46163ad86943f22d69ad'),
        'itemOrder': [
          ObjectId('5c8e46423ad86943f22d69be'),
          ObjectId('5c8e46493ad86943f22d69c1'),
          ObjectId('5c8e464e3ad86943f22d69c4')
        ],
        'choiceOrder': [],
        'labelOrder': [
          ObjectId('5c8e46293ad86943f22d69b2'),
          ObjectId('5c8e462f3ad86943f22d69b6'),
          ObjectId('5c8e46383ad86943f22d69ba')
        ],
        'stepSize': 1,
        'min': 1,
        'max': 10,
        'regulatorDefault': 5,
        'value': 'Wie zufrieden sind Sie mit dem Essen in der Mensa?',
        'description': null,
        'type': 'REGULATOR',
        'survey': ObjectId('5c8e45d13ad86943f22d6983'),
        'user': ObjectId('a1881c06eec96db9901c7bbf'),
        'items': [
          {
            '_id': ObjectId('5c8e46423ad86943f22d69be'),
            'label': 'Pommes mit Currywurst'
          },
          {
            '_id': ObjectId('5c8e46493ad86943f22d69c1'),
            'label': 'Borscht'
          },
          {
            '_id': ObjectId('5c8e464e3ad86943f22d69c4'),
            'label': 'Paniertes Schollenfilet'
          }
        ],
        'choices': [],
        'labels': [
          {
            '_id': ObjectId('5c8e46293ad86943f22d69b2'),
            'label': 'Nicht zufrieden :x',
            'value': 1
          },
          {
            '_id': ObjectId('5c8e462f3ad86943f22d69b6'),
            'label': 'Ganz okay',
            'value': 5
          },
          {
            '_id': ObjectId('5c8e46383ad86943f22d69ba'),
            'label': 'Voll Zufrieden',
            'value': 10
          }
        ],
        'creationDate': '2019-03-17T13:05:26.856Z',
        'lastUpdate': '2019-03-17T13:06:29.640Z'
      },
      {
        '_id': ObjectId('5c8e46563ad86943f22d69c7'),
        'itemOrder': [
          ObjectId('5c8e46833ad86943f22d69cb'),
          ObjectId('5c8e46893ad86943f22d69ce'),
          ObjectId('5c8e468f3ad86943f22d69d1'),
          ObjectId('5c8e46953ad86943f22d69d4'),
          ObjectId('5c8e469b3ad86943f22d69d7'),
          ObjectId('5c8e46a03ad86943f22d69da'),
          ObjectId('5c8e46a93ad86943f22d69dd')
        ],
        'choiceOrder': [],
        'labelOrder': [],
        'stepSize': 1,
        'min': 0,
        'max': 10,
        'regulatorDefault': 5,
        'value': 'Welchen Professor finden Sie am kompetentesten?',
        'description': null,
        'type': 'FAVORITE',
        'survey': ObjectId('5c8e45d13ad86943f22d6983'),
        'user': ObjectId('a1881c06eec96db9901c7bbf'),
        'items': [
          {
            '_id': ObjectId('5c8e46833ad86943f22d69cb'),
            'label': 'Prof. Fischer'
          },
          {
            '_id': ObjectId('5c8e46893ad86943f22d69ce'),
            'label': 'Prof. Noss'
          },
          {
            '_id': ObjectId('5c8e468f3ad86943f22d69d1'),
            'label': 'Prof. Kohls'
          },
          {
            '_id': ObjectId('5c8e46953ad86943f22d69d4'),
            'label': 'Prof. Eisemann'
          },
          {
            '_id': ObjectId('5c8e469b3ad86943f22d69d7'),
            'label': 'Prof. Kornacher'
          },
          {
            '_id': ObjectId('5c8e46a03ad86943f22d69da'),
            'label': 'Prof. Hartmann'
          },
          {
            '_id': ObjectId('5c8e46a93ad86943f22d69dd'),
            'label': 'Prof. Winter'
          }
        ],
        'choices': [],
        'labels': [],
        'creationDate': '2019-03-17T13:06:30.871Z',
        'lastUpdate': '2019-03-17T13:07:59.718Z'
      },
      {
        '_id': ObjectId('5c8e46b03ad86943f22d69e0'),
        'itemOrder': [
          ObjectId('5c8e46bb3ad86943f22d69e4'),
          ObjectId('5c8e46c13ad86943f22d69e7'),
          ObjectId('5c8e46c63ad86943f22d69ea'),
          ObjectId('5c8e46cc3ad86943f22d69ed'),
          ObjectId('5c8e46d23ad86943f22d69f0')
        ],
        'choiceOrder': [],
        'labelOrder': [],
        'stepSize': 1,
        'min': 0,
        'max': 10,
        'regulatorDefault': 5,
        'value': 'Sortieren Sie diese Fächer nach dem subjektiven Lerngewinn.',
        'description': null,
        'type': 'RANKING',
        'survey': ObjectId('5c8e45d13ad86943f22d6983'),
        'user': ObjectId('a1881c06eec96db9901c7bbf'),
        'items': [
          {
            '_id': ObjectId('5c8e46bb3ad86943f22d69e4'),
            'label': 'Mathematik 1 und 2'
          },
          {
            '_id': ObjectId('5c8e46c13ad86943f22d69e7'),
            'label': 'Algorithmen und Programmierung 1 und 2'
          },
          {
            '_id': ObjectId('5c8e46c63ad86943f22d69ea'),
            'label': 'Theoretische Informatik'
          },
          {
            '_id': ObjectId('5c8e46cc3ad86943f22d69ed'),
            'label': 'Mensch-Computer-Interaktion'
          },
          {
            '_id': ObjectId('5c8e46d23ad86943f22d69f0'),
            'label': 'Computergrafik und Animation'
          }
        ],
        'choices': [],
        'labels': [],
        'creationDate': '2019-03-17T13:08:00.660Z',
        'lastUpdate': '2019-03-17T13:08:40.399Z'
      }
    ],
    'to': '2019-03-17T16:01:50.445Z',
    'updatedAt': '2019-03-17T14:03:12.432Z',
    'summaries': [
      {
        '_id': ObjectId('5c8e53a040584c4cfa7c3c15'),
        'question': ObjectId('5c8e45d33ad86943f22d6989'),
        'type': 'LIKE',
        'value': 'Sind Sie Student der TH Köln?',
        'evaluations': [
          {
            '_id': ObjectId('5c8e53a040584c4cfa7c3c16'),
            'metric': 'Amount of votes',
            'data': [
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3c18'),
                'label': 'Liked',
                'total': 3
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3c17'),
                'label': 'Neutral',
                'total': 7
              }
            ]
          }
        ],
        'lastUpdate': '2019-03-17T14:03:12.432Z',
        'creationDate': '2019-03-17T14:03:12.432Z'
      },
      {
        '_id': ObjectId('5c8e53a040584c4cfa7c3c10'),
        'question': ObjectId('5c8e45e33ad86943f22d698d'),
        'type': 'LIKEDISLIKE',
        'value': 'Sind Sie zufrieden mit der Mensa am Campus Gummersbach?',
        'evaluations': [
          {
            '_id': ObjectId('5c8e53a040584c4cfa7c3c11'),
            'metric': 'Amount of votes',
            'data': [
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3c14'),
                'label': 'Liked',
                'total': 8
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3c13'),
                'label': 'Disliked',
                'total': 2
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3c12'),
                'label': 'Neutral',
                'total': 0
              }
            ]
          }
        ],
        'lastUpdate': '2019-03-17T14:03:12.432Z',
        'creationDate': '2019-03-17T14:03:12.432Z'
      },
      {
        '_id': ObjectId('5c8e53a040584c4cfa7c3c07'),
        'question': ObjectId('5c8e45f93ad86943f22d6997'),
        'type': 'CHOICE',
        'value': 'Wie oft sind Sie durchschnittlich pro Woche in der Hochschule?',
        'evaluations': [
          {
            '_id': ObjectId('5c8e53a040584c4cfa7c3c08'),
            'data': [
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3c0f'),
                'label': 'A',
                'total': 3
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3c0e'),
                'label': 'B',
                'total': 1
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3c0d'),
                'label': 'C',
                'total': 0
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3c0c'),
                'label': 'D',
                'total': 1
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3c0b'),
                'label': 'E',
                'total': 2
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3c0a'),
                'label': 'F',
                'total': 1
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3c09'),
                'label': 'Neutral',
                'total': 2
              }
            ],
            'metric': 'Amount of votes'
          }
        ],
        'lastUpdate': '2019-03-17T14:03:12.432Z',
        'creationDate': '2019-03-17T14:03:12.432Z'
      },
      {
        '_id': ObjectId('5c8e53a040584c4cfa7c3bfa'),
        'question': ObjectId('5c8e46163ad86943f22d69ad'),
        'type': 'REGULATOR',
        'value': 'Wie zufrieden sind Sie mit dem Essen in der Mensa?',
        'evaluations': [
          {
            '_id': ObjectId('5c8e53a040584c4cfa7c3bfb'),
            'data': [
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3c06'),
                'label': 'Rating 1',
                'total': 1
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3c05'),
                'label': 'Rating 2',
                'total': 1
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3c04'),
                'label': 'Rating 3',
                'total': 0
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3c03'),
                'label': 'Rating 4',
                'total': 3
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3c02'),
                'label': 'Rating 5',
                'total': 2
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3c01'),
                'label': 'Rating 6',
                'total': 1
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3c00'),
                'label': 'Rating 7',
                'total': 0
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3bff'),
                'label': 'Rating 8',
                'total': 0
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3bfe'),
                'label': 'Rating 9',
                'total': 0
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3bfd'),
                'label': 'Rating 10',
                'total': 1
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3bfc'),
                'label': 'Neutral',
                'total': 1
              }
            ],
            'metric': 'Amount of votes'
          }
        ],
        'lastUpdate': '2019-03-17T14:03:12.432Z',
        'creationDate': '2019-03-17T14:03:12.432Z'
      },
      {
        '_id': ObjectId('5c8e53a040584c4cfa7c3bf0'),
        'question': ObjectId('5c8e46563ad86943f22d69c7'),
        'type': 'FAVORITE',
        'value': 'Welchen Professor finden Sie am kompetentesten?',
        'evaluations': [
          {
            '_id': ObjectId('5c8e53a040584c4cfa7c3bf1'),
            'data': [
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3bf9'),
                'label': 'Prof. Fischer',
                'total': 3
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3bf8'),
                'label': 'Prof. Noss',
                'total': 3
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3bf7'),
                'label': 'Prof. Kohls',
                'total': 0
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3bf6'),
                'label': 'Prof. Eisemann',
                'total': 0
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3bf5'),
                'label': 'Prof. Kornacher',
                'total': 1
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3bf4'),
                'label': 'Prof. Hartmann',
                'total': 0
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3bf3'),
                'label': 'Prof. Winter',
                'total': 3
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3bf2'),
                'label': 'Neutral',
                'total': 0
              }
            ],
            'metric': 'Amount of votes'
          }
        ],
        'lastUpdate': '2019-03-17T14:03:12.432Z',
        'creationDate': '2019-03-17T14:03:12.432Z'
      },
      {
        '_id': ObjectId('5c8e53a040584c4cfa7c3bc6'),
        'question': ObjectId('5c8e46b03ad86943f22d69e0'),
        'type': 'RANKING',
        'value': 'Sortieren Sie diese Fächer nach dem subjektiven Lerngewinn.',
        'evaluations': [
          {
            '_id': ObjectId('5c8e53a040584c4cfa7c3bea'),
            'data': [
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3bef'),
                'label': 'Mathematik 1 und 2',
                'total': 7
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3bee'),
                'label': 'Algorithmen und Programmierung 1 und 2',
                'total': 4.5
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3bed'),
                'label': 'Theoretische Informatik',
                'total': 4
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3bec'),
                'label': 'Mensch-Computer-Interaktion',
                'total': 5.75
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3beb'),
                'label': 'Computergrafik und Animation',
                'total': 3.75
              }
            ],
            'metric': 'Average item-scores (higher = better average placements)'
          },
          {
            '_id': ObjectId('5c8e53a040584c4cfa7c3be3'),
            'data': [
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3be9'),
                'label': 'Mathematik 1 und 2',
                'total': 4
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3be8'),
                'label': 'Algorithmen und Programmierung 1 und 2',
                'total': 3
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3be7'),
                'label': 'Theoretische Informatik',
                'total': 2
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3be6'),
                'label': 'Mensch-Computer-Interaktion',
                'total': 1
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3be5'),
                'label': 'Computergrafik und Animation',
                'total': 0
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3be4'),
                'label': 'Neutral',
                'total': 0
              }
            ],
            'metric': 'Amount of votes for place 1'
          },
          {
            '_id': ObjectId('5c8e53a040584c4cfa7c3bdc'),
            'data': [
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3be2'),
                'label': 'Mathematik 1 und 2',
                'total': 2
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3be1'),
                'label': 'Algorithmen und Programmierung 1 und 2',
                'total': 1
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3be0'),
                'label': 'Theoretische Informatik',
                'total': 1
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3bdf'),
                'label': 'Mensch-Computer-Interaktion',
                'total': 6
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3bde'),
                'label': 'Computergrafik und Animation',
                'total': 0
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3bdd'),
                'label': 'Neutral',
                'total': 0
              }
            ],
            'metric': 'Amount of votes for place 2'
          },
          {
            '_id': ObjectId('5c8e53a040584c4cfa7c3bd5'),
            'data': [
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3bdb'),
                'label': 'Mathematik 1 und 2',
                'total': 2
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3bda'),
                'label': 'Algorithmen und Programmierung 1 und 2',
                'total': 1
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3bd9'),
                'label': 'Theoretische Informatik',
                'total': 1
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3bd8'),
                'label': 'Mensch-Computer-Interaktion',
                'total': 0
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3bd7'),
                'label': 'Computergrafik und Animation',
                'total': 6
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3bd6'),
                'label': 'Neutral',
                'total': 0
              }
            ],
            'metric': 'Amount of votes for place 3'
          },
          {
            '_id': ObjectId('5c8e53a040584c4cfa7c3bce'),
            'data': [
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3bd4'),
                'label': 'Mathematik 1 und 2',
                'total': 2
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3bd3'),
                'label': 'Algorithmen und Programmierung 1 und 2',
                'total': 1
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3bd2'),
                'label': 'Theoretische Informatik',
                'total': 3
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3bd1'),
                'label': 'Mensch-Computer-Interaktion',
                'total': 1
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3bd0'),
                'label': 'Computergrafik und Animation',
                'total': 3
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3bcf'),
                'label': 'Neutral',
                'total': 0
              }
            ],
            'metric': 'Amount of votes for place 4'
          },
          {
            '_id': ObjectId('5c8e53a040584c4cfa7c3bc7'),
            'data': [
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3bcd'),
                'label': 'Mathematik 1 und 2',
                'total': 0
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3bcc'),
                'label': 'Algorithmen und Programmierung 1 und 2',
                'total': 4
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3bcb'),
                'label': 'Theoretische Informatik',
                'total': 3
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3bca'),
                'label': 'Mensch-Computer-Interaktion',
                'total': 2
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3bc9'),
                'label': 'Computergrafik und Animation',
                'total': 1
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3bc8'),
                'label': 'Neutral',
                'total': 0
              }
            ],
            'metric': 'Amount of votes for place 5'
          }
        ],
        'lastUpdate': '2019-03-17T14:03:12.432Z',
        'creationDate': '2019-03-17T14:03:12.432Z'
      }
    ]
  },
  {
    '_id': ObjectId('fc918e472251e2c600ea699f'),
    'versionNumber': 2,
    'survey': ObjectId('5c8e45d13ad86943f22d6983'),
    'from': '2019-03-17T16:01:50.445Z',
    'questions': [
      {
        '_id': ObjectId('5c8e45d33ad86943f22d6989'),
        'itemOrder': [],
        'choiceOrder': [],
        'labelOrder': [],
        'stepSize': 1,
        'min': 0,
        'max': 10,
        'regulatorDefault': 5,
        'value': 'Sind Sie Student der TH Köln?',
        'description': null,
        'type': 'LIKE',
        'survey': ObjectId('5c8e45d13ad86943f22d6983'),
        'user': ObjectId('a1881c06eec96db9901c7bbf'),
        'items': [],
        'choices': [],
        'labels': [],
        'creationDate': '2019-03-17T13:04:19.609Z',
        'lastUpdate': '2019-03-17T13:04:26.986Z'
      },
      {
        '_id': ObjectId('5c8e45e33ad86943f22d698d'),
        'itemOrder': [
          ObjectId('5c8e45ee3ad86943f22d6991'),
          ObjectId('5c8e45f23ad86943f22d6994')
        ],
        'choiceOrder': [],
        'labelOrder': [],
        'stepSize': 1,
        'min': 0,
        'max': 10,
        'regulatorDefault': 5,
        'value': 'Sind Sie zufrieden mit der Mensa am Campus Gummersbach?',
        'description': null,
        'type': 'LIKEDISLIKE',
        'survey': ObjectId('5c8e45d13ad86943f22d6983'),
        'user': ObjectId('a1881c06eec96db9901c7bbf'),
        'items': [
          {
            '_id': ObjectId('5c8e45ee3ad86943f22d6991'),
            'label': 'Mensa'
          },
          {
            '_id': ObjectId('5c8e45f23ad86943f22d6994'),
            'label': 'Küche'
          }
        ],
        'choices': [],
        'labels': [],
        'creationDate': '2019-03-17T13:04:35.988Z',
        'lastUpdate': '2019-03-17T13:04:55.727Z'
      },
      {
        '_id': ObjectId('5c8e45f93ad86943f22d6997'),
        'itemOrder': [],
        'choiceOrder': [
          ObjectId('5c8e46033ad86943f22d699b'),
          ObjectId('5c8e460a3ad86943f22d699e'),
          ObjectId('5c8e460c3ad86943f22d69a1'),
          ObjectId('5c8e460e3ad86943f22d69a4'),
          ObjectId('5c8e460f3ad86943f22d69a7'),
          ObjectId('5c8e46113ad86943f22d69aa')
        ],
        'labelOrder': [],
        'stepSize': 1,
        'min': 0,
        'max': 10,
        'regulatorDefault': 5,
        'value': 'Wie oft sind Sie durchschnittlich pro Woche in der Hochschule?',
        'description': null,
        'type': 'CHOICE',
        'survey': ObjectId('5c8e45d13ad86943f22d6983'),
        'user': ObjectId('a1881c06eec96db9901c7bbf'),
        'items': [],
        'choices': [
          {
            '_id': ObjectId('5c8e46033ad86943f22d699b'),
            'label': 'Niemals',
            'code': 'A'
          },
          {
            '_id': ObjectId('5c8e460a3ad86943f22d699e'),
            'label': '1',
            'code': 'B'
          },
          {
            '_id': ObjectId('5c8e460c3ad86943f22d69a1'),
            'label': '2',
            'code': 'C'
          },
          {
            '_id': ObjectId('5c8e460e3ad86943f22d69a4'),
            'label': '3',
            'code': 'D'
          },
          {
            '_id': ObjectId('5c8e460f3ad86943f22d69a7'),
            'label': '4',
            'code': 'E'
          },
          {
            '_id': ObjectId('5c8e46113ad86943f22d69aa'),
            'label': 'Mehr als 4',
            'code': 'F'
          }
        ],
        'labels': [],
        'creationDate': '2019-03-17T13:04:57.429Z',
        'lastUpdate': '2019-03-17T13:05:24.799Z'
      },
      {
        '_id': ObjectId('5c8e46163ad86943f22d69ad'),
        'itemOrder': [
          ObjectId('5c8e46423ad86943f22d69be'),
          ObjectId('5c8e46493ad86943f22d69c1'),
          ObjectId('5c8e464e3ad86943f22d69c4')
        ],
        'choiceOrder': [],
        'labelOrder': [
          ObjectId('5c8e46293ad86943f22d69b2'),
          ObjectId('5c8e462f3ad86943f22d69b6'),
          ObjectId('5c8e46383ad86943f22d69ba')
        ],
        'stepSize': 1,
        'min': 1,
        'max': 10,
        'regulatorDefault': 5,
        'value': 'Wie zufrieden sind Sie mit dem Essen in der Mensa?',
        'description': null,
        'type': 'REGULATOR',
        'survey': ObjectId('5c8e45d13ad86943f22d6983'),
        'user': ObjectId('a1881c06eec96db9901c7bbf'),
        'items': [
          {
            '_id': ObjectId('5c8e46423ad86943f22d69be'),
            'label': 'Pommes mit Currywurst'
          },
          {
            '_id': ObjectId('5c8e46493ad86943f22d69c1'),
            'label': 'Borscht'
          },
          {
            '_id': ObjectId('5c8e464e3ad86943f22d69c4'),
            'label': 'Paniertes Schollenfilet'
          }
        ],
        'choices': [],
        'labels': [
          {
            '_id': ObjectId('5c8e46293ad86943f22d69b2'),
            'label': 'Nicht zufrieden :x',
            'value': 1
          },
          {
            '_id': ObjectId('5c8e462f3ad86943f22d69b6'),
            'label': 'Ganz okay',
            'value': 5
          },
          {
            '_id': ObjectId('5c8e46383ad86943f22d69ba'),
            'label': 'Voll Zufrieden',
            'value': 10
          }
        ],
        'creationDate': '2019-03-17T13:05:26.856Z',
        'lastUpdate': '2019-03-17T13:06:29.640Z'
      },
      {
        '_id': ObjectId('5c8e46563ad86943f22d69c7'),
        'itemOrder': [
          ObjectId('5c8e46833ad86943f22d69cb'),
          ObjectId('5c8e46893ad86943f22d69ce'),
          ObjectId('5c8e468f3ad86943f22d69d1'),
          ObjectId('5c8e46953ad86943f22d69d4'),
          ObjectId('5c8e469b3ad86943f22d69d7'),
          ObjectId('5c8e46a03ad86943f22d69da'),
          ObjectId('5c8e46a93ad86943f22d69dd')
        ],
        'choiceOrder': [],
        'labelOrder': [],
        'stepSize': 1,
        'min': 0,
        'max': 10,
        'regulatorDefault': 5,
        'value': 'Welchen Professor finden Sie am kompetentesten?',
        'description': null,
        'type': 'FAVORITE',
        'survey': ObjectId('5c8e45d13ad86943f22d6983'),
        'user': ObjectId('a1881c06eec96db9901c7bbf'),
        'items': [
          {
            '_id': ObjectId('5c8e46833ad86943f22d69cb'),
            'label': 'Prof. Fischer'
          },
          {
            '_id': ObjectId('5c8e46893ad86943f22d69ce'),
            'label': 'Prof. Noss'
          },
          {
            '_id': ObjectId('5c8e468f3ad86943f22d69d1'),
            'label': 'Prof. Kohls'
          },
          {
            '_id': ObjectId('5c8e46953ad86943f22d69d4'),
            'label': 'Prof. Eisemann'
          },
          {
            '_id': ObjectId('5c8e469b3ad86943f22d69d7'),
            'label': 'Prof. Kornacher'
          },
          {
            '_id': ObjectId('5c8e46a03ad86943f22d69da'),
            'label': 'Prof. Hartmann'
          },
          {
            '_id': ObjectId('5c8e46a93ad86943f22d69dd'),
            'label': 'Prof. Winter'
          }
        ],
        'choices': [],
        'labels': [],
        'creationDate': '2019-03-17T13:06:30.871Z',
        'lastUpdate': '2019-03-17T13:07:59.718Z'
      },
      {
        '_id': ObjectId('5c8e46b03ad86943f22d69e0'),
        'itemOrder': [
          ObjectId('5c8e46bb3ad86943f22d69e4'),
          ObjectId('5c8e46c13ad86943f22d69e7'),
          ObjectId('5c8e46c63ad86943f22d69ea'),
          ObjectId('5c8e46cc3ad86943f22d69ed'),
          ObjectId('5c8e46d23ad86943f22d69f0')
        ],
        'choiceOrder': [],
        'labelOrder': [],
        'stepSize': 1,
        'min': 0,
        'max': 10,
        'regulatorDefault': 5,
        'value': 'Sortieren Sie diese Fächer nach dem subjektiven Lerngewinn.',
        'description': null,
        'type': 'RANKING',
        'survey': ObjectId('5c8e45d13ad86943f22d6983'),
        'user': ObjectId('a1881c06eec96db9901c7bbf'),
        'items': [
          {
            '_id': ObjectId('5c8e46bb3ad86943f22d69e4'),
            'label': 'Mathematik 1 und 2'
          },
          {
            '_id': ObjectId('5c8e46c13ad86943f22d69e7'),
            'label': 'Algorithmen und Programmierung 1 und 2'
          },
          {
            '_id': ObjectId('5c8e46c63ad86943f22d69ea'),
            'label': 'Theoretische Informatik'
          },
          {
            '_id': ObjectId('5c8e46cc3ad86943f22d69ed'),
            'label': 'Mensch-Computer-Interaktion'
          },
          {
            '_id': ObjectId('5c8e46d23ad86943f22d69f0'),
            'label': 'Computergrafik und Animation'
          }
        ],
        'choices': [],
        'labels': [],
        'creationDate': '2019-03-17T13:08:00.660Z',
        'lastUpdate': '2019-03-17T13:08:40.399Z'
      }
    ],
    'to': '2019-03-17T18:01:50.445Z',
    'updatedAt': '2019-03-17T14:03:12.583Z',
    'summaries': [
      {
        '_id': ObjectId('5c8e53a040584c4cfa7c3c68'),
        'question': ObjectId('5c8e45d33ad86943f22d6989'),
        'type': 'LIKE',
        'value': 'Sind Sie Student der TH Köln?',
        'evaluations': [
          {
            '_id': ObjectId('5c8e53a040584c4cfa7c3c69'),
            'metric': 'Amount of votes',
            'data': [
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3c6b'),
                'label': 'Liked',
                'total': 4
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3c6a'),
                'label': 'Neutral',
                'total': 6
              }
            ]
          }
        ],
        'lastUpdate': '2019-03-17T14:03:12.583Z',
        'creationDate': '2019-03-17T14:03:12.583Z'
      },
      {
        '_id': ObjectId('5c8e53a040584c4cfa7c3c63'),
        'question': ObjectId('5c8e45e33ad86943f22d698d'),
        'type': 'LIKEDISLIKE',
        'value': 'Sind Sie zufrieden mit der Mensa am Campus Gummersbach?',
        'evaluations': [
          {
            '_id': ObjectId('5c8e53a040584c4cfa7c3c64'),
            'metric': 'Amount of votes',
            'data': [
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3c67'),
                'label': 'Liked',
                'total': 7
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3c66'),
                'label': 'Disliked',
                'total': 3
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3c65'),
                'label': 'Neutral',
                'total': 0
              }
            ]
          }
        ],
        'lastUpdate': '2019-03-17T14:03:12.583Z',
        'creationDate': '2019-03-17T14:03:12.583Z'
      },
      {
        '_id': ObjectId('5c8e53a040584c4cfa7c3c5a'),
        'question': ObjectId('5c8e45f93ad86943f22d6997'),
        'type': 'CHOICE',
        'value': 'Wie oft sind Sie durchschnittlich pro Woche in der Hochschule?',
        'evaluations': [
          {
            '_id': ObjectId('5c8e53a040584c4cfa7c3c5b'),
            'data': [
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3c62'),
                'label': 'A',
                'total': 1
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3c61'),
                'label': 'B',
                'total': 3
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3c60'),
                'label': 'C',
                'total': 0
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3c5f'),
                'label': 'D',
                'total': 1
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3c5e'),
                'label': 'E',
                'total': 2
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3c5d'),
                'label': 'F',
                'total': 2
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3c5c'),
                'label': 'Neutral',
                'total': 1
              }
            ],
            'metric': 'Amount of votes'
          }
        ],
        'lastUpdate': '2019-03-17T14:03:12.583Z',
        'creationDate': '2019-03-17T14:03:12.583Z'
      },
      {
        '_id': ObjectId('5c8e53a040584c4cfa7c3c4d'),
        'question': ObjectId('5c8e46163ad86943f22d69ad'),
        'type': 'REGULATOR',
        'value': 'Wie zufrieden sind Sie mit dem Essen in der Mensa?',
        'evaluations': [
          {
            '_id': ObjectId('5c8e53a040584c4cfa7c3c4e'),
            'data': [
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3c59'),
                'label': 'Rating 1',
                'total': 0
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3c58'),
                'label': 'Rating 2',
                'total': 1
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3c57'),
                'label': 'Rating 3',
                'total': 3
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3c56'),
                'label': 'Rating 4',
                'total': 1
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3c55'),
                'label': 'Rating 5',
                'total': 0
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3c54'),
                'label': 'Rating 6',
                'total': 0
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3c53'),
                'label': 'Rating 7',
                'total': 1
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3c52'),
                'label': 'Rating 8',
                'total': 1
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3c51'),
                'label': 'Rating 9',
                'total': 1
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3c50'),
                'label': 'Rating 10',
                'total': 0
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3c4f'),
                'label': 'Neutral',
                'total': 2
              }
            ],
            'metric': 'Amount of votes'
          }
        ],
        'lastUpdate': '2019-03-17T14:03:12.583Z',
        'creationDate': '2019-03-17T14:03:12.583Z'
      },
      {
        '_id': ObjectId('5c8e53a040584c4cfa7c3c43'),
        'question': ObjectId('5c8e46563ad86943f22d69c7'),
        'type': 'FAVORITE',
        'value': 'Welchen Professor finden Sie am kompetentesten?',
        'evaluations': [
          {
            '_id': ObjectId('5c8e53a040584c4cfa7c3c44'),
            'data': [
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3c4c'),
                'label': 'Prof. Fischer',
                'total': 0
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3c4b'),
                'label': 'Prof. Noss',
                'total': 4
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3c4a'),
                'label': 'Prof. Kohls',
                'total': 3
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3c49'),
                'label': 'Prof. Eisemann',
                'total': 0
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3c48'),
                'label': 'Prof. Kornacher',
                'total': 0
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3c47'),
                'label': 'Prof. Hartmann',
                'total': 0
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3c46'),
                'label': 'Prof. Winter',
                'total': 1
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3c45'),
                'label': 'Neutral',
                'total': 2
              }
            ],
            'metric': 'Amount of votes'
          }
        ],
        'lastUpdate': '2019-03-17T14:03:12.583Z',
        'creationDate': '2019-03-17T14:03:12.583Z'
      },
      {
        '_id': ObjectId('5c8e53a040584c4cfa7c3c19'),
        'question': ObjectId('5c8e46b03ad86943f22d69e0'),
        'type': 'RANKING',
        'value': 'Sortieren Sie diese Fächer nach dem subjektiven Lerngewinn.',
        'evaluations': [
          {
            '_id': ObjectId('5c8e53a040584c4cfa7c3c3d'),
            'data': [
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3c42'),
                'label': 'Mathematik 1 und 2',
                'total': 4.25
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3c41'),
                'label': 'Algorithmen und Programmierung 1 und 2',
                'total': 5.5
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3c40'),
                'label': 'Theoretische Informatik',
                'total': 4.25
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3c3f'),
                'label': 'Mensch-Computer-Interaktion',
                'total': 5
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3c3e'),
                'label': 'Computergrafik und Animation',
                'total': 6
              }
            ],
            'metric': 'Average item-scores (higher = better average placements)'
          },
          {
            '_id': ObjectId('5c8e53a040584c4cfa7c3c36'),
            'data': [
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3c3c'),
                'label': 'Mathematik 1 und 2',
                'total': 2
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3c3b'),
                'label': 'Algorithmen und Programmierung 1 und 2',
                'total': 3
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3c3a'),
                'label': 'Theoretische Informatik',
                'total': 0
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3c39'),
                'label': 'Mensch-Computer-Interaktion',
                'total': 3
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3c38'),
                'label': 'Computergrafik und Animation',
                'total': 2
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3c37'),
                'label': 'Neutral',
                'total': 0
              }
            ],
            'metric': 'Amount of votes for place 1'
          },
          {
            '_id': ObjectId('5c8e53a040584c4cfa7c3c2f'),
            'data': [
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3c35'),
                'label': 'Mathematik 1 und 2',
                'total': 1
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3c34'),
                'label': 'Algorithmen und Programmierung 1 und 2',
                'total': 2
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3c33'),
                'label': 'Theoretische Informatik',
                'total': 3
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3c32'),
                'label': 'Mensch-Computer-Interaktion',
                'total': 1
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3c31'),
                'label': 'Computergrafik und Animation',
                'total': 3
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3c30'),
                'label': 'Neutral',
                'total': 0
              }
            ],
            'metric': 'Amount of votes for place 2'
          },
          {
            '_id': ObjectId('5c8e53a040584c4cfa7c3c28'),
            'data': [
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3c2e'),
                'label': 'Mathematik 1 und 2',
                'total': 2
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3c2d'),
                'label': 'Algorithmen und Programmierung 1 und 2',
                'total': 1
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3c2c'),
                'label': 'Theoretische Informatik',
                'total': 2
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3c2b'),
                'label': 'Mensch-Computer-Interaktion',
                'total': 2
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3c2a'),
                'label': 'Computergrafik und Animation',
                'total': 3
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3c29'),
                'label': 'Neutral',
                'total': 0
              }
            ],
            'metric': 'Amount of votes for place 3'
          },
          {
            '_id': ObjectId('5c8e53a040584c4cfa7c3c21'),
            'data': [
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3c27'),
                'label': 'Mathematik 1 und 2',
                'total': 2
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3c26'),
                'label': 'Algorithmen und Programmierung 1 und 2',
                'total': 2
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3c25'),
                'label': 'Theoretische Informatik',
                'total': 4
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3c24'),
                'label': 'Mensch-Computer-Interaktion',
                'total': 1
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3c23'),
                'label': 'Computergrafik und Animation',
                'total': 1
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3c22'),
                'label': 'Neutral',
                'total': 0
              }
            ],
            'metric': 'Amount of votes for place 4'
          },
          {
            '_id': ObjectId('5c8e53a040584c4cfa7c3c1a'),
            'data': [
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3c20'),
                'label': 'Mathematik 1 und 2',
                'total': 3
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3c1f'),
                'label': 'Algorithmen und Programmierung 1 und 2',
                'total': 2
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3c1e'),
                'label': 'Theoretische Informatik',
                'total': 1
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3c1d'),
                'label': 'Mensch-Computer-Interaktion',
                'total': 3
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3c1c'),
                'label': 'Computergrafik und Animation',
                'total': 1
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3c1b'),
                'label': 'Neutral',
                'total': 0
              }
            ],
            'metric': 'Amount of votes for place 5'
          }
        ],
        'lastUpdate': '2019-03-17T14:03:12.583Z',
        'creationDate': '2019-03-17T14:03:12.583Z'
      }
    ]
  },
  {
    '_id': ObjectId('9c35b3bcdf51721e8b8ab119'),
    'versionNumber': 3,
    'survey': ObjectId('5c8e45d13ad86943f22d6983'),
    'from': '2019-03-17T18:01:50.445Z',
    'questions': [
      {
        '_id': ObjectId('5c8e45d33ad86943f22d6989'),
        'itemOrder': [],
        'choiceOrder': [],
        'labelOrder': [],
        'stepSize': 1,
        'min': 0,
        'max': 10,
        'regulatorDefault': 5,
        'value': 'Sind Sie Student der TH Köln?',
        'description': null,
        'type': 'LIKE',
        'survey': ObjectId('5c8e45d13ad86943f22d6983'),
        'user': ObjectId('a1881c06eec96db9901c7bbf'),
        'items': [],
        'choices': [],
        'labels': [],
        'creationDate': '2019-03-17T13:04:19.609Z',
        'lastUpdate': '2019-03-17T13:04:26.986Z'
      },
      {
        '_id': ObjectId('5c8e45e33ad86943f22d698d'),
        'itemOrder': [
          ObjectId('5c8e45ee3ad86943f22d6991'),
          ObjectId('5c8e45f23ad86943f22d6994')
        ],
        'choiceOrder': [],
        'labelOrder': [],
        'stepSize': 1,
        'min': 0,
        'max': 10,
        'regulatorDefault': 5,
        'value': 'Sind Sie zufrieden mit der Mensa am Campus Gummersbach?',
        'description': null,
        'type': 'LIKEDISLIKE',
        'survey': ObjectId('5c8e45d13ad86943f22d6983'),
        'user': ObjectId('a1881c06eec96db9901c7bbf'),
        'items': [
          {
            '_id': ObjectId('5c8e45ee3ad86943f22d6991'),
            'label': 'Mensa'
          },
          {
            '_id': ObjectId('5c8e45f23ad86943f22d6994'),
            'label': 'Küche'
          }
        ],
        'choices': [],
        'labels': [],
        'creationDate': '2019-03-17T13:04:35.988Z',
        'lastUpdate': '2019-03-17T13:04:55.727Z'
      },
      {
        '_id': ObjectId('5c8e45f93ad86943f22d6997'),
        'itemOrder': [],
        'choiceOrder': [
          ObjectId('5c8e46033ad86943f22d699b'),
          ObjectId('5c8e460a3ad86943f22d699e'),
          ObjectId('5c8e460c3ad86943f22d69a1'),
          ObjectId('5c8e460e3ad86943f22d69a4'),
          ObjectId('5c8e460f3ad86943f22d69a7'),
          ObjectId('5c8e46113ad86943f22d69aa')
        ],
        'labelOrder': [],
        'stepSize': 1,
        'min': 0,
        'max': 10,
        'regulatorDefault': 5,
        'value': 'Wie oft sind Sie durchschnittlich pro Woche in der Hochschule?',
        'description': null,
        'type': 'CHOICE',
        'survey': ObjectId('5c8e45d13ad86943f22d6983'),
        'user': ObjectId('a1881c06eec96db9901c7bbf'),
        'items': [],
        'choices': [
          {
            '_id': ObjectId('5c8e46033ad86943f22d699b'),
            'label': 'Niemals',
            'code': 'A'
          },
          {
            '_id': ObjectId('5c8e460a3ad86943f22d699e'),
            'label': '1',
            'code': 'B'
          },
          {
            '_id': ObjectId('5c8e460c3ad86943f22d69a1'),
            'label': '2',
            'code': 'C'
          },
          {
            '_id': ObjectId('5c8e460e3ad86943f22d69a4'),
            'label': '3',
            'code': 'D'
          },
          {
            '_id': ObjectId('5c8e460f3ad86943f22d69a7'),
            'label': '4',
            'code': 'E'
          },
          {
            '_id': ObjectId('5c8e46113ad86943f22d69aa'),
            'label': 'Mehr als 4',
            'code': 'F'
          }
        ],
        'labels': [],
        'creationDate': '2019-03-17T13:04:57.429Z',
        'lastUpdate': '2019-03-17T13:05:24.799Z'
      },
      {
        '_id': ObjectId('5c8e46163ad86943f22d69ad'),
        'itemOrder': [
          ObjectId('5c8e46423ad86943f22d69be'),
          ObjectId('5c8e46493ad86943f22d69c1'),
          ObjectId('5c8e464e3ad86943f22d69c4')
        ],
        'choiceOrder': [],
        'labelOrder': [
          ObjectId('5c8e46293ad86943f22d69b2'),
          ObjectId('5c8e462f3ad86943f22d69b6'),
          ObjectId('5c8e46383ad86943f22d69ba')
        ],
        'stepSize': 1,
        'min': 1,
        'max': 10,
        'regulatorDefault': 5,
        'value': 'Wie zufrieden sind Sie mit dem Essen in der Mensa?',
        'description': null,
        'type': 'REGULATOR',
        'survey': ObjectId('5c8e45d13ad86943f22d6983'),
        'user': ObjectId('a1881c06eec96db9901c7bbf'),
        'items': [
          {
            '_id': ObjectId('5c8e46423ad86943f22d69be'),
            'label': 'Pommes mit Currywurst'
          },
          {
            '_id': ObjectId('5c8e46493ad86943f22d69c1'),
            'label': 'Borscht'
          },
          {
            '_id': ObjectId('5c8e464e3ad86943f22d69c4'),
            'label': 'Paniertes Schollenfilet'
          }
        ],
        'choices': [],
        'labels': [
          {
            '_id': ObjectId('5c8e46293ad86943f22d69b2'),
            'label': 'Nicht zufrieden :x',
            'value': 1
          },
          {
            '_id': ObjectId('5c8e462f3ad86943f22d69b6'),
            'label': 'Ganz okay',
            'value': 5
          },
          {
            '_id': ObjectId('5c8e46383ad86943f22d69ba'),
            'label': 'Voll Zufrieden',
            'value': 10
          }
        ],
        'creationDate': '2019-03-17T13:05:26.856Z',
        'lastUpdate': '2019-03-17T13:06:29.640Z'
      },
      {
        '_id': ObjectId('5c8e46563ad86943f22d69c7'),
        'itemOrder': [
          ObjectId('5c8e46833ad86943f22d69cb'),
          ObjectId('5c8e46893ad86943f22d69ce'),
          ObjectId('5c8e468f3ad86943f22d69d1'),
          ObjectId('5c8e46953ad86943f22d69d4'),
          ObjectId('5c8e469b3ad86943f22d69d7'),
          ObjectId('5c8e46a03ad86943f22d69da'),
          ObjectId('5c8e46a93ad86943f22d69dd')
        ],
        'choiceOrder': [],
        'labelOrder': [],
        'stepSize': 1,
        'min': 0,
        'max': 10,
        'regulatorDefault': 5,
        'value': 'Welchen Professor finden Sie am kompetentesten?',
        'description': null,
        'type': 'FAVORITE',
        'survey': ObjectId('5c8e45d13ad86943f22d6983'),
        'user': ObjectId('a1881c06eec96db9901c7bbf'),
        'items': [
          {
            '_id': ObjectId('5c8e46833ad86943f22d69cb'),
            'label': 'Prof. Fischer'
          },
          {
            '_id': ObjectId('5c8e46893ad86943f22d69ce'),
            'label': 'Prof. Noss'
          },
          {
            '_id': ObjectId('5c8e468f3ad86943f22d69d1'),
            'label': 'Prof. Kohls'
          },
          {
            '_id': ObjectId('5c8e46953ad86943f22d69d4'),
            'label': 'Prof. Eisemann'
          },
          {
            '_id': ObjectId('5c8e469b3ad86943f22d69d7'),
            'label': 'Prof. Kornacher'
          },
          {
            '_id': ObjectId('5c8e46a03ad86943f22d69da'),
            'label': 'Prof. Hartmann'
          },
          {
            '_id': ObjectId('5c8e46a93ad86943f22d69dd'),
            'label': 'Prof. Winter'
          }
        ],
        'choices': [],
        'labels': [],
        'creationDate': '2019-03-17T13:06:30.871Z',
        'lastUpdate': '2019-03-17T13:07:59.718Z'
      },
      {
        '_id': ObjectId('5c8e46b03ad86943f22d69e0'),
        'itemOrder': [
          ObjectId('5c8e46bb3ad86943f22d69e4'),
          ObjectId('5c8e46c13ad86943f22d69e7'),
          ObjectId('5c8e46c63ad86943f22d69ea'),
          ObjectId('5c8e46cc3ad86943f22d69ed'),
          ObjectId('5c8e46d23ad86943f22d69f0')
        ],
        'choiceOrder': [],
        'labelOrder': [],
        'stepSize': 1,
        'min': 0,
        'max': 10,
        'regulatorDefault': 5,
        'value': 'Sortieren Sie diese Fächer nach dem subjektiven Lerngewinn.',
        'description': null,
        'type': 'RANKING',
        'survey': ObjectId('5c8e45d13ad86943f22d6983'),
        'user': ObjectId('a1881c06eec96db9901c7bbf'),
        'items': [
          {
            '_id': ObjectId('5c8e46bb3ad86943f22d69e4'),
            'label': 'Mathematik 1 und 2'
          },
          {
            '_id': ObjectId('5c8e46c13ad86943f22d69e7'),
            'label': 'Algorithmen und Programmierung 1 und 2'
          },
          {
            '_id': ObjectId('5c8e46c63ad86943f22d69ea'),
            'label': 'Theoretische Informatik'
          },
          {
            '_id': ObjectId('5c8e46cc3ad86943f22d69ed'),
            'label': 'Mensch-Computer-Interaktion'
          },
          {
            '_id': ObjectId('5c8e46d23ad86943f22d69f0'),
            'label': 'Computergrafik und Animation'
          }
        ],
        'choices': [],
        'labels': [],
        'creationDate': '2019-03-17T13:08:00.660Z',
        'lastUpdate': '2019-03-17T13:08:40.399Z'
      }
    ],
    'to': '2019-03-17T20:01:50.445Z',
    'updatedAt': '2019-03-17T14:03:12.348Z',
    'summaries': [
      {
        '_id': ObjectId('5c8e53a040584c4cfa7c3bc2'),
        'question': ObjectId('5c8e45d33ad86943f22d6989'),
        'type': 'LIKE',
        'value': 'Sind Sie Student der TH Köln?',
        'evaluations': [
          {
            '_id': ObjectId('5c8e53a040584c4cfa7c3bc3'),
            'metric': 'Amount of votes',
            'data': [
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3bc5'),
                'label': 'Liked',
                'total': 6
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3bc4'),
                'label': 'Neutral',
                'total': 4
              }
            ]
          }
        ],
        'lastUpdate': '2019-03-17T14:03:12.348Z',
        'creationDate': '2019-03-17T14:03:12.348Z'
      },
      {
        '_id': ObjectId('5c8e53a040584c4cfa7c3bbd'),
        'question': ObjectId('5c8e45e33ad86943f22d698d'),
        'type': 'LIKEDISLIKE',
        'value': 'Sind Sie zufrieden mit der Mensa am Campus Gummersbach?',
        'evaluations': [
          {
            '_id': ObjectId('5c8e53a040584c4cfa7c3bbe'),
            'metric': 'Amount of votes',
            'data': [
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3bc1'),
                'label': 'Liked',
                'total': 4
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3bc0'),
                'label': 'Disliked',
                'total': 3
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3bbf'),
                'label': 'Neutral',
                'total': 3
              }
            ]
          }
        ],
        'lastUpdate': '2019-03-17T14:03:12.348Z',
        'creationDate': '2019-03-17T14:03:12.348Z'
      },
      {
        '_id': ObjectId('5c8e53a040584c4cfa7c3bb4'),
        'question': ObjectId('5c8e45f93ad86943f22d6997'),
        'type': 'CHOICE',
        'value': 'Wie oft sind Sie durchschnittlich pro Woche in der Hochschule?',
        'evaluations': [
          {
            '_id': ObjectId('5c8e53a040584c4cfa7c3bb5'),
            'data': [
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3bbc'),
                'label': 'A',
                'total': 3
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3bbb'),
                'label': 'B',
                'total': 0
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3bba'),
                'label': 'C',
                'total': 2
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3bb9'),
                'label': 'D',
                'total': 1
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3bb8'),
                'label': 'E',
                'total': 0
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3bb7'),
                'label': 'F',
                'total': 3
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3bb6'),
                'label': 'Neutral',
                'total': 1
              }
            ],
            'metric': 'Amount of votes'
          }
        ],
        'lastUpdate': '2019-03-17T14:03:12.348Z',
        'creationDate': '2019-03-17T14:03:12.348Z'
      },
      {
        '_id': ObjectId('5c8e53a040584c4cfa7c3ba7'),
        'question': ObjectId('5c8e46163ad86943f22d69ad'),
        'type': 'REGULATOR',
        'value': 'Wie zufrieden sind Sie mit dem Essen in der Mensa?',
        'evaluations': [
          {
            '_id': ObjectId('5c8e53a040584c4cfa7c3ba8'),
            'data': [
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3bb3'),
                'label': 'Rating 1',
                'total': 1
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3bb2'),
                'label': 'Rating 2',
                'total': 0
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3bb1'),
                'label': 'Rating 3',
                'total': 2
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3bb0'),
                'label': 'Rating 4',
                'total': 1
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3baf'),
                'label': 'Rating 5',
                'total': 1
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3bae'),
                'label': 'Rating 6',
                'total': 1
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3bad'),
                'label': 'Rating 7',
                'total': 0
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3bac'),
                'label': 'Rating 8',
                'total': 1
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3bab'),
                'label': 'Rating 9',
                'total': 1
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3baa'),
                'label': 'Rating 10',
                'total': 1
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3ba9'),
                'label': 'Neutral',
                'total': 1
              }
            ],
            'metric': 'Amount of votes'
          }
        ],
        'lastUpdate': '2019-03-17T14:03:12.348Z',
        'creationDate': '2019-03-17T14:03:12.348Z'
      },
      {
        '_id': ObjectId('5c8e53a040584c4cfa7c3b9d'),
        'question': ObjectId('5c8e46563ad86943f22d69c7'),
        'type': 'FAVORITE',
        'value': 'Welchen Professor finden Sie am kompetentesten?',
        'evaluations': [
          {
            '_id': ObjectId('5c8e53a040584c4cfa7c3b9e'),
            'data': [
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3ba6'),
                'label': 'Prof. Fischer',
                'total': 2
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3ba5'),
                'label': 'Prof. Noss',
                'total': 0
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3ba4'),
                'label': 'Prof. Kohls',
                'total': 0
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3ba3'),
                'label': 'Prof. Eisemann',
                'total': 1
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3ba2'),
                'label': 'Prof. Kornacher',
                'total': 2
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3ba1'),
                'label': 'Prof. Hartmann',
                'total': 2
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3ba0'),
                'label': 'Prof. Winter',
                'total': 2
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3b9f'),
                'label': 'Neutral',
                'total': 1
              }
            ],
            'metric': 'Amount of votes'
          }
        ],
        'lastUpdate': '2019-03-17T14:03:12.348Z',
        'creationDate': '2019-03-17T14:03:12.348Z'
      },
      {
        '_id': ObjectId('5c8e53a040584c4cfa7c3b73'),
        'question': ObjectId('5c8e46b03ad86943f22d69e0'),
        'type': 'RANKING',
        'value': 'Sortieren Sie diese Fächer nach dem subjektiven Lerngewinn.',
        'evaluations': [
          {
            '_id': ObjectId('5c8e53a040584c4cfa7c3b97'),
            'data': [
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3b9c'),
                'label': 'Mathematik 1 und 2',
                'total': 4
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3b9b'),
                'label': 'Algorithmen und Programmierung 1 und 2',
                'total': 4.25
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3b9a'),
                'label': 'Theoretische Informatik',
                'total': 6.25
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3b99'),
                'label': 'Mensch-Computer-Interaktion',
                'total': 2.75
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3b98'),
                'label': 'Computergrafik und Animation',
                'total': 7.75
              }
            ],
            'metric': 'Average item-scores (higher = better average placements)'
          },
          {
            '_id': ObjectId('5c8e53a040584c4cfa7c3b90'),
            'data': [
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3b96'),
                'label': 'Mathematik 1 und 2',
                'total': 0
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3b95'),
                'label': 'Algorithmen und Programmierung 1 und 2',
                'total': 1
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3b94'),
                'label': 'Theoretische Informatik',
                'total': 4
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3b93'),
                'label': 'Mensch-Computer-Interaktion',
                'total': 1
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3b92'),
                'label': 'Computergrafik und Animation',
                'total': 4
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3b91'),
                'label': 'Neutral',
                'total': 0
              }
            ],
            'metric': 'Amount of votes for place 1'
          },
          {
            '_id': ObjectId('5c8e53a040584c4cfa7c3b89'),
            'data': [
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3b8f'),
                'label': 'Mathematik 1 und 2',
                'total': 2
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3b8e'),
                'label': 'Algorithmen und Programmierung 1 und 2',
                'total': 1
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3b8d'),
                'label': 'Theoretische Informatik',
                'total': 2
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3b8c'),
                'label': 'Mensch-Computer-Interaktion',
                'total': 0
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3b8b'),
                'label': 'Computergrafik und Animation',
                'total': 5
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3b8a'),
                'label': 'Neutral',
                'total': 0
              }
            ],
            'metric': 'Amount of votes for place 2'
          },
          {
            '_id': ObjectId('5c8e53a040584c4cfa7c3b82'),
            'data': [
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3b88'),
                'label': 'Mathematik 1 und 2',
                'total': 4
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3b87'),
                'label': 'Algorithmen und Programmierung 1 und 2',
                'total': 3
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3b86'),
                'label': 'Theoretische Informatik',
                'total': 0
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3b85'),
                'label': 'Mensch-Computer-Interaktion',
                'total': 3
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3b84'),
                'label': 'Computergrafik und Animation',
                'total': 0
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3b83'),
                'label': 'Neutral',
                'total': 0
              }
            ],
            'metric': 'Amount of votes for place 3'
          },
          {
            '_id': ObjectId('5c8e53a040584c4cfa7c3b7b'),
            'data': [
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3b81'),
                'label': 'Mathematik 1 und 2',
                'total': 2
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3b80'),
                'label': 'Algorithmen und Programmierung 1 und 2',
                'total': 4
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3b7f'),
                'label': 'Theoretische Informatik',
                'total': 3
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3b7e'),
                'label': 'Mensch-Computer-Interaktion',
                'total': 1
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3b7d'),
                'label': 'Computergrafik und Animation',
                'total': 0
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3b7c'),
                'label': 'Neutral',
                'total': 0
              }
            ],
            'metric': 'Amount of votes for place 4'
          },
          {
            '_id': ObjectId('5c8e53a040584c4cfa7c3b74'),
            'data': [
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3b7a'),
                'label': 'Mathematik 1 und 2',
                'total': 2
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3b79'),
                'label': 'Algorithmen und Programmierung 1 und 2',
                'total': 1
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3b78'),
                'label': 'Theoretische Informatik',
                'total': 1
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3b77'),
                'label': 'Mensch-Computer-Interaktion',
                'total': 5
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3b76'),
                'label': 'Computergrafik und Animation',
                'total': 1
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3b75'),
                'label': 'Neutral',
                'total': 0
              }
            ],
            'metric': 'Amount of votes for place 5'
          }
        ],
        'lastUpdate': '2019-03-17T14:03:12.348Z',
        'creationDate': '2019-03-17T14:03:12.348Z'
      }
    ]
  },
  {
    '_id': ObjectId('df756146d3eec187d9b07eae'),
    'versionNumber': 4,
    'survey': ObjectId('5c8e45d13ad86943f22d6983'),
    'from': '2019-03-17T20:01:50.445Z',
    'updatedAt': '2019-03-17T14:03:12.638Z',
    'summaries': [
      {
        '_id': ObjectId('5c8e53a040584c4cfa7c3cbb'),
        'question': ObjectId('5c8e45d33ad86943f22d6989'),
        'type': 'LIKE',
        'value': 'Sind Sie Student der TH Köln?',
        'evaluations': [
          {
            '_id': ObjectId('5c8e53a040584c4cfa7c3cbc'),
            'metric': 'Amount of votes',
            'data': [
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3cbe'),
                'label': 'Liked',
                'total': 6
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3cbd'),
                'label': 'Neutral',
                'total': 4
              }
            ]
          }
        ],
        'lastUpdate': '2019-03-17T14:03:12.638Z',
        'creationDate': '2019-03-17T14:03:12.638Z'
      },
      {
        '_id': ObjectId('5c8e53a040584c4cfa7c3cb6'),
        'question': ObjectId('5c8e45e33ad86943f22d698d'),
        'type': 'LIKEDISLIKE',
        'value': 'Sind Sie zufrieden mit der Mensa am Campus Gummersbach?',
        'evaluations': [
          {
            '_id': ObjectId('5c8e53a040584c4cfa7c3cb7'),
            'metric': 'Amount of votes',
            'data': [
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3cba'),
                'label': 'Liked',
                'total': 7
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3cb9'),
                'label': 'Disliked',
                'total': 3
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3cb8'),
                'label': 'Neutral',
                'total': 0
              }
            ]
          }
        ],
        'lastUpdate': '2019-03-17T14:03:12.638Z',
        'creationDate': '2019-03-17T14:03:12.638Z'
      },
      {
        '_id': ObjectId('5c8e53a040584c4cfa7c3cad'),
        'question': ObjectId('5c8e45f93ad86943f22d6997'),
        'type': 'CHOICE',
        'value': 'Wie oft sind Sie durchschnittlich pro Woche in der Hochschule?',
        'evaluations': [
          {
            '_id': ObjectId('5c8e53a040584c4cfa7c3cae'),
            'data': [
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3cb5'),
                'label': 'A',
                'total': 0
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3cb4'),
                'label': 'B',
                'total': 1
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3cb3'),
                'label': 'C',
                'total': 3
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3cb2'),
                'label': 'D',
                'total': 2
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3cb1'),
                'label': 'E',
                'total': 2
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3cb0'),
                'label': 'F',
                'total': 2
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3caf'),
                'label': 'Neutral',
                'total': 0
              }
            ],
            'metric': 'Amount of votes'
          }
        ],
        'lastUpdate': '2019-03-17T14:03:12.638Z',
        'creationDate': '2019-03-17T14:03:12.638Z'
      },
      {
        '_id': ObjectId('5c8e53a040584c4cfa7c3ca0'),
        'question': ObjectId('5c8e46163ad86943f22d69ad'),
        'type': 'REGULATOR',
        'value': 'Wie zufrieden sind Sie mit dem Essen in der Mensa?',
        'evaluations': [
          {
            '_id': ObjectId('5c8e53a040584c4cfa7c3ca1'),
            'data': [
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3cac'),
                'label': 'Rating 1',
                'total': 0
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3cab'),
                'label': 'Rating 2',
                'total': 1
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3caa'),
                'label': 'Rating 3',
                'total': 0
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3ca9'),
                'label': 'Rating 4',
                'total': 1
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3ca8'),
                'label': 'Rating 5',
                'total': 1
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3ca7'),
                'label': 'Rating 6',
                'total': 1
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3ca6'),
                'label': 'Rating 7',
                'total': 0
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3ca5'),
                'label': 'Rating 8',
                'total': 2
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3ca4'),
                'label': 'Rating 9',
                'total': 1
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3ca3'),
                'label': 'Rating 10',
                'total': 2
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3ca2'),
                'label': 'Neutral',
                'total': 1
              }
            ],
            'metric': 'Amount of votes'
          }
        ],
        'lastUpdate': '2019-03-17T14:03:12.638Z',
        'creationDate': '2019-03-17T14:03:12.638Z'
      },
      {
        '_id': ObjectId('5c8e53a040584c4cfa7c3c96'),
        'question': ObjectId('5c8e46563ad86943f22d69c7'),
        'type': 'FAVORITE',
        'value': 'Welchen Professor finden Sie am kompetentesten?',
        'evaluations': [
          {
            '_id': ObjectId('5c8e53a040584c4cfa7c3c97'),
            'data': [
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3c9f'),
                'label': 'Prof. Fischer',
                'total': 0
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3c9e'),
                'label': 'Prof. Noss',
                'total': 2
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3c9d'),
                'label': 'Prof. Kohls',
                'total': 1
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3c9c'),
                'label': 'Prof. Eisemann',
                'total': 2
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3c9b'),
                'label': 'Prof. Kornacher',
                'total': 1
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3c9a'),
                'label': 'Prof. Hartmann',
                'total': 2
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3c99'),
                'label': 'Prof. Winter',
                'total': 1
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3c98'),
                'label': 'Neutral',
                'total': 1
              }
            ],
            'metric': 'Amount of votes'
          }
        ],
        'lastUpdate': '2019-03-17T14:03:12.638Z',
        'creationDate': '2019-03-17T14:03:12.638Z'
      },
      {
        '_id': ObjectId('5c8e53a040584c4cfa7c3c6c'),
        'question': ObjectId('5c8e46b03ad86943f22d69e0'),
        'type': 'RANKING',
        'value': 'Sortieren Sie diese Fächer nach dem subjektiven Lerngewinn.',
        'evaluations': [
          {
            '_id': ObjectId('5c8e53a040584c4cfa7c3c90'),
            'data': [
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3c95'),
                'label': 'Mathematik 1 und 2',
                'total': 6.25
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3c94'),
                'label': 'Algorithmen und Programmierung 1 und 2',
                'total': 6.25
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3c93'),
                'label': 'Theoretische Informatik',
                'total': 5
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3c92'),
                'label': 'Mensch-Computer-Interaktion',
                'total': 7.5
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3c91'),
                'label': 'Computergrafik und Animation',
                'total': 7.5
              }
            ],
            'metric': 'Average item-scores (higher = better average placements)'
          },
          {
            '_id': ObjectId('5c8e53a040584c4cfa7c3c89'),
            'data': [
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3c8f'),
                'label': 'Mathematik 1 und 2',
                'total': 2
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3c8e'),
                'label': 'Algorithmen und Programmierung 1 und 2',
                'total': 1
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3c8d'),
                'label': 'Theoretische Informatik',
                'total': 0
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3c8c'),
                'label': 'Mensch-Computer-Interaktion',
                'total': 1
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3c8b'),
                'label': 'Computergrafik und Animation',
                'total': 4
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3c8a'),
                'label': 'Neutral',
                'total': 2
              }
            ],
            'metric': 'Amount of votes for place 1'
          },
          {
            '_id': ObjectId('5c8e53a040584c4cfa7c3c82'),
            'data': [
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3c88'),
                'label': 'Mathematik 1 und 2',
                'total': 1
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3c87'),
                'label': 'Algorithmen und Programmierung 1 und 2',
                'total': 2
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3c86'),
                'label': 'Theoretische Informatik',
                'total': 2
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3c85'),
                'label': 'Mensch-Computer-Interaktion',
                'total': 3
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3c84'),
                'label': 'Computergrafik und Animation',
                'total': 0
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3c83'),
                'label': 'Neutral',
                'total': 2
              }
            ],
            'metric': 'Amount of votes for place 2'
          },
          {
            '_id': ObjectId('5c8e53a040584c4cfa7c3c7b'),
            'data': [
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3c81'),
                'label': 'Mathematik 1 und 2',
                'total': 1
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3c80'),
                'label': 'Algorithmen und Programmierung 1 und 2',
                'total': 1
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3c7f'),
                'label': 'Theoretische Informatik',
                'total': 1
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3c7e'),
                'label': 'Mensch-Computer-Interaktion',
                'total': 3
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3c7d'),
                'label': 'Computergrafik und Animation',
                'total': 2
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3c7c'),
                'label': 'Neutral',
                'total': 2
              }
            ],
            'metric': 'Amount of votes for place 3'
          },
          {
            '_id': ObjectId('5c8e53a040584c4cfa7c3c74'),
            'data': [
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3c7a'),
                'label': 'Mathematik 1 und 2',
                'total': 2
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3c79'),
                'label': 'Algorithmen und Programmierung 1 und 2',
                'total': 3
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3c78'),
                'label': 'Theoretische Informatik',
                'total': 2
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3c77'),
                'label': 'Mensch-Computer-Interaktion',
                'total': 1
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3c76'),
                'label': 'Computergrafik und Animation',
                'total': 0
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3c75'),
                'label': 'Neutral',
                'total': 2
              }
            ],
            'metric': 'Amount of votes for place 4'
          },
          {
            '_id': ObjectId('5c8e53a040584c4cfa7c3c6d'),
            'data': [
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3c73'),
                'label': 'Mathematik 1 und 2',
                'total': 2
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3c72'),
                'label': 'Algorithmen und Programmierung 1 und 2',
                'total': 1
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3c71'),
                'label': 'Theoretische Informatik',
                'total': 3
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3c70'),
                'label': 'Mensch-Computer-Interaktion',
                'total': 0
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3c6f'),
                'label': 'Computergrafik und Animation',
                'total': 2
              },
              {
                '_id': ObjectId('5c8e53a040584c4cfa7c3c6e'),
                'label': 'Neutral',
                'total': 2
              }
            ],
            'metric': 'Amount of votes for place 5'
          }
        ],
        'lastUpdate': '2019-03-17T14:03:12.638Z',
        'creationDate': '2019-03-17T14:03:12.638Z'
      }
    ]
  },
  {
    '_id': ObjectId('c5372fcfc477cb08cf07ef35'),
    'versionNumber': 1,
    'survey': ObjectId('5c8e478a3ad86943f22d6a92'),
    'from': '2019-03-17T14:01:50.445Z',
    'questions': [
      {
        '_id': ObjectId('5c8e478c3ad86943f22d6a98'),
        'itemOrder': [
          ObjectId('5c8e47d23ad86943f22d6ab2')
        ],
        'choiceOrder': [],
        'labelOrder': [],
        'stepSize': 1,
        'min': 0,
        'max': 10,
        'regulatorDefault': 5,
        'value': 'Wie gefallen Ihnen diese Kirschen?',
        'description': null,
        'type': 'LIKE',
        'survey': ObjectId('5c8e478a3ad86943f22d6a92'),
        'user': ObjectId('b3daa77b4c04a9551b8781d0'),
        'items': [
          {
            '_id': ObjectId('5c8e47d23ad86943f22d6ab2'),
            'label': 'Kirschen'
          }
        ],
        'choices': [],
        'labels': [],
        'creationDate': '2019-03-17T13:11:40.287Z',
        'lastUpdate': '2019-03-17T13:12:52.719Z'
      },
      {
        '_id': ObjectId('5c8e478f3ad86943f22d6a9b'),
        'itemOrder': [
          ObjectId('5c8e47bc3ad86943f22d6aab'),
          ObjectId('5c8e47be3ad86943f22d6aae')
        ],
        'choiceOrder': [],
        'labelOrder': [],
        'stepSize': 1,
        'min': 0,
        'max': 10,
        'regulatorDefault': 5,
        'value': 'Essen Sie gerne Obst?',
        'description': null,
        'type': 'LIKEDISLIKE',
        'survey': ObjectId('5c8e478a3ad86943f22d6a92'),
        'user': ObjectId('b3daa77b4c04a9551b8781d0'),
        'items': [
          {
            '_id': ObjectId('5c8e47bc3ad86943f22d6aab'),
            'label': 'Kirschen'
          },
          {
            '_id': ObjectId('5c8e47be3ad86943f22d6aae'),
            'label': 'Äpfel'
          }
        ],
        'choices': [],
        'labels': [],
        'creationDate': '2019-03-17T13:11:43.180Z',
        'lastUpdate': '2019-03-17T13:12:34.522Z'
      },
      {
        '_id': ObjectId('5c8e47913ad86943f22d6a9e'),
        'itemOrder': [
          ObjectId('5c8e48383ad86943f22d6ad4'),
          ObjectId('5c8e483f3ad86943f22d6ad7'),
          ObjectId('5c8e48413ad86943f22d6ada')
        ],
        'choiceOrder': [
          ObjectId('5c8e47ef3ad86943f22d6ac8'),
          ObjectId('5c8e47e23ad86943f22d6ab6'),
          ObjectId('5c8e47e43ad86943f22d6ab9'),
          ObjectId('5c8e47e53ad86943f22d6abc')
        ],
        'labelOrder': [],
        'stepSize': 1,
        'min': 0,
        'max': 10,
        'regulatorDefault': 5,
        'value': 'Wie viel geben Sie für Obst in der Woche aus?',
        'description': null,
        'type': 'CHOICE',
        'survey': ObjectId('5c8e478a3ad86943f22d6a92'),
        'user': ObjectId('b3daa77b4c04a9551b8781d0'),
        'items': [
          {
            '_id': ObjectId('5c8e48383ad86943f22d6ad4'),
            'label': 'Bananen'
          },
          {
            '_id': ObjectId('5c8e483f3ad86943f22d6ad7'),
            'label': 'Äpfel'
          },
          {
            '_id': ObjectId('5c8e48413ad86943f22d6ada'),
            'label': 'Kiwis'
          }
        ],
        'choices': [
          {
            '_id': ObjectId('5c8e47e23ad86943f22d6ab6'),
            'label': 'Weniger als 10 Euro',
            'code': 'A'
          },
          {
            '_id': ObjectId('5c8e47e43ad86943f22d6ab9'),
            'label': 'Mehr als 10 Euro und weniger als 20 Euro',
            'code': 'B'
          },
          {
            '_id': ObjectId('5c8e47e53ad86943f22d6abc'),
            'label': 'Mehr als 20 Euro',
            'code': 'C'
          },
          {
            '_id': ObjectId('5c8e47ef3ad86943f22d6ac8'),
            'label': 'Gar nichts',
            'code': 'G'
          }
        ],
        'labels': [],
        'creationDate': '2019-03-17T13:11:45.968Z',
        'lastUpdate': '2019-03-17T13:14:45.981Z'
      },
      {
        '_id': ObjectId('5c8e47943ad86943f22d6aa1'),
        'itemOrder': [],
        'choiceOrder': [],
        'labelOrder': [
          ObjectId('5c8e48563ad86943f22d6ae0'),
          ObjectId('5c8e48593ad86943f22d6ae3')
        ],
        'stepSize': 1,
        'min': 0,
        'max': 5,
        'regulatorDefault': 3,
        'value': 'Wie viel Obst essen Sie am Tag?',
        'description': null,
        'type': 'REGULATOR',
        'survey': ObjectId('5c8e478a3ad86943f22d6a92'),
        'user': ObjectId('b3daa77b4c04a9551b8781d0'),
        'items': [],
        'choices': [],
        'labels': [
          {
            '_id': ObjectId('5c8e48563ad86943f22d6ae0'),
            'label': 'Nichts',
            'value': 1
          },
          {
            '_id': ObjectId('5c8e48593ad86943f22d6ae3'),
            'label': 'Sehr viel',
            'value': 5
          }
        ],
        'creationDate': '2019-03-17T13:11:48.825Z',
        'lastUpdate': '2019-03-17T13:15:08.591Z'
      },
      {
        '_id': ObjectId('5c8e47993ad86943f22d6aa4'),
        'itemOrder': [
          ObjectId('5c8e48743ad86943f22d6ae7'),
          ObjectId('5c8e48773ad86943f22d6aea'),
          ObjectId('5c8e487a3ad86943f22d6aed'),
          ObjectId('5c8e487d3ad86943f22d6af0'),
          ObjectId('5c8e48813ad86943f22d6af3')
        ],
        'choiceOrder': [],
        'labelOrder': [],
        'stepSize': 1,
        'min': 0,
        'max': 10,
        'regulatorDefault': 5,
        'value': 'Was ist ihr Lieblingsobst?',
        'description': null,
        'type': 'FAVORITE',
        'survey': ObjectId('5c8e478a3ad86943f22d6a92'),
        'user': ObjectId('b3daa77b4c04a9551b8781d0'),
        'items': [
          {
            '_id': ObjectId('5c8e48743ad86943f22d6ae7'),
            'label': 'Kirschen'
          },
          {
            '_id': ObjectId('5c8e48773ad86943f22d6aea'),
            'label': 'Bananen'
          },
          {
            '_id': ObjectId('5c8e487a3ad86943f22d6aed'),
            'label': 'Äpfel'
          },
          {
            '_id': ObjectId('5c8e487d3ad86943f22d6af0'),
            'label': 'Birnen'
          },
          {
            '_id': ObjectId('5c8e48813ad86943f22d6af3'),
            'label': 'Erdbeeren'
          }
        ],
        'choices': [],
        'labels': [],
        'creationDate': '2019-03-17T13:11:53.417Z',
        'lastUpdate': '2019-03-17T13:15:52.366Z'
      },
      {
        '_id': ObjectId('5c8e479d3ad86943f22d6aa7'),
        'itemOrder': [
          ObjectId('5c8e48a53ad86943f22d6af7'),
          ObjectId('5c8e48a93ad86943f22d6afa'),
          ObjectId('5c8e48ab3ad86943f22d6afd'),
          ObjectId('5c8e48b03ad86943f22d6b00')
        ],
        'choiceOrder': [],
        'labelOrder': [],
        'stepSize': 1,
        'min': 0,
        'max': 10,
        'regulatorDefault': 5,
        'value': 'Welches Obst essen Sie am häufigsten?',
        'description': null,
        'type': 'RANKING',
        'survey': ObjectId('5c8e478a3ad86943f22d6a92'),
        'user': ObjectId('b3daa77b4c04a9551b8781d0'),
        'items': [
          {
            '_id': ObjectId('5c8e48a53ad86943f22d6af7'),
            'label': 'Äpfel'
          },
          {
            '_id': ObjectId('5c8e48a93ad86943f22d6afa'),
            'label': 'Bananen'
          },
          {
            '_id': ObjectId('5c8e48ab3ad86943f22d6afd'),
            'label': 'Heidelbeeren'
          },
          {
            '_id': ObjectId('5c8e48b03ad86943f22d6b00'),
            'label': 'Erdbeeren'
          }
        ],
        'choices': [],
        'labels': [],
        'creationDate': '2019-03-17T13:11:57.198Z',
        'lastUpdate': '2019-03-17T13:16:43.989Z'
      }
    ],
    'to': '2019-03-17T16:01:50.445Z',
    'updatedAt': '2019-03-17T14:01:52.915Z',
    'summaries': [
      {
        '_id': ObjectId('5c8e535040584c4cfa7c3afd'),
        'question': ObjectId('5c8e478c3ad86943f22d6a98'),
        'type': 'LIKE',
        'value': 'Wie gefallen Ihnen diese Kirschen?',
        'evaluations': [
          {
            '_id': ObjectId('5c8e535040584c4cfa7c3afe'),
            'metric': 'Amount of votes',
            'data': [
              {
                '_id': ObjectId('5c8e535040584c4cfa7c3b00'),
                'label': 'Liked',
                'total': 3
              },
              {
                '_id': ObjectId('5c8e535040584c4cfa7c3aff'),
                'label': 'Neutral',
                'total': 7
              }
            ]
          }
        ],
        'lastUpdate': '2019-03-17T14:01:52.915Z',
        'creationDate': '2019-03-17T14:01:52.915Z'
      },
      {
        '_id': ObjectId('5c8e535040584c4cfa7c3af8'),
        'question': ObjectId('5c8e478f3ad86943f22d6a9b'),
        'type': 'LIKEDISLIKE',
        'value': 'Essen Sie gerne Obst?',
        'evaluations': [
          {
            '_id': ObjectId('5c8e535040584c4cfa7c3af9'),
            'metric': 'Amount of votes',
            'data': [
              {
                '_id': ObjectId('5c8e535040584c4cfa7c3afc'),
                'label': 'Liked',
                'total': 10
              },
              {
                '_id': ObjectId('5c8e535040584c4cfa7c3afb'),
                'label': 'Disliked',
                'total': 0
              },
              {
                '_id': ObjectId('5c8e535040584c4cfa7c3afa'),
                'label': 'Neutral',
                'total': 0
              }
            ]
          }
        ],
        'lastUpdate': '2019-03-17T14:01:52.915Z',
        'creationDate': '2019-03-17T14:01:52.915Z'
      },
      {
        '_id': ObjectId('5c8e535040584c4cfa7c3af1'),
        'question': ObjectId('5c8e47913ad86943f22d6a9e'),
        'type': 'CHOICE',
        'value': 'Wie viel geben Sie für Obst in der Woche aus?',
        'evaluations': [
          {
            '_id': ObjectId('5c8e535040584c4cfa7c3af2'),
            'data': [
              {
                '_id': ObjectId('5c8e535040584c4cfa7c3af7'),
                'label': 'A',
                'total': 1
              },
              {
                '_id': ObjectId('5c8e535040584c4cfa7c3af6'),
                'label': 'B',
                'total': 5
              },
              {
                '_id': ObjectId('5c8e535040584c4cfa7c3af5'),
                'label': 'C',
                'total': 1
              },
              {
                '_id': ObjectId('5c8e535040584c4cfa7c3af4'),
                'label': 'G',
                'total': 1
              },
              {
                '_id': ObjectId('5c8e535040584c4cfa7c3af3'),
                'label': 'Neutral',
                'total': 2
              }
            ],
            'metric': 'Amount of votes'
          }
        ],
        'lastUpdate': '2019-03-17T14:01:52.915Z',
        'creationDate': '2019-03-17T14:01:52.915Z'
      },
      {
        '_id': ObjectId('5c8e535040584c4cfa7c3ae8'),
        'question': ObjectId('5c8e47943ad86943f22d6aa1'),
        'type': 'REGULATOR',
        'value': 'Wie viel Obst essen Sie am Tag?',
        'evaluations': [
          {
            '_id': ObjectId('5c8e535040584c4cfa7c3ae9'),
            'data': [
              {
                '_id': ObjectId('5c8e535040584c4cfa7c3af0'),
                'label': 'Rating 0',
                'total': 3
              },
              {
                '_id': ObjectId('5c8e535040584c4cfa7c3aef'),
                'label': 'Rating 1',
                'total': 1
              },
              {
                '_id': ObjectId('5c8e535040584c4cfa7c3aee'),
                'label': 'Rating 2',
                'total': 0
              },
              {
                '_id': ObjectId('5c8e535040584c4cfa7c3aed'),
                'label': 'Rating 3',
                'total': 3
              },
              {
                '_id': ObjectId('5c8e535040584c4cfa7c3aec'),
                'label': 'Rating 4',
                'total': 0
              },
              {
                '_id': ObjectId('5c8e535040584c4cfa7c3aeb'),
                'label': 'Rating 5',
                'total': 3
              },
              {
                '_id': ObjectId('5c8e535040584c4cfa7c3aea'),
                'label': 'Neutral',
                'total': 0
              }
            ],
            'metric': 'Amount of votes'
          }
        ],
        'lastUpdate': '2019-03-17T14:01:52.915Z',
        'creationDate': '2019-03-17T14:01:52.915Z'
      },
      {
        '_id': ObjectId('5c8e535040584c4cfa7c3ae0'),
        'question': ObjectId('5c8e47993ad86943f22d6aa4'),
        'type': 'FAVORITE',
        'value': 'Was ist ihr Lieblingsobst?',
        'evaluations': [
          {
            '_id': ObjectId('5c8e535040584c4cfa7c3ae1'),
            'data': [
              {
                '_id': ObjectId('5c8e535040584c4cfa7c3ae7'),
                'label': 'Kirschen',
                'total': 2
              },
              {
                '_id': ObjectId('5c8e535040584c4cfa7c3ae6'),
                'label': 'Bananen',
                'total': 0
              },
              {
                '_id': ObjectId('5c8e535040584c4cfa7c3ae5'),
                'label': 'Äpfel',
                'total': 2
              },
              {
                '_id': ObjectId('5c8e535040584c4cfa7c3ae4'),
                'label': 'Birnen',
                'total': 4
              },
              {
                '_id': ObjectId('5c8e535040584c4cfa7c3ae3'),
                'label': 'Erdbeeren',
                'total': 1
              },
              {
                '_id': ObjectId('5c8e535040584c4cfa7c3ae2'),
                'label': 'Neutral',
                'total': 1
              }
            ],
            'metric': 'Amount of votes'
          }
        ],
        'lastUpdate': '2019-03-17T14:01:52.915Z',
        'creationDate': '2019-03-17T14:01:52.915Z'
      },
      {
        '_id': ObjectId('5c8e535040584c4cfa7c3ac2'),
        'question': ObjectId('5c8e479d3ad86943f22d6aa7'),
        'type': 'RANKING',
        'value': 'Welches Obst essen Sie am häufigsten?',
        'evaluations': [
          {
            '_id': ObjectId('5c8e535040584c4cfa7c3adb'),
            'data': [
              {
                '_id': ObjectId('5c8e535040584c4cfa7c3adf'),
                'label': 'Äpfel',
                'total': 3.33
              },
              {
                '_id': ObjectId('5c8e535040584c4cfa7c3ade'),
                'label': 'Bananen',
                'total': 6
              },
              {
                '_id': ObjectId('5c8e535040584c4cfa7c3add'),
                'label': 'Heidelbeeren',
                'total': 7
              },
              {
                '_id': ObjectId('5c8e535040584c4cfa7c3adc'),
                'label': 'Erdbeeren',
                'total': 7
              }
            ],
            'metric': 'Average item-scores (higher = better average placements)'
          },
          {
            '_id': ObjectId('5c8e535040584c4cfa7c3ad5'),
            'data': [
              {
                '_id': ObjectId('5c8e535040584c4cfa7c3ada'),
                'label': 'Äpfel',
                'total': 0
              },
              {
                '_id': ObjectId('5c8e535040584c4cfa7c3ad9'),
                'label': 'Bananen',
                'total': 2
              },
              {
                '_id': ObjectId('5c8e535040584c4cfa7c3ad8'),
                'label': 'Heidelbeeren',
                'total': 3
              },
              {
                '_id': ObjectId('5c8e535040584c4cfa7c3ad7'),
                'label': 'Erdbeeren',
                'total': 4
              },
              {
                '_id': ObjectId('5c8e535040584c4cfa7c3ad6'),
                'label': 'Neutral',
                'total': 1
              }
            ],
            'metric': 'Amount of votes for place 1'
          },
          {
            '_id': ObjectId('5c8e535040584c4cfa7c3acf'),
            'data': [
              {
                '_id': ObjectId('5c8e535040584c4cfa7c3ad4'),
                'label': 'Äpfel',
                'total': 1
              },
              {
                '_id': ObjectId('5c8e535040584c4cfa7c3ad3'),
                'label': 'Bananen',
                'total': 3
              },
              {
                '_id': ObjectId('5c8e535040584c4cfa7c3ad2'),
                'label': 'Heidelbeeren',
                'total': 3
              },
              {
                '_id': ObjectId('5c8e535040584c4cfa7c3ad1'),
                'label': 'Erdbeeren',
                'total': 2
              },
              {
                '_id': ObjectId('5c8e535040584c4cfa7c3ad0'),
                'label': 'Neutral',
                'total': 1
              }
            ],
            'metric': 'Amount of votes for place 2'
          },
          {
            '_id': ObjectId('5c8e535040584c4cfa7c3ac9'),
            'data': [
              {
                '_id': ObjectId('5c8e535040584c4cfa7c3ace'),
                'label': 'Äpfel',
                'total': 4
              },
              {
                '_id': ObjectId('5c8e535040584c4cfa7c3acd'),
                'label': 'Bananen',
                'total': 2
              },
              {
                '_id': ObjectId('5c8e535040584c4cfa7c3acc'),
                'label': 'Heidelbeeren',
                'total': 2
              },
              {
                '_id': ObjectId('5c8e535040584c4cfa7c3acb'),
                'label': 'Erdbeeren',
                'total': 1
              },
              {
                '_id': ObjectId('5c8e535040584c4cfa7c3aca'),
                'label': 'Neutral',
                'total': 1
              }
            ],
            'metric': 'Amount of votes for place 3'
          },
          {
            '_id': ObjectId('5c8e535040584c4cfa7c3ac3'),
            'data': [
              {
                '_id': ObjectId('5c8e535040584c4cfa7c3ac8'),
                'label': 'Äpfel',
                'total': 4
              },
              {
                '_id': ObjectId('5c8e535040584c4cfa7c3ac7'),
                'label': 'Bananen',
                'total': 2
              },
              {
                '_id': ObjectId('5c8e535040584c4cfa7c3ac6'),
                'label': 'Heidelbeeren',
                'total': 1
              },
              {
                '_id': ObjectId('5c8e535040584c4cfa7c3ac5'),
                'label': 'Erdbeeren',
                'total': 2
              },
              {
                '_id': ObjectId('5c8e535040584c4cfa7c3ac4'),
                'label': 'Neutral',
                'total': 1
              }
            ],
            'metric': 'Amount of votes for place 4'
          }
        ],
        'lastUpdate': '2019-03-17T14:01:52.915Z',
        'creationDate': '2019-03-17T14:01:52.915Z'
      }
    ]
  },
  {
    '_id': ObjectId('542a075113b8f13f9f8bc15e'),
    'versionNumber': 2,
    'survey': ObjectId('5c8e478a3ad86943f22d6a92'),
    'from': '2019-03-17T16:01:50.445Z',
    'questions': [
      {
        '_id': ObjectId('5c8e478c3ad86943f22d6a98'),
        'itemOrder': [
          ObjectId('5c8e47d23ad86943f22d6ab2')
        ],
        'choiceOrder': [],
        'labelOrder': [],
        'stepSize': 1,
        'min': 0,
        'max': 10,
        'regulatorDefault': 5,
        'value': 'Wie gefallen Ihnen diese Kirschen?',
        'description': null,
        'type': 'LIKE',
        'survey': ObjectId('5c8e478a3ad86943f22d6a92'),
        'user': ObjectId('b3daa77b4c04a9551b8781d0'),
        'items': [
          {
            '_id': ObjectId('5c8e47d23ad86943f22d6ab2'),
            'label': 'Kirschen'
          }
        ],
        'choices': [],
        'labels': [],
        'creationDate': '2019-03-17T13:11:40.287Z',
        'lastUpdate': '2019-03-17T13:12:52.719Z'
      },
      {
        '_id': ObjectId('5c8e478f3ad86943f22d6a9b'),
        'itemOrder': [
          ObjectId('5c8e47bc3ad86943f22d6aab'),
          ObjectId('5c8e47be3ad86943f22d6aae')
        ],
        'choiceOrder': [],
        'labelOrder': [],
        'stepSize': 1,
        'min': 0,
        'max': 10,
        'regulatorDefault': 5,
        'value': 'Essen Sie gerne Obst?',
        'description': null,
        'type': 'LIKEDISLIKE',
        'survey': ObjectId('5c8e478a3ad86943f22d6a92'),
        'user': ObjectId('b3daa77b4c04a9551b8781d0'),
        'items': [
          {
            '_id': ObjectId('5c8e47bc3ad86943f22d6aab'),
            'label': 'Kirschen'
          },
          {
            '_id': ObjectId('5c8e47be3ad86943f22d6aae'),
            'label': 'Äpfel'
          }
        ],
        'choices': [],
        'labels': [],
        'creationDate': '2019-03-17T13:11:43.180Z',
        'lastUpdate': '2019-03-17T13:12:34.522Z'
      },
      {
        '_id': ObjectId('5c8e47913ad86943f22d6a9e'),
        'itemOrder': [
          ObjectId('5c8e48383ad86943f22d6ad4'),
          ObjectId('5c8e483f3ad86943f22d6ad7'),
          ObjectId('5c8e48413ad86943f22d6ada')
        ],
        'choiceOrder': [
          ObjectId('5c8e47ef3ad86943f22d6ac8'),
          ObjectId('5c8e47e23ad86943f22d6ab6'),
          ObjectId('5c8e47e43ad86943f22d6ab9'),
          ObjectId('5c8e47e53ad86943f22d6abc')
        ],
        'labelOrder': [],
        'stepSize': 1,
        'min': 0,
        'max': 10,
        'regulatorDefault': 5,
        'value': 'Wie viel geben Sie für Obst in der Woche aus?',
        'description': null,
        'type': 'CHOICE',
        'survey': ObjectId('5c8e478a3ad86943f22d6a92'),
        'user': ObjectId('b3daa77b4c04a9551b8781d0'),
        'items': [
          {
            '_id': ObjectId('5c8e48383ad86943f22d6ad4'),
            'label': 'Bananen'
          },
          {
            '_id': ObjectId('5c8e483f3ad86943f22d6ad7'),
            'label': 'Äpfel'
          },
          {
            '_id': ObjectId('5c8e48413ad86943f22d6ada'),
            'label': 'Kiwis'
          }
        ],
        'choices': [
          {
            '_id': ObjectId('5c8e47e23ad86943f22d6ab6'),
            'label': 'Weniger als 10 Euro',
            'code': 'A'
          },
          {
            '_id': ObjectId('5c8e47e43ad86943f22d6ab9'),
            'label': 'Mehr als 10 Euro und weniger als 20 Euro',
            'code': 'B'
          },
          {
            '_id': ObjectId('5c8e47e53ad86943f22d6abc'),
            'label': 'Mehr als 20 Euro',
            'code': 'C'
          },
          {
            '_id': ObjectId('5c8e47ef3ad86943f22d6ac8'),
            'label': 'Gar nichts',
            'code': 'G'
          }
        ],
        'labels': [],
        'creationDate': '2019-03-17T13:11:45.968Z',
        'lastUpdate': '2019-03-17T13:14:45.981Z'
      },
      {
        '_id': ObjectId('5c8e47943ad86943f22d6aa1'),
        'itemOrder': [],
        'choiceOrder': [],
        'labelOrder': [
          ObjectId('5c8e48563ad86943f22d6ae0'),
          ObjectId('5c8e48593ad86943f22d6ae3')
        ],
        'stepSize': 1,
        'min': 0,
        'max': 5,
        'regulatorDefault': 3,
        'value': 'Wie viel Obst essen Sie am Tag?',
        'description': null,
        'type': 'REGULATOR',
        'survey': ObjectId('5c8e478a3ad86943f22d6a92'),
        'user': ObjectId('b3daa77b4c04a9551b8781d0'),
        'items': [],
        'choices': [],
        'labels': [
          {
            '_id': ObjectId('5c8e48563ad86943f22d6ae0'),
            'label': 'Nichts',
            'value': 1
          },
          {
            '_id': ObjectId('5c8e48593ad86943f22d6ae3'),
            'label': 'Sehr viel',
            'value': 5
          }
        ],
        'creationDate': '2019-03-17T13:11:48.825Z',
        'lastUpdate': '2019-03-17T13:15:08.591Z'
      },
      {
        '_id': ObjectId('5c8e47993ad86943f22d6aa4'),
        'itemOrder': [
          ObjectId('5c8e48743ad86943f22d6ae7'),
          ObjectId('5c8e48773ad86943f22d6aea'),
          ObjectId('5c8e487a3ad86943f22d6aed'),
          ObjectId('5c8e487d3ad86943f22d6af0'),
          ObjectId('5c8e48813ad86943f22d6af3')
        ],
        'choiceOrder': [],
        'labelOrder': [],
        'stepSize': 1,
        'min': 0,
        'max': 10,
        'regulatorDefault': 5,
        'value': 'Was ist ihr Lieblingsobst?',
        'description': null,
        'type': 'FAVORITE',
        'survey': ObjectId('5c8e478a3ad86943f22d6a92'),
        'user': ObjectId('b3daa77b4c04a9551b8781d0'),
        'items': [
          {
            '_id': ObjectId('5c8e48743ad86943f22d6ae7'),
            'label': 'Kirschen'
          },
          {
            '_id': ObjectId('5c8e48773ad86943f22d6aea'),
            'label': 'Bananen'
          },
          {
            '_id': ObjectId('5c8e487a3ad86943f22d6aed'),
            'label': 'Äpfel'
          },
          {
            '_id': ObjectId('5c8e487d3ad86943f22d6af0'),
            'label': 'Birnen'
          },
          {
            '_id': ObjectId('5c8e48813ad86943f22d6af3'),
            'label': 'Erdbeeren'
          }
        ],
        'choices': [],
        'labels': [],
        'creationDate': '2019-03-17T13:11:53.417Z',
        'lastUpdate': '2019-03-17T13:15:52.366Z'
      },
      {
        '_id': ObjectId('5c8e479d3ad86943f22d6aa7'),
        'itemOrder': [
          ObjectId('5c8e48a53ad86943f22d6af7'),
          ObjectId('5c8e48a93ad86943f22d6afa'),
          ObjectId('5c8e48ab3ad86943f22d6afd'),
          ObjectId('5c8e48b03ad86943f22d6b00')
        ],
        'choiceOrder': [],
        'labelOrder': [],
        'stepSize': 1,
        'min': 0,
        'max': 10,
        'regulatorDefault': 5,
        'value': 'Welches Obst essen Sie am häufigsten?',
        'description': null,
        'type': 'RANKING',
        'survey': ObjectId('5c8e478a3ad86943f22d6a92'),
        'user': ObjectId('b3daa77b4c04a9551b8781d0'),
        'items': [
          {
            '_id': ObjectId('5c8e48a53ad86943f22d6af7'),
            'label': 'Äpfel'
          },
          {
            '_id': ObjectId('5c8e48a93ad86943f22d6afa'),
            'label': 'Bananen'
          },
          {
            '_id': ObjectId('5c8e48ab3ad86943f22d6afd'),
            'label': 'Heidelbeeren'
          },
          {
            '_id': ObjectId('5c8e48b03ad86943f22d6b00'),
            'label': 'Erdbeeren'
          }
        ],
        'choices': [],
        'labels': [],
        'creationDate': '2019-03-17T13:11:57.198Z',
        'lastUpdate': '2019-03-17T13:16:43.989Z'
      }
    ],
    'to': '2019-03-17T18:01:50.445Z',
    'updatedAt': '2019-03-17T14:01:52.874Z',
    'summaries': [
      {
        '_id': ObjectId('5c8e535040584c4cfa7c3abe'),
        'question': ObjectId('5c8e478c3ad86943f22d6a98'),
        'type': 'LIKE',
        'value': 'Wie gefallen Ihnen diese Kirschen?',
        'evaluations': [
          {
            '_id': ObjectId('5c8e535040584c4cfa7c3abf'),
            'metric': 'Amount of votes',
            'data': [
              {
                '_id': ObjectId('5c8e535040584c4cfa7c3ac1'),
                'label': 'Liked',
                'total': 5
              },
              {
                '_id': ObjectId('5c8e535040584c4cfa7c3ac0'),
                'label': 'Neutral',
                'total': 5
              }
            ]
          }
        ],
        'lastUpdate': '2019-03-17T14:01:52.874Z',
        'creationDate': '2019-03-17T14:01:52.874Z'
      },
      {
        '_id': ObjectId('5c8e535040584c4cfa7c3ab9'),
        'question': ObjectId('5c8e478f3ad86943f22d6a9b'),
        'type': 'LIKEDISLIKE',
        'value': 'Essen Sie gerne Obst?',
        'evaluations': [
          {
            '_id': ObjectId('5c8e535040584c4cfa7c3aba'),
            'metric': 'Amount of votes',
            'data': [
              {
                '_id': ObjectId('5c8e535040584c4cfa7c3abd'),
                'label': 'Liked',
                'total': 5
              },
              {
                '_id': ObjectId('5c8e535040584c4cfa7c3abc'),
                'label': 'Disliked',
                'total': 4
              },
              {
                '_id': ObjectId('5c8e535040584c4cfa7c3abb'),
                'label': 'Neutral',
                'total': 1
              }
            ]
          }
        ],
        'lastUpdate': '2019-03-17T14:01:52.874Z',
        'creationDate': '2019-03-17T14:01:52.874Z'
      },
      {
        '_id': ObjectId('5c8e535040584c4cfa7c3ab2'),
        'question': ObjectId('5c8e47913ad86943f22d6a9e'),
        'type': 'CHOICE',
        'value': 'Wie viel geben Sie für Obst in der Woche aus?',
        'evaluations': [
          {
            '_id': ObjectId('5c8e535040584c4cfa7c3ab3'),
            'data': [
              {
                '_id': ObjectId('5c8e535040584c4cfa7c3ab8'),
                'label': 'A',
                'total': 3
              },
              {
                '_id': ObjectId('5c8e535040584c4cfa7c3ab7'),
                'label': 'B',
                'total': 2
              },
              {
                '_id': ObjectId('5c8e535040584c4cfa7c3ab6'),
                'label': 'C',
                'total': 2
              },
              {
                '_id': ObjectId('5c8e535040584c4cfa7c3ab5'),
                'label': 'G',
                'total': 1
              },
              {
                '_id': ObjectId('5c8e535040584c4cfa7c3ab4'),
                'label': 'Neutral',
                'total': 2
              }
            ],
            'metric': 'Amount of votes'
          }
        ],
        'lastUpdate': '2019-03-17T14:01:52.874Z',
        'creationDate': '2019-03-17T14:01:52.874Z'
      },
      {
        '_id': ObjectId('5c8e535040584c4cfa7c3aa9'),
        'question': ObjectId('5c8e47943ad86943f22d6aa1'),
        'type': 'REGULATOR',
        'value': 'Wie viel Obst essen Sie am Tag?',
        'evaluations': [
          {
            '_id': ObjectId('5c8e535040584c4cfa7c3aaa'),
            'data': [
              {
                '_id': ObjectId('5c8e535040584c4cfa7c3ab1'),
                'label': 'Rating 0',
                'total': 0
              },
              {
                '_id': ObjectId('5c8e535040584c4cfa7c3ab0'),
                'label': 'Rating 1',
                'total': 2
              },
              {
                '_id': ObjectId('5c8e535040584c4cfa7c3aaf'),
                'label': 'Rating 2',
                'total': 2
              },
              {
                '_id': ObjectId('5c8e535040584c4cfa7c3aae'),
                'label': 'Rating 3',
                'total': 3
              },
              {
                '_id': ObjectId('5c8e535040584c4cfa7c3aad'),
                'label': 'Rating 4',
                'total': 2
              },
              {
                '_id': ObjectId('5c8e535040584c4cfa7c3aac'),
                'label': 'Rating 5',
                'total': 1
              },
              {
                '_id': ObjectId('5c8e535040584c4cfa7c3aab'),
                'label': 'Neutral',
                'total': 0
              }
            ],
            'metric': 'Amount of votes'
          }
        ],
        'lastUpdate': '2019-03-17T14:01:52.874Z',
        'creationDate': '2019-03-17T14:01:52.874Z'
      },
      {
        '_id': ObjectId('5c8e535040584c4cfa7c3aa1'),
        'question': ObjectId('5c8e47993ad86943f22d6aa4'),
        'type': 'FAVORITE',
        'value': 'Was ist ihr Lieblingsobst?',
        'evaluations': [
          {
            '_id': ObjectId('5c8e535040584c4cfa7c3aa2'),
            'data': [
              {
                '_id': ObjectId('5c8e535040584c4cfa7c3aa8'),
                'label': 'Kirschen',
                'total': 1
              },
              {
                '_id': ObjectId('5c8e535040584c4cfa7c3aa7'),
                'label': 'Bananen',
                'total': 0
              },
              {
                '_id': ObjectId('5c8e535040584c4cfa7c3aa6'),
                'label': 'Äpfel',
                'total': 2
              },
              {
                '_id': ObjectId('5c8e535040584c4cfa7c3aa5'),
                'label': 'Birnen',
                'total': 4
              },
              {
                '_id': ObjectId('5c8e535040584c4cfa7c3aa4'),
                'label': 'Erdbeeren',
                'total': 2
              },
              {
                '_id': ObjectId('5c8e535040584c4cfa7c3aa3'),
                'label': 'Neutral',
                'total': 1
              }
            ],
            'metric': 'Amount of votes'
          }
        ],
        'lastUpdate': '2019-03-17T14:01:52.874Z',
        'creationDate': '2019-03-17T14:01:52.874Z'
      },
      {
        '_id': ObjectId('5c8e535040584c4cfa7c3a83'),
        'question': ObjectId('5c8e479d3ad86943f22d6aa7'),
        'type': 'RANKING',
        'value': 'Welches Obst essen Sie am häufigsten?',
        'evaluations': [
          {
            '_id': ObjectId('5c8e535040584c4cfa7c3a9c'),
            'data': [
              {
                '_id': ObjectId('5c8e535040584c4cfa7c3aa0'),
                'label': 'Äpfel',
                'total': 6
              },
              {
                '_id': ObjectId('5c8e535040584c4cfa7c3a9f'),
                'label': 'Bananen',
                'total': 5.33
              },
              {
                '_id': ObjectId('5c8e535040584c4cfa7c3a9e'),
                'label': 'Heidelbeeren',
                'total': 5.33
              },
              {
                '_id': ObjectId('5c8e535040584c4cfa7c3a9d'),
                'label': 'Erdbeeren',
                'total': 6.67
              }
            ],
            'metric': 'Average item-scores (higher = better average placements)'
          },
          {
            '_id': ObjectId('5c8e535040584c4cfa7c3a96'),
            'data': [
              {
                '_id': ObjectId('5c8e535040584c4cfa7c3a9b'),
                'label': 'Äpfel',
                'total': 3
              },
              {
                '_id': ObjectId('5c8e535040584c4cfa7c3a9a'),
                'label': 'Bananen',
                'total': 3
              },
              {
                '_id': ObjectId('5c8e535040584c4cfa7c3a99'),
                'label': 'Heidelbeeren',
                'total': 1
              },
              {
                '_id': ObjectId('5c8e535040584c4cfa7c3a98'),
                'label': 'Erdbeeren',
                'total': 2
              },
              {
                '_id': ObjectId('5c8e535040584c4cfa7c3a97'),
                'label': 'Neutral',
                'total': 1
              }
            ],
            'metric': 'Amount of votes for place 1'
          },
          {
            '_id': ObjectId('5c8e535040584c4cfa7c3a90'),
            'data': [
              {
                '_id': ObjectId('5c8e535040584c4cfa7c3a95'),
                'label': 'Äpfel',
                'total': 1
              },
              {
                '_id': ObjectId('5c8e535040584c4cfa7c3a94'),
                'label': 'Bananen',
                'total': 1
              },
              {
                '_id': ObjectId('5c8e535040584c4cfa7c3a93'),
                'label': 'Heidelbeeren',
                'total': 3
              },
              {
                '_id': ObjectId('5c8e535040584c4cfa7c3a92'),
                'label': 'Erdbeeren',
                'total': 4
              },
              {
                '_id': ObjectId('5c8e535040584c4cfa7c3a91'),
                'label': 'Neutral',
                'total': 1
              }
            ],
            'metric': 'Amount of votes for place 2'
          },
          {
            '_id': ObjectId('5c8e535040584c4cfa7c3a8a'),
            'data': [
              {
                '_id': ObjectId('5c8e535040584c4cfa7c3a8f'),
                'label': 'Äpfel',
                'total': 3
              },
              {
                '_id': ObjectId('5c8e535040584c4cfa7c3a8e'),
                'label': 'Bananen',
                'total': 1
              },
              {
                '_id': ObjectId('5c8e535040584c4cfa7c3a8d'),
                'label': 'Heidelbeeren',
                'total': 3
              },
              {
                '_id': ObjectId('5c8e535040584c4cfa7c3a8c'),
                'label': 'Erdbeeren',
                'total': 2
              },
              {
                '_id': ObjectId('5c8e535040584c4cfa7c3a8b'),
                'label': 'Neutral',
                'total': 1
              }
            ],
            'metric': 'Amount of votes for place 3'
          },
          {
            '_id': ObjectId('5c8e535040584c4cfa7c3a84'),
            'data': [
              {
                '_id': ObjectId('5c8e535040584c4cfa7c3a89'),
                'label': 'Äpfel',
                'total': 2
              },
              {
                '_id': ObjectId('5c8e535040584c4cfa7c3a88'),
                'label': 'Bananen',
                'total': 4
              },
              {
                '_id': ObjectId('5c8e535040584c4cfa7c3a87'),
                'label': 'Heidelbeeren',
                'total': 2
              },
              {
                '_id': ObjectId('5c8e535040584c4cfa7c3a86'),
                'label': 'Erdbeeren',
                'total': 1
              },
              {
                '_id': ObjectId('5c8e535040584c4cfa7c3a85'),
                'label': 'Neutral',
                'total': 1
              }
            ],
            'metric': 'Amount of votes for place 4'
          }
        ],
        'lastUpdate': '2019-03-17T14:01:52.874Z',
        'creationDate': '2019-03-17T14:01:52.874Z'
      }
    ]
  },
  {
    '_id': ObjectId('6d0ef9ab872f4af65e590dad'),
    'versionNumber': 3,
    'survey': ObjectId('5c8e478a3ad86943f22d6a92'),
    'from': '2019-03-17T18:01:50.445Z',
    'questions': [
      {
        '_id': ObjectId('5c8e478c3ad86943f22d6a98'),
        'itemOrder': [
          ObjectId('5c8e47d23ad86943f22d6ab2')
        ],
        'choiceOrder': [],
        'labelOrder': [],
        'stepSize': 1,
        'min': 0,
        'max': 10,
        'regulatorDefault': 5,
        'value': 'Wie gefallen Ihnen diese Kirschen?',
        'description': null,
        'type': 'LIKE',
        'survey': ObjectId('5c8e478a3ad86943f22d6a92'),
        'user': ObjectId('b3daa77b4c04a9551b8781d0'),
        'items': [
          {
            '_id': ObjectId('5c8e47d23ad86943f22d6ab2'),
            'label': 'Kirschen'
          }
        ],
        'choices': [],
        'labels': [],
        'creationDate': '2019-03-17T13:11:40.287Z',
        'lastUpdate': '2019-03-17T13:12:52.719Z'
      },
      {
        '_id': ObjectId('5c8e478f3ad86943f22d6a9b'),
        'itemOrder': [
          ObjectId('5c8e47bc3ad86943f22d6aab'),
          ObjectId('5c8e47be3ad86943f22d6aae')
        ],
        'choiceOrder': [],
        'labelOrder': [],
        'stepSize': 1,
        'min': 0,
        'max': 10,
        'regulatorDefault': 5,
        'value': 'Essen Sie gerne Obst?',
        'description': null,
        'type': 'LIKEDISLIKE',
        'survey': ObjectId('5c8e478a3ad86943f22d6a92'),
        'user': ObjectId('b3daa77b4c04a9551b8781d0'),
        'items': [
          {
            '_id': ObjectId('5c8e47bc3ad86943f22d6aab'),
            'label': 'Kirschen'
          },
          {
            '_id': ObjectId('5c8e47be3ad86943f22d6aae'),
            'label': 'Äpfel'
          }
        ],
        'choices': [],
        'labels': [],
        'creationDate': '2019-03-17T13:11:43.180Z',
        'lastUpdate': '2019-03-17T13:12:34.522Z'
      },
      {
        '_id': ObjectId('5c8e47913ad86943f22d6a9e'),
        'itemOrder': [
          ObjectId('5c8e48383ad86943f22d6ad4'),
          ObjectId('5c8e483f3ad86943f22d6ad7'),
          ObjectId('5c8e48413ad86943f22d6ada')
        ],
        'choiceOrder': [
          ObjectId('5c8e47ef3ad86943f22d6ac8'),
          ObjectId('5c8e47e23ad86943f22d6ab6'),
          ObjectId('5c8e47e43ad86943f22d6ab9'),
          ObjectId('5c8e47e53ad86943f22d6abc')
        ],
        'labelOrder': [],
        'stepSize': 1,
        'min': 0,
        'max': 10,
        'regulatorDefault': 5,
        'value': 'Wie viel geben Sie für Obst in der Woche aus?',
        'description': null,
        'type': 'CHOICE',
        'survey': ObjectId('5c8e478a3ad86943f22d6a92'),
        'user': ObjectId('b3daa77b4c04a9551b8781d0'),
        'items': [
          {
            '_id': ObjectId('5c8e48383ad86943f22d6ad4'),
            'label': 'Bananen'
          },
          {
            '_id': ObjectId('5c8e483f3ad86943f22d6ad7'),
            'label': 'Äpfel'
          },
          {
            '_id': ObjectId('5c8e48413ad86943f22d6ada'),
            'label': 'Kiwis'
          }
        ],
        'choices': [
          {
            '_id': ObjectId('5c8e47e23ad86943f22d6ab6'),
            'label': 'Weniger als 10 Euro',
            'code': 'A'
          },
          {
            '_id': ObjectId('5c8e47e43ad86943f22d6ab9'),
            'label': 'Mehr als 10 Euro und weniger als 20 Euro',
            'code': 'B'
          },
          {
            '_id': ObjectId('5c8e47e53ad86943f22d6abc'),
            'label': 'Mehr als 20 Euro',
            'code': 'C'
          },
          {
            '_id': ObjectId('5c8e47ef3ad86943f22d6ac8'),
            'label': 'Gar nichts',
            'code': 'G'
          }
        ],
        'labels': [],
        'creationDate': '2019-03-17T13:11:45.968Z',
        'lastUpdate': '2019-03-17T13:14:45.981Z'
      },
      {
        '_id': ObjectId('5c8e47943ad86943f22d6aa1'),
        'itemOrder': [],
        'choiceOrder': [],
        'labelOrder': [
          ObjectId('5c8e48563ad86943f22d6ae0'),
          ObjectId('5c8e48593ad86943f22d6ae3')
        ],
        'stepSize': 1,
        'min': 0,
        'max': 5,
        'regulatorDefault': 3,
        'value': 'Wie viel Obst essen Sie am Tag?',
        'description': null,
        'type': 'REGULATOR',
        'survey': ObjectId('5c8e478a3ad86943f22d6a92'),
        'user': ObjectId('b3daa77b4c04a9551b8781d0'),
        'items': [],
        'choices': [],
        'labels': [
          {
            '_id': ObjectId('5c8e48563ad86943f22d6ae0'),
            'label': 'Nichts',
            'value': 1
          },
          {
            '_id': ObjectId('5c8e48593ad86943f22d6ae3'),
            'label': 'Sehr viel',
            'value': 5
          }
        ],
        'creationDate': '2019-03-17T13:11:48.825Z',
        'lastUpdate': '2019-03-17T13:15:08.591Z'
      },
      {
        '_id': ObjectId('5c8e47993ad86943f22d6aa4'),
        'itemOrder': [
          ObjectId('5c8e48743ad86943f22d6ae7'),
          ObjectId('5c8e48773ad86943f22d6aea'),
          ObjectId('5c8e487a3ad86943f22d6aed'),
          ObjectId('5c8e487d3ad86943f22d6af0'),
          ObjectId('5c8e48813ad86943f22d6af3')
        ],
        'choiceOrder': [],
        'labelOrder': [],
        'stepSize': 1,
        'min': 0,
        'max': 10,
        'regulatorDefault': 5,
        'value': 'Was ist ihr Lieblingsobst?',
        'description': null,
        'type': 'FAVORITE',
        'survey': ObjectId('5c8e478a3ad86943f22d6a92'),
        'user': ObjectId('b3daa77b4c04a9551b8781d0'),
        'items': [
          {
            '_id': ObjectId('5c8e48743ad86943f22d6ae7'),
            'label': 'Kirschen'
          },
          {
            '_id': ObjectId('5c8e48773ad86943f22d6aea'),
            'label': 'Bananen'
          },
          {
            '_id': ObjectId('5c8e487a3ad86943f22d6aed'),
            'label': 'Äpfel'
          },
          {
            '_id': ObjectId('5c8e487d3ad86943f22d6af0'),
            'label': 'Birnen'
          },
          {
            '_id': ObjectId('5c8e48813ad86943f22d6af3'),
            'label': 'Erdbeeren'
          }
        ],
        'choices': [],
        'labels': [],
        'creationDate': '2019-03-17T13:11:53.417Z',
        'lastUpdate': '2019-03-17T13:15:52.366Z'
      },
      {
        '_id': ObjectId('5c8e479d3ad86943f22d6aa7'),
        'itemOrder': [
          ObjectId('5c8e48a53ad86943f22d6af7'),
          ObjectId('5c8e48a93ad86943f22d6afa'),
          ObjectId('5c8e48ab3ad86943f22d6afd'),
          ObjectId('5c8e48b03ad86943f22d6b00')
        ],
        'choiceOrder': [],
        'labelOrder': [],
        'stepSize': 1,
        'min': 0,
        'max': 10,
        'regulatorDefault': 5,
        'value': 'Welches Obst essen Sie am häufigsten?',
        'description': null,
        'type': 'RANKING',
        'survey': ObjectId('5c8e478a3ad86943f22d6a92'),
        'user': ObjectId('b3daa77b4c04a9551b8781d0'),
        'items': [
          {
            '_id': ObjectId('5c8e48a53ad86943f22d6af7'),
            'label': 'Äpfel'
          },
          {
            '_id': ObjectId('5c8e48a93ad86943f22d6afa'),
            'label': 'Bananen'
          },
          {
            '_id': ObjectId('5c8e48ab3ad86943f22d6afd'),
            'label': 'Heidelbeeren'
          },
          {
            '_id': ObjectId('5c8e48b03ad86943f22d6b00'),
            'label': 'Erdbeeren'
          }
        ],
        'choices': [],
        'labels': [],
        'creationDate': '2019-03-17T13:11:57.198Z',
        'lastUpdate': '2019-03-17T13:16:43.989Z'
      }
    ],
    'to': '2019-03-17T20:01:50.445Z',
    'updatedAt': '2019-03-17T14:01:52.808Z',
    'summaries': [
      {
        '_id': ObjectId('5c8e535040584c4cfa7c3a7f'),
        'question': ObjectId('5c8e478c3ad86943f22d6a98'),
        'type': 'LIKE',
        'value': 'Wie gefallen Ihnen diese Kirschen?',
        'evaluations': [
          {
            '_id': ObjectId('5c8e535040584c4cfa7c3a80'),
            'metric': 'Amount of votes',
            'data': [
              {
                '_id': ObjectId('5c8e535040584c4cfa7c3a82'),
                'label': 'Liked',
                'total': 7
              },
              {
                '_id': ObjectId('5c8e535040584c4cfa7c3a81'),
                'label': 'Neutral',
                'total': 3
              }
            ]
          }
        ],
        'lastUpdate': '2019-03-17T14:01:52.808Z',
        'creationDate': '2019-03-17T14:01:52.808Z'
      },
      {
        '_id': ObjectId('5c8e535040584c4cfa7c3a7a'),
        'question': ObjectId('5c8e478f3ad86943f22d6a9b'),
        'type': 'LIKEDISLIKE',
        'value': 'Essen Sie gerne Obst?',
        'evaluations': [
          {
            '_id': ObjectId('5c8e535040584c4cfa7c3a7b'),
            'metric': 'Amount of votes',
            'data': [
              {
                '_id': ObjectId('5c8e535040584c4cfa7c3a7e'),
                'label': 'Liked',
                'total': 8
              },
              {
                '_id': ObjectId('5c8e535040584c4cfa7c3a7d'),
                'label': 'Disliked',
                'total': 1
              },
              {
                '_id': ObjectId('5c8e535040584c4cfa7c3a7c'),
                'label': 'Neutral',
                'total': 1
              }
            ]
          }
        ],
        'lastUpdate': '2019-03-17T14:01:52.808Z',
        'creationDate': '2019-03-17T14:01:52.808Z'
      },
      {
        '_id': ObjectId('5c8e535040584c4cfa7c3a73'),
        'question': ObjectId('5c8e47913ad86943f22d6a9e'),
        'type': 'CHOICE',
        'value': 'Wie viel geben Sie für Obst in der Woche aus?',
        'evaluations': [
          {
            '_id': ObjectId('5c8e535040584c4cfa7c3a74'),
            'data': [
              {
                '_id': ObjectId('5c8e535040584c4cfa7c3a79'),
                'label': 'A',
                'total': 2
              },
              {
                '_id': ObjectId('5c8e535040584c4cfa7c3a78'),
                'label': 'B',
                'total': 2
              },
              {
                '_id': ObjectId('5c8e535040584c4cfa7c3a77'),
                'label': 'C',
                'total': 3
              },
              {
                '_id': ObjectId('5c8e535040584c4cfa7c3a76'),
                'label': 'G',
                'total': 2
              },
              {
                '_id': ObjectId('5c8e535040584c4cfa7c3a75'),
                'label': 'Neutral',
                'total': 1
              }
            ],
            'metric': 'Amount of votes'
          }
        ],
        'lastUpdate': '2019-03-17T14:01:52.808Z',
        'creationDate': '2019-03-17T14:01:52.808Z'
      },
      {
        '_id': ObjectId('5c8e535040584c4cfa7c3a6a'),
        'question': ObjectId('5c8e47943ad86943f22d6aa1'),
        'type': 'REGULATOR',
        'value': 'Wie viel Obst essen Sie am Tag?',
        'evaluations': [
          {
            '_id': ObjectId('5c8e535040584c4cfa7c3a6b'),
            'data': [
              {
                '_id': ObjectId('5c8e535040584c4cfa7c3a72'),
                'label': 'Rating 0',
                'total': 0
              },
              {
                '_id': ObjectId('5c8e535040584c4cfa7c3a71'),
                'label': 'Rating 1',
                'total': 2
              },
              {
                '_id': ObjectId('5c8e535040584c4cfa7c3a70'),
                'label': 'Rating 2',
                'total': 2
              },
              {
                '_id': ObjectId('5c8e535040584c4cfa7c3a6f'),
                'label': 'Rating 3',
                'total': 4
              },
              {
                '_id': ObjectId('5c8e535040584c4cfa7c3a6e'),
                'label': 'Rating 4',
                'total': 2
              },
              {
                '_id': ObjectId('5c8e535040584c4cfa7c3a6d'),
                'label': 'Rating 5',
                'total': 0
              },
              {
                '_id': ObjectId('5c8e535040584c4cfa7c3a6c'),
                'label': 'Neutral',
                'total': 0
              }
            ],
            'metric': 'Amount of votes'
          }
        ],
        'lastUpdate': '2019-03-17T14:01:52.808Z',
        'creationDate': '2019-03-17T14:01:52.808Z'
      },
      {
        '_id': ObjectId('5c8e535040584c4cfa7c3a62'),
        'question': ObjectId('5c8e47993ad86943f22d6aa4'),
        'type': 'FAVORITE',
        'value': 'Was ist ihr Lieblingsobst?',
        'evaluations': [
          {
            '_id': ObjectId('5c8e535040584c4cfa7c3a63'),
            'data': [
              {
                '_id': ObjectId('5c8e535040584c4cfa7c3a69'),
                'label': 'Kirschen',
                'total': 1
              },
              {
                '_id': ObjectId('5c8e535040584c4cfa7c3a68'),
                'label': 'Bananen',
                'total': 2
              },
              {
                '_id': ObjectId('5c8e535040584c4cfa7c3a67'),
                'label': 'Äpfel',
                'total': 2
              },
              {
                '_id': ObjectId('5c8e535040584c4cfa7c3a66'),
                'label': 'Birnen',
                'total': 3
              },
              {
                '_id': ObjectId('5c8e535040584c4cfa7c3a65'),
                'label': 'Erdbeeren',
                'total': 2
              },
              {
                '_id': ObjectId('5c8e535040584c4cfa7c3a64'),
                'label': 'Neutral',
                'total': 0
              }
            ],
            'metric': 'Amount of votes'
          }
        ],
        'lastUpdate': '2019-03-17T14:01:52.808Z',
        'creationDate': '2019-03-17T14:01:52.808Z'
      },
      {
        '_id': ObjectId('5c8e535040584c4cfa7c3a44'),
        'question': ObjectId('5c8e479d3ad86943f22d6aa7'),
        'type': 'RANKING',
        'value': 'Welches Obst essen Sie am häufigsten?',
        'evaluations': [
          {
            '_id': ObjectId('5c8e535040584c4cfa7c3a5d'),
            'data': [
              {
                '_id': ObjectId('5c8e535040584c4cfa7c3a61'),
                'label': 'Äpfel',
                'total': 4.33
              },
              {
                '_id': ObjectId('5c8e535040584c4cfa7c3a60'),
                'label': 'Bananen',
                'total': 6.67
              },
              {
                '_id': ObjectId('5c8e535040584c4cfa7c3a5f'),
                'label': 'Heidelbeeren',
                'total': 7.33
              },
              {
                '_id': ObjectId('5c8e535040584c4cfa7c3a5e'),
                'label': 'Erdbeeren',
                'total': 8.33
              }
            ],
            'metric': 'Average item-scores (higher = better average placements)'
          },
          {
            '_id': ObjectId('5c8e535040584c4cfa7c3a57'),
            'data': [
              {
                '_id': ObjectId('5c8e535040584c4cfa7c3a5c'),
                'label': 'Äpfel',
                'total': 0
              },
              {
                '_id': ObjectId('5c8e535040584c4cfa7c3a5b'),
                'label': 'Bananen',
                'total': 2
              },
              {
                '_id': ObjectId('5c8e535040584c4cfa7c3a5a'),
                'label': 'Heidelbeeren',
                'total': 3
              },
              {
                '_id': ObjectId('5c8e535040584c4cfa7c3a59'),
                'label': 'Erdbeeren',
                'total': 3
              },
              {
                '_id': ObjectId('5c8e535040584c4cfa7c3a58'),
                'label': 'Neutral',
                'total': 2
              }
            ],
            'metric': 'Amount of votes for place 1'
          },
          {
            '_id': ObjectId('5c8e535040584c4cfa7c3a51'),
            'data': [
              {
                '_id': ObjectId('5c8e535040584c4cfa7c3a56'),
                'label': 'Äpfel',
                'total': 1
              },
              {
                '_id': ObjectId('5c8e535040584c4cfa7c3a55'),
                'label': 'Bananen',
                'total': 2
              },
              {
                '_id': ObjectId('5c8e535040584c4cfa7c3a54'),
                'label': 'Heidelbeeren',
                'total': 2
              },
              {
                '_id': ObjectId('5c8e535040584c4cfa7c3a53'),
                'label': 'Erdbeeren',
                'total': 3
              },
              {
                '_id': ObjectId('5c8e535040584c4cfa7c3a52'),
                'label': 'Neutral',
                'total': 2
              }
            ],
            'metric': 'Amount of votes for place 2'
          },
          {
            '_id': ObjectId('5c8e535040584c4cfa7c3a4b'),
            'data': [
              {
                '_id': ObjectId('5c8e535040584c4cfa7c3a50'),
                'label': 'Äpfel',
                'total': 3
              },
              {
                '_id': ObjectId('5c8e535040584c4cfa7c3a4f'),
                'label': 'Bananen',
                'total': 2
              },
              {
                '_id': ObjectId('5c8e535040584c4cfa7c3a4e'),
                'label': 'Heidelbeeren',
                'total': 1
              },
              {
                '_id': ObjectId('5c8e535040584c4cfa7c3a4d'),
                'label': 'Erdbeeren',
                'total': 2
              },
              {
                '_id': ObjectId('5c8e535040584c4cfa7c3a4c'),
                'label': 'Neutral',
                'total': 2
              }
            ],
            'metric': 'Amount of votes for place 3'
          },
          {
            '_id': ObjectId('5c8e535040584c4cfa7c3a45'),
            'data': [
              {
                '_id': ObjectId('5c8e535040584c4cfa7c3a4a'),
                'label': 'Äpfel',
                'total': 4
              },
              {
                '_id': ObjectId('5c8e535040584c4cfa7c3a49'),
                'label': 'Bananen',
                'total': 2
              },
              {
                '_id': ObjectId('5c8e535040584c4cfa7c3a48'),
                'label': 'Heidelbeeren',
                'total': 2
              },
              {
                '_id': ObjectId('5c8e535040584c4cfa7c3a47'),
                'label': 'Erdbeeren',
                'total': 0
              },
              {
                '_id': ObjectId('5c8e535040584c4cfa7c3a46'),
                'label': 'Neutral',
                'total': 2
              }
            ],
            'metric': 'Amount of votes for place 4'
          }
        ],
        'lastUpdate': '2019-03-17T14:01:52.808Z',
        'creationDate': '2019-03-17T14:01:52.808Z'
      }
    ]
  },
  {
    '_id': ObjectId('3bffa9a8651390118574dbe9'),
    'versionNumber': 4,
    'survey': ObjectId('5c8e478a3ad86943f22d6a92'),
    'from': '2019-03-17T20:01:50.445Z',
    'updatedAt': '2019-03-17T14:01:52.980Z',
    'summaries': [
      {
        '_id': ObjectId('5c8e535040584c4cfa7c3b3c'),
        'question': ObjectId('5c8e478c3ad86943f22d6a98'),
        'type': 'LIKE',
        'value': 'Wie gefallen Ihnen diese Kirschen?',
        'evaluations': [
          {
            '_id': ObjectId('5c8e535040584c4cfa7c3b3d'),
            'metric': 'Amount of votes',
            'data': [
              {
                '_id': ObjectId('5c8e535040584c4cfa7c3b3f'),
                'label': 'Liked',
                'total': 7
              },
              {
                '_id': ObjectId('5c8e535040584c4cfa7c3b3e'),
                'label': 'Neutral',
                'total': 3
              }
            ]
          }
        ],
        'lastUpdate': '2019-03-17T14:01:52.980Z',
        'creationDate': '2019-03-17T14:01:52.980Z'
      },
      {
        '_id': ObjectId('5c8e535040584c4cfa7c3b37'),
        'question': ObjectId('5c8e478f3ad86943f22d6a9b'),
        'type': 'LIKEDISLIKE',
        'value': 'Essen Sie gerne Obst?',
        'evaluations': [
          {
            '_id': ObjectId('5c8e535040584c4cfa7c3b38'),
            'metric': 'Amount of votes',
            'data': [
              {
                '_id': ObjectId('5c8e535040584c4cfa7c3b3b'),
                'label': 'Liked',
                'total': 8
              },
              {
                '_id': ObjectId('5c8e535040584c4cfa7c3b3a'),
                'label': 'Disliked',
                'total': 1
              },
              {
                '_id': ObjectId('5c8e535040584c4cfa7c3b39'),
                'label': 'Neutral',
                'total': 1
              }
            ]
          }
        ],
        'lastUpdate': '2019-03-17T14:01:52.980Z',
        'creationDate': '2019-03-17T14:01:52.980Z'
      },
      {
        '_id': ObjectId('5c8e535040584c4cfa7c3b30'),
        'question': ObjectId('5c8e47913ad86943f22d6a9e'),
        'type': 'CHOICE',
        'value': 'Wie viel geben Sie für Obst in der Woche aus?',
        'evaluations': [
          {
            '_id': ObjectId('5c8e535040584c4cfa7c3b31'),
            'data': [
              {
                '_id': ObjectId('5c8e535040584c4cfa7c3b36'),
                'label': 'A',
                'total': 1
              },
              {
                '_id': ObjectId('5c8e535040584c4cfa7c3b35'),
                'label': 'B',
                'total': 4
              },
              {
                '_id': ObjectId('5c8e535040584c4cfa7c3b34'),
                'label': 'C',
                'total': 2
              },
              {
                '_id': ObjectId('5c8e535040584c4cfa7c3b33'),
                'label': 'G',
                'total': 3
              },
              {
                '_id': ObjectId('5c8e535040584c4cfa7c3b32'),
                'label': 'Neutral',
                'total': 0
              }
            ],
            'metric': 'Amount of votes'
          }
        ],
        'lastUpdate': '2019-03-17T14:01:52.980Z',
        'creationDate': '2019-03-17T14:01:52.980Z'
      },
      {
        '_id': ObjectId('5c8e535040584c4cfa7c3b27'),
        'question': ObjectId('5c8e47943ad86943f22d6aa1'),
        'type': 'REGULATOR',
        'value': 'Wie viel Obst essen Sie am Tag?',
        'evaluations': [
          {
            '_id': ObjectId('5c8e535040584c4cfa7c3b28'),
            'data': [
              {
                '_id': ObjectId('5c8e535040584c4cfa7c3b2f'),
                'label': 'Rating 0',
                'total': 1
              },
              {
                '_id': ObjectId('5c8e535040584c4cfa7c3b2e'),
                'label': 'Rating 1',
                'total': 2
              },
              {
                '_id': ObjectId('5c8e535040584c4cfa7c3b2d'),
                'label': 'Rating 2',
                'total': 2
              },
              {
                '_id': ObjectId('5c8e535040584c4cfa7c3b2c'),
                'label': 'Rating 3',
                'total': 0
              },
              {
                '_id': ObjectId('5c8e535040584c4cfa7c3b2b'),
                'label': 'Rating 4',
                'total': 1
              },
              {
                '_id': ObjectId('5c8e535040584c4cfa7c3b2a'),
                'label': 'Rating 5',
                'total': 2
              },
              {
                '_id': ObjectId('5c8e535040584c4cfa7c3b29'),
                'label': 'Neutral',
                'total': 2
              }
            ],
            'metric': 'Amount of votes'
          }
        ],
        'lastUpdate': '2019-03-17T14:01:52.980Z',
        'creationDate': '2019-03-17T14:01:52.980Z'
      },
      {
        '_id': ObjectId('5c8e535040584c4cfa7c3b1f'),
        'question': ObjectId('5c8e47993ad86943f22d6aa4'),
        'type': 'FAVORITE',
        'value': 'Was ist ihr Lieblingsobst?',
        'evaluations': [
          {
            '_id': ObjectId('5c8e535040584c4cfa7c3b20'),
            'data': [
              {
                '_id': ObjectId('5c8e535040584c4cfa7c3b26'),
                'label': 'Kirschen',
                'total': 1
              },
              {
                '_id': ObjectId('5c8e535040584c4cfa7c3b25'),
                'label': 'Bananen',
                'total': 1
              },
              {
                '_id': ObjectId('5c8e535040584c4cfa7c3b24'),
                'label': 'Äpfel',
                'total': 1
              },
              {
                '_id': ObjectId('5c8e535040584c4cfa7c3b23'),
                'label': 'Birnen',
                'total': 2
              },
              {
                '_id': ObjectId('5c8e535040584c4cfa7c3b22'),
                'label': 'Erdbeeren',
                'total': 5
              },
              {
                '_id': ObjectId('5c8e535040584c4cfa7c3b21'),
                'label': 'Neutral',
                'total': 0
              }
            ],
            'metric': 'Amount of votes'
          }
        ],
        'lastUpdate': '2019-03-17T14:01:52.980Z',
        'creationDate': '2019-03-17T14:01:52.980Z'
      },
      {
        '_id': ObjectId('5c8e535040584c4cfa7c3b01'),
        'question': ObjectId('5c8e479d3ad86943f22d6aa7'),
        'type': 'RANKING',
        'value': 'Welches Obst essen Sie am häufigsten?',
        'evaluations': [
          {
            '_id': ObjectId('5c8e535040584c4cfa7c3b1a'),
            'data': [
              {
                '_id': ObjectId('5c8e535040584c4cfa7c3b1e'),
                'label': 'Äpfel',
                'total': 7
              },
              {
                '_id': ObjectId('5c8e535040584c4cfa7c3b1d'),
                'label': 'Bananen',
                'total': 3.67
              },
              {
                '_id': ObjectId('5c8e535040584c4cfa7c3b1c'),
                'label': 'Heidelbeeren',
                'total': 5.33
              },
              {
                '_id': ObjectId('5c8e535040584c4cfa7c3b1b'),
                'label': 'Erdbeeren',
                'total': 4
              }
            ],
            'metric': 'Average item-scores (higher = better average placements)'
          },
          {
            '_id': ObjectId('5c8e535040584c4cfa7c3b14'),
            'data': [
              {
                '_id': ObjectId('5c8e535040584c4cfa7c3b19'),
                'label': 'Äpfel',
                'total': 4
              },
              {
                '_id': ObjectId('5c8e535040584c4cfa7c3b18'),
                'label': 'Bananen',
                'total': 2
              },
              {
                '_id': ObjectId('5c8e535040584c4cfa7c3b17'),
                'label': 'Heidelbeeren',
                'total': 3
              },
              {
                '_id': ObjectId('5c8e535040584c4cfa7c3b16'),
                'label': 'Erdbeeren',
                'total': 1
              },
              {
                '_id': ObjectId('5c8e535040584c4cfa7c3b15'),
                'label': 'Neutral',
                'total': 0
              }
            ],
            'metric': 'Amount of votes for place 1'
          },
          {
            '_id': ObjectId('5c8e535040584c4cfa7c3b0e'),
            'data': [
              {
                '_id': ObjectId('5c8e535040584c4cfa7c3b13'),
                'label': 'Äpfel',
                'total': 4
              },
              {
                '_id': ObjectId('5c8e535040584c4cfa7c3b12'),
                'label': 'Bananen',
                'total': 1
              },
              {
                '_id': ObjectId('5c8e535040584c4cfa7c3b11'),
                'label': 'Heidelbeeren',
                'total': 2
              },
              {
                '_id': ObjectId('5c8e535040584c4cfa7c3b10'),
                'label': 'Erdbeeren',
                'total': 3
              },
              {
                '_id': ObjectId('5c8e535040584c4cfa7c3b0f'),
                'label': 'Neutral',
                'total': 0
              }
            ],
            'metric': 'Amount of votes for place 2'
          },
          {
            '_id': ObjectId('5c8e535040584c4cfa7c3b08'),
            'data': [
              {
                '_id': ObjectId('5c8e535040584c4cfa7c3b0d'),
                'label': 'Äpfel',
                'total': 1
              },
              {
                '_id': ObjectId('5c8e535040584c4cfa7c3b0c'),
                'label': 'Bananen',
                'total': 3
              },
              {
                '_id': ObjectId('5c8e535040584c4cfa7c3b0b'),
                'label': 'Heidelbeeren',
                'total': 3
              },
              {
                '_id': ObjectId('5c8e535040584c4cfa7c3b0a'),
                'label': 'Erdbeeren',
                'total': 3
              },
              {
                '_id': ObjectId('5c8e535040584c4cfa7c3b09'),
                'label': 'Neutral',
                'total': 0
              }
            ],
            'metric': 'Amount of votes for place 3'
          },
          {
            '_id': ObjectId('5c8e535040584c4cfa7c3b02'),
            'data': [
              {
                '_id': ObjectId('5c8e535040584c4cfa7c3b07'),
                'label': 'Äpfel',
                'total': 1
              },
              {
                '_id': ObjectId('5c8e535040584c4cfa7c3b06'),
                'label': 'Bananen',
                'total': 4
              },
              {
                '_id': ObjectId('5c8e535040584c4cfa7c3b05'),
                'label': 'Heidelbeeren',
                'total': 2
              },
              {
                '_id': ObjectId('5c8e535040584c4cfa7c3b04'),
                'label': 'Erdbeeren',
                'total': 3
              },
              {
                '_id': ObjectId('5c8e535040584c4cfa7c3b03'),
                'label': 'Neutral',
                'total': 0
              }
            ],
            'metric': 'Amount of votes for place 4'
          }
        ],
        'lastUpdate': '2019-03-17T14:01:52.980Z',
        'creationDate': '2019-03-17T14:01:52.980Z'
      }
    ]
  }
]

module.exports = versionEntries