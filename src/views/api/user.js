import client from '@/utils/client'
import gql from 'graphql-tag'

const getUsers = (filter, order) => client.apollo.query(
  {
    query: gql`
    query getUsers($filter: SortableUserField!, $order: SortOption!) {
      amount: userAmount
      users(
        sortBy: {
          fieldName: $filter,
        	sortOption : $order
      	}
      ) {
        id
        lastUpdate
        creationDate
        firstName
        lastName
        email
        isAdmin
      }
    }`,
    variables: { filter, order },
  },
)

const getUser = userID => client.apollo.query(
  {
    query: gql`
    query getUser($userID: HashID!) {
      user(userID: $userID) {
        id
        lastUpdate
        creationDate
        firstName
        lastName
        email
        isAdmin
      }
    }`,
    variables: { userID },
  },
)

const createUser = (firstName, lastName, email, password) => client.apollo.mutate(
  {
    mutation: gql`
    mutation createUser(
      $firstName: String!,
      $lastName: String!,
      $email: String!,
      $password: String!
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

const updateUser = (userID, firstName, lastName, email, isAdmin, password) => client.apollo.mutate(
  {
    mutation: gql`
    mutation updateUser(
      $userID: HashID!,
      $firstName: String!,
      $lastName: String!,
      $email: String,
      $password: String,
      $isAdmin: Boolean
    ) {
      updateUser(
        userID: $userID,
        data: {
          firstName: $firstName,
          lastName: $lastName,
          email: $email,
          password: $password,
          isAdmin: $isAdmin
        }
      ) {
        user {
          id
          firstName
          lastName
          email
          isAdmin
        }
      }
    }`,
    variables: {
      userID,
      firstName,
      lastName,
      email,
      password,
      isAdmin,
    },
  },
)

const deleteUser = userID => client.apollo.mutate(
  {
    mutation: gql`
    mutation deleteUser($userID: String!) {
      deleteUser(userID: $userID) {
        success
      }
    }`,
    variables: { userID },
  },
)

const updateProfile = (userID, firstName, lastName, email, password) => client.apollo.mutate(
  {
    mutation: gql`
    mutation updateUser(
      $userID: HashID!,
      $firstName: String!,
      $lastName: String!,
      $email: String,
      $password: String
    ) {
      updateUser(
        userID: $userID,
        data: {
          firstName: $firstName,
          lastName: $lastName,
          email: $email,
          password: $password
        }
      ) {
        user {
          id
          firstName
          lastName
          email
          isAdmin
        }
      }
    }`,
    variables: {
      userID,
      firstName,
      lastName,
      email,
      password,
    },
  },
)

export default {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  updateProfile,
}
