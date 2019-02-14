const path = require('path')
const config = require('./config')

module.exports = {
  configureWebpack: {
    resolve: {
      alias: {
        '@':  path.resolve(__dirname, './src/views/'),
      },
    },
    entry: {
      app: path.resolve(__dirname, './src/views/main.js')
    }
  },
  devServer: {
    https: config.app.https === 'true',
    proxy: `${config.app.rootURL}:${config.app.port}`
  },
  css: {
    loaderOptions: {
      sass: {
        data: '@import "@/scss/variables.scss";',
      },
    },
  },
}
