import client from '@/utils/client'
import gql from 'graphql-tag'

const updateClientDomain = (clientID, domainID) => client.apollo.mutate(
  {
    mutation: gql`
    mutation updateClient($domainID: HashID!, $clientID: HashID!) {
      updateClient(
        data: {
          domain: $domainID
        },
        clientID: $clientID
      ) {
        client {
          id
          name
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

const getClients = () => client.apollo.query(
  {
    query: gql`
    query getClients {
      clients {
        id
        name
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
  },
)

const deleteClient = clientID => client.apollo.mutate(
  {
    mutation: gql`
    mutation deleteClient($clientID: HashID!) {
      {
        deleteClient(clientID: $clientID) { status }
      }
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
}
