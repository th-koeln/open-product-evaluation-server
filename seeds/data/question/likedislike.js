const getObjectID = require('../../helper.js')

const questions = [
  {
    _id: getObjectID('question6'),
    creationDate: new Date(),
    lastUpdate: new Date(),
    type: 'LIKEDISLIKE',
    items: [],
    value: 'Gefällt Ihnen dieses Bild?',
    description: 'Bitte zeigen Sie mit einem "Like" oder "Dislike", ob Ihnen dieses Bild gefällt oder nicht.',
    likeIcon: getObjectID('image1'),
    dislikeIcon: getObjectID('image2'),
  },
  {
    _id: getObjectID('question7'),
    creationDate: new Date(),
    lastUpdate: new Date(),
    type: 'LIKEDISLIKE',
    items: [],
    value: 'Gefällt Ihnen dieses Objekt?',
    description: 'Bitte zeigen Sie mit einem "Like" oder "Dislike", ob Ihnen dieses Objekt gefällt oder nicht.',
    likeIcon: getObjectID('image1'),
    dislikeIcon: getObjectID('image2'),
  },
  {
    _id: getObjectID('question8'),
    creationDate: new Date(),
    lastUpdate: new Date(),
    type: 'LIKEDISLIKE',
    items: [],
    value: 'Gefällt Ihnen dieses Model?',
    description: 'Bitte zeigen Sie mit einem "Like" oder "Dislike", ob Ihnen dieses Model gefällt oder nicht.',
    likeIcon: getObjectID('image1'),
    dislikeIcon: getObjectID('image2'),
  },
]

module.exports = questions
