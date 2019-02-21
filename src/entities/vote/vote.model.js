const voteSchema = require('./vote.schema')

module.exports = (db, eventEmitter) => {
  const voteModel = {}

  const Vote = db.model('vote', voteSchema, 'vote')

  voteModel.get = async (find, limit, offset, sort) => {
    try {
      const votes = await Vote.find(find)
        .collation({ locale: 'en' })
        .limit(limit)
        .skip(offset)
        .sort(sort)
      if (votes.length === 0) { throw new Error('No Vote found') }
      return votes
    } catch (e) {
      throw e
    }
  }

  voteModel.insert = async (object) => {
    try {
      const vote = await new Vote(object).save()

      eventEmitter.emit('Vote/Insert', vote)

      return vote
    } catch (e) {
      throw e
    }
  }

  voteModel.update = async (where, data) => {
    try {
      const result = await Vote.updateMany(where, data, { runValidators: true })
      if (result.nMatched === 0) { throw new Error('No Vote found.') }
      if (result.nModified === 0) { throw new Error('Vote update failed.') }
      const updatedVotes = await Vote.find(where)

      eventEmitter.emit('Vote/Update', updatedVotes)

      return updatedVotes
    } catch (e) {
      throw e
    }
  }

  voteModel.delete = async (where) => {
    try {
      const votes = await Vote.find(where)
      if (votes.length === 0) { throw new Error('No Vote found.') }
      const result = await Vote.deleteMany(where)
      if (result.n === 0) { throw new Error('Vote deletion failed.') }

      eventEmitter.emit('Vote/Delete', votes)

      return result
    } catch (e) {
      throw e
    }
  }

  /** EventEmitter reactions * */

  /** Delete Votes of deleted Versions * */
  eventEmitter.on('Version/Delete', async (deletedVersions) => {
    try {
      const deletedIds = deletedVersions.map(version => version.id)
      await voteModel.delete({ version: { $in: deletedIds } })
    } catch (e) {
      // TODO:
      // ggf. Modul erstellen, welches fehlgeschlagene DB-Zugriffe
      // in bestimmten abständen wiederholt
      // (nur für welche, die nicht ausschlaggebend für erfolg der query sind)
      console.log(e)
    }
  })

  return Object.freeze(voteModel)
}
