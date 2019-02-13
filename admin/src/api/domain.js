import client from '@/utils/client'
import gql from 'graphql-tag'

const getDomain = domainID => client.query(
  {
    query: gql`
    query getDomain($domainID: ID!) {
      domain(domainID: $domainID) {
        id
        name
        isPublic
        activeSurvey {
          id
          title
          description
          isActive
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
        id
        name
        isPublic
        activeSurvey {
          id
          title
          description
          isActive
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
          isPublic
          activeSurvey {
            id
            title
            description
            isActive
          }
          activeQuestion { id }
          states { key value }
          owners { id firstName lastName }
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

const updateDomain = (domainID, name, isPublic, surveyID) => client.mutate(
  {
    mutation: gql`
    mutation updateDomain($domainID: ID!, $name: String!, $isPublic: Boolean, $surveyID: ID!) {
      updateDomain(
        domainID: $domainID,
        data: {
          name: $name,
          activeSurvey: $surveyID,
          isPublic: $isPublic
        }
      ) {
        domain {
          id
          name
          isPublic
          activeSurvey {
            id
            title
            description
            isActive
          }
          activeQuestion { id }
          states { key value }
          owners { id firstName lastName }
          clients {
            id
            name
            owners { id firstName lastName }
          }
        }
      }
    }`,
    variables: { domainID, name, isPublic, surveyID },
  },
)

const updateDomainVisibility = (domainID, isPublic) => client.mutate(
  {
    mutation: gql`
    mutation updateDomain($domainID: ID!, $isPublic: Boolean) {
      updateDomain(
        domainID: $domainID,
        data: {
          isPublic: $isPublic
        }
      ) {
        domain {
          id
          name
          isPublic
          activeSurvey {
            id
            title
            description
            isActive
          }
          activeQuestion { id }
          states { key value }
          owners { id firstName lastName }
          clients {
            id
            name
            owners { id firstName lastName }
          }
        }
      }
    }`,
    variables: { domainID, isPublic },
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
          isPublic
          activeSurvey {
            id
            title
            description
            isActive
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
  updateDomainVisibility,
  createDomain,
  updateDomain,
  deleteDomain,
  onDomainUpdate,
}
