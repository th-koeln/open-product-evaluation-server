// run dotenv (needs to run as early as possible)


require('dotenv').config()

const config = require('../config.js')
const { GraphQLServer } = require('graphql-yoga')
const { express: middleware } = require('graphql-voyager/middleware')
const { fileLoader, mergeTypes, mergeResolvers } = require('merge-graphql-schemas')
const path = require('path')
const dbLoader = require('./utils/dbLoader')
const express = require('express')
const permissions = require('./utils/permissionMiddleware')

const getAuth = ({ request: { auth } }) => {
  if (auth) return auth
  return null
}

dbLoader.connectDB().then(() => {
  const authMiddleware = require('./utils/authMiddleware')
  const schemaList = fileLoader(path.join(__dirname, './entities/**/*.graphql'))
  const resolverList = fileLoader(path.join(__dirname, './entities/**/*.resolvers.js'))

  const server = new GraphQLServer({
    typeDefs: mergeTypes(schemaList, { all: true }),
    resolvers: mergeResolvers(resolverList, { all: true }),
    /* mocks: {
      DateTime: () => new Date(),
    }, */
    middlewares: [permissions],
    context: req => ({
      ...req,
      auth: getAuth(req), // Bind user to Context
    }),
  })

  server.express.use(authMiddleware)
  server.express.use('/voyager', middleware({ endpointUrl: '/' }))
  server.express.use('/static', express.static('static'))

  server.start({ port: config.app.port }, () => console.log(`Server is running on ${config.app.rootURL}:${config.app.port}`))
})
