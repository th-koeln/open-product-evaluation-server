const users = require('../../../seeds/data/user/user')
const domains = require('../../../seeds/data/domain/domain')
const surveys = require('../../../seeds/data/survey/survey')
const { Seeder } = require('mongo-seeding')
const config = require('../../../../config')
const { unauthRequest, authRequest } = require('../../helper/requests')
const { getSeedID, getNotMatchingID, promiseTimeout } = require('../../helper/helpers')
const {
  userAmountQuery,
  loginUserMutation,
  usersQuery,
  userQuery,
  updateUserMutation,
  deleteUserMutation
} = require('../../queries/user.queries')
const { domainQuery, setDomainOwnerMutation } = require('../../queries/domain.queries')
const { surveyQuery } = require('../../queries/survey.queries')

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
    it('get the amount of users', async () => {
      const query = userAmountQuery()
      const res = await authRequest(query, jwt)
      const { data, errors } = res

      expect(errors).toBeUndefined()
      expect(data.userAmount).toBe(3)
    })
    it('get all user when querying for users', async () => {
      const query = usersQuery()
      const { data, errors } = await authRequest(query, jwt)

      expect(errors).toBeUndefined()
      expect(data.users).toMatchSnapshot()
    })
    it('get himself when querying for a specific user', async () => {
      const query = userQuery(getSeedID(user))
      const { data, errors } = await authRequest(query, jwt)

      expect(errors).toBeUndefined()
      expect(data.user).toMatchSnapshot()
    })
    it('get any user when querying for a specific user', async () => {
      const query = userQuery(getSeedID(users[0]))
      const { data, errors } = await authRequest(query, jwt)

      expect(errors).toBeUndefined()
      expect(data.user).toMatchSnapshot()
    })
    it('update firstName of himself', async () => {
      const query = updateUserMutation(
        getSeedID(user),
        { firstName: 'newName' }
      )
      const { data, errors } = await authRequest(query, jwt)

      expect(errors).toBeUndefined()
      expect(data.updateUser).toMatchSnapshot()
    })
    it('update lastName of himself', async () => {
      const query = updateUserMutation(
        getSeedID(user),
        { lastName: 'newName' }
      )
      const { data, errors } = await authRequest(query, jwt)

      expect(errors).toBeUndefined()
      expect(data.updateUser).toMatchSnapshot()
    })
    it('update email of himself', async () => {
      const query = updateUserMutation(
        getSeedID(user),
        { email: 'new@mail.com' }
      )
      const { data, errors } = await authRequest(query, jwt)

      expect(errors).toBeUndefined()
      expect(data.updateUser).toMatchSnapshot()
    })
    it('update password of himself', async () => {
      const query = updateUserMutation(
        getSeedID(user),
        { password: 'newPW' }
      )
      const { errors } = await authRequest(query, jwt)

      expect(errors).toBeUndefined()

      const loginQuery = loginUserMutation(user.email, 'newPW')
      const { errors: loginErrors } = await authRequest(loginQuery, jwt)

      expect(loginErrors).toBeUndefined()
    })
    it('update isAdmin of himself', async () => {
      const query = updateUserMutation(
        getSeedID(user),
        { isAdmin: false }
      )
      const { data, errors } = await authRequest(query, jwt)

      expect(errors).toBeUndefined()
      expect(data.updateUser).toMatchSnapshot()
    })
    it('update firstName of other user', async () => {
      const query = updateUserMutation(
        getSeedID(users[0]),
        { firstName: 'newName' }
      )
      const { data, errors } = await authRequest(query, jwt)

      expect(errors).toBeUndefined()
      expect(data.updateUser).toMatchSnapshot()
    })
    it('update lastName of other user', async () => {
      const query = updateUserMutation(
        getSeedID(users[0]),
        { lastName: 'newName' }
      )
      const { data, errors } = await authRequest(query, jwt)

      expect(errors).toBeUndefined()
      expect(data.updateUser).toMatchSnapshot()
    })
    it('update email of other user', async () => {
      const query = updateUserMutation(
        getSeedID(users[0]),
        { email: 'new@mail.com' }
      )
      const { data, errors } = await authRequest(query, jwt)

      expect(errors).toBeUndefined()
      expect(data.updateUser).toMatchSnapshot()
    })
    it('update password of other user', async () => {
      const query = updateUserMutation(
        getSeedID(users[0]),
        { password: 'newPW' }
      )
      const { errors } = await authRequest(query, jwt)

      expect(errors).toBeUndefined()

      const loginQuery = loginUserMutation(users[0].email, 'newPW')
      const { errors: loginErrors } = await authRequest(loginQuery, jwt)

      expect(loginErrors).toBeUndefined()
    })
    it('update isAdmin of other user', async () => {
      const query = updateUserMutation(
        getSeedID(users[0]),
        { isAdmin: true }
      )
      const { data, errors } = await authRequest(query, jwt)

      expect(errors).toBeUndefined()
      expect(data.updateUser).toMatchSnapshot()
    })
    it('delete himself', async () => {
      const query = deleteUserMutation(getSeedID(user))
      const { data, errors } = await authRequest(query, jwt)

      expect(errors).toBeUndefined()
      expect(data.deleteUser.success).toBe(true)
    })
    it('delete any user', async () => {
      const query = deleteUserMutation(getSeedID(users[0]))
      const { data, errors } = await authRequest(query, jwt)

      expect(errors).toBeUndefined()
      expect(data.deleteUser.success).toBe(true)
    })
    it('remove owner of domain by deleting a user', async () => {
      const addQuery = setDomainOwnerMutation(getSeedID(domains[1]), user.email)
      const { data: addData, errors: addErrors } = await authRequest(addQuery, jwt)

      expect(addErrors).toBeUndefined()
      expect(addData.setDomainOwner).toMatchSnapshot()

      const query = deleteUserMutation(getSeedID(users[0]))
      const { data, errors } = await authRequest(query, jwt)

      expect(errors).toBeUndefined()
      expect(data.deleteUser.success).toBe(true)

      await promiseTimeout()

      const getQuery = domainQuery(getSeedID(domains[1]), true)
      const { data: getData, errors: getErrors } = await authRequest(getQuery, jwt)

      expect(getErrors).toBeUndefined()
      expect(getData.domain).toMatchSnapshot()
    })
    it('delete domain by deleting user that is the last owner', async () => {
      const query = deleteUserMutation(getSeedID(users[0]))
      const { data, errors } = await authRequest(query, jwt)

      expect(errors).toBeUndefined()
      expect(data.deleteUser.success).toBe(true)

      await promiseTimeout()

      const getQuery = domainQuery(getSeedID(domains[1]), true)
      const { data: getData, errors: getErrors } = await authRequest(getQuery, jwt)

      expect(getData).toBeNull()
      expect(getErrors.length).toBeGreaterThan(0)
    })
    it('delete survey by deleting user that is the creator', async () => {
      const query = deleteUserMutation(getSeedID(users[0]))
      const { data, errors } = await authRequest(query, jwt)

      expect(errors).toBeUndefined()
      expect(data.deleteUser.success).toBe(true)

      await promiseTimeout()

      const getQuery = surveyQuery(getSeedID(surveys[1]), true)
      const { data: getData, errors: getErrors } = await authRequest(getQuery, jwt)

      expect(getData).toBeNull()
      expect(getErrors.length).toBeGreaterThan(0)
    })
  })
  describe('should not', async () => {
    it('get not existing user', async () => {
      const query = userQuery(getNotMatchingID())
      const { data, errors } = await authRequest(query, jwt)

      expect(data).toBeNull()
      expect(errors.length).toBeGreaterThan(0)
    })
    it('update not existing user', async () => {
      const query = updateUserMutation(
        getNotMatchingID(),
        { firstName: 'newName' },
      )
      const { data, errors } = await authRequest(query, jwt)

      expect(data).toBeNull()
      expect(errors.length).toBeGreaterThan(0)
    })
    it('update firstName of user to be empty', async () => {
      const query = updateUserMutation(
        getSeedID(user),
        { firstName: '' },
      )
      const { data, errors } = await authRequest(query, jwt)

      expect(data).toBeNull()
      expect(errors.length).toBeGreaterThan(0)
    })
    it('update lastName of user to be empty', async () => {
      const query = updateUserMutation(
        getSeedID(user),
        { lastName: '' },
      )
      const { data, errors } = await authRequest(query, jwt)

      expect(data).toBeNull()
      expect(errors.length).toBeGreaterThan(0)
    })
    it('update email of user to be empty', async () => {
      const query = updateUserMutation(
        getSeedID(user),
        { email: '' },
      )
      const { data, errors } = await authRequest(query, jwt)

      expect(data).toBeNull()
      expect(errors.length).toBeGreaterThan(0)
    })
    it('update email of user to be an already existing one', async () => {
      const query = updateUserMutation(
        getSeedID(user),
        { email: users[0].email },
      )
      const { data, errors } = await authRequest(query, jwt)

      expect(data).toBeNull()
      expect(errors.length).toBeGreaterThan(0)
    })
    it('update password of user to be empty', async () => {
      const query = updateUserMutation(
        getSeedID(user),
        { password: '' },
      )
      const { data, errors } = await authRequest(query, jwt)

      expect(data).toBeNull()
      expect(errors.length).toBeGreaterThan(0)
    })
    it('update isAdmin of user with invalid value', async () => {
      const query = updateUserMutation(
        getSeedID(user),
        { isAdmin: 'invalid' },
      )
      const { data, errors } = await authRequest(query, jwt)

      expect(data).toBeUndefined()
      expect(errors.length).toBeGreaterThan(0)
    })
    it('delete not existing user', async () => {
      const query = deleteUserMutation(getNotMatchingID())
      const { data, errors } = await authRequest(query, jwt)

      expect(data).toBeNull()
      expect(errors.length).toBeGreaterThan(0)
    })
  })
})
