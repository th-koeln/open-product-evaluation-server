import client from '@/utils/client'
import gql from 'graphql-tag'

const getDomain = domainID => client.apollo.query(
  {
    query: gql`
    query getDomain($domainID: HashID!) {
      domain(domainID: $domainID) {
        id
        name
        isPublic
        creationDate
        lastUpdate
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

const getDomains = (filter, order) => client.apollo.query(
  {
    query: gql`
    query getDomains($filter: SortableDomainField!, $order: SortOption!) {
      amount: domainAmount
      domains(
        sortBy: {
          fieldName: $filter,
        	sortOption : $order
      	}
      ) {
        id
        name
        isPublic
        creationDate
        lastUpdate
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
    variables: { filter, order },
  },
)

const createDomain = name => client.apollo.mutate(
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
          creationDate
          lastUpdate
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

const updateDomain = (domainID, name, isPublic, surveyID) => client.apollo.mutate(
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
          creationDate
          lastUpdate
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

const updateDomainVisibility = (domainID, isPublic) => client.apollo.mutate(
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
          creationDate
          lastUpdate
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

const deleteDomain = domainID => client.apollo.mutate(
  {
    mutation: gql`
    mutation deleteDomain($domainID: HashID!) {
      deleteDomain(domainID: $domainID) { success }
    }`,
    variables: { domainID },
  },
)

const onDomainUpdate = domainID => client.apollo.subscribe(
  {
    query: gql`
    subscription onDomainUpdate($domainID: HashID!) {
      domainUpdate(domainID: $domainID) {
        event
        domain {
          id
          name
          isPublic
          creationDate
          lastUpdate
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
