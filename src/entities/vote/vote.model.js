const voteModel = {}
module.exports = voteModel

const voteSchema = require('./vote.schema')
const dbLoader = require('../../utils/dbLoader')

const Vote = dbLoader.getDB().model('vote', voteSchema, 'vote')

voteModel.get = async (find, limit, offset, sort) => {
  try {
    const votes = await Vote.find(find).limit(limit).skip(offset).sort(sort)
    if (votes.length === 0) throw new Error('No Votes found')
    return votes
  } catch (e) {
    throw e
  }
}

voteModel.insert = async (object) => {

}

voteModel.update = async (where, data) => {

}

voteModel.delete = async (where) => {

}
