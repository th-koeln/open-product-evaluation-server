const config = require('../../../config')

const url = `http://localhost:${config.app.port}`
// eslint-disable-next-line
const request = require('supertest')(url)

const graphqlEndpoint = '/graphql'

module.exports = {
  unauthRequest: query => new Promise(async (resolve, reject) => {
    try {
      const response = await request.post(graphqlEndpoint)
        .set('Accept', 'application/json')
        .send(query)
      const { body: { data, errors } } = response
      resolve({ data, errors })
    } catch (error) {
      reject(error)
    }
  }),
  authRequest: (query, token) => new Promise(async (resolve, reject) => {
    try {
      const response = await request.post(graphqlEndpoint)
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json')
        .send(query)
      const { body: { data, errors } } = response
      resolve({ data, errors })
    } catch (error) {
      reject(error)
    }
  }),
}
