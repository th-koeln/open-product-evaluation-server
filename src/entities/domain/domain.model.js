const _ = require('underscore')
const domainSchema = require('./domain.schema')

module.exports = (db, eventEmitter) => {
  const domainModel = {}

  const Domain = db.model('domain', domainSchema, 'domain')

  domainModel.get = async (find, limit, offset, sort) => {
    try {
      const domains = await Domain.find(find)
        .limit(limit)
        .skip(offset)
        .sort(sort)
      if (domains.length === 0) { throw new Error('No domains found') }
      return domains
    } catch (e) {
      throw e
    }
  }

  domainModel.insert = async (object) => {
    try {
      const domain = await new Domain(object).save()

      eventEmitter.emit('Domain/Insert', domain)

      return domain
    } catch (e) {
      throw e
    }
  }

  domainModel.update = async (where, data) => {
    try {
      const currentDomains = await Domain.find(where)
      const result = await Domain.updateMany(where, data)
      if (result.nMatched === 0) { throw new Error('Domain not found.') }
      if (result.nModified === 0) { throw new Error('Domain update failed.') }

      const currentIds = currentDomains.map(domain => domain.id)
      const updatedDomains = await Domain.find({ _id: { $in: currentIds } })

      const sortObj = updatedDomains
        .reduce((acc, domain, index) => ({ ...acc, [domain.id]: index }), {})
      const currentDomainsSorted = _.sortBy(currentDomains, domain => sortObj[domain.id])

      eventEmitter.emit('Domain/Update', updatedDomains, currentDomainsSorted)

      return updatedDomains
    } catch (e) {
      throw e
    }
  }

  domainModel.delete = async (where) => {
    try {
      const domains = await Domain.find(where)
      if (domains.length === 0) { throw new Error('Domain not found.') }
      const result = await Domain.deleteMany(where)
      if (result.n === 0) { throw new Error('Domain deletion failed.') }

      const notDeletedDomains = await Domain.find(where)
      const deletedDomains = domains.filter(domain => !notDeletedDomains.includes(domain))

      if (deletedDomains.length > 0) { eventEmitter.emit('Domain/Delete', deletedDomains) }

      return result
    } catch (e) {
      throw e
    }
  }

  domainModel.insertState = async (domainID, key, value) => {
    try {
      const domainsWithKey = await Domain
        .find({ $and: [{ _id: domainID }, { states: { $elemMatch: { key } } }] })
      if (domainsWithKey.length > 0) { throw new Error('State already exists!') }
      const newDomain = await Domain
        .findByIdAndUpdate(domainID, {
          $push: {
            states: {
              key,
              value,
            },
          },
        }, { new: true })

      const newState = newDomain.states.find(state => state.key === key)

      eventEmitter.emit('State/Insert', newState, domainID)

      return newState
    } catch (e) {
      throw e
    }
  }

  domainModel.updateState = async (domainID, key, value) => {
    try {
      const results = await Domain
        .update({
          _id: domainID,
          'states.key': key,
        }, { 'states.$.value': value })

      if (results.nModified !== 1 || results.ok !== 1) {
        throw new Error('Failed to update!')
      }

      const state = {
        key,
        value,
      }

      eventEmitter.emit('State/Update', state, domainID)

      return state
    } catch (e) {
      throw e
    }
  }

  domainModel.deleteState = async (domainID, key) => {
    try {
      const [domainsWithKey] = await Domain
        .find({ $and: [{ _id: domainID }, { states: { $elemMatch: { key } } }] })
      if (!domainsWithKey) { throw Error('State does not exist!') }

      const deletedState = domainsWithKey.states.find(state => state.key === key)
      const updatedDomain = await Domain
        .findByIdAndUpdate(domainID, { $pull: { states: { key } } }, { new: true })
      if (!updatedDomain) { throw Error('Failed to delete!') }

      eventEmitter.emit('State/Delete', deletedState, domainID)

      return deletedState
    } catch (e) {
      throw e
    }
  }

  /** EventEmitter reactions * */

  /** Update Domains of deleted user * */
  eventEmitter.on('User/Delete', async (deletedUsers) => {
    try {
      const deletedIds = deletedUsers.map(user => user.id)
      await domainModel.update({}, { $pull: { owners: { $in: deletedIds } } })
    } catch (e) {
      // TODO:
      // ggf. Modul erstellen, welches fehlgeschlagene DB-Zugriffe
      // in bestimmten abständen wiederholt
      // (nur für welche, die nicht ausschlaggebend für erfolg der query sind)
      console.log(e)
    }

    /** delete domains without owners * */
    try {
      await domainModel.delete({ owners: { $exists: true, $size: 0 } })
    } catch (e) {
      // TODO:
      // ggf. Modul erstellen, welches fehlgeschlagene DB-Zugriffe
      // in bestimmten abständen wiederholt
      // (nur für welche, die nicht ausschlaggebend für erfolg der query sind)
      console.log(e)
    }
  })

  /** Update Domains referencing deleted Surveys * */
  eventEmitter.on('Survey/Delete', async (deletedSurveys) => {
    try {
      const deletedIds = deletedSurveys.map(survey => survey.id)
      await domainModel.update({ activeSurvey: { $in: deletedIds } }, {
        $unset: {
          activeSurvey: '',
          activeQuestion: '',
        },
      })
    } catch (e) {
      // TODO:
      // ggf. Modul erstellen, welches fehlgeschlagene DB-Zugriffe
      // in bestimmten abständen wiederholt
      // (nur für welche, die nicht ausschlaggebend für erfolg der query sind)
      console.log(e)
    }
  })

  /** Update Domains referencing updated Surveys * */
  eventEmitter.on('Survey/Update', async (updatedSurveys, oldSurveys) => {
    try {
      const inactiveIds = updatedSurveys.reduce((acc, survey, index) => {
        if (!survey.isPublic && oldSurveys[index].isPublic) { return [...acc, survey.id] }
        return acc
      }, [])

      if (inactiveIds.length > 0) {
        await domainModel.update({ activeSurvey: { $in: inactiveIds } }, {
          $unset: {
            activeSurvey: '',
            activeQuestion: '',
          },
        })
      }
    } catch (e) {
      // TODO:
      // ggf. Modul erstellen, welches fehlgeschlagene DB-Zugriffe
      // in bestimmten abständen wiederholt
      // (nur für welche, die nicht ausschlaggebend für erfolg der query sind)
      console.log(e)
    }
  })

  return Object.freeze(domainModel)
}
