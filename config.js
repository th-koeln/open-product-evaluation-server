const env = process.env.NODE_ENV || 'dev' // 'dev' or 'test'
const path = require('path')
const shortID = require('shortid')

const secret = shortID.generate()

const dev = {
  app: {
    rootURL: process.env.ROOT_URL || 'http://localhost',
    port: parseInt(process.env.DEV_APP_PORT, 10) || 3000,
    jwtSecret: process.env.DEV_SECRET || secret,
    imageFolder: process.env.IMAGE_FOLDER || 'public/images',
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
    rootURL: process.env.ROOT_URL || 'http://localhost',
    port: parseInt(process.env.TEST_APP_PORT, 10) || 3000,
    jwtSecret: process.env.TEST_SECRET || secret,
    imageFolder: process.env.IMAGE_FOLDER || 'public/images',
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
  dev,
  test,
}

module.exports = config[env]
