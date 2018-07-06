const userSchema = require('./user.schema')
const dbLoader = require('../../utils/dbLoader')

module.exports = () => {
  const User = dbLoader.getDB().model('user', userSchema, 'user')

  const isEmailFree = async email => await User.count({ email }) === 0

  return Object.freeze({
    get: async (find, limit, offset, sort) => {
      try {
        const users = await User.find(find).limit(limit).skip(offset).sort(sort)
        if (users.length === 0) throw new Error('No user found.')
        return users
      } catch (e) {
        throw e
      }
    },
    insert: async (object) => {
      try {
        if (await isEmailFree(object.email)) return (await new User(object).save())
        throw new Error('Email already in use. Could not create user.')
      } catch (e) {
        throw e
      }
    },
    update: async (where, data) => {
      try {
        if (Object.prototype.hasOwnProperty.call(data, 'email') && !(await isEmailFree(data.email))) throw new Error('Email already in use. Could not update user.')
        const result = await User.updateMany(where, data)
        if (result.nMatched === 0) throw new Error('User not found.')
        if (result.nModified === 0) throw new Error('User update failed.')
        const updatedUsers = await User.find(where)
        return updatedUsers
      } catch (e) {
        throw e
      }
    },
    delete: async (where) => {
      try {
        const result = await User.deleteMany(where)
        if (result.n === 0) throw new Error('User deletion failed.')
        // TODO:
        // Delete Surveys
        // Delete Contexts if no other user
        // Delete device reference to user and device if no user
        return result
      } catch (e) {
        throw e
      }
    },
  })
}
