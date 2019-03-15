const _ = require('underscore')
const {
  SUB_VOTES,
  SUB_ANSWERS,
  SUB_DOMAIN,
  SUB_CLIENT,
  SUB_USER,
} = require('./channels')
const { UPDATE, DELETE, INSERT } = require('./events')
const { createAndPersistSummaryForVersion } = require('../entities/results/summary.creator')

const filterUnimportantAttributes = attributes => attributes.filter(key => key[0] !== '_' && key !== 'lastUpdate' && key !== 'creationDate')

// eslint-disable-next-line
const keysAreEqual = (updatedArray, oldArray) => JSON.stringify(updatedArray) !== JSON.stringify(oldArray)

const getChangedAttributes = (updatedObject, oldObject) => {
  const keysFromUpdated = filterUnimportantAttributes(Object.keys(updatedObject))
  const keysFromOld = filterUnimportantAttributes(Object.keys(oldObject))

  const keysOnlyInUpdated = _.difference(keysFromUpdated, keysFromOld)
  const keysOnlyInOld = _.difference(keysFromOld, keysFromUpdated)
  const differentKeys = [...keysOnlyInUpdated, ...keysOnlyInOld]

  const sharedKeys = _.without(keysFromUpdated, ...differentKeys)
  sharedKeys.forEach((key) => {
    if (keysAreEqual(updatedObject[key], oldObject[key])) { differentKeys.push(key) }
  })

  return (differentKeys.length > 0) ? differentKeys : null
}

module.exports = (eventEmitter, pubsub, models) => {
  const notifyUser = (event, user, changedAttributes) => {
    pubsub.publish(SUB_USER, {
      userUpdate: {
        event,
        user,
        changedAttributes,
      },
    })
  }

  const notifyDomain = (event, domain, changedAttributes, stateKey) => {
    pubsub.publish(SUB_DOMAIN, {
      domainUpdate: {
        event,
        domain,
        changedAttributes,
        stateKey,
      },
    })
  }

  const notifyClient = (event, client, changedAttributes) => {
    pubsub.publish(SUB_CLIENT, {
      clientUpdate: {
        event,
        client,
        changedAttributes,
      },
    })
  }

  const notifyAnswer = (event, answer, changedAttributes, clientId, domainId) => {
    pubsub.publish(SUB_ANSWERS, {
      answerUpdate: {
        event,
        answer,
        changedAttributes,
        clientId,
        domainId,
      },
    })
  }

  const notifyVote = (event, vote, surveyId, summaries) => {
    pubsub.publish(SUB_VOTES, {
      voteUpdate: {
        event,
        vote,
        surveyId,
        summaries,
      },
    })
  }

  eventEmitter.on('User/Update', (updatedUsers, oldUsers) => {
    updatedUsers.forEach((user, index) => {
      const changedAttributes = getChangedAttributes(user.toObject(), oldUsers[index].toObject())

      notifyUser(UPDATE, user, changedAttributes)
    })
  })

  eventEmitter.on('User/Delete', (deletedUsers) => {
    deletedUsers.forEach((user) => {
      notifyUser(DELETE, user)
    })
  })

  eventEmitter.on('Survey/Update', (updatedSurveys, oldSurveys) => {
    updatedSurveys.forEach(async (survey, index) => {
      const changedAttributes = getChangedAttributes(
        survey.toObject(),
        oldSurveys[index].toObject(),
      )

      if (changedAttributes && !(changedAttributes.length === 1 && changedAttributes.includes('votes'))) {
        try {
          const domains = await models.domain.get({ activeSurvey: survey.id })

          domains.forEach(domain => notifyDomain(UPDATE, domain, ['activeSurvey']))
        } catch (e) { }
      }
    })
  })

  eventEmitter.on('Domain/Update', (updatedDomains, oldDomains) => {
    updatedDomains.forEach(async (domain, index) => {
      const changedAttributes = getChangedAttributes(
        domain.toObject(),
        oldDomains[index].toObject(),
      )

      notifyDomain(UPDATE, domain, changedAttributes)

      try {
        const clients = await models.client.get({ domain: domain.id })
        clients.forEach((client) => {
          notifyClient(UPDATE, client, ['domain'])
        })
      } catch (e) { }
    })
  })

  eventEmitter.on('Domain/Delete', (deletedDomains) => {
    deletedDomains.forEach(async (domain) => {
      notifyDomain(DELETE, domain)
    })
  })

  eventEmitter.on('State/Set', async (state, domainId) => {
    try {
      const [domain] = await models.domain.get({ _id: domainId })
      const changedAttributes = ['states']

      notifyDomain(UPDATE, domain, changedAttributes, state.key)
    } catch (e) { }
  })

  eventEmitter.on('State/Remove', async (state, domainId) => {
    try {
      const [domain] = await models.domain.get({ _id: domainId })
      const changedAttributes = ['states']

      notifyDomain(UPDATE, domain, changedAttributes, state.key)
    } catch (e) { }
  })

  eventEmitter.on('Client/Update', async (updatedClients, oldClients) => {
    updatedClients.forEach(async (client, index) => {
      const changedAttributes = getChangedAttributes(
        client.toObject(),
        oldClients[index].toObject(),
      )

      notifyClient(UPDATE, client, changedAttributes)

      if (changedAttributes && changedAttributes.includes('domain')) {
        if (client.domain) {
          try {
            const [updatedDomain] = await models.domain.get({ _id: client.domain })

            notifyDomain(UPDATE, updatedDomain, ['clients'])
          } catch (e) {
            console.log(e)
          }
        }

        if (oldClients[index].domain) {
          try {
            const [oldDomain] = await models.domain.get({ _id: oldClients[index].domain })

            notifyDomain(UPDATE, oldDomain, ['clients'])
          } catch (e) {
            console.log(e)
          }
        }
      }
    })
  })

  eventEmitter.on('Client/Delete', (deletedClients) => {
    deletedClients.forEach(async (client) => {
      notifyClient(DELETE, client)

      if (client.domain) {
        try {
          const [domain] = await models.domain.get({ _id: client.domain })

          notifyDomain(UPDATE, domain, ['clients'])
        } catch (e) { }
      }
    })
  })

  eventEmitter.on('Answer/Insert', (answer, domainId, clientId) => {
    notifyAnswer(INSERT, answer, null, clientId, domainId)
  })

  eventEmitter.on('Answer/Update', (answer, oldAnswer, domainId, clientId) => {
    const changedAttributes = getChangedAttributes(answer, oldAnswer)

    notifyAnswer(UPDATE, answer, changedAttributes, clientId, domainId)
  })

  eventEmitter.on('Answer/Delete', (domainId, clientId) => {
    notifyAnswer(DELETE, null, null, clientId, domainId)
  })

  eventEmitter.on('Vote/Insert', async (vote) => {
    const summaries = await createAndPersistSummaryForVersion(vote.version, models)
    notifyVote(INSERT, vote, vote.survey, summaries)
  })

  eventEmitter.on('Vote/Delete', async (votes) => {
    await Promise.all(votes.map(async (vote) => {
      const summaries = await createAndPersistSummaryForVersion(vote.version, models)
      notifyVote(INSERT, vote, vote.survey, summaries)
    }))
  })
}
