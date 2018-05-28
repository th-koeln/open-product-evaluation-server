const {GraphQLServer} = require('graphql-yoga')
const {express: middleware} = require('graphql-voyager/middleware')

const server = new GraphQLServer({
    typeDefs: './src/schema.graphql',
    resolvers: {},
})

server.express.use('/voyager', middleware({endpointUrl: '/'}))

server.start({port: 3000}, () => console.log('Server is running on http://localhost:3000'))