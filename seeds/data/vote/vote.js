const getObjectID = require('../../helper.js')

const votes = [
  {
    _id: getObjectID('vote1'),
    creationDate: new Date(),
    lastUpdate: new Date(),
    context: getObjectID('context1'),
    answers: [
      {
        question: getObjectID('question1'),
        code: '',
      },
      {
        question: getObjectID('question4'),
        liked: true,
      },
      {
        question: getObjectID('question5'),
        liked: false,
      },
      {
        question: getObjectID('question10'),
        rating: 1.0,
        normalized: 0.00001123323234234234,
      },
    ],
  },
]

module.exports = votes
