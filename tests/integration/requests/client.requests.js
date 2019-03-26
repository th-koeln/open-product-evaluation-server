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
        name
        domain {
          name
          activeQuestion {
            value
          }
          activeSurvey {
            title
            questions {
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
        name
        domain {
          name
          activeQuestion {
            value
          }
          activeSurvey {
            title
            questions {
              value
            }
          }
        }
        ${(requestOwners) ? 'owners { firstName }' : ''}
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
            name
            activeQuestion {
              value
            }
            activeSurvey {
              title
              questions {
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
          name
          code
          domain {
            name
            activeQuestion {
              value
            }
            activeSurvey {
              title
              questions {
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
          name
          domain {
            name
            activeQuestion {
              value
            }
            activeSurvey {
              title
              questions {
                value
              }
            }
          }
          ${(requestOwners) ? 'owners { firstName }' : ''}
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
          name
          domain {
            name
          }
          owners{
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
