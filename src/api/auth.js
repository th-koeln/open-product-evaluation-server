import client from '@/utils/client'
import gql from 'graphql-tag'

const login = (email, password) => client.mutate(
  {
    mutation: gql`
      mutation login($email: String!, $password: String!) {
        login(data: { email: $email, password: $password }) {
          user {
            id
            creationDate
            lastUpdate
            email
            firstName
            lastName
            isAdmin
          }
          token
        }
      }`,
    variables: { email, password },
  },
)

const register = (firstName, lastName, email, password) => client.mutate(
  {
    mutation: gql`
      mutation register(
        $firstName: String!,
        $lastName: String!,
        $email: String!,
        $password: String!,
      ) {
        createUser(
          data: {
            firstName: $firstName,
            lastName: $lastName,
            email: $email,
            password: $password
          }
        ) {
          user {
            id
            creationDate
            lastUpdate
            email
            firstName
            lastName
            isAdmin
          }
          token
        }
      }`,
    variables: {
      firstName,
      lastName,
      email,
      password,
    },
  },
)

export default {
  login,
  register,
}
