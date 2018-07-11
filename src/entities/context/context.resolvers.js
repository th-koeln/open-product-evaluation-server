const userModel = require('../user/user.model')
const deviceModel = require('../device/device.model')
const contextModel = require('../context/context.model')
const surveyModel = require('../survey/survey.model')
const questionModel = require('../question/question.model')
const idStore = require('../../utils/idStore')
const { isUser, isDevice, isAdmin } = require('../../utils/authUtils')

const hasStatePremissions = async (auth, data, args) => {
  const surveyContext = (await contextModel
    .get({ _id: args.contextID }))[0]
  if (!(isAdmin(auth) || (surveyContext.owners
    .indexOf(idStore.getMatchingId(auth.user.id)) > -1) || isDevice(auth))) { return false }
  if (isDevice(auth)) {
    const device = await (deviceModel.get({ _id: idStore.getMatchingId(auth.device.id) }))[0]
    const { context: deviceContext } = device
    if (surveyContext.id !== deviceContext) { return false }
  }
  return true
}

module.exports = {
  Query: {
    contexts: async (parent, args, context, info) => {
      try {
        const { auth } = context.request
        if (isAdmin(auth)) {
          const contexts = await contextModel
            .get()
          return contexts
        } else if (isUser(auth)) {
          const contexts = await contextModel
            .get({ owners: idStore.getMatchingId(auth.user.id) })
          return contexts
        } else if (isDevice(auth)) {
          const device = await (deviceModel.get({ _id: idStore.getMatchingId(auth.device.id) }))[0]
          const { context: deviceContext } = device
          const contexts = await contextModel
            .get({ _id: deviceContext })
          return contexts
        }
        throw new Error('Not authorized or no permissions.')
      } catch (e) {
        throw e
      }
    },
    context: async (parent, args, context, info) => {
      try {
        const { auth } = context.request
        const surveyContext = (await contextModel
          .get({ _id: args.contextID }))[0]
        if (isAdmin(auth)) {
          return surveyContext
        } else if (isUser(auth)
          && surveyContext.owners.indexOf(idStore.getMatchingId(auth.user.id)) > -1) {
          return surveyContext
        }
        throw new Error('Not authorized or no permissions.')
      } catch (e) {
        throw e
      }
    },
    state: async (parent, args, context, info) => {
      try {
        const { auth } = context.request
        const surveyContext = (await contextModel
          .get({ _id: args.contextID }))[0]
        if (isAdmin(auth) ||
            surveyContext.owners.indexOf(idStore.getMatchingId(auth.user.id)) > -1) {
          return surveyContext.states.find(state => state.key === args.key)
        } else if (isDevice(auth)) {
          const device = await (deviceModel.get({ _id: idStore.getMatchingId(auth.device.id) }))[0]
          const { context: deviceContext } = device
          if (surveyContext.id === deviceContext) {
            return surveyContext.states.find(state => state.key === args.key)
          }
        }
        throw new Error('Not authorized or no permissions.')
      } catch (e) {
        throw e
      }
    },
  },
  Mutation: {
    createContext: async (parent, args, context, info) => {
      try {
        const { auth } = context.request
        if (!isUser(auth)) { throw new Error('Not authorized or no permissions.') }
        const newContext = {
          owners: [idStore.getMatchingId(auth.user.id)],
          ...args.data,
        }
        const insertedContext = (await contextModel.insert(newContext))
        return {
          context: insertedContext,
        }
      } catch (e) {
        throw e
      }
    },
    updateContext: async (parent, args, context, info) => {
      try {
        const { auth } = context.request
        if (!isUser(auth)) { throw new Error('Not authorized or no permissions.') }
        const contextFromID = (await contextModel.get({ _id: args.contextID }))[0]
        if (isAdmin(auth) ||
          contextFromID.owners.indexOf(idStore.getMatchingId(auth.user.id)) > -1) {
          const newContext = (await contextModel.update({ _id: args.contextID }, args.data))[0]
          return { context: newContext }
        }
        throw new Error('No permissions.')
      } catch (e) {
        throw e
      }
    },
    deleteContext: async (parent, args, context, info) => {
      try {
        const { auth } = context.request
        if (!isUser(auth)) { throw new Error('Not authorized or no permissions.') }
        const contextFromID = (await contextModel.get({ _id: args.contextID }))[0]
        if (isAdmin(auth) ||
          contextFromID.owners.indexOf(idStore.getMatchingId(auth.user.id)) > -1) {
          await contextModel.delete({ _id: args.contextID })
          return { status: 'success' }
        }
        throw new Error('No permissions.')
      } catch (e) {
        throw e
      }
    },
    createState: async (parent, args, context, info) => {
      try {
        const { auth } = context.request
        const { data } = args
        const hasAccess = await hasStatePremissions(auth, data, args)
        if (!hasAccess) { throw new Error('Not authorized or no permissions.') }
        const newState = await contextModel.insertState(args.contextID, data.key, data.value)
        return { state: newState }
      } catch (e) {
        throw e
      }
    },
    updateState: async (parent, args, context, info) => {
      try {
        const { auth } = context.request
        const { data } = args
        const hasAccess = await hasStatePremissions(auth, data, args)
        if (!hasAccess) { throw new Error('Not authorized or no permissions.') }
        const newState = await contextModel.updateState(args.contextID, data.key, data.value)
        return { state: newState }
      } catch (e) {
        throw e
      }
    },
    deleteState: async (parent, args, context, info) => {
      try {
        const { auth } = context.request
        const { data } = args
        const hasAccess = await hasStatePremissions(auth, data, args)
        if (!hasAccess) { throw new Error('Not authorized or no permissions.') }
        const deletedState = await contextModel.deleteState(args.contextID, data.key)
        return { state: deletedState }
      } catch (e) {
        throw e
      }
    },
  },
  Context: {
    owners: async (parent, args, context, info) => {
      const { auth } = context.request
      const surveyContext = (await contextModel
        .get({ _id: args.contextID }))[0]
      if (!(isAdmin(auth) || (surveyContext.owners
        .indexOf(idStore.getMatchingId(auth.user.id)) > -1))) { throw new Error('Not authorized or no permissions.') }
      return userModel.get({ _id: { $in: parent.owners } })
    },
    devices: async (parent, args, context, info) => deviceModel.get({ context: parent.id }),
    activeSurvey: async (parent, args, context, info) => surveyModel.get({ _id: parent.id }),
    activeQuestion: async (parent, args, context, info) => questionModel.get({ _id: parent.id }),
  },
}
