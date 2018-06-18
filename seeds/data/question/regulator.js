const getObjectID = require('../../helper.js')

const questions = [
  {
    _id: getObjectID('question10'),
    creationDate: new Date(),
    lastUpdate: new Date(),
    type: 'REGULATOR',
    items: null,
    value: 'Wie sehr sind Sie mit dieser Frage zufrieden?',
    description: null,
    labels: [
      {
        label: 'Zufrieden',
        image: null,
        value: 0.0,
      },
      {
        label: 'Unzufrieden',
        image: null,
        value: 10.0,
      },
    ],
    stepSize: 1.0,
    min: 0.0,
    max: 10.0,
    default: 5.0,
  },
]

module.exports = questions
