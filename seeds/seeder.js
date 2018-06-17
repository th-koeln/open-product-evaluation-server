'use strict'

// run dotenv (needs to run as early as possible)
require('dotenv').config()

const config = require('../config')
const { seedDatabase } = require('mongo-seeding')

seedDatabase(config.seeder).then(() => {

  console.log('success')

}).catch(err => {

  console.log(err)

})