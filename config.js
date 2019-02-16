const path = require('path')

const determineURL = () => {
  if (process.env.HOST && process.env.HTTPS) {
    return `https://${process.env.HOST}`
  }

  if(process.env.HOST && !process.env.HTTPS) {
    return `http://${process.env.HOST}`
  }

  if(process.env.HOST === '' && process.env.HTTPS) {
    return 'https://localhost'
  }

  return 'http://localhost'
}

// prefix server settings with OPE_ to avoid naming conflicts with vue.js
module.exports = {
  app: {
    host: process.env.OPE_HOST || 'localhost',
    rootURL: determineURL(),
    https: process.env.OPE_HTTPS || false,
    port: process.env.OPE_PORT || 3000,
    jwtSecret: process.env.OPE_SECRET,
    imageFolder: 'static/images',
    defaultFolder: 'static/images/default',
    clientCacheTime: 1000 * 60 * 30,
    questionCacheTime: 1000 * 60,
    playground: '/playground',
    endpoint: '/graphql',
  },
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 27017,
    name: process.env.DB_NAME || 'openproductevaluation',
  },
  seeder: {
    database: {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 27017,
      name: process.env.DB_NAME || 'openproductevaluation',
    },
    inputPath: path.resolve(__dirname, './seeds/data'),
    dropDatabase: true,
  },
}