// run dotenv (needs to run as early as possible)
require('dotenv').config()

// eslint-disable-next-line import/no-extraneous-dependencies
const { seedDatabase } = require('mongo-seeding')

const config = require('../config')

seedDatabase(config.seeder).then(() => {
  console.log('success')
}).catch((err) => {
  console.log(err)
})
