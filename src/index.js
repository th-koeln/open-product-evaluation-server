const { GraphQLServer } = require('graphql-yoga')
const { GraphQLScalarType } = require('graphql')
const { express: middleware } = require('graphql-voyager/middleware')
const { makeExecutableSchema, addMockFunctionsToSchema } = require('graphql-tools')
const {GraphQLDateTime} = require('graphql-iso-date')

const resolvers = {
    Answer: {
        __resolveType(obj, context, info) {
            if(obj.liked) {
                if(obj.question.type === 'LikeAnswer') return 'LikeAnswer'
                else return 'LikeDislikeAnswer'
            }
            else if(obj.choiceCode) return 'ChoiceAnswer'
            else if(obj.rating) return 'RegulatorAnswer'
            else if(obj.rankedCodes) return 'RankingAnswer'
            else if(obj.favoriteCode) return 'FavoriteAnswer'
            else return null
        }
    },
    Question: {
        __resolveType(obj, context, info) {
            switch (obj.type) {
                case 'LIKE': return 'LikeQuestion'
                case 'LIKEDISLIKE': return 'LikeDislikeQuestion'
                case 'CHOICE': return 'ChoiceQuestion'
                case 'REGULATOR': return 'RegulatorQuestion'
                case 'RANKING': return 'RankingQuestion'
                case 'FAVORITE': return 'FavoriteQuestion'
                default : throw new Error('Unkown Question')
            }
        }
    },
    DateTime: GraphQLDateTime
}


const server = new GraphQLServer({
    typeDefs : './src/schemaClient.graphql',
    resolvers,
    mocks : {
        DateTime: () => new Date()
    }
})

const server2 = new GraphQLServer({
    typeDefs: './src/schemaAdmin.graphql',
    resolvers,
    mocks : {
        DateTime: () => new Date()
    }
})

server.express.use('/voyager', middleware({endpointUrl: '/'}))
server2.express.use('/voyager', middleware({endpointUrl: '/'}))

server.start({port: 3000}, () => console.log('Server is running on http://localhost:3000'))
server2.start({port: 4000}, () => console.log('Server is running on http://localhost:4000'))