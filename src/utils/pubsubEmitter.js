/**
 * Created by Dennis Dubbert on 03.09.18.
 */

const {
  SUB_CONTEXT,
  SUB_DEVICE,
  SUB_USER,
} = require('./pubsubChannels')
const { UPDATE, DELETE } = require('./subscriptionEvents')
const _ = require('underscore')

const filterUnimportantAttributes = attributes =>
  attributes.filter(key => key[0] !== '_' && key !== 'lastUpdate' && key !== 'creationDate')

const getChangedAttributes = (updatedObject, oldObject) => {
  const keysFromUpdated = filterUnimportantAttributes(Object.keys(updatedObject))
  const keysFromOld = filterUnimportantAttributes(Object.keys(oldObject))

  const keysOnlyInUpdated = _.difference(keysFromUpdated, keysFromOld)
  const keysOnlyInOld = _.difference(keysFromOld, keysFromUpdated)
  const differentKeys = [...keysOnlyInUpdated, ...keysOnlyInOld]

  const sharedKeys = _.without(keysFromUpdated, ...differentKeys)
  sharedKeys.forEach((key) => {
    if (updatedObject[key] !== oldObject[key]) differentKeys.push(key)
  })

  return differentKeys
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

  const notifyContext = (event, context, changedAttributes) => {
    pubsub.publish(SUB_CONTEXT, {
      contextUpdate: {
        event,
        context,
        changedAttributes,
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

  eventEmitter.on('Context/Update', (updatedContexts, oldContexts) => {
    updatedContexts.forEach(async (context, index) => {
      const changedAttributes =
        getChangedAttributes(context.toObject(), oldContexts[index].toObject())

      notifyContext(UPDATE, context, changedAttributes)
    })
  })

  eventEmitter.on('Context/Delete', (deletedContexts) => {
    deletedContexts.forEach(async (context) => {
      notifyContext(DELETE, context)
    })
  })

  eventEmitter.on('Device/Update', async (updatedDevices, oldDevices) => {
    updatedDevices.forEach(async (device, index) => {
      const changedAttributes =
        getChangedAttributes(device.toObject(), oldDevices[index].toObject())

      notifyDevice(UPDATE, device, changedAttributes)

      if (changedAttributes.includes('context')) {
        try {
          const updatedContext = await models.context.get({ _id: device.context })

          notifyContext(UPDATE, updatedContext, ['devices'])
        } catch (e) {
          console.log(e)
        }

        if (oldDevices[index].context) {
          try {
            const oldContext = await models.context.get({ _id: oldDevices[index].context })

            notifyContext(UPDATE, oldContext, ['devices'])
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

      if (device.context) {
        const context = await models.context.get({ _id: device.context })

        notifyContext(UPDATE, context, ['devices'])
      }
    })
  })
}
