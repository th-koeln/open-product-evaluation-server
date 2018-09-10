/**
 * Created by Dennis Dubbert on 03.09.18.
 */

const {
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
}
