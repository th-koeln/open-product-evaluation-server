const users = require('../../../seeds/data/user/user')
const { Seeder } = require('mongo-seeding')
const config = require('../../../../config')
const { unauthRequest, authRequest } = require('../../helper/requests')
const { getSeedID, getNotMatchingID } = require('../../helper/helpers')
const {
  userAmountQuery,
  loginUserMutation,
  usersQuery,
  userQuery,
  updateUserMutation,
  deleteUserMutation
} = require('../../queries/user.queries')

const seeder = new Seeder(config.seeder)
const collections = seeder.readCollectionsFromPath(config.seeder.inputPath)


describe('User', () => {
  const user = users[0]
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
    it('get 1 as the amount of users', async () => {
      const query = userAmountQuery()
      const res = await authRequest(query, jwt)
      const { data, errors } = res

      expect(errors).toBeUndefined()
      expect(data.userAmount).toBe(1)
    })
    it('get only himself when querying for users', async () => {
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
    it('delete himself', async () => {
      const query = deleteUserMutation(getSeedID(user))
      const { data, errors } = await authRequest(query, jwt)

      expect(errors).toBeUndefined()
      expect(data.deleteUser.success).toBe(true)
    })
  })
  describe('should not', async () => {
    it('get not existing user', async () => {
      const query = userQuery(getNotMatchingID())
      const { data, errors } = await authRequest(query, jwt)

      expect(data).toBeNull()
      expect(errors.length).toBeGreaterThan(0)
    })
    it('get another user when querying for a specific user', async () => {
      const query = userQuery(getSeedID(users[1]))
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
    it('update firstName of himself to be empty', async () => {
      const query = updateUserMutation(
        getSeedID(user),
        { firstName: '' },
      )
      const { data, errors } = await authRequest(query, jwt)

      expect(data).toBeNull()
      expect(errors.length).toBeGreaterThan(0)
    })
    it('update lastName of himself to be empty', async () => {
      const query = updateUserMutation(
        getSeedID(user),
        { lastName: '' },
      )
      const { data, errors } = await authRequest(query, jwt)

      expect(data).toBeNull()
      expect(errors.length).toBeGreaterThan(0)
    })
    it('update email of himself to be empty', async () => {
      const query = updateUserMutation(
        getSeedID(user),
        { email: '' },
      )
      const { data, errors } = await authRequest(query, jwt)

      expect(data).toBeNull()
      expect(errors.length).toBeGreaterThan(0)
    })
    it('update email of himself to be an already existing one', async () => {
      const query = updateUserMutation(
        getSeedID(user),
        { email: users[1].email },
      )
      const { data, errors } = await authRequest(query, jwt)

      expect(data).toBeNull()
      expect(errors.length).toBeGreaterThan(0)
    })
    it('update password of himself to be empty', async () => {
      const query = updateUserMutation(
        getSeedID(user),
        { password: '' },
      )
      const { data, errors } = await authRequest(query, jwt)

      expect(data).toBeNull()
      expect(errors.length).toBeGreaterThan(0)
    })
    it('update isAdmin of himself', async () => {
      const query = updateUserMutation(
        getSeedID(user),
        { isAdmin: true }
      )
      const { data, errors } = await authRequest(query, jwt)

      expect(data).toBeNull()
      expect(errors.length).toBeGreaterThan(0)
    })
    it('update firstName of other user', async () => {
      const query = updateUserMutation(
        getSeedID(users[1]),
        { firstName: 'newName' }
      )
      const { data, errors } = await authRequest(query, jwt)

      expect(data).toBeNull()
      expect(errors.length).toBeGreaterThan(0)
    })
    it('update lastName of other user', async () => {
      const query = updateUserMutation(
        getSeedID(users[1]),
        { lastName: 'newName' }
      )
      const { data, errors } = await authRequest(query, jwt)

      expect(data).toBeNull()
      expect(errors.length).toBeGreaterThan(0)
    })
    it('update email of other user', async () => {
      const query = updateUserMutation(
        getSeedID(users[1]),
        { email: 'new@mail.com' }
      )
      const { data, errors } = await authRequest(query, jwt)

      expect(data).toBeNull()
      expect(errors.length).toBeGreaterThan(0)
    })
    it('update password of other user', async () => {
      const query = updateUserMutation(
        getSeedID(users[1]),
        { password: 'newPW' }
      )
      const { data, errors } = await authRequest(query, jwt)

      expect(data).toBeNull()
      expect(errors.length).toBeGreaterThan(0)
    })
    it('update isAdmin of other user', async () => {
      const query = updateUserMutation(
        getSeedID(users[1]),
        { isAdmin: true }
      )
      const { data, errors } = await authRequest(query, jwt)

      expect(data).toBeNull()
      expect(errors.length).toBeGreaterThan(0)
    })
    it('delete not existing user', async () => {
      const query = deleteUserMutation(getNotMatchingID())
      const { data, errors } = await authRequest(query, jwt)

      expect(data).toBeNull()
      expect(errors.length).toBeGreaterThan(0)
    })
    it('delete another user', async () => {
      const query = deleteUserMutation(getSeedID(users[1]))
      const { data, errors } = await authRequest(query, jwt)

      expect(data).toBeNull()
      expect(errors.length).toBeGreaterThan(0)
    })
  })
})
