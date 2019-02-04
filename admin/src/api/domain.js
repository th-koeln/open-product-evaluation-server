import client from '@/utils/client'
import gql from 'graphql-tag'

const getDomain = domainID => client.query(
  {
    query: gql`
    query getDomain($domainID: ID!) {
      domain(domainID: $domainID) {
        id
        name
        activeSurvey {
          id
          title
          description
          isPublic
        }
        activeQuestion { id value }
        states { key value }
        owners { id firstName lastName }
        clients {
          id
          name
          owners { id firstName lastName }
        }
      }
    }`,
    variables: { domainID },
  },
)

const getDomains = () => client.query(
  {
    query: gql`
    query getDomains {
      domains {
        owners { id }
        id
        name
        activeSurvey {
          id
          title
          description
          isPublic
        }
        activeQuestion {id value}
        states { key value }
        owners { id firstName lastName }
        clients {
          id
          name
          owners { id firstName lastName }
        }
      }
    }`,
  },
)

const createDomain = name => client.mutate(
  {
    mutation: gql`
    mutation createDomain($name: String!) {
      createDomain(
        data: { name: $name }
      ) {
        domain {
          id
          name
          activeSurvey {
            id
            title
            description
            isPublic
          }
          activeQuestion { id }
          states { key value }
          clients {
            id
            name
            owners { id firstName lastName }
          }
        }
      }
    }`,
    variables: { name },
  },
)

const updateDomain = (domainID, name, surveyID) => client.mutate(
  {
    mutation: gql`
    mutation updateDomain($domainID: ID!, $name: String!, $surveyID: ID!) {
      updateDomain(
        domainID: $domainID,
        data: {
          name: $name,
          activeSurvey: $surveyID
        }
      ) {
        domain {
          id
          name
          activeSurvey {
            id
            title
            description
            isPublic
          }
          activeQuestion { id }
          states { key value }
          clients {
            id
            name
            owners { id firstName lastName }
          }
        }
      }
    }`,
    variables: { domainID, name, surveyID },
  },
)

const deleteDomain = domainID => client.mutate(
  {
    mutation: gql`
    mutation deleteDomain($domainID: ID!) {
      deleteDomain(domainID: $domainID) { success }
    }`,
    variables: { domainID },
  },
)

const onDomainUpdate = (domainID, scb, ecb) => client.subscribe(
  {
    query: gql`
    subscription onDomainUpdate($domainID: ID!) {
      domainUpdate(domainID: $domainID) {
        event
        domain {
          id
          name
          activeSurvey {
            id
            title
            description
            isPublic
          }
          activeQuestion { id value }
          states { key value }
          owners { id firstName lastName }
          clients {
            id
            name
            owners { id firstName lastName }
          }
        }
        changedAttributes
        stateKey
      }
    }`,
    variables: {
      domainID,
    },
  },
).subscribe(
  {
    next(data) {
      scb(data)
    },
    error(error) {
      ecb(error)
    },
  },
)

export default {
  getDomain,
  getDomains,
  createDomain,
  updateDomain,
  deleteDomain,
  onDomainUpdate,
}
