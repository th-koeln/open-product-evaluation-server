import client from '@/utils/client'
import gql from 'graphql-tag'

const updateClientDomain = (clientID, domainID) => client.apollo.mutate(
  {
    mutation: gql`
    mutation updateClient($domainID: HashID, $clientID: HashID!) {
      updateClient(
        data: {
          domain: $domainID
        },
        clientID: $clientID
      ) {
        client {
          id
          name
          creationDate
          lastUpdate
          owners {
            id
            firstName
            lastName
          }
          domain {
            id
            activeSurvey {
              id
              title
            }
          }
        }
      }
    }`,
    variables: { domainID, clientID },
  },
)

const setClientOwner = (clientID, email) => client.apollo.mutate(
  {
    mutation: gql`
    mutation setClientOwner($clientID: HashID!, $email: String!) {
      setClientOwner(clientID: $clientID, email: $email) {
        client {
          id
          name
          creationDate
          lastUpdate
          owners {
            id
            firstName
            lastName
          }
          domain {
            id
            activeSurvey {
              id
              title
            }
          }
        }
      }
    }`,
    variables: { clientID, email}
  }
)

const removeClientOwner = (clientID, ownerID) => client.apollo.mutate(
  {
    mutation: gql`
    mutation removeClientOwner($clientID: HashID!, $ownerID: HashID!) {
      removeClientOwner(clientID: $clientID, ownerID: $ownerID) {
        success
      }
    }`,
    variables: { clientID, ownerID }
  }
)

const updateClient = (clientID, name) => client.apollo.mutate(
  {
    mutation: gql`
    mutation updateClient($clientID: HashID!, $name: String!) {
      updateClient(
        data: {
          name: $name
        },
        clientID: $clientID
      )
      {
        client {
          id
          name
          creationDate
          lastUpdate
          owners {
            id
            firstName
            lastName
          }
          domain {
            id
            activeSurvey {
              id
              title
            }
          }
        }
      }
    }`,
    variables: { clientID, name },
  },
)

const createClient = name => client.apollo.mutate(
  {
    mutation: gql`
    mutation createClient($name: String!) {
      createClient(data: { name: $name }) {
        device { id }
        token
      }
    }`,
    variables: { name },
  },
)

const getClient = clientID => client.apollo.query(
  {
    query: gql`
    query getClient($clientID: HashID!) {
      client(clientID: $clientID) {
        id
        name
        creationDate
        lastUpdate
        owners {
          id
          firstName
          lastName
        }
        domain {
          id
          activeSurvey {
            id
            title
          }
        }
      }
    }`,
    variables: { clientID },
  },
)

const getClients = (filter, order) => client.apollo.query(
  {
    query: gql`
    query getClients($filter: SortableClientField!, $order: SortOption!) {
      amount: clientAmount
      clients(
        sortBy: {
          fieldName: $filter,
        	sortOption : $order
      	}
      ) {
        id
        name
        creationDate
        lastUpdate
        owners {
          id
          firstName
          lastName
        }
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
          }
        }
      }
    }`,
    variables: { filter, order }
  },
)

const deleteClient = clientID => client.apollo.mutate(
  {
    mutation: gql`
    mutation deleteClient($clientID: HashID!) {
        deleteClient(clientID: $clientID) { success }
    }`,
    variables: { clientID },
  },
)

export default {
  getClient,
  getClients,
  createClient,
  updateClient,
  updateClientDomain,
  deleteClient,
  setClientOwner,
  removeClientOwner,
}
