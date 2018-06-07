const {GraphQLServer} = require('graphql-yoga')
const {express: middleware} = require('graphql-voyager/middleware')

const server = new GraphQLServer({
    typeDefs : './src/schemaClient.graphql',
    resolvers : {},
    mocks : true
})

const server2 = new GraphQLServer({
    typeDefs: './src/schemaAdmin.graphql',
    resolvers: {},
    mocks : true
})

server.express.use('/voyager', middleware({endpointUrl: '/'}))
server2.express.use('/voyager', middleware({endpointUrl: '/'}))

server.start({port: 3000}, () => console.log('Server is running on http://localhost:3000'))
server2.start({port: 4000}, () => console.log('Server is running on http://localhost:4000'))