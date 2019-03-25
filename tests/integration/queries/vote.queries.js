function votesQuery(surveyID) {
  return {
    query: `query {
      votes(surveyID:"${surveyID}") {
        id
        domain
        client
        answers {
          question
          ... on LikeAnswer { liked }
          ... on LikeDislikeAnswer { liked }
          ... on ChoiceAnswer { choice }
          ... on RegulatorAnswer { rating normalized }
          ... on FavoriteAnswer { favoriteItem }
          ... on RankingAnswer { rankedItems }
        }
      }
    }`,
  }
}

module.exports = {
  votesQuery,
}
