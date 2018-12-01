/**
 * Created by Dennis Dubbert on 03.09.18.
 */

const {
  SUB_VOTES,
  SUB_ANSWERS,
  SUB_DOMAIN,
  SUB_DEVICE,
  SUB_USER,
} = require('./pubsubChannels')
const { UPDATE, DELETE, INSERT } = require('./subscriptionEvents')
const _ = require('underscore')

const filterUnimportantAttributes = attributes =>
  attributes.filter(key => key[0] !== '_' && key !== 'lastUpdate' && key !== 'creationDate')

const keysAreEqual =
  (updatedArray, oldArray) => JSON.stringify(updatedArray) !== JSON.stringify(oldArray)

const getChangedAttributes = (updatedObject, oldObject) => {
  const keysFromUpdated = filterUnimportantAttributes(Object.keys(updatedObject))
  const keysFromOld = filterUnimportantAttributes(Object.keys(oldObject))

  const keysOnlyInUpdated = _.difference(keysFromUpdated, keysFromOld)
  const keysOnlyInOld = _.difference(keysFromOld, keysFromUpdated)
  const differentKeys = [...keysOnlyInUpdated, ...keysOnlyInOld]

  const sharedKeys = _.without(keysFromUpdated, ...differentKeys)
  sharedKeys.forEach((key) => {
    if (keysAreEqual(updatedObject[key], oldObject[key])) differentKeys.push(key)
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

  const notifyDevice = (event, device, changedAttributes) => {
    pubsub.publish(SUB_DEVICE, {
      deviceUpdate: {
        event,
        device,
        changedAttributes,
      },
    })
  }

  const notifyAnswer = (event, answer, changedAttributes, deviceId, domainId) => {
    pubsub.publish(SUB_ANSWERS, {
      answerUpdate: {
        event,
        answer,
        changedAttributes,
        deviceId,
        domainId,
      },
    })
  }

  const notifyVote = (event, vote, surveyId) => {
    pubsub.publish(SUB_VOTES, {
      newVote: {
        event,
        vote,
        surveyId,
      },
    })
  }

  eventEmitter.on('User/Update', (updatedUsers, oldUsers) => {
    updatedUsers.forEach((user, index) => {
      const changedAttributes =
        getChangedAttributes(user.toObject(), oldUsers[index].toObject())

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
      const changedAttributes =
        getChangedAttributes(survey.toObject(), oldSurveys[index].toObject())

      if (changedAttributes && !(changedAttributes.length === 1 && changedAttributes.includes('votes'))) {
        const domains = await models.domain.get({ activeSurvey: survey.id })

        domains.forEach(domain => notifyDomain(UPDATE, domain, ['activeSurvey']))
      }
    })
  })

  eventEmitter.on('Domain/Update', (updatedDomains, oldDomains) => {
    updatedDomains.forEach(async (domain, index) => {
      const changedAttributes =
        getChangedAttributes(domain.toObject(), oldDomains[index].toObject())

      notifyDomain(UPDATE, domain, changedAttributes)

      const devices = await models.device.get({ domain: domain.id })
      devices.forEach((device) => {
        notifyDevice(UPDATE, device, ['domain'])
      })
    })
  })

  eventEmitter.on('Domain/Delete', (deletedDomains) => {
    deletedDomains.forEach(async (domain) => {
      notifyDomain(DELETE, domain)
    })
  })

  eventEmitter.on('State/Insert', async (state, domainId) => {
    const [domain] = await models.domain.get({ _id: domainId })
    const changedAttributes = ['states']

    notifyDomain(UPDATE, domain, changedAttributes, state.key)
  })

  eventEmitter.on('State/Update', async (state, domainId) => {
    const [domain] = await models.domain.get({ _id: domainId })
    const changedAttributes = ['states']

    notifyDomain(UPDATE, domain, changedAttributes, state.key)
  })

  eventEmitter.on('State/Delete', async (state, domainId) => {
    const [domain] = await models.domain.get({ _id: domainId })
    const changedAttributes = ['states']

    notifyDomain(UPDATE, domain, changedAttributes, state.key)
  })

  eventEmitter.on('Device/Update', async (updatedDevices, oldDevices) => {
    updatedDevices.forEach(async (device, index) => {
      const changedAttributes =
        getChangedAttributes(device.toObject(), oldDevices[index].toObject())

      notifyDevice(UPDATE, device, changedAttributes)

      if (changedAttributes && changedAttributes.includes('domain')) {
        if (device.domain) {
          try {
            const [updatedDomain] = await models.domain.get({ _id: device.domain })

            notifyDomain(UPDATE, updatedDomain, ['devices'])
          } catch (e) {
            console.log(e)
          }
        }

        if (oldDevices[index].domain) {
          try {
            const [oldDomain] = await models.domain.get({ _id: oldDevices[index].domain })

            notifyDomain(UPDATE, oldDomain, ['devices'])
          } catch (e) {
            console.log(e)
          }
        }
      }
    })
  })

  eventEmitter.on('Device/Delete', (deletedDevices) => {
    deletedDevices.forEach(async (device) => {
      notifyDevice(DELETE, device)

      if (device.domain) {
        const [domain] = await models.domain.get({ _id: device.domain })

        notifyDomain(UPDATE, domain, ['devices'])
      }
    })
  })

  eventEmitter.on('Answer/Insert', (answer, domainId, deviceId) => {
    notifyAnswer(INSERT, answer, null, deviceId, domainId)
  })

  eventEmitter.on('Answer/Update', (answer, oldAnswer, domainId, deviceId) => {
    const changedAttributes = getChangedAttributes(answer, oldAnswer)

    notifyAnswer(UPDATE, answer, changedAttributes, deviceId, domainId)
  })

  eventEmitter.on('Answer/Delete', (domainId, deviceId) => {
    notifyAnswer(DELETE, null, null, deviceId, domainId)
  })

  eventEmitter.on('Vote/Insert', (vote) => {
    notifyVote(INSERT, vote, vote.survey)
  })

  eventEmitter.on('Vote/Delete', (votes) => {
    votes.forEach(vote => notifyVote(DELETE, vote, vote.survey))
  })
}
