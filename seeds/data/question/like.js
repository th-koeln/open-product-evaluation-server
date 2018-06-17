const getObjectID = require('../../helper.js')

const questions = [
  {
    _id: getObjectID('question3'),
    creationDate: new Date(),
    lastUpdate: new Date(),
    type: 'LIKE',
    items: [],
    value: 'Gefällt Ihnen dieses Bild?',
    description: 'Bitte zeigen Sie mit einem "Like", ob Ihnen dieses Bild gefällt.',
    likeIcon: getObjectID('image1')
  },
  {
    _id: getObjectID('question4'),
    creationDate: new Date(),
    lastUpdate: new Date(),
    type: 'LIKE',
    items: [],
    value: 'Gefällt Ihnen dieses Objekt?',
    description: 'Bitte zeigen Sie mit einem "Like", ob Ihnen dieses Objekt gefällt.',
    likeIcon: getObjectID('image1')
  },
  {
    _id: getObjectID('question5'),
    creationDate: new Date(),
    lastUpdate: new Date(),
    type: 'LIKE',
    items: [],
    value: 'Gefällt Ihnen dieses Model?',
    description: 'Bitte zeigen Sie mit einem "Like", ob Ihnen dieses Model gefällt.',
    likeIcon: getObjectID('image1')
  }
]

module.exports = questions