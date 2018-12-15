const getObjectID = require('../../helper.js')

const domain = [
  {
    _id: getObjectID('domain1'),
    creationDate: new Date(),
    lastUpdate: new Date(),
    activeQuestion: getObjectID('question4'),
    activeSurvey: getObjectID('survey1'),
    owners: [getObjectID('user1')],
    name: 'Forum Gummersbach',
    states: [],
    isPublic: true,
  },
  {
    _id: getObjectID('domain2'),
    creationDate: new Date(),
    lastUpdate: new Date(),
    activeQuestion: getObjectID('question2'),
    activeSurvey: getObjectID('survey2'),
    owners: [getObjectID('user2')],
    name: 'TH-Koeln: Gummersbach Mensa',
    states: [],
    isPublic: true,
  },
  {
    _id: getObjectID('domain3'),
    creationDate: new Date(),
    lastUpdate: new Date(),
    activeQuestion: getObjectID('question2'),
    activeSurvey: getObjectID('survey3'),
    owners: [getObjectID('user2')],
    name: 'TH-Koeln: Gummersbach Eingang',
    states: [],
    isPublic: true,
  },
]

module.exports = domain
