const users = require('../../../seeds/data/user/user')
const { Seeder } = require('mongo-seeding')
const config = require('../../../../config')
const { unauthRequest } = require('../../helper/requests')
const { getSeedID } = require('../../helper/helpers')
const {
  userAmountQuery,
  loginUserMutation,
  usersQuery,
  userQuery,
  createUserMutation,
  updateUserMutation,
  deleteUserMutation
} = require('../../requests/user.requests')

const seeder = new Seeder(config.seeder)
const collections = seeder.readCollectionsFromPath(config.seeder.inputPath)


describe('Unauthorized', () => {
  beforeEach(async () => {
    await seeder.import(collections)
  })

  describe('should', async () => {
    it('create a user', async () => {
      const query = createUserMutation(
        'peter',
        'pummel',
        'peter@pummel.com',
        'password',

      )
      const res = await unauthRequest(query)
      const { data, errors } = res

      expect(errors).toBeUndefined()
      expect(data.createUser.token).not.toBeNull()
      expect(data.createUser.user).toMatchSnapshot()
    })
    it('login as a user', async () => {
      const query = loginUserMutation(users[0].email, 'password')
      const res = await unauthRequest(query)
      const { data, errors } = res

      expect(errors).toBeUndefined()
      expect(data.login.token).not.toBeNull()
      expect(data.login.user).toMatchSnapshot()
    })
    it('login as a user, using capitalized email', async () => {
      const query = loginUserMutation(users[0].email.toUpperCase(), 'password')
      const res = await unauthRequest(query)
      const { data, errors } = res

      expect(errors).toBeUndefined()
      expect(data.login.token).not.toBeNull()
      expect(data.login.user).toMatchSnapshot()
    })
  })
  describe('should not', async () => {
    it('get the amount of users', async () => {
      const query = userAmountQuery()
      const { data, errors } = await unauthRequest(query)

      expect(data.userAmount).toBeNull()
      expect(errors.length).toBeGreaterThan(0)
    })
    it('get any user when querying for users', async () => {
      const query = usersQuery()
      const { data, errors } = await unauthRequest(query)

      expect(data.users).toBeNull()
      expect(errors.length).toBeGreaterThan(0)
    })
    it('get user when querying for a specific user', async () => {
      const query = userQuery(getSeedID(users[0]))
      const { data, errors } = await unauthRequest(query)

      expect(data).toBeNull()
      expect(errors.length).toBeGreaterThan(0)
    })
    it('login using password that does not match user', async () => {
      const query = loginUserMutation(users[0].email, 'wrongPassword')
      const { data, errors } = await unauthRequest(query)

      expect(data).toBeNull()
      expect(errors.length).toBeGreaterThan(0)
    })
    it('login using email that does not belong to a user', async () => {
      const query = loginUserMutation('notFound@email.com', 'password')
      const { data, errors } = await unauthRequest(query)

      expect(data).toBeNull()
      expect(errors.length).toBeGreaterThan(0)
    })
    it('create user with already taken email', async () => {
      const query = createUserMutation(
        'peter',
        'pummel',
        'peter@pummel.com',
        'password',
      )
      const { data, errors } = await unauthRequest(query)

      expect(errors).toBeUndefined()
      expect(data.createUser.token).not.toBeNull()
      expect(data.createUser.user).toMatchSnapshot()

      const { data: secondData, errors: secondErrors } = await unauthRequest(query)

      expect(secondData).toBeNull()
      expect(secondErrors.length).toBeGreaterThan(0)
    })
    it('create user with empty firstName', async () => {
      const query = createUserMutation(
        '',
        'pummel',
        'peter@pummel.com',
        'password',
      )
      const { data, errors } = await unauthRequest(query)

      expect(data).toBeNull()
      expect(errors.length).toBeGreaterThan(0)
    })
    it('create user with empty lastName', async () => {
      const query = createUserMutation(
        'peter',
        '',
        'peter@pummel.com',
        'password',
      )
      const { data, errors } = await unauthRequest(query)

      expect(data).toBeNull()
      expect(errors.length).toBeGreaterThan(0)
    })
    it('create user with empty email', async () => {
      const query = createUserMutation(
        'peter',
        'pummel',
        '',
        'password',
      )
      const { data, errors } = await unauthRequest(query)

      expect(data).toBeNull()
      expect(errors.length).toBeGreaterThan(0)
    })
    it('create user with empty password', async () => {
      const query = createUserMutation(
        'peter',
        'pummel',
        'peter@pummel.com',
        '',
      )
      const { data, errors } = await unauthRequest(query)

      expect(data).toBeNull()
      expect(errors.length).toBeGreaterThan(0)
    })
    it('update firstName of user', async () => {
      const query = updateUserMutation(
        getSeedID(users[0]),
        { firstName: 'newName' },
      )
      const { data, errors } = await unauthRequest(query)

      expect(data).toBeNull()
      expect(errors.length).toBeGreaterThan(0)
    })
    it('update lastName of user', async () => {
      const query = updateUserMutation(
        getSeedID(users[0]),
        { lastName: 'newName' },
      )
      const { data, errors } = await unauthRequest(query)

      expect(data).toBeNull()
      expect(errors.length).toBeGreaterThan(0)
    })
    it('update email of user', async () => {
      const query = updateUserMutation(
        getSeedID(users[0]),
        { email: 'new@email.com' },
      )
      const { data, errors } = await unauthRequest(query)

      expect(data).toBeNull()
      expect(errors.length).toBeGreaterThan(0)
    })
    it('update password of user', async () => {
      const query = updateUserMutation(
        getSeedID(users[0]),
        { password: 'newPW' },
      )
      const { data, errors } = await unauthRequest(query)

      expect(data).toBeNull()
      expect(errors.length).toBeGreaterThan(0)
    })
    it('update isAdmin of user', async () => {
      const query = updateUserMutation(
        getSeedID(users[0]),
        { isAdmin: true },
      )
      const { data, errors } = await unauthRequest(query)

      expect(data).toBeNull()
      expect(errors.length).toBeGreaterThan(0)
    })
    it('delete user', async () => {
      const query = deleteUserMutation(getSeedID(users[0]))
      const { data, errors } = await unauthRequest(query)

      expect(data).toBeNull()
      expect(errors.length).toBeGreaterThan(0)
    })
  })
})
