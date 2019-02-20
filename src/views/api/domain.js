import client from '@/utils/client'
import gql from 'graphql-tag'

const getDomain = domainID => client.api.query(
  {
    query: gql`
    query getDomain($domainID: HashID!) {
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

const getDomains = () => client.api.query(
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

const createDomain = name => client.api.mutate(
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

const updateDomain = (domainID, name, isPublic, surveyID) => client.api.mutate(
  {
    mutation: gql`
    mutation updateDomain($domainID: HashID!, $name: String!, $isPublic: Boolean, $surveyID: HashID!) {
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

const updateDomainVisibility = (domainID, isPublic) => client.api.mutate(
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

const deleteDomain = domainID => client.api.mutate(
  {
    mutation: gql`
    mutation deleteDomain($domainID: HashID!) {
      deleteDomain(domainID: $domainID) { success }
    }`,
    variables: { domainID },
  },
)

const onDomainUpdate = domainID => client.api.subscribe(
  {
    query: gql`
    subscription onDomainUpdate($domainID: HashID!) {
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
