// run dotenv (needs to run as early as possible)
require('dotenv').config()

// eslint-disable-next-line import/no-extraneous-dependencies
const { Seeder } = require('mongo-seeding')
const config = require('../config')

const seeder = new Seeder(config.seeder)
const collections = seeder.readCollectionsFromPath(config.seeder.inputPath)

seeder
  .import(collections)
  .then(() => {
    console.log('success')
  })
  .catch(err => {
    console.log(err)
  })
