const { createHashFromId } = require('../../utils/idStore')

const sharedResolvers = {
  question: async (parent, args, context, info) => createHashFromId(parent.question),
}

module.exports = {
  Vote: {
    id: async (parent, args, context, info) => createHashFromId(parent.id),
    context: async (parent, args, context, info) => ((Object.prototype.hasOwnProperty.call(parent.toObject(), 'context')
        && parent.context !== null && parent.context !== '') ? createHashFromId(parent.context) : null),
  },
  Answer: {
    __resolveType(obj, context, info) {
      switch (obj.type) {
        case 'LIKE': return 'LikeAnswer'
        case 'LIKEDISLIKE': return 'LikeDislikeAnswer'
        case 'CHOICE': return 'ChoiceAnswer'
        case 'REGULATOR': return 'RegulatorAnswer'
        case 'RANKING': return 'RankingAnswer'
        case 'FAVORITE': return 'FavoriteAnswer'
        default: throw new Error('Unkown Answer')
      }
    },
  },
  LikeAnswer: sharedResolvers,
  LikeDislikeAnswer: sharedResolvers,
  ChoiceAnswer: sharedResolvers,
  RegulatorAnswer: sharedResolvers,
  RankingAnswer: sharedResolvers,
  FavoriteAnswer: sharedResolvers,
}
