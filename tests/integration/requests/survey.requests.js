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
        ${(requestCreator) ? 'creator { firstName }' : ''}
        title
        description
        isActive
        types
        domains {
          name
        }
        questions {
          value
          description
          type
          items {
            label
          }
          ... on LikeQuestion {
            likeIcon {
                url
            }
          }
          ... on LikeDislikeQuestion {
            likeIcon {
                url
            }
            dislikeIcon {
                url
            }
          }
          ... on ChoiceQuestion {
            choices {
              label
            }
            choiceDefault: default
          }
          ... on RegulatorQuestion {
            labels {
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
              value
              description
              type
              items {
                label
              }
              ... on LikeQuestion {
                likeIcon {
                    url
                }
              }
              ... on LikeDislikeQuestion {
                likeIcon {
                    url
                }
                dislikeIcon {
                    url
                }
              }
              ... on ChoiceQuestion {
                choices {
                  label
                }
                choiceDefault: default
              }
              ... on RegulatorQuestion {
                labels {
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
          creator { firstName }
          title
          description
          isActive
          types
          questions { value }
          domains { name }
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
          title
          description
          isActive
          types
          domains {
            name
          }
          questions {
            value
            description
            type
            items {
              label
            }
            ... on LikeQuestion {
              likeIcon {
                  url
              }
            }
            ... on LikeDislikeQuestion {
              likeIcon {
                  url
              }
              dislikeIcon {
                  url
              }
            }
            ... on ChoiceQuestion {
              choices {
                label
              }
              choiceDefault: default
            }
            ... on RegulatorQuestion {
              labels {
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
                value
                description
                type
                items {
                  label
                }
                ... on LikeQuestion {
                  likeIcon {
                      url
                  }
                }
                ... on LikeDislikeQuestion {
                  likeIcon {
                      url
                  }
                  dislikeIcon {
                      url
                  }
                }
                ... on ChoiceQuestion {
                  choices {
                    label
                  }
                  choiceDefault: default
                }
                ... on RegulatorQuestion {
                  labels {
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
