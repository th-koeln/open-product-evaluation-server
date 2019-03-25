const users = require('../../../seeds/data/user/user')
const surveys = require('../../../seeds/data/survey/survey')
const questions = require('../../../seeds/data/question/question')
const domains = require('../../../seeds/data/domain/domain')
const { Seeder } = require('mongo-seeding')
const config = require('../../../../config')
const { unauthRequest } = require('../../helper/requests')
const { getSeedID } = require('../../helper/helpers')
const {
  domainAmountQuery,
  domainsQuery,
  domainQuery,
  stateQuery,
  createDomainMutation,
  updateDomainMutation,
  deleteDomainMutation,
  setDomainOwnerMutation,
  removeDomainOwnerMutation,
  setStateMutation,
  removeStateMutation
} = require('../../queries/domain.queries')

const seeder = new Seeder(config.seeder)
const collections = seeder.readCollectionsFromPath(config.seeder.inputPath)


describe('Unauthorized', () => {
  beforeEach(async () => {
    await seeder.import(collections)
  })

  describe('should not', async () => {
    it('get the amount of domains', async () => {
      const query = domainAmountQuery()
      const res = await unauthRequest(query)
      const { data, errors } = res

      expect(data.domainAmount).toBeNull()
      expect(errors.length).toBeGreaterThan(0)
    })
    it('get any domain when querying for domains', async () => {
      const query = domainsQuery()
      const { data, errors } = await unauthRequest(query)

      expect(data.domains).toBeNull()
      expect(errors.length).toBeGreaterThan(0)
    })
    it('get domain when querying for a specific domain', async () => {
      const query = domainQuery(getSeedID(domains[0]))
      const { data, errors } = await unauthRequest(query)

      expect(data).toBeNull()
      expect(errors.length).toBeGreaterThan(0)
    })
    it('create domain', async () => {
      const query = createDomainMutation('TestDomain')
      const res = await unauthRequest(query)
      const { data, errors } = res

      expect(data).toBeNull()
      expect(errors.length).toBeGreaterThan(0)
    })
    it('update name of domain', async () => {
      const query = updateDomainMutation(getSeedID(domains[0]),
        { name: 'newName' },
      )
      const { data, errors } = await unauthRequest(query)

      expect(data).toBeNull()
      expect(errors.length).toBeGreaterThan(0)
    })
    it('update isPublic of domain', async () => {
      const query = updateDomainMutation(getSeedID(domains[0]),
        { isPublic: false },
      )
      const { data, errors } = await unauthRequest(query)

      expect(data).toBeNull()
      expect(errors.length).toBeGreaterThan(0)
    })
    it('update activeQuestion of domain', async () => {
      const query = updateDomainMutation(getSeedID(domains[0]),
        { activeQuestion: getSeedID(questions[0]) },
      )
      const { data, errors } = await unauthRequest(query)

      expect(data).toBeNull()
      expect(errors.length).toBeGreaterThan(0)
    })
    it('update activeSurvey of domain', async () => {
      const query = updateDomainMutation(getSeedID(domains[0]),
        { activeSurvey: getSeedID(surveys[1]) },
      )
      const { data, errors } = await unauthRequest(query)

      expect(data).toBeNull()
      expect(errors.length).toBeGreaterThan(0)
    })
    it('set owner for domain', async () => {
      const query = setDomainOwnerMutation(getSeedID(domains[0]), users[0].email)
      const { data, errors } = await unauthRequest(query)

      expect(data).toBeNull()
      expect(errors.length).toBeGreaterThan(0)
    })
    it('remove owner from domain', async () => {
      const query = removeDomainOwnerMutation(getSeedID(domains[0]), getSeedID(users[1]))
      const { data, errors } = await unauthRequest(query)

      expect(data).toBeNull()
      expect(errors.length).toBeGreaterThan(0)
    })
    it('delete domain', async () => {
      const query = deleteDomainMutation(getSeedID(domains[0]))
      const { data, errors } = await unauthRequest(query)

      expect(data).toBeNull()
      expect(errors.length).toBeGreaterThan(0)
    })
    it('get state of domain', async () => {
      const query = stateQuery(getSeedID(domains[0]), 'link')
      const { data, errors } = await unauthRequest(query)

      expect(data).toBeNull()
      expect(errors.length).toBeGreaterThan(0)
    })
    it('set state for domain', async () => {
      const query = setStateMutation(getSeedID(domains[0]), 'key', 'value')
      const { data, errors } = await unauthRequest(query)

      expect(data).toBeNull()
      expect(errors.length).toBeGreaterThan(0)
    })
    it('remove state from domain', async () => {
      const query = removeStateMutation(getSeedID(domains[0]), 'link')
      const { data, errors } = await unauthRequest(query)

      expect(data).toBeNull()
      expect(errors.length).toBeGreaterThan(0)
    })
  })
})
