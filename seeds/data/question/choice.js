const getObjectID = require('../../helper.js')

const questions = [
  {
    _id: getObjectID('question1'),
    creationDate: new Date(),
    lastUpdate: new Date(),
    type: 'CHOICE',
    items: [],
    value: 'Bitte treffen Sie eine Auswahl:',
    description: null,
    choices: [
      {
        label: 'Auswahl A',
        image: getObjectID('image3'),
        code: ''
      },
      {
        label: 'Auswahl B',
        image: getObjectID('image4'),
        code: ''
      }
    ]
  }
]

module.exports = questions