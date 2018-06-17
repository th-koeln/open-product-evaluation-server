const getObjectID = require('../../helper.js')

const questions = [
  {
    _id: getObjectID('question9'),
    creationDate: new Date(),
    lastUpdate: new Date(),
    type: 'RANKING',
    value: 'Ordnen Sie diese Elemente nach ihrem persönlichen Wert.',
    description: null,
    items: [
      {
        label: 'Objekt 1',
        image: null,
        code: ''
      },
      {
        label: 'Objekt 2',
        image: null,
        code: ''
      }
    ]
  }
]

module.exports = questions