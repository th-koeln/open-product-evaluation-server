// run dotenv (needs to run as early as possible)
require('dotenv').config()

const { GraphQLServer, PubSub } = require('graphql-yoga')
const { express: middleware } = require('graphql-voyager/middleware')
const { fileLoader, mergeTypes, mergeResolvers } = require('merge-graphql-schemas')
const path = require('path')
const express = require('express')
const { EventEmitter } = require('events')
const { readFileSync, pathExistsSync } = require('fs-extra')
const dbLoader = require('./utils/database')
const config = require('../config.js')
const AuthMiddleware = require('./middleware/auth.middelware')
const AnswerStore = require('./store/answer.store')
const ImageStore = require('./store/image.store')
const permissions = require('./middleware/permission.middelware')
const pubsubEmitter = require('./subscriptions/emitter')

dbLoader.connectDB().then(() => {
  const httpsKeyPath = path.join(__dirname, '../https.key')
  const httpsCrtPath = path.join(__dirname, '../https.crt')

  const eventEmitter = new EventEmitter()
  const models = dbLoader.getModels(eventEmitter)
  const authMiddleware = AuthMiddleware(models)
  const answerStore = AnswerStore(models, eventEmitter)
  const imageStore = ImageStore(models, eventEmitter)
  const schemaList = fileLoader(path.join(__dirname, './entities/**/*.graphql'))
  const resolverList = fileLoader(path.join(__dirname, './entities/**/*.resolvers.js'))

  const pubsub = new PubSub()
  pubsubEmitter(eventEmitter, pubsub, models)

  const server = new GraphQLServer({
    typeDefs: mergeTypes(schemaList, { all: true }),
    resolvers: mergeResolvers(resolverList, { all: true }),
    middlewares: [permissions],
    context: req => ({
      ...req,
      models,
      answerStore,
      imageStore,
      pubsub,
    }),
  })

  // set lazy CORS
  server.express.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
    next()
  })

  server.express.use(authMiddleware)

  if (process.argv.includes('--voyager')) {
    server.express.use('/voyager', middleware({ endpointUrl: '/graphql' }))
  }

  const options = {
    port: config.app.port,
    playground: (process.argv.includes('--playground')) ? config.app.playground : false,
    endpoint: config.app.endpoint,
  }

  if (config.app.https) {
    if (!pathExistsSync(httpsKeyPath) || !pathExistsSync(httpsCrtPath)) {
      throw new Error('Https key or certificate missing.')
    }

    options.https = {
      key: readFileSync(httpsKeyPath),
      cert: readFileSync(httpsCrtPath),
    }
  }

  server.express.use(`${config.app.imageRoute}/:imageHash.:imageType`, async (req, res) => {
    const { imageHash, imageType } = req.params
    const { size } = req.query

    try {
      const neededSize = (size) ? Number(size) : 992
      const [image] = await models.image.get({
        hash: imageHash,
        type: imageType,
      })

      const imagePath = await imageStore.getImagePath(image, neededSize)
      res.sendFile(imagePath, `${imageHash}.${imageType}`)
    } catch (e) {
      res.status(404).send()
    }
  })

  server.express.use('/', express.static('./dist'))
  server.express.get('/', (req, res) => {
    res.sendFile(path.resolve('./dist/index.html'))
  })

  server.start(options, () => console.log(`Server is running on ${config.app.rootURL}:${config.app.port}`))
})
