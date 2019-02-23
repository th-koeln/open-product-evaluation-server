const _ = require('underscore')
const clientSchema = require('./client.schema')

module.exports = (db, eventEmitter) => {
  const clientModel = {}

  const Client = db.model('client', clientSchema, 'client')

  clientModel.get = async (find, limit, offset, sort) => {
    try {
      const clients = await Client.find(find)
        .collation({ locale: 'en' })
        .limit(limit)
        .skip(offset)
        .sort(sort)
      if (clients.length === 0) {
        throw new Error('No clients found')
      }
      return clients
    } catch (e) {
      throw e
    }
  }

  clientModel.insert = async (object) => {
    try {
      const client = await new Client(object).save()

      eventEmitter.emit('Client/Insert', client)

      return client
    } catch (e) {
      throw e
    }
  }

  clientModel.update = async (where, data) => {
    try {
      const currentClients = await Client.find(where)
      const result = await Client.updateMany(where, data, { runValidators: true })
      if (result.nMatched === 0) {
        throw new Error('Client not found.')
      }
      if (result.nModified === 0) {
        throw new Error('Client update failed.')
      }

      const currentIds = currentClients.map(client => client.id)
      const updatedClients = await Client.find({ _id: { $in: currentIds } })

      const sortObj = updatedClients
        .reduce((acc, client, index) => ({ ...acc, [client.id]: index }), {})
      const currentClientsSorted = _.sortBy(currentClients, client => sortObj[client.id])

      eventEmitter.emit('Client/Update', updatedClients, currentClientsSorted)

      return updatedClients
    } catch (e) {
      throw e
    }
  }

  clientModel.delete = async (where) => {
    try {
      const clients = await Client.find(where)
      const result = await Client.deleteMany(where)
      if (result.n === 0) {
        throw new Error('Client deletion failed.')
      }

      const notDeletedClients = await Client.find(where)
      const deletedClients = clients.filter(client => !notDeletedClients.includes(client))

      if (deletedClients.length > 0) {
        eventEmitter.emit('Client/Delete', deletedClients)
      }

      return result
    } catch (e) {
      throw e
    }
  }

  /** EventEmitter reactions * */
  /** Update Clients of deleted user * */
  eventEmitter.on('User/Delete', async (deletedUsers) => {
    try {
      const deletedUserIds = deletedUsers.map(user => user.id)
      await clientModel.update({}, { $pull: { owners: { $in: deletedUserIds } } })
    } catch (e) {
      // TODO:
      // ggf. Modul erstellen, welches fehlgeschlagene DB-Zugriffe
      // in bestimmten abständen wiederholt
      // (nur für welche, die nicht ausschlaggebend für erfolg der query sind)
      console.log(e)
    }
  })

  /** Update Clients referencing deleted Domains * */
  eventEmitter.on('Domain/Delete', async (deletedDomains) => {
    try {
      const deletedIds = deletedDomains.map(domain => domain.id)
      await clientModel.update({ domain: { $in: deletedIds } }, { $unset: { domain: '' } })
    } catch (e) {
      // TODO:
      // ggf. Modul erstellen, welches fehlgeschlagene DB-Zugriffe
      // in bestimmten abständen wiederholt
      // (nur für welche, die nicht ausschlaggebend für erfolg der query sind)
      console.log(e)
    }
  })

  return Object.freeze(clientModel)
}
