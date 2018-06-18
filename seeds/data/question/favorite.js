const getObjectID = require('../../helper.js')

const questions = [
  {
    _id: getObjectID('question2'),
    creationDate: new Date(),
    lastUpdate: new Date(),
    type: 'FAVORITE',
    value: 'Bitte favorisieren Sie ein Element aus dieser Liste',
    description: null,
    items: [
      {
        label: 'Objekt 1',
        image: null,
        code: '',
      },
      {
        label: 'Objekt 2',
        image: null,
        code: '',
      },
    ],
  },
]

module.exports = questions
