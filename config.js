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

module.exports = {
  app: {
    host: process.env.HOST || 'localhost',
    rootURL: determineURL(),
    https: process.env.HTTPS || false,
    port: process.env.PORT || 3000,
    jwtSecret: process.env.SECRET,
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