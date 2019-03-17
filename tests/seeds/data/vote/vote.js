const { ObjectId } = require('mongodb')

const votes = [
  {
    '_id': ObjectId('b276ec13b5d0226b931accfc'),
    'domain': ObjectId('5c8e470c3ad86943f22d6a14'),
    'client': ObjectId('5c8e471b3ad86943f22d6a1b'),
    'version': ObjectId('a8399ebb0bc1f371786801c9'),
    'survey': ObjectId('5c8e45d13ad86943f22d6983'),
    'answers': [
      {
        'creationDate': '2019-03-17T15:37:50.566Z',
        'question': ObjectId('5c8e45d33ad86943f22d6989'),
        'type': 'LIKE',
        'liked': true
      },
      {
        'creationDate': '2019-03-17T15:47:40.740Z',
        'question': ObjectId('5c8e45e33ad86943f22d698d'),
        'type': 'LIKEDISLIKE',
        'liked': true
      },
      {
        'creationDate': '2019-03-17T15:26:41.503Z',
        'question': ObjectId('5c8e45f93ad86943f22d6997'),
        'type': 'CHOICE',
        'choice': ObjectId('5c8e460f3ad86943f22d69a7')
      },
      {
        'creationDate': '2019-03-17T15:36:47.724Z',
        'question': ObjectId('5c8e46163ad86943f22d69ad'),
        'type': 'REGULATOR',
        'rating': 9,
        'normalized': 0.888888888888889
      },
      {
        'creationDate': '2019-03-17T15:37:58.130Z',
        'question': ObjectId('5c8e46563ad86943f22d69c7'),
        'type': 'FAVORITE',
        'favoriteItem': ObjectId('5c8e46893ad86943f22d69ce')
      },
      {
        'creationDate': '2019-03-17T15:29:35.739Z',
        'id': 0,
        'question': ObjectId('5c8e46b03ad86943f22d69e0'),
        'type': 'RANKING',
        'rankedItems': [
          '5c8e46c63ad86943f22d69ea',
          '5c8e46c13ad86943f22d69e7',
          '5c8e46d23ad86943f22d69f0',
          '5c8e46bb3ad86943f22d69e4',
          '5c8e46cc3ad86943f22d69ed'
        ]
      }
    ],
    'creationDate': '2019-03-17T15:51:32.203Z',
    'lastUpdate': '2019-03-17T15:51:32.203Z'
  },
  {
    '_id': ObjectId('d7ae9bcf5f61bac110bebbcc'),
    'domain': ObjectId('5c8e470c3ad86943f22d6a14'),
    'client': ObjectId('5c8e47153ad86943f22d6a19'),
    'version': ObjectId('a8399ebb0bc1f371786801c9'),
    'survey': ObjectId('5c8e45d13ad86943f22d6983'),
    'answers': [
      {
        'creationDate': '2019-03-17T14:22:31.866Z',
        'question': ObjectId('5c8e45d33ad86943f22d6989'),
        'type': 'LIKE',
        'liked': true
      },
      {
        'creationDate': '2019-03-17T14:29:43.880Z',
        'question': ObjectId('5c8e45e33ad86943f22d698d'),
        'type': 'LIKEDISLIKE',
        'liked': false
      },
      {
        'creationDate': '2019-03-17T14:18:38.800Z',
        'question': ObjectId('5c8e45f93ad86943f22d6997'),
        'type': 'CHOICE',
        'choice': ObjectId('5c8e460a3ad86943f22d699e')
      },
      {
        'creationDate': '2019-03-17T14:41:39.672Z',
        'question': ObjectId('5c8e46163ad86943f22d69ad'),
        'type': 'REGULATOR',
        'rating': 5,
        'normalized': 0.444444444444444
      },
      {
        'creationDate': '2019-03-17T14:43:11.588Z',
        'question': ObjectId('5c8e46563ad86943f22d69c7'),
        'type': 'FAVORITE',
        'favoriteItem': ObjectId('5c8e468f3ad86943f22d69d1')
      },
      {
        'creationDate': '2019-03-17T14:41:54.597Z',
        'id': 1,
        'question': ObjectId('5c8e46b03ad86943f22d69e0'),
        'type': 'RANKING',
        'rankedItems': [
          '5c8e46c63ad86943f22d69ea',
          '5c8e46c13ad86943f22d69e7',
          '5c8e46d23ad86943f22d69f0',
          '5c8e46cc3ad86943f22d69ed',
          '5c8e46bb3ad86943f22d69e4'
        ]
      }
    ],
    'creationDate': '2019-03-17T14:45:19.502Z',
    'lastUpdate': '2019-03-17T14:45:19.502Z'
  },
  {
    '_id': ObjectId('ff774ad07fbb49bc981ad484'),
    'domain': ObjectId('5c8e470c3ad86943f22d6a14'),
    'client': ObjectId('5c8e47153ad86943f22d6a19'),
    'version': ObjectId('a8399ebb0bc1f371786801c9'),
    'survey': ObjectId('5c8e45d13ad86943f22d6983'),
    'answers': [
      {
        'creationDate': '2019-03-17T15:37:13.923Z',
        'question': ObjectId('5c8e45d33ad86943f22d6989'),
        'type': 'LIKE',
        'liked': true
      },
      {
        'creationDate': '2019-03-17T15:32:46.099Z',
        'question': ObjectId('5c8e45e33ad86943f22d698d'),
        'type': 'LIKEDISLIKE',
        'liked': true
      },
      {
        'creationDate': '2019-03-17T15:21:13.058Z',
        'question': ObjectId('5c8e45f93ad86943f22d6997'),
        'type': 'CHOICE',
        'choice': ObjectId('5c8e46113ad86943f22d69aa')
      },
      {
        'creationDate': '2019-03-17T15:40:48.358Z',
        'question': ObjectId('5c8e46163ad86943f22d69ad'),
        'type': 'REGULATOR',
        'rating': 10,
        'normalized': 1
      },
      {
        'creationDate': '2019-03-17T15:16:19.055Z',
        'question': ObjectId('5c8e46563ad86943f22d69c7'),
        'type': 'FAVORITE',
        'favoriteItem': ObjectId('5c8e469b3ad86943f22d69d7')
      },
      {
        'creationDate': '2019-03-17T15:13:38.047Z',
        'id': 2,
        'question': ObjectId('5c8e46b03ad86943f22d69e0'),
        'type': 'RANKING',
        'rankedItems': [
          '5c8e46d23ad86943f22d69f0',
          '5c8e46c63ad86943f22d69ea',
          '5c8e46cc3ad86943f22d69ed',
          '5c8e46c13ad86943f22d69e7',
          '5c8e46bb3ad86943f22d69e4'
        ]
      }
    ],
    'creationDate': '2019-03-17T15:41:16.645Z',
    'lastUpdate': '2019-03-17T15:41:16.645Z'
  },
  {
    '_id': ObjectId('600a5f27bc111e59bb35bc44'),
    'domain': ObjectId('5c8e470c3ad86943f22d6a14'),
    'client': ObjectId('5c8e47153ad86943f22d6a19'),
    'version': ObjectId('a8399ebb0bc1f371786801c9'),
    'survey': ObjectId('5c8e45d13ad86943f22d6983'),
    'answers': [
      {
        'creationDate': '2019-03-17T15:34:41.404Z',
        'question': ObjectId('5c8e45d33ad86943f22d6989'),
        'type': 'LIKE',
        'liked': false
      },
      {
        'creationDate': '2019-03-17T15:34:35.102Z',
        'question': ObjectId('5c8e45e33ad86943f22d698d'),
        'type': 'LIKEDISLIKE',
        'liked': true
      },
      {
        'creationDate': '2019-03-17T15:16:23.199Z',
        'question': ObjectId('5c8e45f93ad86943f22d6997'),
        'type': 'CHOICE',
        'choice': ObjectId('5c8e460a3ad86943f22d699e')
      },
      {
        'creationDate': '2019-03-17T15:14:59.659Z',
        'question': ObjectId('5c8e46163ad86943f22d69ad'),
        'type': 'REGULATOR',
        'rating': 1,
        'normalized': 0
      },
      {
        'creationDate': '2019-03-17T15:37:39.333Z',
        'question': ObjectId('5c8e46563ad86943f22d69c7'),
        'type': 'FAVORITE',
        'favoriteItem': ObjectId('5c8e46953ad86943f22d69d4')
      },
      {
        'creationDate': '2019-03-17T15:33:24.802Z',
        'id': 3,
        'question': ObjectId('5c8e46b03ad86943f22d69e0'),
        'type': 'RANKING',
        'rankedItems': null
      }
    ],
    'creationDate': '2019-03-17T15:42:50.111Z',
    'lastUpdate': '2019-03-17T15:42:50.111Z'
  },
  {
    '_id': ObjectId('e12be8ec3647590686adc952'),
    'domain': ObjectId('5c8e470c3ad86943f22d6a14'),
    'client': ObjectId('5c8e471b3ad86943f22d6a1b'),
    'version': ObjectId('a8399ebb0bc1f371786801c9'),
    'survey': ObjectId('5c8e45d13ad86943f22d6983'),
    'answers': [
      {
        'creationDate': '2019-03-17T15:23:32.918Z',
        'question': ObjectId('5c8e45d33ad86943f22d6989'),
        'type': 'LIKE',
        'liked': true
      },
      {
        'creationDate': '2019-03-17T15:32:01.733Z',
        'question': ObjectId('5c8e45e33ad86943f22d698d'),
        'type': 'LIKEDISLIKE',
        'liked': true
      },
      {
        'creationDate': '2019-03-17T15:34:00.257Z',
        'question': ObjectId('5c8e45f93ad86943f22d6997'),
        'type': 'CHOICE',
        'choice': ObjectId('5c8e460e3ad86943f22d69a4')
      },
      {
        'creationDate': '2019-03-17T15:31:35.390Z',
        'question': ObjectId('5c8e46163ad86943f22d69ad'),
        'type': 'REGULATOR',
        'rating': 2,
        'normalized': 0.111111111111111
      },
      {
        'creationDate': '2019-03-17T15:45:02.501Z',
        'question': ObjectId('5c8e46563ad86943f22d69c7'),
        'type': 'FAVORITE',
        'favoriteItem': null
      },
      {
        'creationDate': '2019-03-17T15:39:12.964Z',
        'id': 4,
        'question': ObjectId('5c8e46b03ad86943f22d69e0'),
        'type': 'RANKING',
        'rankedItems': [
          '5c8e46cc3ad86943f22d69ed',
          '5c8e46c13ad86943f22d69e7',
          '5c8e46c63ad86943f22d69ea',
          '5c8e46bb3ad86943f22d69e4',
          '5c8e46d23ad86943f22d69f0'
        ]
      }
    ],
    'creationDate': '2019-03-17T15:45:26.831Z',
    'lastUpdate': '2019-03-17T15:45:26.831Z'
  },
  {
    '_id': ObjectId('53a2ba3a943190494cdf4730'),
    'domain': ObjectId('5c8e470c3ad86943f22d6a14'),
    'client': ObjectId('5c8e47153ad86943f22d6a19'),
    'version': ObjectId('fc918e472251e2c600ea699f'),
    'survey': ObjectId('5c8e45d13ad86943f22d6983'),
    'answers': [
      {
        'creationDate': '2019-03-17T17:12:56.843Z',
        'question': ObjectId('5c8e45d33ad86943f22d6989'),
        'type': 'LIKE',
        'liked': false
      },
      {
        'creationDate': '2019-03-17T17:18:58.703Z',
        'question': ObjectId('5c8e45e33ad86943f22d698d'),
        'type': 'LIKEDISLIKE',
        'liked': true
      },
      {
        'creationDate': '2019-03-17T16:56:18.356Z',
        'question': ObjectId('5c8e45f93ad86943f22d6997'),
        'type': 'CHOICE',
        'choice': ObjectId('5c8e460c3ad86943f22d69a1')
      },
      {
        'creationDate': '2019-03-17T17:01:53.106Z',
        'question': ObjectId('5c8e46163ad86943f22d69ad'),
        'type': 'REGULATOR',
        'rating': 9,
        'normalized': 0.888888888888889
      },
      {
        'creationDate': '2019-03-17T17:14:14.327Z',
        'question': ObjectId('5c8e46563ad86943f22d69c7'),
        'type': 'FAVORITE',
        'favoriteItem': ObjectId('5c8e46953ad86943f22d69d4')
      },
      {
        'creationDate': '2019-03-17T16:57:58.429Z',
        'id': 0,
        'question': ObjectId('5c8e46b03ad86943f22d69e0'),
        'type': 'RANKING',
        'rankedItems': [
          '5c8e46c13ad86943f22d69e7',
          '5c8e46cc3ad86943f22d69ed',
          '5c8e46d23ad86943f22d69f0',
          '5c8e46bb3ad86943f22d69e4',
          '5c8e46c63ad86943f22d69ea'
        ]
      }
    ],
    'creationDate': '2019-03-17T17:23:28.435Z',
    'lastUpdate': '2019-03-17T17:23:28.435Z'
  },
  {
    '_id': ObjectId('a690eac4f1447d3dce1b36d1'),
    'domain': ObjectId('5c8e470c3ad86943f22d6a14'),
    'client': ObjectId('5c8e47153ad86943f22d6a19'),
    'version': ObjectId('fc918e472251e2c600ea699f'),
    'survey': ObjectId('5c8e45d13ad86943f22d6983'),
    'answers': [
      {
        'creationDate': '2019-03-17T17:40:40.899Z',
        'question': ObjectId('5c8e45d33ad86943f22d6989'),
        'type': 'LIKE',
        'liked': false
      },
      {
        'creationDate': '2019-03-17T17:34:12.511Z',
        'question': ObjectId('5c8e45e33ad86943f22d698d'),
        'type': 'LIKEDISLIKE',
        'liked': true
      },
      {
        'creationDate': '2019-03-17T17:40:45.253Z',
        'question': ObjectId('5c8e45f93ad86943f22d6997'),
        'type': 'CHOICE',
        'choice': ObjectId('5c8e460c3ad86943f22d69a1')
      },
      {
        'creationDate': '2019-03-17T17:45:53.494Z',
        'question': ObjectId('5c8e46163ad86943f22d69ad'),
        'type': 'REGULATOR',
        'rating': 6,
        'normalized': 0.555555555555556
      },
      {
        'creationDate': '2019-03-17T17:53:57.995Z',
        'question': ObjectId('5c8e46563ad86943f22d69c7'),
        'type': 'FAVORITE',
        'favoriteItem': ObjectId('5c8e46893ad86943f22d69ce')
      },
      {
        'creationDate': '2019-03-17T17:36:16.348Z',
        'id': 1,
        'question': ObjectId('5c8e46b03ad86943f22d69e0'),
        'type': 'RANKING',
        'rankedItems': null
      }
    ],
    'creationDate': '2019-03-17T17:59:15.055Z',
    'lastUpdate': '2019-03-17T17:59:15.055Z'
  },
  {
    '_id': ObjectId('bff57c8ac5506b072bc8089f'),
    'domain': ObjectId('5c8e470c3ad86943f22d6a14'),
    'client': ObjectId('5c8e47153ad86943f22d6a19'),
    'version': ObjectId('fc918e472251e2c600ea699f'),
    'survey': ObjectId('5c8e45d13ad86943f22d6983'),
    'answers': [
      {
        'creationDate': '2019-03-17T15:46:43.552Z',
        'question': ObjectId('5c8e45d33ad86943f22d6989'),
        'type': 'LIKE',
        'liked': true
      },
      {
        'creationDate': '2019-03-17T16:09:42.947Z',
        'question': ObjectId('5c8e45e33ad86943f22d698d'),
        'type': 'LIKEDISLIKE',
        'liked': true
      },
      {
        'creationDate': '2019-03-17T15:45:20.817Z',
        'question': ObjectId('5c8e45f93ad86943f22d6997'),
        'type': 'CHOICE',
        'choice': ObjectId('5c8e460a3ad86943f22d699e')
      },
      {
        'creationDate': '2019-03-17T15:58:35.627Z',
        'question': ObjectId('5c8e46163ad86943f22d69ad'),
        'type': 'REGULATOR',
        'rating': null,
        'normalized': null
      },
      {
        'creationDate': '2019-03-17T16:02:49.623Z',
        'question': ObjectId('5c8e46563ad86943f22d69c7'),
        'type': 'FAVORITE',
        'favoriteItem': null
      },
      {
        'creationDate': '2019-03-17T15:52:18.206Z',
        'id': 2,
        'question': ObjectId('5c8e46b03ad86943f22d69e0'),
        'type': 'RANKING',
        'rankedItems': null
      }
    ],
    'creationDate': '2019-03-17T16:11:16.783Z',
    'lastUpdate': '2019-03-17T16:11:16.783Z'
  },
  {
    '_id': ObjectId('70b4484d424486e7db04bf89'),
    'domain': ObjectId('5c8e470c3ad86943f22d6a14'),
    'client': ObjectId('5c8e471b3ad86943f22d6a1b'),
    'version': ObjectId('fc918e472251e2c600ea699f'),
    'survey': ObjectId('5c8e45d13ad86943f22d6983'),
    'answers': [
      {
        'creationDate': '2019-03-17T17:25:05.084Z',
        'question': ObjectId('5c8e45d33ad86943f22d6989'),
        'type': 'LIKE',
        'liked': null
      },
      {
        'creationDate': '2019-03-17T17:14:29.103Z',
        'question': ObjectId('5c8e45e33ad86943f22d698d'),
        'type': 'LIKEDISLIKE',
        'liked': true
      },
      {
        'creationDate': '2019-03-17T17:13:04.659Z',
        'question': ObjectId('5c8e45f93ad86943f22d6997'),
        'type': 'CHOICE',
        'choice': ObjectId('5c8e460a3ad86943f22d699e')
      },
      {
        'creationDate': '2019-03-17T17:08:36.139Z',
        'question': ObjectId('5c8e46163ad86943f22d69ad'),
        'type': 'REGULATOR',
        'rating': 1,
        'normalized': 0
      },
      {
        'creationDate': '2019-03-17T17:28:34.866Z',
        'question': ObjectId('5c8e46563ad86943f22d69c7'),
        'type': 'FAVORITE',
        'favoriteItem': ObjectId('5c8e46833ad86943f22d69cb')
      },
      {
        'creationDate': '2019-03-17T17:21:07.672Z',
        'id': 3,
        'question': ObjectId('5c8e46b03ad86943f22d69e0'),
        'type': 'RANKING',
        'rankedItems': [
          '5c8e46bb3ad86943f22d69e4',
          '5c8e46cc3ad86943f22d69ed',
          '5c8e46c63ad86943f22d69ea',
          '5c8e46c13ad86943f22d69e7',
          '5c8e46d23ad86943f22d69f0'
        ]
      }
    ],
    'creationDate': '2019-03-17T17:29:02.196Z',
    'lastUpdate': '2019-03-17T17:29:02.196Z'
  },
  {
    '_id': ObjectId('6a96c2b45e2023cec295a99d'),
    'domain': ObjectId('5c8e470c3ad86943f22d6a14'),
    'client': ObjectId('5c8e471b3ad86943f22d6a1b'),
    'version': ObjectId('fc918e472251e2c600ea699f'),
    'survey': ObjectId('5c8e45d13ad86943f22d6983'),
    'answers': [
      {
        'creationDate': '2019-03-17T16:39:03.925Z',
        'question': ObjectId('5c8e45d33ad86943f22d6989'),
        'type': 'LIKE',
        'liked': true
      },
      {
        'creationDate': '2019-03-17T16:56:39.919Z',
        'question': ObjectId('5c8e45e33ad86943f22d698d'),
        'type': 'LIKEDISLIKE',
        'liked': true
      },
      {
        'creationDate': '2019-03-17T16:54:35.641Z',
        'question': ObjectId('5c8e45f93ad86943f22d6997'),
        'type': 'CHOICE',
        'choice': ObjectId('5c8e460f3ad86943f22d69a7')
      },
      {
        'creationDate': '2019-03-17T16:37:11.671Z',
        'question': ObjectId('5c8e46163ad86943f22d69ad'),
        'type': 'REGULATOR',
        'rating': 8,
        'normalized': 0.777777777777778
      },
      {
        'creationDate': '2019-03-17T16:50:38.827Z',
        'question': ObjectId('5c8e46563ad86943f22d69c7'),
        'type': 'FAVORITE',
        'favoriteItem': ObjectId('5c8e46a93ad86943f22d69dd')
      },
      {
        'creationDate': '2019-03-17T16:31:37.657Z',
        'id': 4,
        'question': ObjectId('5c8e46b03ad86943f22d69e0'),
        'type': 'RANKING',
        'rankedItems': [
          '5c8e46cc3ad86943f22d69ed',
          '5c8e46c63ad86943f22d69ea',
          '5c8e46d23ad86943f22d69f0',
          '5c8e46bb3ad86943f22d69e4',
          '5c8e46c13ad86943f22d69e7'
        ]
      }
    ],
    'creationDate': '2019-03-17T16:59:14.793Z',
    'lastUpdate': '2019-03-17T16:59:14.793Z'
  },
  {
    '_id': ObjectId('05daa3d66cf0f8b78c52591d'),
    'domain': ObjectId('5c8e470c3ad86943f22d6a14'),
    'client': ObjectId('5c8e47153ad86943f22d6a19'),
    'version': ObjectId('9c35b3bcdf51721e8b8ab119'),
    'survey': ObjectId('5c8e45d13ad86943f22d6983'),
    'answers': [
      {
        'creationDate': '2019-03-17T18:36:23.970Z',
        'question': ObjectId('5c8e45d33ad86943f22d6989'),
        'type': 'LIKE',
        'liked': true
      },
      {
        'creationDate': '2019-03-17T18:35:18.363Z',
        'question': ObjectId('5c8e45e33ad86943f22d698d'),
        'type': 'LIKEDISLIKE',
        'liked': null
      },
      {
        'creationDate': '2019-03-17T18:37:25.436Z',
        'question': ObjectId('5c8e45f93ad86943f22d6997'),
        'type': 'CHOICE',
        'choice': ObjectId('5c8e460e3ad86943f22d69a4')
      },
      {
        'creationDate': '2019-03-17T18:25:42.896Z',
        'question': ObjectId('5c8e46163ad86943f22d69ad'),
        'type': 'REGULATOR',
        'rating': 6,
        'normalized': 0.555555555555556
      },
      {
        'creationDate': '2019-03-17T18:36:35.132Z',
        'question': ObjectId('5c8e46563ad86943f22d69c7'),
        'type': 'FAVORITE',
        'favoriteItem': ObjectId('5c8e46893ad86943f22d69ce')
      },
      {
        'creationDate': '2019-03-17T18:46:44.955Z',
        'id': 0,
        'question': ObjectId('5c8e46b03ad86943f22d69e0'),
        'type': 'RANKING',
        'rankedItems': [
          '5c8e46c13ad86943f22d69e7',
          '5c8e46cc3ad86943f22d69ed',
          '5c8e46d23ad86943f22d69f0',
          '5c8e46bb3ad86943f22d69e4',
          '5c8e46c63ad86943f22d69ea'
        ]
      }
    ],
    'creationDate': '2019-03-17T18:54:46.974Z',
    'lastUpdate': '2019-03-17T18:54:46.974Z'
  },
  {
    '_id': ObjectId('877dc1244b8ec9b65c4726d7'),
    'domain': ObjectId('5c8e470c3ad86943f22d6a14'),
    'client': ObjectId('5c8e471b3ad86943f22d6a1b'),
    'version': ObjectId('9c35b3bcdf51721e8b8ab119'),
    'survey': ObjectId('5c8e45d13ad86943f22d6983'),
    'answers': [
      {
        'creationDate': '2019-03-17T19:45:40.952Z',
        'question': ObjectId('5c8e45d33ad86943f22d6989'),
        'type': 'LIKE',
        'liked': null
      },
      {
        'creationDate': '2019-03-17T19:44:59.002Z',
        'question': ObjectId('5c8e45e33ad86943f22d698d'),
        'type': 'LIKEDISLIKE',
        'liked': true
      },
      {
        'creationDate': '2019-03-17T19:35:39.657Z',
        'question': ObjectId('5c8e45f93ad86943f22d6997'),
        'type': 'CHOICE',
        'choice': ObjectId('5c8e460a3ad86943f22d699e')
      },
      {
        'creationDate': '2019-03-17T19:36:07.525Z',
        'question': ObjectId('5c8e46163ad86943f22d69ad'),
        'type': 'REGULATOR',
        'rating': 3,
        'normalized': 0.222222222222222
      },
      {
        'creationDate': '2019-03-17T19:34:48.118Z',
        'question': ObjectId('5c8e46563ad86943f22d69c7'),
        'type': 'FAVORITE',
        'favoriteItem': ObjectId('5c8e46a93ad86943f22d69dd')
      },
      {
        'creationDate': '2019-03-17T19:33:57.007Z',
        'id': 1,
        'question': ObjectId('5c8e46b03ad86943f22d69e0'),
        'type': 'RANKING',
        'rankedItems': [
          '5c8e46c63ad86943f22d69ea',
          '5c8e46c13ad86943f22d69e7',
          '5c8e46bb3ad86943f22d69e4',
          '5c8e46d23ad86943f22d69f0',
          '5c8e46cc3ad86943f22d69ed'
        ]
      }
    ],
    'creationDate': '2019-03-17T19:55:18.519Z',
    'lastUpdate': '2019-03-17T19:55:18.519Z'
  },
  {
    '_id': ObjectId('3d8f539ca7112d904989309c'),
    'domain': ObjectId('5c8e470c3ad86943f22d6a14'),
    'client': ObjectId('5c8e47153ad86943f22d6a19'),
    'version': ObjectId('9c35b3bcdf51721e8b8ab119'),
    'survey': ObjectId('5c8e45d13ad86943f22d6983'),
    'answers': [
      {
        'creationDate': '2019-03-17T18:54:23.361Z',
        'question': ObjectId('5c8e45d33ad86943f22d6989'),
        'type': 'LIKE',
        'liked': true
      },
      {
        'creationDate': '2019-03-17T18:49:31.692Z',
        'question': ObjectId('5c8e45e33ad86943f22d698d'),
        'type': 'LIKEDISLIKE',
        'liked': true
      },
      {
        'creationDate': '2019-03-17T18:45:11.310Z',
        'question': ObjectId('5c8e45f93ad86943f22d6997'),
        'type': 'CHOICE',
        'choice': ObjectId('5c8e46033ad86943f22d699b')
      },
      {
        'creationDate': '2019-03-17T18:48:56.320Z',
        'question': ObjectId('5c8e46163ad86943f22d69ad'),
        'type': 'REGULATOR',
        'rating': 2,
        'normalized': 0.111111111111111
      },
      {
        'creationDate': '2019-03-17T18:43:45.997Z',
        'question': ObjectId('5c8e46563ad86943f22d69c7'),
        'type': 'FAVORITE',
        'favoriteItem': ObjectId('5c8e46833ad86943f22d69cb')
      },
      {
        'creationDate': '2019-03-17T18:46:45.899Z',
        'id': 2,
        'question': ObjectId('5c8e46b03ad86943f22d69e0'),
        'type': 'RANKING',
        'rankedItems': [
          '5c8e46bb3ad86943f22d69e4',
          '5c8e46cc3ad86943f22d69ed',
          '5c8e46c63ad86943f22d69ea',
          '5c8e46c13ad86943f22d69e7',
          '5c8e46d23ad86943f22d69f0'
        ]
      }
    ],
    'creationDate': '2019-03-17T19:11:05.916Z',
    'lastUpdate': '2019-03-17T19:11:05.916Z'
  },
  {
    '_id': ObjectId('db0bfa6b655100429add6066'),
    'domain': ObjectId('5c8e470c3ad86943f22d6a14'),
    'client': ObjectId('5c8e471b3ad86943f22d6a1b'),
    'version': ObjectId('9c35b3bcdf51721e8b8ab119'),
    'survey': ObjectId('5c8e45d13ad86943f22d6983'),
    'answers': [
      {
        'creationDate': '2019-03-17T18:43:22.114Z',
        'question': ObjectId('5c8e45d33ad86943f22d6989'),
        'type': 'LIKE',
        'liked': false
      },
      {
        'creationDate': '2019-03-17T18:34:17.154Z',
        'question': ObjectId('5c8e45e33ad86943f22d698d'),
        'type': 'LIKEDISLIKE',
        'liked': null
      },
      {
        'creationDate': '2019-03-17T18:47:26.334Z',
        'question': ObjectId('5c8e45f93ad86943f22d6997'),
        'type': 'CHOICE',
        'choice': null
      },
      {
        'creationDate': '2019-03-17T18:35:32.257Z',
        'question': ObjectId('5c8e46163ad86943f22d69ad'),
        'type': 'REGULATOR',
        'rating': 10,
        'normalized': 1
      },
      {
        'creationDate': '2019-03-17T18:49:48.100Z',
        'question': ObjectId('5c8e46563ad86943f22d69c7'),
        'type': 'FAVORITE',
        'favoriteItem': ObjectId('5c8e46893ad86943f22d69ce')
      },
      {
        'creationDate': '2019-03-17T18:54:28.455Z',
        'id': 3,
        'question': ObjectId('5c8e46b03ad86943f22d69e0'),
        'type': 'RANKING',
        'rankedItems': [
          '5c8e46c63ad86943f22d69ea',
          '5c8e46d23ad86943f22d69f0',
          '5c8e46cc3ad86943f22d69ed',
          '5c8e46bb3ad86943f22d69e4',
          '5c8e46c13ad86943f22d69e7'
        ]
      }
    ],
    'creationDate': '2019-03-17T18:54:52.158Z',
    'lastUpdate': '2019-03-17T18:54:52.158Z'
  },
  {
    '_id': ObjectId('28c69498b120a08f38bafc48'),
    'domain': ObjectId('5c8e470c3ad86943f22d6a14'),
    'client': ObjectId('5c8e471b3ad86943f22d6a1b'),
    'version': ObjectId('9c35b3bcdf51721e8b8ab119'),
    'survey': ObjectId('5c8e45d13ad86943f22d6983'),
    'answers': [
      {
        'creationDate': '2019-03-17T18:33:56.779Z',
        'question': ObjectId('5c8e45d33ad86943f22d6989'),
        'type': 'LIKE',
        'liked': true
      },
      {
        'creationDate': '2019-03-17T18:29:27.163Z',
        'question': ObjectId('5c8e45e33ad86943f22d698d'),
        'type': 'LIKEDISLIKE',
        'liked': true
      },
      {
        'creationDate': '2019-03-17T18:50:08.983Z',
        'question': ObjectId('5c8e45f93ad86943f22d6997'),
        'type': 'CHOICE',
        'choice': null
      },
      {
        'creationDate': '2019-03-17T18:43:23.160Z',
        'question': ObjectId('5c8e46163ad86943f22d69ad'),
        'type': 'REGULATOR',
        'rating': 3,
        'normalized': 0.222222222222222
      },
      {
        'creationDate': '2019-03-17T18:32:08.538Z',
        'question': ObjectId('5c8e46563ad86943f22d69c7'),
        'type': 'FAVORITE',
        'favoriteItem': ObjectId('5c8e468f3ad86943f22d69d1')
      },
      {
        'creationDate': '2019-03-17T18:39:45.657Z',
        'id': 4,
        'question': ObjectId('5c8e46b03ad86943f22d69e0'),
        'type': 'RANKING',
        'rankedItems': [
          '5c8e46c13ad86943f22d69e7',
          '5c8e46bb3ad86943f22d69e4',
          '5c8e46c63ad86943f22d69ea',
          '5c8e46cc3ad86943f22d69ed',
          '5c8e46d23ad86943f22d69f0'
        ]
      }
    ],
    'creationDate': '2019-03-17T18:56:52.689Z',
    'lastUpdate': '2019-03-17T18:56:52.689Z'
  },
  {
    '_id': ObjectId('24491843d05f5f43510f2c12'),
    'domain': ObjectId('5c8e470c3ad86943f22d6a14'),
    'client': ObjectId('5c8e47153ad86943f22d6a19'),
    'version': ObjectId('df756146d3eec187d9b07eae'),
    'survey': ObjectId('5c8e45d13ad86943f22d6983'),
    'answers': [
      {
        'creationDate': '2019-03-17T18:14:14.368Z',
        'question': ObjectId('5c8e45d33ad86943f22d6989'),
        'type': 'LIKE',
        'liked': true
      },
      {
        'creationDate': '2019-03-17T17:53:13.970Z',
        'question': ObjectId('5c8e45e33ad86943f22d698d'),
        'type': 'LIKEDISLIKE',
        'liked': false
      },
      {
        'creationDate': '2019-03-17T18:07:59.710Z',
        'question': ObjectId('5c8e45f93ad86943f22d6997'),
        'type': 'CHOICE',
        'choice': ObjectId('5c8e460e3ad86943f22d69a4')
      },
      {
        'creationDate': '2019-03-17T17:56:12.182Z',
        'question': ObjectId('5c8e46163ad86943f22d69ad'),
        'type': 'REGULATOR',
        'rating': 10,
        'normalized': 1
      },
      {
        'creationDate': '2019-03-17T17:53:00.779Z',
        'question': ObjectId('5c8e46563ad86943f22d69c7'),
        'type': 'FAVORITE',
        'favoriteItem': ObjectId('5c8e46953ad86943f22d69d4')
      },
      {
        'creationDate': '2019-03-17T17:59:41.128Z',
        'id': 0,
        'question': ObjectId('5c8e46b03ad86943f22d69e0'),
        'type': 'RANKING',
        'rankedItems': [
          '5c8e46bb3ad86943f22d69e4',
          '5c8e46c13ad86943f22d69e7',
          '5c8e46d23ad86943f22d69f0',
          '5c8e46cc3ad86943f22d69ed',
          '5c8e46c63ad86943f22d69ea'
        ]
      }
    ],
    'creationDate': '2019-03-17T18:18:48.200Z',
    'lastUpdate': '2019-03-17T18:18:48.200Z'
  },
  {
    '_id': ObjectId('fa2c57920288458b474a1eaa'),
    'domain': ObjectId('5c8e470c3ad86943f22d6a14'),
    'client': ObjectId('5c8e471b3ad86943f22d6a1b'),
    'version': ObjectId('df756146d3eec187d9b07eae'),
    'survey': ObjectId('5c8e45d13ad86943f22d6983'),
    'answers': [
      {
        'creationDate': '2019-03-17T17:57:39.127Z',
        'question': ObjectId('5c8e45d33ad86943f22d6989'),
        'type': 'LIKE',
        'liked': false
      },
      {
        'creationDate': '2019-03-17T18:08:06.006Z',
        'question': ObjectId('5c8e45e33ad86943f22d698d'),
        'type': 'LIKEDISLIKE',
        'liked': true
      },
      {
        'creationDate': '2019-03-17T18:20:58.193Z',
        'question': ObjectId('5c8e45f93ad86943f22d6997'),
        'type': 'CHOICE',
        'choice': ObjectId('5c8e460a3ad86943f22d699e')
      },
      {
        'creationDate': '2019-03-17T18:06:53.267Z',
        'question': ObjectId('5c8e46163ad86943f22d69ad'),
        'type': 'REGULATOR',
        'rating': 4,
        'normalized': 0.333333333333333
      },
      {
        'creationDate': '2019-03-17T18:17:17.355Z',
        'question': ObjectId('5c8e46563ad86943f22d69c7'),
        'type': 'FAVORITE',
        'favoriteItem': ObjectId('5c8e46833ad86943f22d69cb')
      },
      {
        'creationDate': '2019-03-17T18:15:39.754Z',
        'id': 1,
        'question': ObjectId('5c8e46b03ad86943f22d69e0'),
        'type': 'RANKING',
        'rankedItems': [
          '5c8e46d23ad86943f22d69f0',
          '5c8e46c63ad86943f22d69ea',
          '5c8e46c13ad86943f22d69e7',
          '5c8e46bb3ad86943f22d69e4',
          '5c8e46cc3ad86943f22d69ed'
        ]
      }
    ],
    'creationDate': '2019-03-17T18:25:51.361Z',
    'lastUpdate': '2019-03-17T18:25:51.361Z'
  },
  {
    '_id': ObjectId('8a267868f88146645a63f86f'),
    'domain': ObjectId('5c8e470c3ad86943f22d6a14'),
    'client': ObjectId('5c8e47153ad86943f22d6a19'),
    'version': ObjectId('df756146d3eec187d9b07eae'),
    'survey': ObjectId('5c8e45d13ad86943f22d6983'),
    'answers': [
      {
        'creationDate': '2019-03-17T19:20:02.848Z',
        'question': ObjectId('5c8e45d33ad86943f22d6989'),
        'type': 'LIKE',
        'liked': true
      },
      {
        'creationDate': '2019-03-17T19:25:25.325Z',
        'question': ObjectId('5c8e45e33ad86943f22d698d'),
        'type': 'LIKEDISLIKE',
        'liked': null
      },
      {
        'creationDate': '2019-03-17T19:22:10.004Z',
        'question': ObjectId('5c8e45f93ad86943f22d6997'),
        'type': 'CHOICE',
        'choice': ObjectId('5c8e46033ad86943f22d699b')
      },
      {
        'creationDate': '2019-03-17T19:21:32.464Z',
        'question': ObjectId('5c8e46163ad86943f22d69ad'),
        'type': 'REGULATOR',
        'rating': 6,
        'normalized': 0.555555555555556
      },
      {
        'creationDate': '2019-03-17T19:24:27.946Z',
        'question': ObjectId('5c8e46563ad86943f22d69c7'),
        'type': 'FAVORITE',
        'favoriteItem': ObjectId('5c8e46893ad86943f22d69ce')
      },
      {
        'creationDate': '2019-03-17T19:19:48.156Z',
        'id': 2,
        'question': ObjectId('5c8e46b03ad86943f22d69e0'),
        'type': 'RANKING',
        'rankedItems': [
          '5c8e46c13ad86943f22d69e7',
          '5c8e46c63ad86943f22d69ea',
          '5c8e46bb3ad86943f22d69e4',
          '5c8e46cc3ad86943f22d69ed',
          '5c8e46d23ad86943f22d69f0'
        ]
      }
    ],
    'creationDate': '2019-03-17T19:32:07.165Z',
    'lastUpdate': '2019-03-17T19:32:07.165Z'
  },
  {
    '_id': ObjectId('a37653ab0d7e8b6a31175af0'),
    'domain': ObjectId('5c8e470c3ad86943f22d6a14'),
    'client': ObjectId('5c8e471b3ad86943f22d6a1b'),
    'version': ObjectId('df756146d3eec187d9b07eae'),
    'survey': ObjectId('5c8e45d13ad86943f22d6983'),
    'answers': [
      {
        'creationDate': '2019-03-17T19:27:44.307Z',
        'question': ObjectId('5c8e45d33ad86943f22d6989'),
        'type': 'LIKE',
        'liked': true
      },
      {
        'creationDate': '2019-03-17T19:38:16.826Z',
        'question': ObjectId('5c8e45e33ad86943f22d698d'),
        'type': 'LIKEDISLIKE',
        'liked': false
      },
      {
        'creationDate': '2019-03-17T19:20:47.207Z',
        'question': ObjectId('5c8e45f93ad86943f22d6997'),
        'type': 'CHOICE',
        'choice': ObjectId('5c8e46113ad86943f22d69aa')
      },
      {
        'creationDate': '2019-03-17T19:21:20.531Z',
        'question': ObjectId('5c8e46163ad86943f22d69ad'),
        'type': 'REGULATOR',
        'rating': 7,
        'normalized': 0.666666666666667
      },
      {
        'creationDate': '2019-03-17T19:17:48.586Z',
        'question': ObjectId('5c8e46563ad86943f22d69c7'),
        'type': 'FAVORITE',
        'favoriteItem': null
      },
      {
        'creationDate': '2019-03-17T19:16:07.593Z',
        'id': 3,
        'question': ObjectId('5c8e46b03ad86943f22d69e0'),
        'type': 'RANKING',
        'rankedItems': [
          '5c8e46bb3ad86943f22d69e4',
          '5c8e46d23ad86943f22d69f0',
          '5c8e46c13ad86943f22d69e7',
          '5c8e46c63ad86943f22d69ea',
          '5c8e46cc3ad86943f22d69ed'
        ]
      }
    ],
    'creationDate': '2019-03-17T19:42:08.097Z',
    'lastUpdate': '2019-03-17T19:42:08.097Z'
  },
  {
    '_id': ObjectId('01cb811b87264c427b7f2eb5'),
    'domain': ObjectId('5c8e470c3ad86943f22d6a14'),
    'client': ObjectId('5c8e471b3ad86943f22d6a1b'),
    'version': ObjectId('df756146d3eec187d9b07eae'),
    'survey': ObjectId('5c8e45d13ad86943f22d6983'),
    'answers': [
      {
        'creationDate': '2019-03-17T18:39:02.287Z',
        'question': ObjectId('5c8e45d33ad86943f22d6989'),
        'type': 'LIKE',
        'liked': true
      },
      {
        'creationDate': '2019-03-17T18:43:08.004Z',
        'question': ObjectId('5c8e45e33ad86943f22d698d'),
        'type': 'LIKEDISLIKE',
        'liked': true
      },
      {
        'creationDate': '2019-03-17T18:44:36.160Z',
        'question': ObjectId('5c8e45f93ad86943f22d6997'),
        'type': 'CHOICE',
        'choice': ObjectId('5c8e46033ad86943f22d699b')
      },
      {
        'creationDate': '2019-03-17T18:31:35.263Z',
        'question': ObjectId('5c8e46163ad86943f22d69ad'),
        'type': 'REGULATOR',
        'rating': null,
        'normalized': null
      },
      {
        'creationDate': '2019-03-17T18:34:30.639Z',
        'question': ObjectId('5c8e46563ad86943f22d69c7'),
        'type': 'FAVORITE',
        'favoriteItem': ObjectId('5c8e46a93ad86943f22d69dd')
      },
      {
        'creationDate': '2019-03-17T18:59:24.508Z',
        'id': 4,
        'question': ObjectId('5c8e46b03ad86943f22d69e0'),
        'type': 'RANKING',
        'rankedItems': [
          '5c8e46d23ad86943f22d69f0',
          '5c8e46c13ad86943f22d69e7',
          '5c8e46c63ad86943f22d69ea',
          '5c8e46bb3ad86943f22d69e4',
          '5c8e46cc3ad86943f22d69ed'
        ]
      }
    ],
    'creationDate': '2019-03-17T19:01:12.598Z',
    'lastUpdate': '2019-03-17T19:01:12.598Z'
  },
  {
    '_id': ObjectId('ec9d62878fb868f98bedc909'),
    'domain': ObjectId('5c8e48df3ad86943f22d6b0d'),
    'client': ObjectId('5c8e48ef3ad86943f22d6b12'),
    'version': ObjectId('c5372fcfc477cb08cf07ef35'),
    'survey': ObjectId('5c8e478a3ad86943f22d6a92'),
    'answers': [
      {
        'creationDate': '2019-03-17T15:12:15.820Z',
        'question': ObjectId('5c8e478c3ad86943f22d6a98'),
        'type': 'LIKE',
        'liked': true
      },
      {
        'creationDate': '2019-03-17T15:06:51.145Z',
        'question': ObjectId('5c8e478f3ad86943f22d6a9b'),
        'type': 'LIKEDISLIKE',
        'liked': true
      },
      {
        'creationDate': '2019-03-17T14:54:57.475Z',
        'question': ObjectId('5c8e47913ad86943f22d6a9e'),
        'type': 'CHOICE',
        'choice': ObjectId('5c8e47e53ad86943f22d6abc')
      },
      {
        'creationDate': '2019-03-17T15:06:05.405Z',
        'question': ObjectId('5c8e47943ad86943f22d6aa1'),
        'type': 'REGULATOR',
        'rating': 4,
        'normalized': 0.8
      },
      {
        'creationDate': '2019-03-17T15:06:09.992Z',
        'question': ObjectId('5c8e47993ad86943f22d6aa4'),
        'type': 'FAVORITE',
        'favoriteItem': ObjectId('5c8e487a3ad86943f22d6aed')
      },
      {
        'creationDate': '2019-03-17T15:06:01.417Z',
        'id': 0,
        'question': ObjectId('5c8e479d3ad86943f22d6aa7'),
        'type': 'RANKING',
        'rankedItems': [
          '5c8e48a53ad86943f22d6af7',
          '5c8e48b03ad86943f22d6b00',
          '5c8e48a93ad86943f22d6afa',
          '5c8e48ab3ad86943f22d6afd'
        ]
      }
    ],
    'creationDate': '2019-03-17T15:14:19.051Z',
    'lastUpdate': '2019-03-17T15:14:19.051Z'
  },
  {
    '_id': ObjectId('d431cee7385278a9d6f9ff52'),
    'domain': ObjectId('5c8e48df3ad86943f22d6b0d'),
    'client': ObjectId('5c8e48f73ad86943f22d6b14'),
    'version': ObjectId('c5372fcfc477cb08cf07ef35'),
    'survey': ObjectId('5c8e478a3ad86943f22d6a92'),
    'answers': [
      {
        'creationDate': '2019-03-17T13:38:01.576Z',
        'question': ObjectId('5c8e478c3ad86943f22d6a98'),
        'type': 'LIKE',
        'liked': true
      },
      {
        'creationDate': '2019-03-17T13:53:38.044Z',
        'question': ObjectId('5c8e478f3ad86943f22d6a9b'),
        'type': 'LIKEDISLIKE',
        'liked': false
      },
      {
        'creationDate': '2019-03-17T13:48:35.038Z',
        'question': ObjectId('5c8e47913ad86943f22d6a9e'),
        'type': 'CHOICE',
        'choice': ObjectId('5c8e47ef3ad86943f22d6ac8')
      },
      {
        'creationDate': '2019-03-17T14:02:19.449Z',
        'question': ObjectId('5c8e47943ad86943f22d6aa1'),
        'type': 'REGULATOR',
        'rating': 0,
        'normalized': null
      },
      {
        'creationDate': '2019-03-17T13:53:44.489Z',
        'question': ObjectId('5c8e47993ad86943f22d6aa4'),
        'type': 'FAVORITE',
        'favoriteItem': ObjectId('5c8e48773ad86943f22d6aea')
      },
      {
        'creationDate': '2019-03-17T13:51:37.369Z',
        'id': 1,
        'question': ObjectId('5c8e479d3ad86943f22d6aa7'),
        'type': 'RANKING',
        'rankedItems': [
          '5c8e48a53ad86943f22d6af7',
          '5c8e48ab3ad86943f22d6afd',
          '5c8e48b03ad86943f22d6b00',
          '5c8e48a93ad86943f22d6afa'
        ]
      }
    ],
    'creationDate': '2019-03-17T14:06:27.362Z',
    'lastUpdate': '2019-03-17T14:06:27.362Z'
  },
  {
    '_id': ObjectId('559169b2ad728ceeef9b227c'),
    'domain': ObjectId('5c8e48df3ad86943f22d6b0d'),
    'client': ObjectId('5c8e48f73ad86943f22d6b14'),
    'version': ObjectId('c5372fcfc477cb08cf07ef35'),
    'survey': ObjectId('5c8e478a3ad86943f22d6a92'),
    'answers': [
      {
        'creationDate': '2019-03-17T14:44:40.186Z',
        'question': ObjectId('5c8e478c3ad86943f22d6a98'),
        'type': 'LIKE',
        'liked': true
      },
      {
        'creationDate': '2019-03-17T14:27:08.234Z',
        'question': ObjectId('5c8e478f3ad86943f22d6a9b'),
        'type': 'LIKEDISLIKE',
        'liked': false
      },
      {
        'creationDate': '2019-03-17T14:32:42.693Z',
        'question': ObjectId('5c8e47913ad86943f22d6a9e'),
        'type': 'CHOICE',
        'choice': ObjectId('5c8e47e43ad86943f22d6ab9')
      },
      {
        'creationDate': '2019-03-17T14:37:01.375Z',
        'question': ObjectId('5c8e47943ad86943f22d6aa1'),
        'type': 'REGULATOR',
        'rating': 2,
        'normalized': 0.4
      },
      {
        'creationDate': '2019-03-17T14:35:25.155Z',
        'question': ObjectId('5c8e47993ad86943f22d6aa4'),
        'type': 'FAVORITE',
        'favoriteItem': ObjectId('5c8e48813ad86943f22d6af3')
      },
      {
        'creationDate': '2019-03-17T14:40:43.000Z',
        'id': 2,
        'question': ObjectId('5c8e479d3ad86943f22d6aa7'),
        'type': 'RANKING',
        'rankedItems': [
          '5c8e48a53ad86943f22d6af7',
          '5c8e48b03ad86943f22d6b00',
          '5c8e48a93ad86943f22d6afa',
          '5c8e48ab3ad86943f22d6afd'
        ]
      }
    ],
    'creationDate': '2019-03-17T14:50:48.481Z',
    'lastUpdate': '2019-03-17T14:50:48.481Z'
  },
  {
    '_id': ObjectId('5824e8b9a4e7c174dcb4a3be'),
    'domain': ObjectId('5c8e48df3ad86943f22d6b0d'),
    'client': ObjectId('5c8e48ef3ad86943f22d6b12'),
    'version': ObjectId('c5372fcfc477cb08cf07ef35'),
    'survey': ObjectId('5c8e478a3ad86943f22d6a92'),
    'answers': [
      {
        'creationDate': '2019-03-17T13:56:30.619Z',
        'question': ObjectId('5c8e478c3ad86943f22d6a98'),
        'type': 'LIKE',
        'liked': null
      },
      {
        'creationDate': '2019-03-17T14:20:55.001Z',
        'question': ObjectId('5c8e478f3ad86943f22d6a9b'),
        'type': 'LIKEDISLIKE',
        'liked': false
      },
      {
        'creationDate': '2019-03-17T14:10:00.766Z',
        'question': ObjectId('5c8e47913ad86943f22d6a9e'),
        'type': 'CHOICE',
        'choice': ObjectId('5c8e47e23ad86943f22d6ab6')
      },
      {
        'creationDate': '2019-03-17T14:13:01.768Z',
        'question': ObjectId('5c8e47943ad86943f22d6aa1'),
        'type': 'REGULATOR',
        'rating': 3,
        'normalized': 0.6
      },
      {
        'creationDate': '2019-03-17T14:02:18.054Z',
        'question': ObjectId('5c8e47993ad86943f22d6aa4'),
        'type': 'FAVORITE',
        'favoriteItem': ObjectId('5c8e48743ad86943f22d6ae7')
      },
      {
        'creationDate': '2019-03-17T14:11:02.022Z',
        'id': 3,
        'question': ObjectId('5c8e479d3ad86943f22d6aa7'),
        'type': 'RANKING',
        'rankedItems': [
          '5c8e48a53ad86943f22d6af7',
          '5c8e48a93ad86943f22d6afa',
          '5c8e48b03ad86943f22d6b00',
          '5c8e48ab3ad86943f22d6afd'
        ]
      }
    ],
    'creationDate': '2019-03-17T14:23:25.408Z',
    'lastUpdate': '2019-03-17T14:23:25.408Z'
  },
  {
    '_id': ObjectId('caa34655be29474feb361a14'),
    'domain': ObjectId('5c8e48df3ad86943f22d6b0d'),
    'client': ObjectId('5c8e48ef3ad86943f22d6b12'),
    'version': ObjectId('c5372fcfc477cb08cf07ef35'),
    'survey': ObjectId('5c8e478a3ad86943f22d6a92'),
    'answers': [
      {
        'creationDate': '2019-03-17T14:09:49.679Z',
        'question': ObjectId('5c8e478c3ad86943f22d6a98'),
        'type': 'LIKE',
        'liked': false
      },
      {
        'creationDate': '2019-03-17T14:04:12.953Z',
        'question': ObjectId('5c8e478f3ad86943f22d6a9b'),
        'type': 'LIKEDISLIKE',
        'liked': true
      },
      {
        'creationDate': '2019-03-17T14:19:36.043Z',
        'question': ObjectId('5c8e47913ad86943f22d6a9e'),
        'type': 'CHOICE',
        'choice': ObjectId('5c8e47e53ad86943f22d6abc')
      },
      {
        'creationDate': '2019-03-17T14:05:05.629Z',
        'question': ObjectId('5c8e47943ad86943f22d6aa1'),
        'type': 'REGULATOR',
        'rating': 2,
        'normalized': 0.4
      },
      {
        'creationDate': '2019-03-17T14:06:21.515Z',
        'question': ObjectId('5c8e47993ad86943f22d6aa4'),
        'type': 'FAVORITE',
        'favoriteItem': ObjectId('5c8e48773ad86943f22d6aea')
      },
      {
        'creationDate': '2019-03-17T14:14:23.630Z',
        'id': 4,
        'question': ObjectId('5c8e479d3ad86943f22d6aa7'),
        'type': 'RANKING',
        'rankedItems': [
          '5c8e48ab3ad86943f22d6afd',
          '5c8e48b03ad86943f22d6b00',
          '5c8e48a93ad86943f22d6afa',
          '5c8e48a53ad86943f22d6af7'
        ]
      }
    ],
    'creationDate': '2019-03-17T14:28:06.827Z',
    'lastUpdate': '2019-03-17T14:28:06.827Z'
  },
  {
    '_id': ObjectId('79ed9449fe4f8973a7e63021'),
    'domain': ObjectId('5c8e48df3ad86943f22d6b0d'),
    'client': ObjectId('5c8e48f73ad86943f22d6b14'),
    'version': ObjectId('542a075113b8f13f9f8bc15e'),
    'survey': ObjectId('5c8e478a3ad86943f22d6a92'),
    'answers': [
      {
        'creationDate': '2019-03-17T16:07:14.248Z',
        'question': ObjectId('5c8e478c3ad86943f22d6a98'),
        'type': 'LIKE',
        'liked': true
      },
      {
        'creationDate': '2019-03-17T16:14:29.035Z',
        'question': ObjectId('5c8e478f3ad86943f22d6a9b'),
        'type': 'LIKEDISLIKE',
        'liked': true
      },
      {
        'creationDate': '2019-03-17T16:18:04.981Z',
        'question': ObjectId('5c8e47913ad86943f22d6a9e'),
        'type': 'CHOICE',
        'choice': ObjectId('5c8e47ef3ad86943f22d6ac8')
      },
      {
        'creationDate': '2019-03-17T16:29:50.471Z',
        'question': ObjectId('5c8e47943ad86943f22d6aa1'),
        'type': 'REGULATOR',
        'rating': 5,
        'normalized': 1
      },
      {
        'creationDate': '2019-03-17T16:06:40.198Z',
        'question': ObjectId('5c8e47993ad86943f22d6aa4'),
        'type': 'FAVORITE',
        'favoriteItem': ObjectId('5c8e48813ad86943f22d6af3')
      },
      {
        'creationDate': '2019-03-17T16:09:59.045Z',
        'id': 0,
        'question': ObjectId('5c8e479d3ad86943f22d6aa7'),
        'type': 'RANKING',
        'rankedItems': [
          '5c8e48ab3ad86943f22d6afd',
          '5c8e48b03ad86943f22d6b00',
          '5c8e48a93ad86943f22d6afa',
          '5c8e48a53ad86943f22d6af7'
        ]
      }
    ],
    'creationDate': '2019-03-17T16:33:08.197Z',
    'lastUpdate': '2019-03-17T16:33:08.197Z'
  },
  {
    '_id': ObjectId('26d1a1825e7a128f25ad7e1b'),
    'domain': ObjectId('5c8e48df3ad86943f22d6b0d'),
    'client': ObjectId('5c8e48f73ad86943f22d6b14'),
    'version': ObjectId('542a075113b8f13f9f8bc15e'),
    'survey': ObjectId('5c8e478a3ad86943f22d6a92'),
    'answers': [
      {
        'creationDate': '2019-03-17T16:45:22.658Z',
        'question': ObjectId('5c8e478c3ad86943f22d6a98'),
        'type': 'LIKE',
        'liked': null
      },
      {
        'creationDate': '2019-03-17T16:52:45.030Z',
        'question': ObjectId('5c8e478f3ad86943f22d6a9b'),
        'type': 'LIKEDISLIKE',
        'liked': false
      },
      {
        'creationDate': '2019-03-17T16:39:28.969Z',
        'question': ObjectId('5c8e47913ad86943f22d6a9e'),
        'type': 'CHOICE',
        'choice': ObjectId('5c8e47e23ad86943f22d6ab6')
      },
      {
        'creationDate': '2019-03-17T16:36:14.424Z',
        'question': ObjectId('5c8e47943ad86943f22d6aa1'),
        'type': 'REGULATOR',
        'rating': 2,
        'normalized': 0.4
      },
      {
        'creationDate': '2019-03-17T16:44:41.383Z',
        'question': ObjectId('5c8e47993ad86943f22d6aa4'),
        'type': 'FAVORITE',
        'favoriteItem': ObjectId('5c8e48743ad86943f22d6ae7')
      },
      {
        'creationDate': '2019-03-17T16:41:53.767Z',
        'id': 1,
        'question': ObjectId('5c8e479d3ad86943f22d6aa7'),
        'type': 'RANKING',
        'rankedItems': [
          '5c8e48ab3ad86943f22d6afd',
          '5c8e48a53ad86943f22d6af7',
          '5c8e48b03ad86943f22d6b00',
          '5c8e48a93ad86943f22d6afa'
        ]
      }
    ],
    'creationDate': '2019-03-17T16:58:35.210Z',
    'lastUpdate': '2019-03-17T16:58:35.210Z'
  },
  {
    '_id': ObjectId('1613bff97e2f46dc5eb104cd'),
    'domain': ObjectId('5c8e48df3ad86943f22d6b0d'),
    'client': ObjectId('5c8e48f73ad86943f22d6b14'),
    'version': ObjectId('542a075113b8f13f9f8bc15e'),
    'survey': ObjectId('5c8e478a3ad86943f22d6a92'),
    'answers': [
      {
        'creationDate': '2019-03-17T17:00:26.027Z',
        'question': ObjectId('5c8e478c3ad86943f22d6a98'),
        'type': 'LIKE',
        'liked': null
      },
      {
        'creationDate': '2019-03-17T16:50:15.241Z',
        'question': ObjectId('5c8e478f3ad86943f22d6a9b'),
        'type': 'LIKEDISLIKE',
        'liked': true
      },
      {
        'creationDate': '2019-03-17T17:00:52.986Z',
        'question': ObjectId('5c8e47913ad86943f22d6a9e'),
        'type': 'CHOICE',
        'choice': null
      },
      {
        'creationDate': '2019-03-17T16:51:33.303Z',
        'question': ObjectId('5c8e47943ad86943f22d6aa1'),
        'type': 'REGULATOR',
        'rating': 1,
        'normalized': 0.2
      },
      {
        'creationDate': '2019-03-17T17:10:07.377Z',
        'question': ObjectId('5c8e47993ad86943f22d6aa4'),
        'type': 'FAVORITE',
        'favoriteItem': ObjectId('5c8e48773ad86943f22d6aea')
      },
      {
        'creationDate': '2019-03-17T17:12:19.941Z',
        'id': 2,
        'question': ObjectId('5c8e479d3ad86943f22d6aa7'),
        'type': 'RANKING',
        'rankedItems': [
          '5c8e48b03ad86943f22d6b00',
          '5c8e48a53ad86943f22d6af7',
          '5c8e48a93ad86943f22d6afa',
          '5c8e48ab3ad86943f22d6afd'
        ]
      }
    ],
    'creationDate': '2019-03-17T17:16:42.873Z',
    'lastUpdate': '2019-03-17T17:16:42.873Z'
  },
  {
    '_id': ObjectId('d5d11c7727e17a49884c2eec'),
    'domain': ObjectId('5c8e48df3ad86943f22d6b0d'),
    'client': ObjectId('5c8e48ef3ad86943f22d6b12'),
    'version': ObjectId('542a075113b8f13f9f8bc15e'),
    'survey': ObjectId('5c8e478a3ad86943f22d6a92'),
    'answers': [
      {
        'creationDate': '2019-03-17T16:09:41.151Z',
        'question': ObjectId('5c8e478c3ad86943f22d6a98'),
        'type': 'LIKE',
        'liked': true
      },
      {
        'creationDate': '2019-03-17T16:01:10.978Z',
        'question': ObjectId('5c8e478f3ad86943f22d6a9b'),
        'type': 'LIKEDISLIKE',
        'liked': false
      },
      {
        'creationDate': '2019-03-17T16:06:56.426Z',
        'question': ObjectId('5c8e47913ad86943f22d6a9e'),
        'type': 'CHOICE',
        'choice': null
      },
      {
        'creationDate': '2019-03-17T16:24:23.159Z',
        'question': ObjectId('5c8e47943ad86943f22d6aa1'),
        'type': 'REGULATOR',
        'rating': null,
        'normalized': null
      },
      {
        'creationDate': '2019-03-17T16:10:58.283Z',
        'question': ObjectId('5c8e47993ad86943f22d6aa4'),
        'type': 'FAVORITE',
        'favoriteItem': ObjectId('5c8e487a3ad86943f22d6aed')
      },
      {
        'creationDate': '2019-03-17T16:24:41.404Z',
        'id': 3,
        'question': ObjectId('5c8e479d3ad86943f22d6aa7'),
        'type': 'RANKING',
        'rankedItems': [
          '5c8e48a93ad86943f22d6afa',
          '5c8e48a53ad86943f22d6af7',
          '5c8e48ab3ad86943f22d6afd',
          '5c8e48b03ad86943f22d6b00'
        ]
      }
    ],
    'creationDate': '2019-03-17T16:26:04.271Z',
    'lastUpdate': '2019-03-17T16:26:04.271Z'
  },
  {
    '_id': ObjectId('38894e41b8b3b2ae4ac317ad'),
    'domain': ObjectId('5c8e48df3ad86943f22d6b0d'),
    'client': ObjectId('5c8e48ef3ad86943f22d6b12'),
    'version': ObjectId('542a075113b8f13f9f8bc15e'),
    'survey': ObjectId('5c8e478a3ad86943f22d6a92'),
    'answers': [
      {
        'creationDate': '2019-03-17T17:35:52.269Z',
        'question': ObjectId('5c8e478c3ad86943f22d6a98'),
        'type': 'LIKE',
        'liked': true
      },
      {
        'creationDate': '2019-03-17T17:41:47.189Z',
        'question': ObjectId('5c8e478f3ad86943f22d6a9b'),
        'type': 'LIKEDISLIKE',
        'liked': true
      },
      {
        'creationDate': '2019-03-17T17:33:59.742Z',
        'question': ObjectId('5c8e47913ad86943f22d6a9e'),
        'type': 'CHOICE',
        'choice': ObjectId('5c8e47e23ad86943f22d6ab6')
      },
      {
        'creationDate': '2019-03-17T17:52:26.652Z',
        'question': ObjectId('5c8e47943ad86943f22d6aa1'),
        'type': 'REGULATOR',
        'rating': 3,
        'normalized': 0.6
      },
      {
        'creationDate': '2019-03-17T17:52:12.922Z',
        'question': ObjectId('5c8e47993ad86943f22d6aa4'),
        'type': 'FAVORITE',
        'favoriteItem': ObjectId('5c8e487d3ad86943f22d6af0')
      },
      {
        'creationDate': '2019-03-17T17:36:25.236Z',
        'id': 4,
        'question': ObjectId('5c8e479d3ad86943f22d6aa7'),
        'type': 'RANKING',
        'rankedItems': null
      }
    ],
    'creationDate': '2019-03-17T17:57:50.715Z',
    'lastUpdate': '2019-03-17T17:57:50.715Z'
  },
  {
    '_id': ObjectId('cba3b83faafea7558f6548fa'),
    'domain': ObjectId('5c8e48df3ad86943f22d6b0d'),
    'client': ObjectId('5c8e48f73ad86943f22d6b14'),
    'version': ObjectId('6d0ef9ab872f4af65e590dad'),
    'survey': ObjectId('5c8e478a3ad86943f22d6a92'),
    'answers': [
      {
        'creationDate': '2019-03-17T18:34:08.538Z',
        'question': ObjectId('5c8e478c3ad86943f22d6a98'),
        'type': 'LIKE',
        'liked': true
      },
      {
        'creationDate': '2019-03-17T18:27:28.657Z',
        'question': ObjectId('5c8e478f3ad86943f22d6a9b'),
        'type': 'LIKEDISLIKE',
        'liked': true
      },
      {
        'creationDate': '2019-03-17T18:30:29.024Z',
        'question': ObjectId('5c8e47913ad86943f22d6a9e'),
        'type': 'CHOICE',
        'choice': ObjectId('5c8e47e43ad86943f22d6ab9')
      },
      {
        'creationDate': '2019-03-17T18:19:36.185Z',
        'question': ObjectId('5c8e47943ad86943f22d6aa1'),
        'type': 'REGULATOR',
        'rating': 4,
        'normalized': 0.8
      },
      {
        'creationDate': '2019-03-17T18:19:10.070Z',
        'question': ObjectId('5c8e47993ad86943f22d6aa4'),
        'type': 'FAVORITE',
        'favoriteItem': ObjectId('5c8e48773ad86943f22d6aea')
      },
      {
        'creationDate': '2019-03-17T18:45:46.254Z',
        'id': 0,
        'question': ObjectId('5c8e479d3ad86943f22d6aa7'),
        'type': 'RANKING',
        'rankedItems': [
          '5c8e48ab3ad86943f22d6afd',
          '5c8e48a53ad86943f22d6af7',
          '5c8e48a93ad86943f22d6afa',
          '5c8e48b03ad86943f22d6b00'
        ]
      }
    ],
    'creationDate': '2019-03-17T18:48:53.824Z',
    'lastUpdate': '2019-03-17T18:48:53.824Z'
  },
  {
    '_id': ObjectId('ddb100942761fea15510f75d'),
    'domain': ObjectId('5c8e48df3ad86943f22d6b0d'),
    'client': ObjectId('5c8e48f73ad86943f22d6b14'),
    'version': ObjectId('6d0ef9ab872f4af65e590dad'),
    'survey': ObjectId('5c8e478a3ad86943f22d6a92'),
    'answers': [
      {
        'creationDate': '2019-03-17T18:36:08.856Z',
        'question': ObjectId('5c8e478c3ad86943f22d6a98'),
        'type': 'LIKE',
        'liked': null
      },
      {
        'creationDate': '2019-03-17T18:33:11.889Z',
        'question': ObjectId('5c8e478f3ad86943f22d6a9b'),
        'type': 'LIKEDISLIKE',
        'liked': false
      },
      {
        'creationDate': '2019-03-17T18:33:04.929Z',
        'question': ObjectId('5c8e47913ad86943f22d6a9e'),
        'type': 'CHOICE',
        'choice': ObjectId('5c8e47e43ad86943f22d6ab9')
      },
      {
        'creationDate': '2019-03-17T18:36:02.464Z',
        'question': ObjectId('5c8e47943ad86943f22d6aa1'),
        'type': 'REGULATOR',
        'rating': null,
        'normalized': null
      },
      {
        'creationDate': '2019-03-17T18:45:29.998Z',
        'question': ObjectId('5c8e47993ad86943f22d6aa4'),
        'type': 'FAVORITE',
        'favoriteItem': ObjectId('5c8e487a3ad86943f22d6aed')
      },
      {
        'creationDate': '2019-03-17T18:52:03.477Z',
        'id': 1,
        'question': ObjectId('5c8e479d3ad86943f22d6aa7'),
        'type': 'RANKING',
        'rankedItems': [
          '5c8e48a53ad86943f22d6af7',
          '5c8e48b03ad86943f22d6b00',
          '5c8e48ab3ad86943f22d6afd',
          '5c8e48a93ad86943f22d6afa'
        ]
      }
    ],
    'creationDate': '2019-03-17T19:03:04.668Z',
    'lastUpdate': '2019-03-17T19:03:04.668Z'
  },
  {
    '_id': ObjectId('6c49d7282a5a5bfd942eff2f'),
    'domain': ObjectId('5c8e48df3ad86943f22d6b0d'),
    'client': ObjectId('5c8e48f73ad86943f22d6b14'),
    'version': ObjectId('6d0ef9ab872f4af65e590dad'),
    'survey': ObjectId('5c8e478a3ad86943f22d6a92'),
    'answers': [
      {
        'creationDate': '2019-03-17T18:56:53.281Z',
        'question': ObjectId('5c8e478c3ad86943f22d6a98'),
        'type': 'LIKE',
        'liked': true
      },
      {
        'creationDate': '2019-03-17T18:59:01.552Z',
        'question': ObjectId('5c8e478f3ad86943f22d6a9b'),
        'type': 'LIKEDISLIKE',
        'liked': true
      },
      {
        'creationDate': '2019-03-17T19:00:45.374Z',
        'question': ObjectId('5c8e47913ad86943f22d6a9e'),
        'type': 'CHOICE',
        'choice': ObjectId('5c8e47e53ad86943f22d6abc')
      },
      {
        'creationDate': '2019-03-17T19:11:55.107Z',
        'question': ObjectId('5c8e47943ad86943f22d6aa1'),
        'type': 'REGULATOR',
        'rating': 2,
        'normalized': 0.4
      },
      {
        'creationDate': '2019-03-17T18:57:50.685Z',
        'question': ObjectId('5c8e47993ad86943f22d6aa4'),
        'type': 'FAVORITE',
        'favoriteItem': ObjectId('5c8e487d3ad86943f22d6af0')
      },
      {
        'creationDate': '2019-03-17T19:16:15.695Z',
        'id': 2,
        'question': ObjectId('5c8e479d3ad86943f22d6aa7'),
        'type': 'RANKING',
        'rankedItems': [
          '5c8e48ab3ad86943f22d6afd',
          '5c8e48b03ad86943f22d6b00',
          '5c8e48a93ad86943f22d6afa',
          '5c8e48a53ad86943f22d6af7'
        ]
      }
    ],
    'creationDate': '2019-03-17T19:21:26.955Z',
    'lastUpdate': '2019-03-17T19:21:26.955Z'
  },
  {
    '_id': ObjectId('502f98d76f4f819860d9f38b'),
    'domain': ObjectId('5c8e48df3ad86943f22d6b0d'),
    'client': ObjectId('5c8e48ef3ad86943f22d6b12'),
    'version': ObjectId('6d0ef9ab872f4af65e590dad'),
    'survey': ObjectId('5c8e478a3ad86943f22d6a92'),
    'answers': [
      {
        'creationDate': '2019-03-17T19:52:42.660Z',
        'question': ObjectId('5c8e478c3ad86943f22d6a98'),
        'type': 'LIKE',
        'liked': null
      },
      {
        'creationDate': '2019-03-17T19:37:59.862Z',
        'question': ObjectId('5c8e478f3ad86943f22d6a9b'),
        'type': 'LIKEDISLIKE',
        'liked': false
      },
      {
        'creationDate': '2019-03-17T19:46:36.212Z',
        'question': ObjectId('5c8e47913ad86943f22d6a9e'),
        'type': 'CHOICE',
        'choice': ObjectId('5c8e47e43ad86943f22d6ab9')
      },
      {
        'creationDate': '2019-03-17T19:57:54.638Z',
        'question': ObjectId('5c8e47943ad86943f22d6aa1'),
        'type': 'REGULATOR',
        'rating': null,
        'normalized': null
      },
      {
        'creationDate': '2019-03-17T19:50:52.415Z',
        'question': ObjectId('5c8e47993ad86943f22d6aa4'),
        'type': 'FAVORITE',
        'favoriteItem': null
      },
      {
        'creationDate': '2019-03-17T19:41:45.788Z',
        'id': 3,
        'question': ObjectId('5c8e479d3ad86943f22d6aa7'),
        'type': 'RANKING',
        'rankedItems': [
          '5c8e48b03ad86943f22d6b00',
          '5c8e48a93ad86943f22d6afa',
          '5c8e48a53ad86943f22d6af7',
          '5c8e48ab3ad86943f22d6afd'
        ]
      }
    ],
    'creationDate': '2019-03-17T20:00:01.443Z',
    'lastUpdate': '2019-03-17T20:00:01.443Z'
  },
  {
    '_id': ObjectId('feec7ca9c03719d8764c3e98'),
    'domain': ObjectId('5c8e48df3ad86943f22d6b0d'),
    'client': ObjectId('5c8e48ef3ad86943f22d6b12'),
    'version': ObjectId('6d0ef9ab872f4af65e590dad'),
    'survey': ObjectId('5c8e478a3ad86943f22d6a92'),
    'answers': [
      {
        'creationDate': '2019-03-17T18:38:02.216Z',
        'question': ObjectId('5c8e478c3ad86943f22d6a98'),
        'type': 'LIKE',
        'liked': true
      },
      {
        'creationDate': '2019-03-17T18:50:25.028Z',
        'question': ObjectId('5c8e478f3ad86943f22d6a9b'),
        'type': 'LIKEDISLIKE',
        'liked': true
      },
      {
        'creationDate': '2019-03-17T18:37:12.620Z',
        'question': ObjectId('5c8e47913ad86943f22d6a9e'),
        'type': 'CHOICE',
        'choice': null
      },
      {
        'creationDate': '2019-03-17T18:30:43.254Z',
        'question': ObjectId('5c8e47943ad86943f22d6aa1'),
        'type': 'REGULATOR',
        'rating': 5,
        'normalized': 1
      },
      {
        'creationDate': '2019-03-17T18:41:15.179Z',
        'question': ObjectId('5c8e47993ad86943f22d6aa4'),
        'type': 'FAVORITE',
        'favoriteItem': ObjectId('5c8e48813ad86943f22d6af3')
      },
      {
        'creationDate': '2019-03-17T18:39:07.235Z',
        'id': 4,
        'question': ObjectId('5c8e479d3ad86943f22d6aa7'),
        'type': 'RANKING',
        'rankedItems': [
          '5c8e48b03ad86943f22d6b00',
          '5c8e48ab3ad86943f22d6afd',
          '5c8e48a93ad86943f22d6afa',
          '5c8e48a53ad86943f22d6af7'
        ]
      }
    ],
    'creationDate': '2019-03-17T18:56:13.914Z',
    'lastUpdate': '2019-03-17T18:56:13.914Z'
  },
  {
    '_id': ObjectId('45c264b5575ba0664ea906f4'),
    'domain': ObjectId('5c8e48df3ad86943f22d6b0d'),
    'client': ObjectId('5c8e48f73ad86943f22d6b14'),
    'version': ObjectId('3bffa9a8651390118574dbe9'),
    'survey': ObjectId('5c8e478a3ad86943f22d6a92'),
    'answers': [
      {
        'creationDate': '2019-03-17T18:55:52.139Z',
        'question': ObjectId('5c8e478c3ad86943f22d6a98'),
        'type': 'LIKE',
        'liked': true
      },
      {
        'creationDate': '2019-03-17T18:33:25.102Z',
        'question': ObjectId('5c8e478f3ad86943f22d6a9b'),
        'type': 'LIKEDISLIKE',
        'liked': false
      },
      {
        'creationDate': '2019-03-17T18:32:30.051Z',
        'question': ObjectId('5c8e47913ad86943f22d6a9e'),
        'type': 'CHOICE',
        'choice': ObjectId('5c8e47ef3ad86943f22d6ac8')
      },
      {
        'creationDate': '2019-03-17T18:35:33.290Z',
        'question': ObjectId('5c8e47943ad86943f22d6aa1'),
        'type': 'REGULATOR',
        'rating': 4,
        'normalized': 0.8
      },
      {
        'creationDate': '2019-03-17T18:51:32.665Z',
        'question': ObjectId('5c8e47993ad86943f22d6aa4'),
        'type': 'FAVORITE',
        'favoriteItem': ObjectId('5c8e48743ad86943f22d6ae7')
      },
      {
        'creationDate': '2019-03-17T18:37:02.870Z',
        'id': 0,
        'question': ObjectId('5c8e479d3ad86943f22d6aa7'),
        'type': 'RANKING',
        'rankedItems': [
          '5c8e48a53ad86943f22d6af7',
          '5c8e48ab3ad86943f22d6afd',
          '5c8e48b03ad86943f22d6b00',
          '5c8e48a93ad86943f22d6afa'
        ]
      }
    ],
    'creationDate': '2019-03-17T18:57:24.526Z',
    'lastUpdate': '2019-03-17T18:57:24.526Z'
  },
  {
    '_id': ObjectId('93e4cc3f6f470f75e2af8c21'),
    'domain': ObjectId('5c8e48df3ad86943f22d6b0d'),
    'client': ObjectId('5c8e48ef3ad86943f22d6b12'),
    'version': ObjectId('3bffa9a8651390118574dbe9'),
    'survey': ObjectId('5c8e478a3ad86943f22d6a92'),
    'answers': [
      {
        'creationDate': '2019-03-17T15:08:58.481Z',
        'question': ObjectId('5c8e478c3ad86943f22d6a98'),
        'type': 'LIKE',
        'liked': true
      },
      {
        'creationDate': '2019-03-17T15:18:32.732Z',
        'question': ObjectId('5c8e478f3ad86943f22d6a9b'),
        'type': 'LIKEDISLIKE',
        'liked': true
      },
      {
        'creationDate': '2019-03-17T15:27:53.988Z',
        'question': ObjectId('5c8e47913ad86943f22d6a9e'),
        'type': 'CHOICE',
        'choice': ObjectId('5c8e47ef3ad86943f22d6ac8')
      },
      {
        'creationDate': '2019-03-17T15:08:05.212Z',
        'question': ObjectId('5c8e47943ad86943f22d6aa1'),
        'type': 'REGULATOR',
        'rating': 5,
        'normalized': 1
      },
      {
        'creationDate': '2019-03-17T15:12:42.768Z',
        'question': ObjectId('5c8e47993ad86943f22d6aa4'),
        'type': 'FAVORITE',
        'favoriteItem': ObjectId('5c8e48773ad86943f22d6aea')
      },
      {
        'creationDate': '2019-03-17T15:21:37.942Z',
        'id': 1,
        'question': ObjectId('5c8e479d3ad86943f22d6aa7'),
        'type': 'RANKING',
        'rankedItems': [
          '5c8e48a53ad86943f22d6af7',
          '5c8e48ab3ad86943f22d6afd',
          '5c8e48b03ad86943f22d6b00',
          '5c8e48a93ad86943f22d6afa'
        ]
      }
    ],
    'creationDate': '2019-03-17T15:28:44.118Z',
    'lastUpdate': '2019-03-17T15:28:44.118Z'
  },
  {
    '_id': ObjectId('f4a130912588b5e47dcc3792'),
    'domain': ObjectId('5c8e48df3ad86943f22d6b0d'),
    'client': ObjectId('5c8e48ef3ad86943f22d6b12'),
    'version': ObjectId('3bffa9a8651390118574dbe9'),
    'survey': ObjectId('5c8e478a3ad86943f22d6a92'),
    'answers': [
      {
        'creationDate': '2019-03-17T15:22:08.138Z',
        'question': ObjectId('5c8e478c3ad86943f22d6a98'),
        'type': 'LIKE',
        'liked': null
      },
      {
        'creationDate': '2019-03-17T15:20:40.691Z',
        'question': ObjectId('5c8e478f3ad86943f22d6a9b'),
        'type': 'LIKEDISLIKE',
        'liked': null
      },
      {
        'creationDate': '2019-03-17T15:18:19.848Z',
        'question': ObjectId('5c8e47913ad86943f22d6a9e'),
        'type': 'CHOICE',
        'choice': ObjectId('5c8e47ef3ad86943f22d6ac8')
      },
      {
        'creationDate': '2019-03-17T15:35:40.591Z',
        'question': ObjectId('5c8e47943ad86943f22d6aa1'),
        'type': 'REGULATOR',
        'rating': 1,
        'normalized': 0.2
      },
      {
        'creationDate': '2019-03-17T15:16:00.915Z',
        'question': ObjectId('5c8e47993ad86943f22d6aa4'),
        'type': 'FAVORITE',
        'favoriteItem': ObjectId('5c8e487a3ad86943f22d6aed')
      },
      {
        'creationDate': '2019-03-17T15:36:32.903Z',
        'id': 2,
        'question': ObjectId('5c8e479d3ad86943f22d6aa7'),
        'type': 'RANKING',
        'rankedItems': [
          '5c8e48ab3ad86943f22d6afd',
          '5c8e48a93ad86943f22d6afa',
          '5c8e48a53ad86943f22d6af7',
          '5c8e48b03ad86943f22d6b00'
        ]
      }
    ],
    'creationDate': '2019-03-17T15:37:08.107Z',
    'lastUpdate': '2019-03-17T15:37:08.107Z'
  },
  {
    '_id': ObjectId('d101e506b0764241cc86c36f'),
    'domain': ObjectId('5c8e48df3ad86943f22d6b0d'),
    'client': ObjectId('5c8e48ef3ad86943f22d6b12'),
    'version': ObjectId('3bffa9a8651390118574dbe9'),
    'survey': ObjectId('5c8e478a3ad86943f22d6a92'),
    'answers': [
      {
        'creationDate': '2019-03-17T15:20:40.636Z',
        'question': ObjectId('5c8e478c3ad86943f22d6a98'),
        'type': 'LIKE',
        'liked': true
      },
      {
        'creationDate': '2019-03-17T15:11:07.086Z',
        'question': ObjectId('5c8e478f3ad86943f22d6a9b'),
        'type': 'LIKEDISLIKE',
        'liked': true
      },
      {
        'creationDate': '2019-03-17T15:18:50.928Z',
        'question': ObjectId('5c8e47913ad86943f22d6a9e'),
        'type': 'CHOICE',
        'choice': null
      },
      {
        'creationDate': '2019-03-17T15:08:39.559Z',
        'question': ObjectId('5c8e47943ad86943f22d6aa1'),
        'type': 'REGULATOR',
        'rating': 1,
        'normalized': 0.2
      },
      {
        'creationDate': '2019-03-17T15:14:17.814Z',
        'question': ObjectId('5c8e47993ad86943f22d6aa4'),
        'type': 'FAVORITE',
        'favoriteItem': ObjectId('5c8e48743ad86943f22d6ae7')
      },
      {
        'creationDate': '2019-03-17T14:55:52.808Z',
        'id': 3,
        'question': ObjectId('5c8e479d3ad86943f22d6aa7'),
        'type': 'RANKING',
        'rankedItems': [
          '5c8e48a93ad86943f22d6afa',
          '5c8e48b03ad86943f22d6b00',
          '5c8e48a53ad86943f22d6af7',
          '5c8e48ab3ad86943f22d6afd'
        ]
      }
    ],
    'creationDate': '2019-03-17T15:24:48.495Z',
    'lastUpdate': '2019-03-17T15:24:48.495Z'
  },
  {
    '_id': ObjectId('babbf6aa6f5ee97d808d564b'),
    'domain': ObjectId('5c8e48df3ad86943f22d6b0d'),
    'client': ObjectId('5c8e48ef3ad86943f22d6b12'),
    'version': ObjectId('3bffa9a8651390118574dbe9'),
    'survey': ObjectId('5c8e478a3ad86943f22d6a92'),
    'answers': [
      {
        'creationDate': '2019-03-17T19:29:55.926Z',
        'question': ObjectId('5c8e478c3ad86943f22d6a98'),
        'type': 'LIKE',
        'liked': true
      },
      {
        'creationDate': '2019-03-17T19:27:46.367Z',
        'question': ObjectId('5c8e478f3ad86943f22d6a9b'),
        'type': 'LIKEDISLIKE',
        'liked': true
      },
      {
        'creationDate': '2019-03-17T19:36:47.502Z',
        'question': ObjectId('5c8e47913ad86943f22d6a9e'),
        'type': 'CHOICE',
        'choice': ObjectId('5c8e47e23ad86943f22d6ab6')
      },
      {
        'creationDate': '2019-03-17T19:42:20.009Z',
        'question': ObjectId('5c8e47943ad86943f22d6aa1'),
        'type': 'REGULATOR',
        'rating': 5,
        'normalized': 1
      },
      {
        'creationDate': '2019-03-17T19:31:51.084Z',
        'question': ObjectId('5c8e47993ad86943f22d6aa4'),
        'type': 'FAVORITE',
        'favoriteItem': ObjectId('5c8e487a3ad86943f22d6aed')
      },
      {
        'creationDate': '2019-03-17T19:45:21.711Z',
        'id': 4,
        'question': ObjectId('5c8e479d3ad86943f22d6aa7'),
        'type': 'RANKING',
        'rankedItems': [
          '5c8e48ab3ad86943f22d6afd',
          '5c8e48a93ad86943f22d6afa',
          '5c8e48a53ad86943f22d6af7',
          '5c8e48b03ad86943f22d6b00'
        ]
      }
    ],
    'creationDate': '2019-03-17T19:48:47.357Z',
    'lastUpdate': '2019-03-17T19:48:47.357Z'
  }
]

module.exports = votes