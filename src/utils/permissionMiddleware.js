const {
  rule, shield, or, allow,
} = require('graphql-shield')

const { ADMIN, USER } = require('./roles')

const isAuthenticated = rule()(async (parent, args, { request }, info) => request.auth !== null)

const isAdmin = rule()(async (parent, args, { request }, info) => request.auth.role === ADMIN)

const isUser = rule()(async (parent, args, { request }, info) => request.auth.role === USER)

// const isDevice = rule()(async (parent, args, ctx, info) => ctx.auth.role === DEVICE)


const permissions = shield({
  Query: {
    contexts: isAuthenticated,
    context: isAuthenticated,
    state: isAuthenticated,
    devices: isAuthenticated,
    device: isAuthenticated,
    surveys: or(isAdmin, isUser),
    survey: or(isAdmin, isUser),
    users: or(isAdmin, isUser),
    user: or(isAdmin, isUser),
    votes: isAuthenticated,
  },
  Mutation: {
    createContext: or(isAdmin, isUser),
    updateContext: or(isAdmin, isUser),
    deleteContext: or(isAdmin, isUser),
    createState: isAuthenticated,
    updateState: isAuthenticated,
    deleteState: isAuthenticated,
    createDevice: allow,
    updateDevice: isAuthenticated,
    deleteDevice: isAuthenticated,
    createImage: or(isAdmin, isUser),
    updateImage: or(isAdmin, isUser),
    createLikeQuestion: or(isAdmin, isUser),
    updateLikeQuestion: or(isAdmin, isUser),
    createLikeDislikeQuestion: or(isAdmin, isUser),
    updateLikeDislikeQuestion: or(isAdmin, isUser),
    createChoiceQuestion: or(isAdmin, isUser),
    updateChoiceQuestion: or(isAdmin, isUser),
    createRegulatorQuestion: or(isAdmin, isUser),
    updateRegulatorQuestion: or(isAdmin, isUser),
    createRankingQuestion: or(isAdmin, isUser),
    updateRankingQuestion: or(isAdmin, isUser),
    createFavoriteQuestion: or(isAdmin, isUser),
    updateFavoriteQuestion: or(isAdmin, isUser),
    deleteQuestion: or(isAdmin, isUser),
    createSurvey: or(isAdmin, isUser),
    updateSurvey: or(isAdmin, isUser),
    deleteSurvey: or(isAdmin, isUser),
    createUser: isAdmin,
    updateUser: or(isAdmin, isUser),
    deleteUser: or(isAdmin, isUser),
    login: allow,
    createAnswer: isAuthenticated,
  },
  Context: {
    owners: or(isAdmin, isUser),
  },
  Device: {
    owners: or(isAdmin, isUser),
  },
})

module.exports = permissions
