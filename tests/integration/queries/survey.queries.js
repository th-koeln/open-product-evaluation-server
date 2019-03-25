const { getRequestString } = require('../helper/helpers')

function surveyAmountQuery() {
  return {
    query: `query {
      surveyAmount 
    }`,
  }
}

function surveysQuery() {
  return {
    query: `query {
      surveys {
        id
        title
        description
        types
        isActive
      }
    }`,
  }
}

function surveyQuery(surveyID, requestCreator) {
  return {
    query: `{
      survey(surveyID: "${surveyID}") {
        id
        ${(requestCreator) ? 'creator { id firstName }' : ''}
        title
        description
        isActive
        types
        domains {
          id
          name
        }
        questions {
          id
          value
          description
          type
          items {
            id
            label
          }
          ... on LikeQuestion {
            likeIcon {
                id
            }
          }
          ... on LikeDislikeQuestion {
            likeIcon {
                id
            }
            dislikeIcon {
                id
            }
          }
          ... on ChoiceQuestion {
            choices {
              id
              label
            }
            choiceDefault: default
          }
          ... on RegulatorQuestion {
            labels {
              id
              label
              value
            }
            stepSize
            min
            max
            regulatorDefault: default
          }
        }
        results {
          numberOfVotes
          versions {
            versionNumber
            questions {
              id
              value
              description
              type
              items {
                id
                label
              }
              ... on LikeQuestion {
                likeIcon {
                    id
                }
              }
              ... on LikeDislikeQuestion {
                likeIcon {
                    id
                }
                dislikeIcon {
                    id
                }
              }
              ... on ChoiceQuestion {
                choices {
                  id
                  label
                }
                choiceDefault: default
              }
              ... on RegulatorQuestion {
                labels {
                  id
                  label
                  value
                }
                stepSize
                min
                max
                regulatorDefault: default
              }
            }
            votes {
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
            summaries {
              question
              type
              value
              evaluations {
                metric
                data {
                  total
                  label
                }
              }
            }
          }
        }
      }
    }`,
  }
}

function createSurveyMutation(createData) {
  return {
    query: getRequestString(
      'mutation',
      'createSurvey',
      `
        survey {
          creator { id firstName }
          title
          description
          isActive
          types
          questions { id }
          domains { id }
          results { numberOfVotes }
        }
      `,
      { data: createData }
    )
  }
}

function updateSurveyMutation(surveyID, updateData) {
  return {
    query: getRequestString(
      'mutation',
      'updateSurvey',
      `
        survey {
          id
          title
          description
          isActive
          types
          domains {
            id
            name
          }
          questions {
            id
            value
            description
            type
            items {
              id
              label
            }
            ... on LikeQuestion {
              likeIcon {
                  id
              }
            }
            ... on LikeDislikeQuestion {
              likeIcon {
                  id
              }
              dislikeIcon {
                  id
              }
            }
            ... on ChoiceQuestion {
              choices {
                id
                label
              }
              choiceDefault: default
            }
            ... on RegulatorQuestion {
              labels {
                id
                label
                value
              }
              stepSize
              min
              max
              regulatorDefault: default
            }
          }
          results {
            numberOfVotes
            versions {
              versionNumber
              questions {
                id
                value
                description
                type
                items {
                  id
                  label
                }
                ... on LikeQuestion {
                  likeIcon {
                      id
                  }
                }
                ... on LikeDislikeQuestion {
                  likeIcon {
                      id
                  }
                  dislikeIcon {
                      id
                  }
                }
                ... on ChoiceQuestion {
                  choices {
                    id
                    label
                  }
                  choiceDefault: default
                }
                ... on RegulatorQuestion {
                  labels {
                    id
                    label
                    value
                  }
                  stepSize
                  min
                  max
                  regulatorDefault: default
                }
              }
              votes {
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
              summaries {
                question
                type
                value
                evaluations {
                  metric
                  data {
                    total
                    label
                  }
                }
              }
            }
          }
        }
      `,
      { surveyID, data: updateData }
    ),
  }
}

function deleteSurveyMutation(surveyID) {
  return {
    query: `mutation {
      deleteSurvey(surveyID:"${surveyID}"){
        success
      }
    }`,
  }
}

function resultsQuery(surveyID) {
  return {
    query: `{
      survey(surveyID: "${surveyID}") {
        results {
          versions {
            versionNumber
          }
        }
      }
    }`,
  }
}

module.exports = {
  surveyAmountQuery,
  surveysQuery,
  surveyQuery,
  createSurveyMutation,
  updateSurveyMutation,
  deleteSurveyMutation,
  resultsQuery,
}
