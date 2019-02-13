import { ApolloClient } from 'apollo-client'
import { ApolloLink, Observable, split } from 'apollo-link'
import { createUploadLink } from 'apollo-upload-client'
import { InMemoryCache, IntrospectionFragmentMatcher } from 'apollo-cache-inmemory'
import { WebSocketLink } from 'apollo-link-ws'
import { getMainDefinition } from 'apollo-utilities'
import introspectionQueryResultData from './fragments.json'

const fragmentMatcher = new IntrospectionFragmentMatcher({
  introspectionQueryResultData,
})

const defaultOptions = {
  watchQuery: {
    fetchPolicy: 'network-only',
    errorPolicy: 'ignore',
  },
  query: {
    fetchPolicy: 'network-only',
    errorPolicy: 'all',
  },
}

const cache = new InMemoryCache({ fragmentMatcher })

const request = async (operation) => {
  let token = null
  let headers = {
    headers: {},
  }

  if (localStorage.getItem('currentUser') !== null) {
    token = await JSON.parse(localStorage.getItem('currentUser')).token
  }

  if (token) {
    headers = {
      headers: {
        authorization: token ? `Bearer ${token}` : null,
      },
    }
  }
  operation.setContext(headers)
}

const requestLink = new ApolloLink((operation, forward) => new Observable((observer) => {
  let handle
  Promise.resolve(operation)
    .then(oper => request(oper))
    .then(() => {
      handle = forward(operation).subscribe({
        next: observer.next.bind(observer),
        error: observer.error.bind(observer),
        complete: observer.complete.bind(observer),
      })
    })
    .catch(observer.error.bind(observer))

  return () => {
    if (handle) handle.unsubscribe()
  }
}))

const getToken = () => {
  if (localStorage.getItem('currentUser') !== null) {
    return JSON.parse(localStorage.getItem('currentUser')).token
  }
  return null
}

const wsLink = new WebSocketLink({
  uri: 'ws://localhost:3000/',
  options: {
    reconnect: true,
    connectionParams: {
      Authorization: getToken(),
    },
  },
})

const link = split(
  // split based on operation type
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query)
    return kind === 'OperationDefinition' && operation === 'subscription'
  },
  wsLink,
  requestLink,
)

export default new ApolloClient({
  link: ApolloLink.from([
    link,
    createUploadLink({
      uri: 'http://localhost:3000/graphql',
    }),
  ]),
  cache,
  defaultOptions,
  connectToDevTools: true,
})
