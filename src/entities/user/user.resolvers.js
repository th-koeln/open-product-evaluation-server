const { getMatchingId, createHashFromId } = require('../../utils/idStore')
const {
  isUser, isAdmin, userIdIsMatching, encodeUser,
} = require('../../utils/authUtils')

module.exports = {
  Query: {
    users: async (parent, args, { request, models }, info) => {
      try {
        const { auth } = request
        if (!isUser(auth)) { throw new Error('Not authorized or no permissions.') }
        if (isAdmin(auth)) return await models.user.get({})
        return await models.user.get({ _id: auth.user.id })
      } catch (e) {
        throw e
      }
    },
    user: async (parent, { userID }, { request, models }, info) => {
      try {
        const { auth } = request
        const matchingId = getMatchingId(userID)
        if (!userIdIsMatching(auth, matchingId)) { throw new Error('Not authorized or no permissions.') }
        return (await models.user.get({ _id: matchingId }))[0]
      } catch (e) {
        throw e
      }
    },
  },
  Mutation: {
    createUser: async (parent, { data }, { models }, info) => {
      try {
        const updatedData = data
        updatedData.email = updatedData.email.toLowerCase()
        const newUser = await models.user.insert(updatedData)
        return {
          user: newUser,
          token: encodeUser(createHashFromId(newUser.id), newUser.isAdmin),
        }
      } catch (e) {
        throw e
      }
    },
    updateUser: async (parent, { data, userID }, { request, models }, info) => {
      try {
        const { auth } = request
        const matchingId = getMatchingId(userID)
        if (!userIdIsMatching(auth, matchingId)) { throw new Error('Not authorized or no permissions.') }
        const [updatedUser] = await models.user.update({ _id: matchingId }, data)
        // TODO:
        //  - notify subscription
        return { user: updatedUser }
      } catch (e) {
        throw e
      }
    },
    deleteUser: async (parent, { userID }, { request, models }, info) => {
      try {
        const { auth } = request
        const matchingId = getMatchingId(userID)
        if (!userIdIsMatching(auth, matchingId)) { throw new Error('Not authorized or no permissions.') }
        const result = await models.user.delete({ _id: matchingId })
        // TODO:
        //  - notify subscription
        return { success: result.n > 0 }
      } catch (e) {
        throw e
      }
    },
    login: async (parent, { data }, { models }, info) => {
      try {
        const [user] = await models.user.get({ email: data.email.toLowerCase() })
        if (user.password !== data.password) { throw new Error('Email or password wrong.') }
        return {
          user,
          token: encodeUser(createHashFromId(user.id), user.isAdmin),
        }
      } catch (e) {
        throw e
      }
    },
  },
  User: {
    id: async (parent, args, context, info) => createHashFromId(parent.id),
  },
}
