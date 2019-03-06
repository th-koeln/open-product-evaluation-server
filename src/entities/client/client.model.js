const _ = require('underscore')
const clientSchema = require('./client.schema')
const { TEMPORARY, PERMANENT } = require('../../utils/lifetime')

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

  eventEmitter.on('Client/Update', async (updatedClients) => {
    try {
      const updatedIds = updatedClients.map(client => client.id)
      await clientModel.delete({
        _id: { $in: updatedIds },
        lifetime: PERMANENT,
        owners: { $exists: true, $size: 0 },
      })
    } catch (e) {
      // TODO:
      // ggf. Modul erstellen, welches fehlgeschlagene DB-Zugriffe
      // in bestimmten abständen wiederholt
      // (nur für welche, die nicht ausschlaggebend für erfolg der query sind)
      console.log(e)
    }
  })

  /** EventEmitter reactions * */
  /** Update Clients of deleted user * */
  eventEmitter.on('User/Delete', async (deletedUsers) => {
    try {
      const deletedUserIds = deletedUsers.map(user => user.id)
      await clientModel.update({}, { $pull: { owners: { $in: deletedUserIds } } })
      await clientModel.delete({ lifetime: PERMANENT, owners: { $exists: true, $size: 0 } })
    } catch (e) {
      // TODO:
      // ggf. Modul erstellen, welches fehlgeschlagene DB-Zugriffe
      // in bestimmten abständen wiederholt
      // (nur für welche, die nicht ausschlaggebend für erfolg der query sind)
      console.log(e)
    }
  })

  /** Delete temporary Clients referencing updated Domains, if survey changed * */
  eventEmitter.on('Domain/Update', async (updatedDomains, oldDomains) => {
    try {
      await Promise.all(updatedDomains.map(async (domain, index) => {
        if (oldDomains[index].activeSurvey
          && domain.activeSurvey !== oldDomains[index].activeSurvey) {
          await clientModel.delete({
            domain: domain._id,
            lifetime: TEMPORARY,
          })
        }
      }))
    } catch (e) {}
  })

  /** Update Clients referencing deleted Domains (delete temporary clients) * */
  eventEmitter.on('Domain/Delete', async (deletedDomains) => {
    try {
      const deletedIds = deletedDomains.map(domain => domain.id)
      await clientModel.delete({ domain: { $in: deletedIds }, lifetime: TEMPORARY })
      await clientModel.update({ domain: { $in: deletedIds } }, { $unset: { domain: '' } })
    } catch (e) {
      // TODO:
      // ggf. Modul erstellen, welches fehlgeschlagene DB-Zugriffe
      // in bestimmten abständen wiederholt
      // (nur für welche, die nicht ausschlaggebend für erfolg der query sind)
      console.log(e)
    }
  })

  /** Update Clients referencing deleted Domains * */
  eventEmitter.on('Cache/Client/Delete', async (clientId) => {
    try {
      const [client] = await clientModel.get({ _id: clientId })
      if (client.lifetime === TEMPORARY) {
        await clientModel.delete({ _id: clientId })
      }
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
