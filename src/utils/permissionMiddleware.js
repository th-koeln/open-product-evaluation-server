const {
  rule, shield, or, allow,
} = require('graphql-shield')

const { ADMIN, USER } = require('./roles')

const isAuthenticated = rule()(async (parent, args, { request }, info) => request.auth !== null)

const isAdmin = rule()(async (parent, args, { request }, info) => request.auth.role === ADMIN)

const isUser = rule()(async (parent, args, { request }, info) => request.auth.role === USER)

// const isClient = rule()(async (parent, args, ctx, info) => ctx.auth.role === CLIENT)


const permissions = shield({
  Query: {
    domains: isAuthenticated,
    domain: isAuthenticated,
    state: isAuthenticated,
    clients: isAuthenticated,
    client: isAuthenticated,
    surveys: or(isAdmin, isUser),
    survey: or(isAdmin, isUser),
    users: or(isAdmin, isUser),
    user: or(isAdmin, isUser),
    votes: isAuthenticated,
  },
  Mutation: {
    createDomain: or(isAdmin, isUser),
    updateDomain: isAuthenticated,
    deleteDomain: or(isAdmin, isUser),
    createState: isAuthenticated,
    updateState: isAuthenticated,
    deleteState: isAuthenticated,
    createClient: allow,
    updateClient: isAuthenticated,
    deleteClient: isAuthenticated,
    createBonusImage: or(isAdmin, isUser),
    updateBonusImage: or(isAdmin, isUser),
    deleteBonusImage: or(isAdmin, isUser),
    createQuestion: or(isAdmin, isUser),
    updateQuestion: or(isAdmin, isUser),
    deleteQuestion: or(isAdmin, isUser),
    createItem: or(isAdmin, isUser),
    updateItem: or(isAdmin, isUser),
    deleteItem: or(isAdmin, isUser),
    createLabel: or(isAdmin, isUser),
    updateLabel: or(isAdmin, isUser),
    deleteLabel: or(isAdmin, isUser),
    createChoice: or(isAdmin, isUser),
    updateChoice: or(isAdmin, isUser),
    deleteChoice: or(isAdmin, isUser),
    createSurvey: or(isAdmin, isUser),
    updateSurvey: or(isAdmin, isUser),
    deleteSurvey: or(isAdmin, isUser),
    createUser: allow,
    updateUser: or(isAdmin, isUser),
    deleteUser: or(isAdmin, isUser),
    login: allow,
    createAnswer: isAuthenticated,
  },
  Domain: {
    owners: or(isAdmin, isUser),
  },
  Client: {
    owners: or(isAdmin, isUser),
  },
})

module.exports = permissions
