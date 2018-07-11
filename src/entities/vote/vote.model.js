const voteModel = {}
module.exports = voteModel

const voteSchema = require('./vote.schema')
const dbLoader = require('../../utils/dbLoader')

const Vote = dbLoader.getDB().model('vote', voteSchema, 'vote')

voteModel.get = async (find, limit, offset, sort) => {
  try {
    const votes = await Vote.find(find).limit(limit).skip(offset).sort(sort)
    if (votes.length === 0) throw new Error('No Vote found')
    return votes
  } catch (e) {
    throw e
  }
}

voteModel.insert = async (object) => {
  try {
    return (await new Vote(object).save())
  } catch (e) {
    throw e
  }
}

voteModel.update = async (where, data) => {
  try {
    const result = await Vote.updateMany(where, data)
    if (result.nMatched === 0) throw new Error('No Vote found.')
    if (result.nModified === 0) throw new Error('Vote update failed.')
    const updatedVotes = await Vote.find(where)
    return updatedVotes
  } catch (e) {
    throw e
  }
}

voteModel.delete = async (where) => {

}
