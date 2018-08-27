// run dotenv (needs to run as early as possible)
require('dotenv').config()

const config = require('../config.js')
const { GraphQLServer } = require('graphql-yoga')
const { express: middleware } = require('graphql-voyager/middleware')
const { fileLoader, mergeTypes, mergeResolvers } = require('merge-graphql-schemas')
const path = require('path')
const dbLoader = require('./utils/dbLoader')
const express = require('express')
const { EventEmitter } = require('events')
const AuthMiddleware = require('./utils/authMiddleware')
const AnswerStore = require('./utils/authMiddleware')
const permissions = require('./utils/permissionMiddleware')

dbLoader.connectDB().then(() => {
  const eventEmitter = new EventEmitter()
  const models = dbLoader.getModels(eventEmitter)
  const authMiddleware = AuthMiddleware(models)
  const answerStore = AnswerStore(models, eventEmitter)
  const schemaList = fileLoader(path.join(__dirname, './entities/**/*.graphql'))
  const resolverList = fileLoader(path.join(__dirname, './entities/**/*.resolvers.js'))

  const server = new GraphQLServer({
    typeDefs: mergeTypes(schemaList, { all: true }),
    resolvers: mergeResolvers(resolverList, { all: true }),
    middlewares: [permissions],
    context: req => ({
      ...req,
      models,
      answerStore,
    }),
  })

  server.express.use(authMiddleware)
  server.express.use('/voyager', middleware({ endpointUrl: '/' }))
  server.express.use('/static', express.static('static'))

  server.start({ port: config.app.port }, () => console.log(`Server is running on ${config.app.rootURL}:${config.app.port}`))
})
