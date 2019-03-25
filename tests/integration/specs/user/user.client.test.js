const users = require('../../../seeds/data/user/user')
const clients = require('../../../seeds/data/client/client')
const { Seeder } = require('mongo-seeding')
const config = require('../../../../config')
const { authRequest, unauthRequest } = require('../../helper/requests')
const { getSeedID, getClientToken, promiseTimeout } = require('../../helper/helpers')
const {
  userAmountQuery,
  usersQuery,
  userQuery,
  updateUserMutation,
  deleteUserMutation
} = require('../../queries/user.queries')
const { loginClientMutation, clientQuery, setClientOwnerMutation } = require('../../queries/client.queries')
const { loginUserMutation } = require('../../queries/user.queries')
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
      it('have owner removed when deleting a user', async () => {
        const loginQuery = loginUserMutation(users[1].email, 'password')
        const { data: loginData, errors: loginErrors } = await unauthRequest(loginQuery)

        expect(loginData.login).not.toBeNull()
        expect(loginErrors).toBeUndefined()

        const { login: { token } } = loginData

        const addQuery = setClientOwnerMutation(getSeedID(clients[2]), users[1].email)
        const { data: addData, errors: addErrors } = await authRequest(addQuery, token)

        expect(addErrors).toBeUndefined()
        expect(addData.setClientOwner).toMatchSnapshot()

        const query = deleteUserMutation(getSeedID(users[0]))
        const { data, errors } = await authRequest(query, token)

        expect(errors).toBeUndefined()
        expect(data.deleteUser.success).toBe(true)

        await promiseTimeout()

        const getQuery = clientQuery(getSeedID(clients[2]), true)
        const { data: getData, errors: getErrors } = await authRequest(getQuery, token)

        expect(getErrors).toBeUndefined()
        expect(getData.client).toMatchSnapshot()

      })
      it('be delete when last owner got deleted', async () => {
        const loginQuery = loginUserMutation(users[1].email, 'password')
        const { data: loginData, errors: loginErrors } = await unauthRequest(loginQuery)

        expect(loginData.login).not.toBeNull()
        expect(loginErrors).toBeUndefined()

        const { login: { token } } = loginData

        const query = deleteUserMutation(getSeedID(users[0]))
        const { data, errors } = await authRequest(query, token)

        expect(errors).toBeUndefined()
        expect(data.deleteUser.success).toBe(true)

        await promiseTimeout()

        const getQuery = clientQuery(getSeedID(clients[2]), true)
        const { data: getData, errors: getErrors } = await authRequest(getQuery, token)

        expect(getData).toBeNull()
        expect(getErrors.length).toBeGreaterThan(0)
      })
    })
    describe('should not', async () => {
      it('get the amount of users', async () => {
        const query = userAmountQuery()
        const { data, errors } = await authRequest(query, jwt)

        expect(data.userAmount).toBeNull()
        expect(errors.length).toBeGreaterThan(0)
      })
      it('get any user when querying for users', async () => {
        const query = usersQuery()
        const { data, errors } = await authRequest(query, jwt)

        expect(data.users).toBeNull()
        expect(errors.length).toBeGreaterThan(0)
      })
      it('get user when querying for a specific user', async () => {
        const query = userQuery(getSeedID(users[0]))
        const { data, errors } = await authRequest(query, jwt)

        expect(data).toBeNull()
        expect(errors.length).toBeGreaterThan(0)
      })
      it('update firstName of user', async () => {
        const query = updateUserMutation(
          getSeedID(users[0]),
          { firstName: 'newName' },
        )
        const { data, errors } = await authRequest(query, jwt)

        expect(data).toBeNull()
        expect(errors.length).toBeGreaterThan(0)
      })
      it('update lastName of user', async () => {
        const query = updateUserMutation(
          getSeedID(users[0]),
          { lastName: 'newName' },
        )
        const { data, errors } = await authRequest(query, jwt)

        expect(data).toBeNull()
        expect(errors.length).toBeGreaterThan(0)
      })
      it('update email of user', async () => {
        const query = updateUserMutation(
          getSeedID(users[0]),
          { email: 'new@email.com' },
        )
        const { data, errors } = await authRequest(query, jwt)

        expect(data).toBeNull()
        expect(errors.length).toBeGreaterThan(0)
      })
      it('update password of user', async () => {
        const query = updateUserMutation(
          getSeedID(users[0]),
          { password: 'newPW' },
        )
        const { data, errors } = await authRequest(query, jwt)

        expect(data).toBeNull()
        expect(errors.length).toBeGreaterThan(0)
      })
      it('update isAdmin of user', async () => {
        const query = updateUserMutation(
          getSeedID(users[0]),
          { isAdmin: true },
        )
        const { data, errors } = await authRequest(query, jwt)

        expect(data).toBeNull()
        expect(errors.length).toBeGreaterThan(0)
      })
      it('delete user', async () => {
        const query = deleteUserMutation(getSeedID(users[0]))
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

    describe('should not', async () => {
      it('get the amount of users', async () => {
        const query = userAmountQuery()
        const { data, errors } = await authRequest(query, jwt)

        expect(data.userAmount).toBeNull()
        expect(errors.length).toBeGreaterThan(0)
      })
      it('get any user when querying for users', async () => {
        const query = usersQuery()
        const { data, errors } = await authRequest(query, jwt)

        expect(data.users).toBeNull()
        expect(errors.length).toBeGreaterThan(0)
      })
      it('get user when querying for a specific user', async () => {
        const query = userQuery(getSeedID(users[0]))
        const { data, errors } = await authRequest(query, jwt)

        expect(data).toBeNull()
        expect(errors.length).toBeGreaterThan(0)
      })
      it('update firstName of user', async () => {
        const query = updateUserMutation(
          getSeedID(users[0]),
          { firstName: 'newName' },
        )
        const { data, errors } = await authRequest(query, jwt)

        expect(data).toBeNull()
        expect(errors.length).toBeGreaterThan(0)
      })
      it('update lastName of user', async () => {
        const query = updateUserMutation(
          getSeedID(users[0]),
          { lastName: 'newName' },
        )
        const { data, errors } = await authRequest(query, jwt)

        expect(data).toBeNull()
        expect(errors.length).toBeGreaterThan(0)
      })
      it('update email of user', async () => {
        const query = updateUserMutation(
          getSeedID(users[0]),
          { email: 'new@email.com' },
        )
        const { data, errors } = await authRequest(query, jwt)

        expect(data).toBeNull()
        expect(errors.length).toBeGreaterThan(0)
      })
      it('update password of user', async () => {
        const query = updateUserMutation(
          getSeedID(users[0]),
          { password: 'newPW' },
        )
        const { data, errors } = await authRequest(query, jwt)

        expect(data).toBeNull()
        expect(errors.length).toBeGreaterThan(0)
      })
      it('update isAdmin of user', async () => {
        const query = updateUserMutation(
          getSeedID(users[0]),
          { isAdmin: true },
        )
        const { data, errors } = await authRequest(query, jwt)

        expect(data).toBeNull()
        expect(errors.length).toBeGreaterThan(0)
      })
      it('delete user', async () => {
        const query = deleteUserMutation(getSeedID(users[0]))
        const { data, errors } = await authRequest(query, jwt)

        expect(data).toBeNull()
        expect(errors.length).toBeGreaterThan(0)
      })
    })
  })
})
