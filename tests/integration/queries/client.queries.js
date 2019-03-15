function createClientQuery(name) {
  return {
    query: `mutation {
        createClient(data: {name: "TestClient"}) {
          client {
            name
            domain {
              id
            }
          }
          token
        }
      }`,
  }
}

const updateClientQuery = function updateClientQuery(clientID, clientName, domain) {
  return {
    query: `mutation {
      updateClient(clientID:"${clientID}", data:{name:"${clientName}",domain:"${domain}"}){
        client{
          id
          name
          domain{
            id
          }
          owners{
            id
          }
        }
      }
    }`,
  }
}

const setClientOwnerQuery = function setClientOwnerQuery(clientID, email) {
  return {
    query: `mutation {
      setClientOwner(clientID:"${clientID}", email:"${email}"){
        client{
          owners{
            id
          }
        }
      }
    }`,
  }
}

const deleteClientQuery = function deleteClientQuery(clientID) {
  return {
    query: `mutation {
      deleteClient(clientID:"${clientID}"){
        success
      }
    }`,
  }
}

const clientsQuery = function clientsQuery() {
  return {
    query: `{
      clients {
        id
        name
        domain {
          id
        }
        owners {
          id
        }
      }
    }`,
  }
}

const clientQuery = function clientQuery(clientID) {
  return {
    query: `{
      client(clientID: "${clientID}") {
        id
        name
        domain {
          id
        }
        owners{
          id
        }
      }
    }`,
  }
}

module.exports = {
  createClientQuery,
  updateClientQuery,
  clientsQuery,
  setClientOwnerQuery,
  deleteClientQuery,
  clientQuery
}