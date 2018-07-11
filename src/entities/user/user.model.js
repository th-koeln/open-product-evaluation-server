const userModel = {}
module.exports = userModel

const userSchema = require('./user.schema')
const dbLoader = require('../../utils/dbLoader')
const surveyModel = require('../survey/survey.model')
const contextModel = require('../context/context.model')

const User = dbLoader.getDB().model('user', userSchema, 'user')

const isEmailFree = async email => await User.count({ email }) === 0

userModel.get = async (find, limit, offset, sort) => {
  try {
    const users = await User.find(find).limit(limit).skip(offset).sort(sort)
    if (users.length === 0) throw new Error('No User found.')
    return users
  } catch (e) {
    throw e
  }
}

userModel.insert = async (object) => {
  try {
    if (await isEmailFree(object.email)) return (await new User(object).save())
    throw new Error('Email already in use. Could not create user.')
  } catch (e) {
    throw e
  }
}

userModel.update = async (where, data) => {
  try {
    if (Object.prototype.hasOwnProperty.call(data, 'email') && !(await isEmailFree(data.email))) throw new Error('Email already in use. Could not update user.')
    const result = await User.updateMany(where, data)
    if (result.nMatched === 0) throw new Error('No User found.')
    if (result.nModified === 0) throw new Error('User update failed.')
    const updatedUsers = await User.find(where)
    return updatedUsers
  } catch (e) {
    throw e
  }
}

userModel.delete = async (where) => {
  try {
    const deletedUsers = await User.find(where)
    if (deletedUsers.length === 0) throw new Error('No User found.')
    const result = await User.deleteMany(where)
    if (result.n === 0) throw new Error('User deletion failed.')

    const userIds = deletedUsers.reduce((acc, user) => [...acc, user.id], [])

    if (userIds.length > 0) {
      /** Delete Surveys of this user * */
      try {
        await surveyModel.delete({ creator: { $in: userIds } })
      } catch (e) {
        // TODO:
        // ggf. Modul erstellen, welches fehlgeschlagene DB-Zugriffe
        // in bestimmten abständen wiederholt
        // (nur für welche, die nicht ausschlaggebend für erfolg der query sind)
        console.log(e)
      }
      /** Update Contexts of this user * */
      try {
        await contextModel.update({}, { $pull: { owners: { $in: userIds } } })
      } catch (e) {
        // TODO:
        // ggf. Modul erstellen, welches fehlgeschlagene DB-Zugriffe
        // in bestimmten abständen wiederholt
        // (nur für welche, die nicht ausschlaggebend für erfolg der query sind)
        console.log(e)
      }
      /** Delete Contexts without any user * */
      try {
        await contextModel.delete({ owners: { $exists: true, $size: 0 } })
      } catch (e) {
        // TODO:
        // ggf. Modul erstellen, welches fehlgeschlagene DB-Zugriffe
        // in bestimmten abständen wiederholt
        // (nur für welche, die nicht ausschlaggebend für erfolg der query sind)
        console.log(e)
      }
    }

    return result
  } catch (e) {
    throw e
  }
}
