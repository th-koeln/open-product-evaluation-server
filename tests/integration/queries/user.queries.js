const { getRequestString } = require('../helper/helpers')

function userAmountQuery() {
  return {
    query: `query {
      userAmount 
    }`,
  }
}

function loginUserMutation(email, password) {
  return {
    query: getRequestString(
      'mutation',
      'login',
      `
        user {
          id
          firstName
          lastName
          email
          isAdmin
        }
        token
      `,
      { data: { email: email, password: password } }
    ),
  }
}

function usersQuery() {
  return {
    query: `query {
      users {
        id
        firstName
        lastName
        email
        isAdmin
      }
    }`,
  }
}

function userQuery(userId) {
  return {
    query: `query {
      user(userID: "${userId}") {
        id
        firstName
        lastName
        email
        isAdmin
      }
    }`,
  }
}

function createUserMutation(firstName, lastName, email, password) {
  return {
    query: getRequestString(
      'mutation',
      'createUser',
      `
        user {
          firstName
          lastName
          email
          isAdmin
        }
        token
      `,
      { data: { firstName, lastName, email, password } }
    )
  }
}

function updateUserMutation(userID, updateData) {
  return {
    query: getRequestString(
      'mutation',
      'updateUser',
      `
        user {
          id
          firstName
          lastName
          email
          isAdmin
        }
      `,
      { userID, data: updateData }
    ),
  }
}

function deleteUserMutation(userID) {
  return {
    query: `mutation {
      deleteUser(userID:"${userID}"){
        success
      }
    }`,
  }
}

module.exports = {
  userAmountQuery,
  loginUserMutation,
  usersQuery,
  userQuery,
  createUserMutation,
  updateUserMutation,
  deleteUserMutation
}
