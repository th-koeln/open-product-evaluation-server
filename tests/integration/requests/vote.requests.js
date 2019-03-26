const { getRequestString } = require('../helper/helpers')

function voteAmountQuery(surveyID) {
  return {
    query: `query {
      voteAmount(surveyID:"${surveyID}") 
    }`,
  }
}

function votesQuery(surveyID) {
  return {
    query: `query {
      votes(surveyID:"${surveyID}") {
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

function setAnswerMutation(questionID, answerData) {
  return {
    query: getRequestString(
      'mutation',
      'setAnswer',
      `
        voteCreated
        answer {
          question
          ... on LikeAnswer {
            liked
          }
          ... on LikeDislikeAnswer {
            liked
          }
          ... on ChoiceAnswer {
            choice
          }
          ... on RegulatorAnswer {
            rating
            normalized
          }
          ... on FavoriteAnswer {
            favoriteItem
          }
          ... on RankingAnswer {
            rankedItems
          }
        }
      `,
      { data: { questionID, ...answerData} }
    )
  }
}

function removeAnswerMutation(questionID) {
  return {
    query: getRequestString(
      'mutation',
      'removeAnswer',
      `
        success
      `,
      { questionID }
    )
  }
}

module.exports = {
  voteAmountQuery,
  votesQuery,
  setAnswerMutation,
  removeAnswerMutation,
}
