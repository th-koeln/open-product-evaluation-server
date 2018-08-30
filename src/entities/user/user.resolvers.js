const { getMatchingId, createHashFromId } = require('../../utils/idStore')
const { encodeUser } = require('../../utils/authUtils')
const { ADMIN, USER } = require('../../utils/roles')

module.exports = {
  Query: {
    users: async (parent, args, { request, models }, info) => {
      try {
        const { auth } = request
        switch (auth.role) {
          case ADMIN:
            return await models.user.get({})

          case USER:
            return models.user.get({ _id: auth.user.id })

          default:
            throw new Error('Not authorized or no permissions.')
        }
      } catch (e) {
        throw e
      }
    },
    user: async (parent, { userID }, { request, models }, info) => {
      try {
        const { auth } = request
        const matchingId = getMatchingId(userID)
        switch (auth.role) {
          case ADMIN:
            return (await models.user.get({ _id: matchingId }))[0]
          case USER:
            if (matchingId === auth.id) return (await models.user.get({ _id: matchingId }))[0]
            break
          default:
            throw new Error('Not authorized or no permissions.')
        }
        throw new Error('Not authorized or no permissions.')
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

        if (auth.role === ADMIN || auth.id === matchingId) {
          const [updatedUser] = await models.user.update({ _id: matchingId }, data)
          return { user: updatedUser }
        }

        throw new Error('Not authorized or no permissions.')
      } catch (e) {
        throw e
      }
    },
    deleteUser: async (parent, { userID }, { request, models }, info) => {
      try {
        const { auth } = request
        const matchingId = getMatchingId(userID)

        if (auth.role === ADMIN || auth.id === matchingId) {
          const result = await models.user.delete({ _id: matchingId })
          return { success: result.n > 0 }
        }

        throw new Error('Not authorized or no permissions.')
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
