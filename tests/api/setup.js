require('dotenv').config()

const { seedDatabase } = require('mongo-seeding')
const chai = require('chai')
const config = require('../../config')

chai.should()


beforeEach(async () => seedDatabase(config.seeder))
