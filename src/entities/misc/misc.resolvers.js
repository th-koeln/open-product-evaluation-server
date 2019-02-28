const { GraphQLDateTime } = require('graphql-iso-date')
const { GraphQLScalarType, Kind } = require('graphql')
const { getMatchingId, createHashFromId } = require('../../store/id.store')

module.exports = {
  SortOption: {
    ASCENDING: 'asc',
    DESCENDING: 'desc',
  },
  DateTime: GraphQLDateTime,
  HashID: new GraphQLScalarType({
    name: 'HashID',
    description: 'Hashed ID of entities',
    parseValue(hashID) { return getMatchingId(hashID) },
    parseLiteral(ast) {
      if (ast.kind !== Kind.STRING) {
        throw Error('The value needs to be a String to be interpreted.')
      }

      return getMatchingId(ast.value)
    },
    serialize: value => createHashFromId(value),
  }),
}
