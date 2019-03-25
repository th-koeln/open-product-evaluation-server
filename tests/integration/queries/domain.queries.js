const { getRequestString } = require('../helper/helpers')

function domainAmountQuery() {
  return {
    query: `query {
      domainAmount 
    }`,
  }
}

function domainsQuery() {
  return {
    query: `query {
      domains {
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
        states {
          key
          value
        }
        clients {
          id
          name
        }
        isPublic
      }
    }`,
  }
}

function domainQuery(domainId, requestOwners) {
  return {
    query: `query {
      domain(domainID: "${domainId}") {
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
        states {
          key
          value
        }
        clients {
          id
          name
        }
        isPublic
        ${(requestOwners) ? 'owners { id firstName }' : ''}
      }
    }`,
  }
}

function stateQuery(domainID, key) {
  return {
    query: `query {
      state(domainID: "${domainID}", key: "${key}") {
        key
        value
      }
    }`,
  }
}

function createDomainMutation(name) {
  return {
    query: getRequestString(
      'mutation',
      'createDomain',
      `
        domain {
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
          states {
            key
            value
          }
          clients {
            id
            name
          }
          isPublic
          owners {
            id
            firstName
          }
        }
      `,
      { data: { name } }
    )
  }
}

function updateDomainMutation(domainID, updateData, requestOwners) {
  return {
    query: getRequestString(
      'mutation',
      'updateDomain',
      `
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
          states {
            key
            value
          }
          clients {
            id
            name
          }
          isPublic
          ${(requestOwners) ? 'owners { id firstName }' : ''}
        }
      `,
      { domainID, data: updateData }
    ),
  }
}

function deleteDomainMutation(domainID) {
  return {
    query: `mutation {
      deleteDomain(domainID:"${domainID}"){
        success
      }
    }`,
  }
}

function setDomainOwnerMutation(domainID, email) {
  return {
    query: `mutation {
      setDomainOwner(domainID:"${domainID}", email:"${email}"){
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
          states {
            key
            value
          }
          clients {
            id
            name
          }
          isPublic
          owners {
            id
            firstName
          }
        }
      }
    }`,
  }
}

function removeDomainOwnerMutation(domainID, ownerID) {
  return {
    query: `mutation {
      removeDomainOwner(domainID:"${domainID}", ownerID:"${ownerID}"){
        success
      }
    }`,
  }
}

function setStateMutation(domainID, key, value) {
  return {
    query: `mutation {
      setState(domainID:"${domainID}", data: { key:"${key}", value:"${value}" }){
        state {
          key
          value
        }
      }
    }`,
  }
}

function removeStateMutation(domainID, key) {
  return {
    query: `mutation {
      removeState(domainID:"${domainID}", data: { key:"${key}" }){
        success
      }
    }`,
  }
}

module.exports = {
  domainAmountQuery,
  domainsQuery,
  domainQuery,
  stateQuery,
  createDomainMutation,
  updateDomainMutation,
  deleteDomainMutation,
  setDomainOwnerMutation,
  removeDomainOwnerMutation,
  setStateMutation,
  removeStateMutation
}
