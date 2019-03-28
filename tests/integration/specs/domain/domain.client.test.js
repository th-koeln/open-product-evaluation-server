const users = require('../../../seeds/data/user/user')
const surveys = require('../../../seeds/data/survey/survey')
const questions = require('../../../seeds/data/question/question')
const clients = require('../../../seeds/data/client/client')
const domains = require('../../../seeds/data/domain/domain')
const { Seeder } = require('mongo-seeding')
const config = require('../../../../config')
const { authRequest, unauthRequest } = require('../../helper/requests')
const { getSeedID, getNotMatchingID, getClientToken, promiseTimeout } = require('../../helper/helpers')
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
const { loginClientMutation, clientQuery } = require('../../requests/client.requests')
const { loginUserMutation } = require('../../requests/user.requests')
const { TEMPORARY } = require('../../../../src/utils/lifetime')

const seeder = new Seeder(config.seeder)
const collections = seeder.readCollectionsFromPath(config.seeder.inputPath)

describe('Client', () => {
  describe('that is permanent', () => {
    const user = users[0]
    const client = clients[2]
    let jwt = ''

    beforeEach(async () => {
      await seeder.import(collections)

      const query = loginClientMutation(user.email, client.code)
      const { data, errors } = await unauthRequest(query)

      expect(data.loginClient).not.toBeNull()
      expect(errors).toBeUndefined()

      const { loginClient: { token } } = data
      jwt = token
    })

    describe('should', async () => {
      it('get amount of all public domains', async () => {
        const query = domainAmountQuery()
        const res = await authRequest(query, jwt)
        const { data, errors } = res

        expect(errors).toBeUndefined()
        expect(data.domainAmount).toBe(1)
      })
      it('get all public domains when querying for domains', async () => {
        const query = domainsQuery()
        const { data, errors } = await authRequest(query, jwt)

        expect(errors).toBeUndefined()
        expect(data.domains).toMatchSnapshot()
      })
      it('get public domain when querying for a specific domain', async () => {
        const query = domainQuery(getSeedID(domains[1]))
        const { data, errors } = await authRequest(query, jwt)

        expect(errors).toBeUndefined()
        expect(data.domain).toMatchSnapshot()
      })
      it('get private domain when querying for a specific domain', async () => {
        const query = domainQuery(getSeedID(domains[0]))
        const { data, errors } = await authRequest(query, jwt)

        expect(errors).toBeUndefined()
        expect(data.domain).toMatchSnapshot()
      })
      it('update activeQuestion of connected domain', async () => {
        const query = updateDomainMutation(getSeedID(domains[1]),
          { activeQuestion: getSeedID(questions[6]) },
        )
        const { data, errors } = await authRequest(query, jwt)

        expect(errors).toBeUndefined()
        expect(data.updateDomain).toMatchSnapshot()
      })
      it('get state of connected domain', async () => {
        const query = stateQuery(getSeedID(domains[1]), 'link')
        const { data, errors } = await authRequest(query, jwt)

        expect(errors).toBeUndefined()
        expect(data.state).toMatchSnapshot()
      })
      it('set state for connected domain', async () => {
        const query = setStateMutation(getSeedID(domains[1]), 'key', 'value')
        const { data, errors } = await authRequest(query, jwt)

        expect(errors).toBeUndefined()
        expect(data.setState).toMatchSnapshot()
      })
      it('remove state from connected domain', async () => {
        const query = removeStateMutation(getSeedID(domains[1]), 'link')
        const { data, errors } = await authRequest(query, jwt)

        expect(errors).toBeUndefined()
        expect(data.removeState.success).toBe(true)
      })
      it('be removed from domain when changing isPublic of domain to false', async () => {
        const loginQuery = loginUserMutation(user.email, 'password')
        const { data: loginData, errors: loginErrors } = await unauthRequest(loginQuery)

        expect(loginData.login).not.toBeNull()
        expect(loginErrors).toBeUndefined()

        const { login: { token } } = loginData

        const query = updateDomainMutation(
          getSeedID(domains[1]),
          { isPublic: false },
        )

        const { data, errors } = await authRequest(query, token)

        expect(errors).toBeUndefined()
        expect(data.updateDomain).toMatchSnapshot()

        await promiseTimeout()

        const clientQ = clientQuery(getSeedID(client))

        const { data: clientData, errors: clientErrors } = await authRequest(clientQ, jwt)

        expect(clientErrors).toBeUndefined()
        expect(clientData.client).toMatchSnapshot()
      })
      it('be removed from domain when deleting domain', async () => {
        const loginQuery = loginUserMutation(user.email, 'password')
        const { data: loginData, errors: loginErrors } = await unauthRequest(loginQuery)

        expect(loginData.login).not.toBeNull()
        expect(loginErrors).toBeUndefined()

        const { login: { token } } = loginData

        const query = deleteDomainMutation(getSeedID(domains[1]))

        const { data, errors } = await authRequest(query, token)

        expect(errors).toBeUndefined()
        expect(data.deleteDomain.success).toBe(true)

        await promiseTimeout()

        const clientQ = clientQuery(getSeedID(client))

        const { data: clientData, errors: clientErrors } = await authRequest(clientQ, jwt)

        expect(clientErrors).toBeUndefined()
        expect(clientData.client).toMatchSnapshot()
      })
    })
    describe('should not', async () => {
      it('see owners of domain', async () => {
        const query = domainQuery(getSeedID(domains[0]), true)
        const { data, errors } = await authRequest(query, jwt)

        expect(data.domain.owners).toBeNull()
        expect(errors.length).toBeGreaterThan(0)
      })
      it('get non existing domain when querying for a specific domain', async () => {
        const query = domainQuery(getNotMatchingID())
        const { data, errors } = await unauthRequest(query)

        expect(data).toBeNull()
        expect(errors.length).toBeGreaterThan(0)
      })
      it('create domain', async () => {
        const query = createDomainMutation('TestDomain')
        const res = await authRequest(query, jwt)
        const { data, errors } = res

        expect(data).toBeNull()
        expect(errors.length).toBeGreaterThan(0)
      })
      it('set name for domain', async () => {
        const query = updateDomainMutation(getSeedID(domains[1]),
          { name: 'newName' },
        )
        const { data, errors } = await authRequest(query, jwt)

        expect(data).toBeNull()
        expect(errors.length).toBeGreaterThan(0)
      })
      it('update isPublic of domain', async () => {
        const query = updateDomainMutation(getSeedID(domains[1]),
          { isPublic: false },
        )
        const { data, errors } = await authRequest(query, jwt)

        expect(data).toBeNull()
        expect(errors.length).toBeGreaterThan(0)
      })
      it('set a question of another survey as activeQuestion for a domain', async () => {
        const query = updateDomainMutation(getSeedID(domains[1]),
          { activeQuestion: getSeedID(questions[0]) },
        )
        const { data, errors } = await authRequest(query, jwt)

        expect(data).toBeNull()
        expect(errors.length).toBeGreaterThan(0)
      })
      it('update activeQuestion of not connected domain', async () => {
        const query = updateDomainMutation(getSeedID(domains[0]),
          { activeQuestion: getSeedID(questions[0]) },
          true,
        )
        const { data, errors } = await authRequest(query, jwt)

        expect(data).toBeNull()
        expect(errors.length).toBeGreaterThan(0)
      })
      it('set activeSurvey for domain', async () => {
        const query = updateDomainMutation(getSeedID(domains[1]),
          { activeSurvey: getSeedID(surveys[0]) },
        )
        const { data, errors } = await authRequest(query, jwt)

        expect(data).toBeNull()
        expect(errors.length).toBeGreaterThan(0)
      })
      it('remove activeSurvey from domain', async () => {
        const query = updateDomainMutation(getSeedID(domains[1]),
          { activeSurvey: null },
          true,
        )
        const { data, errors } = await authRequest(query, jwt)

        expect(data).toBeNull()
        expect(errors.length).toBeGreaterThan(0)
      })
      it('set owner for domain', async () => {
        const query = setDomainOwnerMutation(getSeedID(domains[1]), getSeedID(users[1]))
        const { data, errors } = await authRequest(query, jwt)

        expect(data).toBeNull()
        expect(errors.length).toBeGreaterThan(0)
      })
      it('remove owner from domain', async () => {
        const query = removeDomainOwnerMutation(getSeedID(domains[1]), getSeedID(users[0]))
        const { data, errors } = await authRequest(query, jwt)

        expect(data).toBeNull()
        expect(errors.length).toBeGreaterThan(0)
      })
      it('delete domain', async () => {
        const query = deleteDomainMutation(getSeedID(domains[1]))
        const { data, errors } = await authRequest(query, jwt)

        expect(data).toBeNull()
        expect(errors.length).toBeGreaterThan(0)
      })
      it('get state of not connected domain', async () => {
        const query = stateQuery(getSeedID(domains[0]), 'link')
        const { data, errors } = await authRequest(query, jwt)

        expect(data).toBeNull()
        expect(errors.length).toBeGreaterThan(0)
      })
      it('get not existing state of domain', async () => {
        const query = stateQuery(getSeedID(domains[1]), 'notFound')
        const { data, errors } = await authRequest(query, jwt)

        expect(data).toBeNull()
        expect(errors.length).toBeGreaterThan(0)
      })
      it('set state for not connected domain', async () => {
        const query = setStateMutation(getSeedID(domains[0]), 'key', 'value')
        const { data, errors } = await authRequest(query, jwt)

        expect(data).toBeNull()
        expect(errors.length).toBeGreaterThan(0)
      })
      it('set state with empty key for domain', async () => {
        const query = setStateMutation(getSeedID(domains[1]), '', 'value')
        const { data, errors } = await authRequest(query, jwt)

        expect(data).toBeNull()
        expect(errors.length).toBeGreaterThan(0)
      })
      it('set state with empty value for domain', async () => {
        const query = setStateMutation(getSeedID(domains[1]), 'key', '')
        const { data, errors } = await authRequest(query, jwt)

        expect(data).toBeNull()
        expect(errors.length).toBeGreaterThan(0)
      })
      it('remove not existing state from domain', async () => {
        const query = removeStateMutation(getSeedID(domains[1]), 'notFound')
        const { data, errors } = await authRequest(query, jwt)

        expect(data).toBeNull()
        expect(errors.length).toBeGreaterThan(0)
      })
      it('remove state from not connected domain', async () => {
        const query = removeStateMutation(getSeedID(domains[0]), 'link')
        const { data, errors } = await authRequest(query, jwt)

        expect(data).toBeNull()
        expect(errors.length).toBeGreaterThan(0)
      })
    })
  })

  describe('that is temporary', () => {
    const client = clients[4]
    let jwt = ''

    beforeEach(async () => {
      await seeder.import(collections)

      jwt = getClientToken(client, TEMPORARY)
    })

    describe('should', async () => {
      it('get 0 as amount of domains', async () => {
        const query = domainAmountQuery()
        const res = await authRequest(query, jwt)
        const { data, errors } = res

        expect(errors).toBeUndefined()
        expect(data.domainAmount).toBe(0)
      })
      it('get public domain when querying for a specific domain', async () => {
        const query = domainQuery(getSeedID(domains[1]))
        const { data, errors } = await authRequest(query, jwt)

        expect(errors).toBeUndefined()
        expect(data.domain).toMatchSnapshot()
      })
      it('get private domain when querying for a specific domain', async () => {
        const query = domainQuery(getSeedID(domains[0]))
        const { data, errors } = await authRequest(query, jwt)

        expect(errors).toBeUndefined()
        expect(data.domain).toMatchSnapshot()
      })
      it('update activeQuestion of connected domain', async () => {
        const query = updateDomainMutation(getSeedID(domains[1]),
          { activeQuestion: getSeedID(questions[6]) },
        )
        const { data, errors } = await authRequest(query, jwt)

        expect(errors).toBeUndefined()
        expect(data.updateDomain).toMatchSnapshot()
      })
      it('get state of connected domain', async () => {
        const query = stateQuery(getSeedID(domains[1]), 'link')
        const { data, errors } = await authRequest(query, jwt)

        expect(errors).toBeUndefined()
        expect(data.state).toMatchSnapshot()
      })
      it('set state for connected domain', async () => {
        const query = setStateMutation(getSeedID(domains[1]), 'key', 'value')
        const { data, errors } = await authRequest(query, jwt)

        expect(errors).toBeUndefined()
        expect(data.setState).toMatchSnapshot()
      })
      it('remove state from connected domain', async () => {
        const query = removeStateMutation(getSeedID(domains[1]), 'link')
        const { data, errors } = await authRequest(query, jwt)

        expect(errors).toBeUndefined()
        expect(data.removeState.success).toBe(true)
      })
      it('be deleted when the isPublic attribute of the connected domain changes to false', async () => {
        const loginQuery = loginUserMutation(users[0].email, 'password')
        const { data: loginData, errors: loginErrors } = await unauthRequest(loginQuery)

        expect(loginData.login).not.toBeNull()
        expect(loginErrors).toBeUndefined()

        const { login: { token } } = loginData

        const query = updateDomainMutation(
          getSeedID(domains[1]),
          { isPublic: false },
        )

        const { data, errors } = await authRequest(query, token)

        expect(errors).toBeUndefined()
        expect(data.updateDomain).toMatchSnapshot()

        await promiseTimeout()

        const clientQ = clientQuery(getSeedID(client))

        const { data: clientData, errors: clientErrors } = await authRequest(clientQ, jwt)

        expect(clientData).toBeNull()
        expect(clientErrors.length).toBeGreaterThan(0)
      })
      it('be deleted when deleting domain', async () => {
        const loginQuery = loginUserMutation(users[0].email, 'password')
        const { data: loginData, errors: loginErrors } = await unauthRequest(loginQuery)

        expect(loginData.login).not.toBeNull()
        expect(loginErrors).toBeUndefined()

        const { login: { token } } = loginData

        const query = deleteDomainMutation(getSeedID(domains[1]))

        const { data, errors } = await authRequest(query, token)

        expect(errors).toBeUndefined()
        expect(data.deleteDomain.success).toBe(true)

        await promiseTimeout()

        const clientQ = clientQuery(getSeedID(client))

        const { data: clientData, errors: clientErrors } = await authRequest(clientQ, jwt)

        expect(clientData).toBeNull()
        expect(clientErrors.length).toBeGreaterThan(0)
      })
      it('be deleted when activeSurvey of domain changes', async () => {
        const loginQuery = loginUserMutation(users[1].email, 'password')
        const { data: loginData, errors: loginErrors } = await unauthRequest(loginQuery)

        expect(loginData.login).not.toBeNull()
        expect(loginErrors).toBeUndefined()

        const { login: { token } } = loginData

        const query = updateDomainMutation(
          getSeedID(domains[1]),
          { activeSurvey: getSeedID(surveys[0]) },
        )

        const { data, errors } = await authRequest(query, token)

        expect(errors).toBeUndefined()
        expect(data.updateDomain).toMatchSnapshot()

        await promiseTimeout()

        const clientQ = clientQuery(getSeedID(client))

        const { data: clientData, errors: clientErrors } = await authRequest(clientQ, jwt)

        expect(clientData).toBeNull()
        expect(clientErrors.length).toBeGreaterThan(0)
      })
    })
    describe('should not', async () => {
      it('get any domain when querying for domains', async () => {
        const query = domainsQuery()
        const { data, errors } = await authRequest(query, jwt)

        expect(data.domains).toBeNull()
        expect(errors.length).toBeGreaterThan(0)
      })
      it('see owners of domain', async () => {
        const query = domainQuery(getSeedID(domains[1]), true)
        const { data, errors } = await authRequest(query, jwt)

        expect(data.domain.owners).toBeNull()
        expect(errors.length).toBeGreaterThan(0)
      })
      it('get non existing domain when querying for a specific domain', async () => {
        const query = domainQuery(getNotMatchingID())
        const { data, errors } = await unauthRequest(query)

        expect(data).toBeNull()
        expect(errors.length).toBeGreaterThan(0)
      })
      it('create domain', async () => {
        const query = createDomainMutation('TestDomain')
        const res = await authRequest(query, jwt)
        const { data, errors } = res

        expect(data).toBeNull()
        expect(errors.length).toBeGreaterThan(0)
      })
      it('set name for domain', async () => {
        const query = updateDomainMutation(getSeedID(domains[1]),
          { name: 'newName' },
        )
        const { data, errors } = await authRequest(query, jwt)

        expect(data).toBeNull()
        expect(errors.length).toBeGreaterThan(0)
      })
      it('update isPublic of domain', async () => {
        const query = updateDomainMutation(getSeedID(domains[1]),
          { isPublic: false },
        )
        const { data, errors } = await authRequest(query, jwt)

        expect(data).toBeNull()
        expect(errors.length).toBeGreaterThan(0)
      })
      it('set a question of another survey as activeQuestion for a domain', async () => {
        const query = updateDomainMutation(getSeedID(domains[1]),
          { activeQuestion: getSeedID(questions[0]) },
        )
        const { data, errors } = await authRequest(query, jwt)

        expect(data).toBeNull()
        expect(errors.length).toBeGreaterThan(0)
      })
      it('update activeQuestion of not connected domain', async () => {
        const query = updateDomainMutation(getSeedID(domains[0]),
          { activeQuestion: getSeedID(questions[0]) },
          true,
        )
        const { data, errors } = await authRequest(query, jwt)

        expect(data).toBeNull()
        expect(errors.length).toBeGreaterThan(0)
      })
      it('set activeSurvey for domain', async () => {
        const query = updateDomainMutation(getSeedID(domains[1]),
          { activeSurvey: getSeedID(surveys[0]) },
        )
        const { data, errors } = await authRequest(query, jwt)

        expect(data).toBeNull()
        expect(errors.length).toBeGreaterThan(0)
      })
      it('remove activeSurvey from domain', async () => {
        const query = updateDomainMutation(getSeedID(domains[1]),
          { activeSurvey: null },
          true,
        )
        const { data, errors } = await authRequest(query, jwt)

        expect(data).toBeNull()
        expect(errors.length).toBeGreaterThan(0)
      })
      it('set owner for domain', async () => {
        const query = setDomainOwnerMutation(getSeedID(domains[1]), getSeedID(users[1]))
        const { data, errors } = await authRequest(query, jwt)

        expect(data).toBeNull()
        expect(errors.length).toBeGreaterThan(0)
      })
      it('remove owner from domain', async () => {
        const query = removeDomainOwnerMutation(getSeedID(domains[1]), getSeedID(users[0]))
        const { data, errors } = await authRequest(query, jwt)

        expect(data).toBeNull()
        expect(errors.length).toBeGreaterThan(0)
      })
      it('delete domain', async () => {
        const query = deleteDomainMutation(getSeedID(domains[1]))
        const { data, errors } = await authRequest(query, jwt)

        expect(data).toBeNull()
        expect(errors.length).toBeGreaterThan(0)
      })
      it('get state of not connected domain', async () => {
        const query = stateQuery(getSeedID(domains[0]), 'link')
        const { data, errors } = await authRequest(query, jwt)

        expect(data).toBeNull()
        expect(errors.length).toBeGreaterThan(0)
      })
      it('get not existing state of domain', async () => {
        const query = stateQuery(getSeedID(domains[1]), 'notFound')
        const { data, errors } = await authRequest(query, jwt)

        expect(data).toBeNull()
        expect(errors.length).toBeGreaterThan(0)
      })
      it('set state for not connected domain', async () => {
        const query = setStateMutation(getSeedID(domains[0]), 'key', 'value')
        const { data, errors } = await authRequest(query, jwt)

        expect(data).toBeNull()
        expect(errors.length).toBeGreaterThan(0)
      })
      it('set state with empty key for domain', async () => {
        const query = setStateMutation(getSeedID(domains[1]), '', 'value')
        const { data, errors } = await authRequest(query, jwt)

        expect(data).toBeNull()
        expect(errors.length).toBeGreaterThan(0)
      })
      it('set state with empty value for domain', async () => {
        const query = setStateMutation(getSeedID(domains[1]), 'key', '')
        const { data, errors } = await authRequest(query, jwt)

        expect(data).toBeNull()
        expect(errors.length).toBeGreaterThan(0)
      })
      it('remove not existing state from domain', async () => {
        const query = removeStateMutation(getSeedID(domains[1]), 'notFound')
        const { data, errors } = await authRequest(query, jwt)

        expect(data).toBeNull()
        expect(errors.length).toBeGreaterThan(0)
      })
      it('remove state from not connected domain', async () => {
        const query = removeStateMutation(getSeedID(domains[0]), 'link')
        const { data, errors } = await authRequest(query, jwt)

        expect(data).toBeNull()
        expect(errors.length).toBeGreaterThan(0)
      })
    })
  })
})
