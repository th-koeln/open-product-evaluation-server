const { getRequestString } = require('../helper/helpers')

function clientAmountQuery() {
  return {
    query: `query {
      clientAmount 
    }`,
  }
}

function clientsQuery() {
  return {
    query: `query {
      clients {
        id
        name
        domain {
          id
          name
          activeQuestion {
            id
            value
          }
          activeSurvey {
            id
            title
            questions {
              id
              value
            }
          }
        }
      }
    }`,
  }
}

function clientQuery(clientID, requestOwners) {
  return {
    query: `{
      client(clientID: "${clientID}") {
        id
        name
        domain {
          id
          name
          activeQuestion {
            id
            value
          }
          activeSurvey {
            id
            title
            questions {
              id
              value
            }
          }
        }
        ${(requestOwners) ? 'owners { id firstName }' : ''}
      }
    }`,
  }
}

function createPermanentClientMutation(name, email) {
  return {
    query: getRequestString(
      'mutation',
      'createPermanentClient',
      `
        client {
          name
        }
        code
        token
      `,
      { data: { name, email } }
    )
  }
}

function createTemporaryClientMutation(domainID) {
  return {
    query: getRequestString(
      'mutation',
      'createTemporaryClient',
      `
        client {
          name
          domain {
            id
            name
            activeQuestion {
              id
              value
            }
            activeSurvey {
              id
              title
              questions {
                id
                value
              }
            }
          }
        }
        token
      `,
      { data: { domainID } }
    ),
  }
}

function loginClientMutation(email, code) {
  return {
    query: getRequestString(
      'mutation',
      'loginClient',
      `
        client {
          id
          name
          code
          domain {
            id
            name
            activeQuestion {
              id
              value
            }
            activeSurvey {
              id
              title
              questions {
                id
                value
              }
            }
          }
        }
        code
        token
      `,
      { data: { email, code } }
    ),
  }
}

function updateClientMutation(clientID, updateData, requestOwners) {
  return {
    query: getRequestString(
      'mutation',
      'updateClient',
      `
        client {
          id
          name
          domain {
            id
            name
            activeQuestion {
              id
              value
            }
            activeSurvey {
              id
              title
              questions {
                id
                value
              }
            }
          }
          ${(requestOwners) ? 'owners { id firstName }' : ''}
        }
      `,
      { clientID, data: updateData }
    ),
  }
}

function deleteClientMutation(clientID) {
  return {
    query: `mutation {
      deleteClient(clientID:"${clientID}"){
        success
      }
    }`,
  }
}

function setClientOwnerMutation(clientID, email) {
  return {
    query: `mutation {
      setClientOwner(clientID:"${clientID}", email:"${email}"){
        client{
          id
          name
          domain {
            id
            name
          }
          owners{
            id
            firstName
          }
        }
      }
    }`,
  }
}

function removeClientOwnerMutation(clientID, ownerID) {
  return {
    query: `mutation {
      removeClientOwner(clientID:"${clientID}", ownerID:"${ownerID}"){
        success
      }
    }`,
  }
}

module.exports = {
  clientAmountQuery,
  createPermanentClientMutation,
  createTemporaryClientMutation,
  loginClientMutation,
  clientsQuery,
  clientQuery,
  updateClientMutation,
  deleteClientMutation,
  setClientOwnerMutation,
  removeClientOwnerMutation
}
