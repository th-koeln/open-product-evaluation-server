const authUtils = require('../../utils/authUtils')
const userModel = require('./user.model')()
const idStore = require('../../utils/idStore')
const { isUser, isAdmin, userIdIsMatching } = require('../../utils/authUtils')

module.exports = {
  Query: {
    users: async (parent, args, { request }, info) => {
      try {
        const { auth } = request
        if (!isUser(auth)) { throw new Error('Not authorized or no permissions.') }
        if (isAdmin(auth)) return await userModel.get({})
        return await userModel.get({ _id: idStore.getMatchingId(auth.user.id) })
      } catch (e) {
        throw e
      }
    },
    user: async (parent, { userID }, { request }, info) => {
      try {
        const { auth } = request
        if (!userIdIsMatching(auth, userID)) { throw new Error('Not authorized or no permissions.') }
        return (await userModel.get({ _id: idStore.getMatchingId(userID) }))[0]
      } catch (e) {
        throw e
      }
    },
  },
  Mutation: {
    createUser: async (parent, { data }, context, info) => {
      try {
        const newUser = await userModel.insert(data)
        return {
          user: newUser,
          token: authUtils.encodeUser(idStore.createHashFromId(newUser.id), newUser.isAdmin),
        }
      } catch (e) {
        throw e
      }
    },
    updateUser: async (parent, { data, userID }, { request }, info) => {
      try {
        const { auth } = request
        if (!userIdIsMatching(auth, userID)) { throw new Error('Not authorized or no permissions.') }
        const matchingId = idStore.getMatchingId(userID)
        const [updatedUser] = await userModel.update({ _id: matchingId }, data)
        // TODO:
        //  - notify subscription
        return { user: updatedUser }
      } catch (e) {
        throw e
      }
    },
    deleteUser: async (parent, { userID }, { request }, info) => {
      try {
        const { auth } = request
        if (!userIdIsMatching(auth, userID)) { throw new Error('Not authorized or no permissions.') }
        const matchingId = idStore.getMatchingId(userID)
        const result = await userModel.delete({ _id: matchingId })
        // TODO:
        //  - notify subscription
        return { success: result.n > 0 }
      } catch (e) {
        throw e
      }
    },
    login: async (parent, { data }, context, info) => {
      try {
        const [user] = await userModel.get({ email: data.email })
        if (user.password !== data.password) { throw new Error('Email or password wrong.') }
        return {
          user,
          token: authUtils.encodeUser(idStore.createHashFromId(user.id), user.isAdmin),
        }
      } catch (e) {
        throw e
      }
    },
  },
  User: {
    id: async (parent, args, context, info) => idStore.createHashFromId(parent.id),
  },
}
