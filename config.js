const env = (process.env.NODE_ENV || 'development').toString() // 'dev' or 'test'
const path = require('path')
const shortID = require('shortid')

const secret = shortID.generate()

const common = {
  host: process.env.host || 'localhost',
  https: process.env.HTTPS || false,
  port: parseInt(process.env.PORT, 10) || 3000,
  jwtSecret: process.env.DEV_SECRET || secret,
  imageFolder: process.env.IMAGE_FOLDER || 'static/images',
  defaultFolder: process.env.DEFAULT_FOLDER || 'static/images/default',
  clientCacheTime: process.env.CLIENT_CACHE_TIME || 1000 * 60 * 30,
  questionCacheTime: process.env.QUESTION_CACHE_TIME || 1000 * 60,
  playground: process.env.PLAYGROUND || '/playground',
  endpoint: process.env.endpoint || '/graphql',
}

const hostURL = () => {
  if (process.env.HTTPS === 'true') {
    return `https://${common.host}`
  }
  return `http://${common.host}`
}

const socketURL = () => {
  const port = process.env.port || 3000
  if (process.env.HTTPS === 'true') {
    return `wss://${common.host}:${common.port}`
  }
  return `ws://${common.host}:${port}`
}

const development = {
  app: {
    ...common,
    rootURL: process.env.ROOT_URL || hostURL(),
    socketURL: process.env.SOCKET_URL || socketURL(),
  },
  db: {
    host: process.env.DEV_DB_HOST || 'localhost',
    port: parseInt(process.env.DEV_DB_PORT, 10) || 27017,
    name: process.env.DEV_DB_NAME || 'openproductevaluation',
  },
  seeder: {
    database: {
      host: process.env.DEV_DB_HOST || 'localhost',
      port: parseInt(process.env.DEV_DB_PORT, 10) || 27017,
      name: process.env.DEV_DB_NAME || 'openproductevaluation',
    },
    inputPath: path.resolve(__dirname, './seeds/data'),
    dropDatabase: true,
  },
}

const test = {
  app: {
    ...common,
    rootURL: process.env.ROOT_URL || hostURL(),
    socketURL: process.env.SOCKET_URL || socketURL(),
    jwtSecret: 'testsecret',
  },
  db: {
    host: process.env.TEST_DB_HOST || 'localhost',
    port: parseInt(process.env.TEST_DB_PORT, 10) || 27017,
    name: process.env.TEST_DB_NAME || 'openproductevaluation',
  },
  seeder: {
    database: {
      host: process.env.TEST_DB_HOST || 'localhost',
      port: parseInt(process.env.TEST_DB_PORT, 10) || 27017,
      name: process.env.TEST_DB_NAME || 'openproductevaluation',
    },
    inputPath: path.resolve(__dirname, './seeds/data'),
    dropDatabase: true,
  },
}

const production = {
  app: {
    ...common,
    rootURL: process.env.ROOT_URL || hostURL(),
    socketURL: process.env.SOCKET_URL || socketURL(),
    jwtSecret: 'testsecret',
  },
  db: {
    host: process.env.TEST_DB_HOST || 'localhost',
    port: parseInt(process.env.TEST_DB_PORT, 10) || 27017,
    name: process.env.TEST_DB_NAME || 'openproductevaluation',
  },
  seeder: {
    database: {
      host: process.env.TEST_DB_HOST || 'localhost',
      port: parseInt(process.env.TEST_DB_PORT, 10) || 27017,
      name: process.env.TEST_DB_NAME || 'openproductevaluation',
    },
    inputPath: path.resolve(__dirname, './seeds/data'),
    dropDatabase: true,
  },
}

const config = {
  development,
  test,
  production,
}

module.exports = config[env]
