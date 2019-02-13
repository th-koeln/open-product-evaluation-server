/**
 * Created by Dennis Dubbert on 28.06.18.
 */
const { GraphQLDateTime } = require('graphql-iso-date')
const { GraphQLScalarType, Kind } = require('graphql')
const { getMatchingId, createHashFromId } = require('../../utils/idStore')

module.exports = {
  SortOption: {
    ASCENDING: 'asc',
    DESCENDING: 'desc',
  },
  ComparisonFilterOption: {
    EQUAL: '$eq',
    GREATER: '$gt',
    GREATER_OR_EQUAL: '$gte',
    LOWER: '$lt',
    LOWER_OR_EQUAL: '$lte',
    NOT_EQUAL: '$ne',
    REGEX: '$regex',
  },
  ArrayFilterOption: {
    ALL: '$all',
    ANY: '$in',
    NOT_IN_ARRAY: '$nin',
  },
  ConnectorFilterOption: {
    AND: '$and',
    NOT_ANY: '$not',
    NOR: '$nor',
    OR: '$or',
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
