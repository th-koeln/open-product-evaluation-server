const users = require('../../../seeds/data/user/user')
const surveys = require('../../../seeds/data/survey/survey')
const questions = require('../../../seeds/data/question/question')
const domains = require('../../../seeds/data/domain/domain')
const { Seeder } = require('mongo-seeding')
const config = require('../../../../config')
const { authRequest, unauthRequest } = require('../../helper/requests')
const { getSeedID, getNotMatchingID } = require('../../helper/helpers')
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
} = require('../../requests/domain.requests')
const { loginUserMutation } = require('../../requests/user.requests')

const seeder = new Seeder(config.seeder)
const collections = seeder.readCollectionsFromPath(config.seeder.inputPath)


describe('Admin', () => {
  const user = users[1]
  let jwt = ''

  beforeEach(async () => {
    await seeder.import(collections)
    const query = loginUserMutation(user.email, 'password')
    const { data, errors } = await unauthRequest(query)

    expect(data.login).not.toBeNull()
    expect(errors).toBeUndefined()

    const { login: { token } } = data
    jwt = token
  })

  describe('should', async () => {
    it('get amount of all domains', async () => {
      const query = domainAmountQuery()
      const res = await authRequest(query, jwt)
      const { data, errors } = res

      expect(errors).toBeUndefined()
      expect(data.domainAmount).toBe(2)
    })
    it('get all domains when querying for domains', async () => {
      const query = domainsQuery()
      const { data, errors } = await authRequest(query, jwt)

      expect(errors).toBeUndefined()
      expect(data.domains).toMatchSnapshot()
    })
    it('get owned domain when querying for a specific domain', async () => {
      const query = domainQuery(getSeedID(domains[0]), true)
      const { data, errors } = await authRequest(query, jwt)

      expect(errors).toBeUndefined()
      expect(data.domain).toMatchSnapshot()
    })
    it('get not owned domain when querying for a specific domain', async () => {
      const query = domainQuery(getSeedID(domains[1]), true)
      const { data, errors } = await authRequest(query, jwt)

      expect(errors).toBeUndefined()
      expect(data.domain).toMatchSnapshot()
    })
    it('create domain', async () => {
      const query = createDomainMutation('TestDomain')
      const res = await authRequest(query, jwt)
      const { data, errors } = res

      expect(errors).toBeUndefined()
      expect(data.createDomain).toMatchSnapshot()
    })
    it('update name of owned domain', async () => {
      const query = updateDomainMutation(getSeedID(domains[0]),
        { name: 'newName' },
        true,
      )
      const { data, errors } = await authRequest(query, jwt)

      expect(errors).toBeUndefined()
      expect(data.updateDomain).toMatchSnapshot()
    })
    it('update isPublic of owned domain', async () => {
      const query = updateDomainMutation(getSeedID(domains[0]),
        { isPublic: false },
        true,
      )
      const { data, errors } = await authRequest(query, jwt)

      expect(errors).toBeUndefined()
      expect(data.updateDomain).toMatchSnapshot()
    })
    it('update activeQuestion of owned domain', async () => {
      const query = updateDomainMutation(getSeedID(domains[0]),
        { activeQuestion: getSeedID(questions[0]) },
        true,
      )
      const { data, errors } = await authRequest(query, jwt)

      expect(errors).toBeUndefined()
      expect(data.updateDomain).toMatchSnapshot()
    })
    it('update activeSurvey of owned domain (and reset activeQuestion)', async () => {
      const questionQuery = updateDomainMutation(getSeedID(domains[0]),
        { activeQuestion: getSeedID(questions[0]) },
        true,
      )
      const { data: questionData, errors: questionErrors } = await authRequest(questionQuery, jwt)

      expect(questionErrors).toBeUndefined()
      expect(questionData.updateDomain).toMatchSnapshot()

      const query = updateDomainMutation(getSeedID(domains[0]),
        { activeSurvey: getSeedID(surveys[1]) },
        true,
      )
      const { data, errors } = await authRequest(query, jwt)

      expect(errors).toBeUndefined()
      expect(data.updateDomain).toMatchSnapshot()
    })
    it('remove activeSurvey of owned domain (and reset activeQuestion)', async () => {
      const questionQuery = updateDomainMutation(getSeedID(domains[0]),
        { activeQuestion: getSeedID(questions[0]) },
        true,
      )
      const { data: questionData, errors: questionErrors } = await authRequest(questionQuery, jwt)

      expect(questionErrors).toBeUndefined()
      expect(questionData.updateDomain).toMatchSnapshot()

      const query = updateDomainMutation(getSeedID(domains[0]),
        { activeSurvey: null },
        true,
      )
      const { data, errors } = await authRequest(query, jwt)

      expect(errors).toBeUndefined()
      expect(data.updateDomain).toMatchSnapshot()
    })
    it('update name of not owned domain', async () => {
      const query = updateDomainMutation(getSeedID(domains[1]),
        { name: 'newName' },
        true,
      )
      const { data, errors } = await authRequest(query, jwt)

      expect(errors).toBeUndefined()
      expect(data.updateDomain).toMatchSnapshot()
    })
    it('update isPublic of not owned domain', async () => {
      const query = updateDomainMutation(getSeedID(domains[1]),
        { isPublic: false },
        true,
      )
      const { data, errors } = await authRequest(query, jwt)

      expect(errors).toBeUndefined()
      expect(data.updateDomain).toMatchSnapshot()
    })
    it('update activeQuestion of not owned domain', async () => {
      const query = updateDomainMutation(getSeedID(domains[1]),
        { activeQuestion: getSeedID(questions[6]) },
        true,
      )
      const { data, errors } = await authRequest(query, jwt)

      expect(errors).toBeUndefined()
      expect(data.updateDomain).toMatchSnapshot()
    })
    it('update activeSurvey of not owned domain (and reset activeQuestion)', async () => {
      const questionQuery = updateDomainMutation(getSeedID(domains[1]),
        { activeQuestion: getSeedID(questions[6]) },
        true,
      )
      const { data: questionData, errors: questionErrors } = await authRequest(questionQuery, jwt)

      expect(questionErrors).toBeUndefined()
      expect(questionData.updateDomain).toMatchSnapshot()

      const query = updateDomainMutation(getSeedID(domains[1]),
        { activeSurvey: getSeedID(surveys[0]) },
        true,
      )
      const { data, errors } = await authRequest(query, jwt)

      expect(errors).toBeUndefined()
      expect(data.updateDomain).toMatchSnapshot()
    })
    it('remove activeSurvey of not owned domain (and reset activeQuestion)', async () => {
      const questionQuery = updateDomainMutation(getSeedID(domains[1]),
        { activeQuestion: getSeedID(questions[6]) },
        true,
      )
      const { data: questionData, errors: questionErrors } = await authRequest(questionQuery, jwt)

      expect(questionErrors).toBeUndefined()
      expect(questionData.updateDomain).toMatchSnapshot()

      const query = updateDomainMutation(getSeedID(domains[1]),
        { activeSurvey: null },
        true,
      )
      const { data, errors } = await authRequest(query, jwt)

      expect(errors).toBeUndefined()
      expect(data.updateDomain).toMatchSnapshot()
    })
    it('set owner for owned domain', async () => {
      const query = setDomainOwnerMutation(getSeedID(domains[0]), users[0].email)
      const { data, errors } = await authRequest(query, jwt)

      expect(errors).toBeUndefined()
      expect(data.setDomainOwner).toMatchSnapshot()
    })
    it('remove owner from owned domain (and delete it if the last owner is removed)', async () => {
      const query = removeDomainOwnerMutation(getSeedID(domains[0]), getSeedID(users[1]))
      const { data, errors } = await authRequest(query, jwt)

      expect(errors).toBeUndefined()
      expect(data.removeDomainOwner.success).toBe(true)

      const findQuery = domainQuery(getSeedID(domains[0]),true)
      const { data: findData, errors: findErrors } = await authRequest(findQuery, jwt)

      expect(findData).toBeNull()
      expect(findErrors.length).toBeGreaterThan(0)
    })
    it('set owner for not owned domain', async () => {
      const query = setDomainOwnerMutation(getSeedID(domains[1]), users[1].email)
      const { data, errors } = await authRequest(query, jwt)

      expect(errors).toBeUndefined()
      expect(data.setDomainOwner).toMatchSnapshot()
    })
    it('remove owner from not owned domain (and delete it if the last owner is removed)', async () => {
      const query = removeDomainOwnerMutation(getSeedID(domains[1]), getSeedID(users[0]))
      const { data, errors } = await authRequest(query, jwt)

      expect(errors).toBeUndefined()
      expect(data.removeDomainOwner.success).toBe(true)

      const findQuery = domainQuery(getSeedID(domains[1]),true)
      const { data: findData, errors: findErrors } = await authRequest(findQuery, jwt)

      expect(findData).toBeNull()
      expect(findErrors.length).toBeGreaterThan(0)
    })
    it('delete owned domain', async () => {
      const query = deleteDomainMutation(getSeedID(domains[0]))
      const { data, errors } = await authRequest(query, jwt)

      expect(errors).toBeUndefined()
      expect(data.deleteDomain.success).toBe(true)
    })
    it('delete not owned domain', async () => {
      const query = deleteDomainMutation(getSeedID(domains[1]))
      const { data, errors } = await authRequest(query, jwt)

      expect(errors).toBeUndefined()
      expect(data.deleteDomain.success).toBe(true)
    })
    it('get state of owned domain', async () => {
      const query = stateQuery(getSeedID(domains[0]), 'link')
      const { data, errors } = await authRequest(query, jwt)

      expect(errors).toBeUndefined()
      expect(data.state).toMatchSnapshot()
    })
    it('set state for owned domain', async () => {
      const query = setStateMutation(getSeedID(domains[0]), 'key', 'value')
      const { data, errors } = await authRequest(query, jwt)

      expect(errors).toBeUndefined()
      expect(data.setState).toMatchSnapshot()
    })
    it('remove state from owned domain', async () => {
      const query = removeStateMutation(getSeedID(domains[0]), 'link')
      const { data, errors } = await authRequest(query, jwt)

      expect(errors).toBeUndefined()
      expect(data.removeState.success).toBe(true)
    })
    it('get state of not owned domain', async () => {
      const query = stateQuery(getSeedID(domains[1]), 'link')
      const { data, errors } = await authRequest(query, jwt)

      expect(errors).toBeUndefined()
      expect(data.state).toMatchSnapshot()
    })
    it('set state for not owned domain', async () => {
      const query = setStateMutation(getSeedID(domains[1]), 'key', 'value')
      const { data, errors } = await authRequest(query, jwt)

      expect(errors).toBeUndefined()
      expect(data.setState).toMatchSnapshot()
    })
    it('remove state from not owned domain', async () => {
      const query = removeStateMutation(getSeedID(domains[1]), 'link')
      const { data, errors } = await authRequest(query, jwt)

      expect(errors).toBeUndefined()
      expect(data.removeState.success).toBe(true)
    })
  })
  describe('should not', async () => {
    it('get non existing domain when querying for a specific domain', async () => {
      const query = domainQuery(getNotMatchingID())
      const { data, errors } = await unauthRequest(query)

      expect(data).toBeNull()
      expect(errors.length).toBeGreaterThan(0)
    })
    it('create domain with empty name', async () => {
      const query = createDomainMutation('')
      const res = await authRequest(query, jwt)
      const { data, errors } = res

      expect(data).toBeNull()
      expect(errors.length).toBeGreaterThan(0)
    })
    it('set empty name for domain', async () => {
      const query = updateDomainMutation(getSeedID(domains[0]),
        { name: '' },
      )
      const { data, errors } = await authRequest(query, jwt)

      expect(data).toBeNull()
      expect(errors.length).toBeGreaterThan(0)
    })
    it('update isPublic of domain with invalid input', async () => {
      const query = updateDomainMutation(getSeedID(domains[0]),
        { isPublic: null },
      )
      const { data, errors } = await authRequest(query, jwt)

      expect(data).toBeNull()
      expect(errors.length).toBeGreaterThan(0)
    })
    it('set a question of another survey as activeQuestion for a domain', async () => {
      const query = updateDomainMutation(getSeedID(domains[0]),
        { activeQuestion: getSeedID(questions[6]) },
      )
      const { data, errors } = await authRequest(query, jwt)

      expect(data).toBeNull()
      expect(errors.length).toBeGreaterThan(0)
    })
    it('set not existing activeSurvey of domain', async () => {
      const query = updateDomainMutation(getSeedID(domains[0]),
        { activeSurvey: getNotMatchingID() },
      )
      const { data, errors } = await authRequest(query, jwt)

      expect(data).toBeNull()
      expect(errors.length).toBeGreaterThan(0)
    })
    it('set not existing owner for domain', async () => {
      const query = setDomainOwnerMutation(getSeedID(domains[0]), 'notFound@user.com')
      const { data, errors } = await authRequest(query, jwt)

      expect(data).toBeNull()
      expect(errors.length).toBeGreaterThan(0)
    })
    it('delete not existing domain', async () => {
      const query = deleteDomainMutation(getNotMatchingID())
      const { data, errors } = await authRequest(query, jwt)

      expect(data).toBeNull()
      expect(errors.length).toBeGreaterThan(0)
    })
    it('get not existing state of domain', async () => {
      const query = stateQuery(getSeedID(domains[0]), 'notFound')
      const { data, errors } = await authRequest(query, jwt)

      expect(data).toBeNull()
      expect(errors.length).toBeGreaterThan(0)
    })
    it('set state with empty key for domain', async () => {
      const query = setStateMutation(getSeedID(domains[0]), '', 'value')
      const { data, errors } = await authRequest(query, jwt)

      expect(data).toBeNull()
      expect(errors.length).toBeGreaterThan(0)
    })
    it('set state with empty value for domain', async () => {
      const query = setStateMutation(getSeedID(domains[0]), 'key', '')
      const { data, errors } = await authRequest(query, jwt)

      expect(data).toBeNull()
      expect(errors.length).toBeGreaterThan(0)
    })
    it('remove not existing state from domain', async () => {
      const query = removeStateMutation(getSeedID(domains[0]), 'notFound')
      const { data, errors } = await authRequest(query, jwt)

      expect(data).toBeNull()
      expect(errors.length).toBeGreaterThan(0)
    })
  })
})
