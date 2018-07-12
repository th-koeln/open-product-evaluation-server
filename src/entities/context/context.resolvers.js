const userModel = require('../user/user.model')
const deviceModel = require('../device/device.model')
const contextModel = require('../context/context.model')
const surveyModel = require('../survey/survey.model')
const questionModel = require('../question/question.model')
const idStore = require('../../utils/idStore')
const { isUser, isDevice, isAdmin } = require('../../utils/authUtils')

const hasStatePremissions = async (auth, data, args) => {
  const [surveyContext] = await contextModel.get({ _id: idStore.getMatchingId(args.contextID) })
  if (!(isDevice(auth) || isAdmin(auth) || (isUser(auth) && (surveyContext.owners
    .indexOf(idStore.getMatchingId(auth.user.id)) > -1)))) { return false }
  if (isDevice(auth)) {
    const [device] = await deviceModel.get({ _id: idStore.getMatchingId(auth.device.id) })
    const { context: deviceContext } = device
    if (surveyContext.id !== deviceContext) { return false }
  }
  return true
}

const keyExists = (object, keyName) =>
  Object.prototype.hasOwnProperty.call(object.toObject(), keyName)

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
          const [device] = await deviceModel.get({ _id: idStore.getMatchingId(auth.device.id) })
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
        const [surveyContext] = await contextModel
          .get({ _id: idStore.getMatchingId(args.contextID) })
        if (isAdmin(auth) || (isUser(auth)
          && surveyContext.owners.indexOf(idStore.getMatchingId(auth.user.id)) > -1)
          || (isDevice(auth)
          && ((await deviceModel.get({ context: surveyContext.id })).map(device => `${device.id}`)
            .indexOf(idStore.getMatchingId(auth.device.id)) > -1))) {
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
        const [surveyContext] = await contextModel
          .get({ _id: idStore.getMatchingId(args.contextID) })
        if (isAdmin(auth) ||
            surveyContext.owners.indexOf(idStore.getMatchingId(auth.user.id)) > -1) {
          return surveyContext.states.find(state => state.key === args.key)
        } else if (isDevice(auth)) {
          const [device] = await deviceModel.get({ _id: idStore.getMatchingId(auth.device.id) })
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
        const [contextFromID] = await contextModel
          .get({ _id: idStore.getMatchingId(args.contextID) })
        if (isAdmin(auth) ||
          contextFromID.owners.indexOf(idStore.getMatchingId(auth.user.id)) > -1) {
          const inputData = args.data
          if (inputData.activeSurvey) {
            inputData.activeSurvey = idStore.getMatchingId(inputData.activeSurvey)
            await surveyModel.get({ _id: inputData.activeSurvey })
          }
          if (inputData.activeQuestion) {
            inputData.activeQuestion = idStore.getMatchingId(inputData.activeQuestion)
            await questionModel.get({ _id: inputData.activeQuestion })
          }
          const [newContext] = await contextModel
            .update({ _id: idStore.getMatchingId(args.contextID) }, inputData)
          return { context: newContext }
        }
        throw new Error('Not authorized or no permissions.')
      } catch (e) {
        throw e
      }
    },
    deleteContext: async (parent, args, context, info) => {
      try {
        const { auth } = context.request
        if (!isUser(auth)) { throw new Error('Not authorized or no permissions.') }
        const [contextFromID] = await contextModel
          .get({ _id: idStore.getMatchingId(args.contextID) })
        if (isAdmin(auth) ||
          contextFromID.owners.indexOf(idStore.getMatchingId(auth.user.id)) > -1) {
          await contextModel.delete({ _id: idStore.getMatchingId(args.contextID) })
          return { status: 'success' }
        }
        throw new Error('Not authorized or no permissions.')
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
        const newState = await contextModel
          .insertState(idStore.getMatchingId(args.contextID), data.key, data.value)
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
        const newState = await contextModel
          .updateState(idStore.getMatchingId(args.contextID), data.key, data.value)
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
        const deletedState = await contextModel
          .deleteState(idStore.getMatchingId(args.contextID), data.key)
        return { state: deletedState }
      } catch (e) {
        throw e
      }
    },
  },
  Context: {
    owners: async (parent, args, context, info) => {
      if (!keyExists(parent, 'owners') || parent.owners === null || parent.owners.length === 0) return null
      const { auth } = context.request
      const [surveyContext] = await contextModel.get({ _id: parent.id })
      if (!(isAdmin(auth) || (surveyContext.owners
        .indexOf(idStore.getMatchingId(auth.user.id)) > -1))) { throw new Error('Not authorized or no permissions.') }
      return userModel.get({ _id: { $in: parent.owners } })
    },
    devices: async (parent, args, context, info) => {
      if (!keyExists(parent, 'devices') || parent.devices === null || parent.devices.length === 0) return null
      return deviceModel.get({ context: parent.id })
    },
    activeSurvey: async (parent, args, context, info) => {
      if (!keyExists(parent, 'activeSurvey') || parent.activeSurvey === null || parent.activeSurvey === '') return null
      return (await surveyModel.get({ _id: parent.activeSurvey }))[0]
    },
    activeQuestion: async (parent, args, context, info) => {
      if (!keyExists(parent, 'activeQuestion') || parent.activeQuestion === null || parent.activeQuestion === '') return null
      return (await questionModel.get({ _id: parent.activeQuestion }))[0]
    },
    states: async (parent, args, context, info) => {
      if (!keyExists(parent, 'states') || parent.states === null || parent.states.length === 0) return null
      return parent.states
    },
    id: async (parent, args, context, info) => idStore.createHashFromId(parent.id),
  },
}
