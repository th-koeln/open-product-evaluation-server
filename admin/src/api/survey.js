import client from '@/utils/client'
import gql from 'graphql-tag'

const createSurvey = (title, description) => client.mutate(
  {
    mutation: gql`
    mutation createSurvey($title: String!, $description: String!) {
      createSurvey(
        data: {
          title: $title,
          description: $description
        }
      ) {
        survey {
          id
          title
          isActive
          description
          types
          questions {
            id
            value
            type
            description
            items {
              id
              label
              image {
                id
                url
                name
                type
                hash
                tags
                creationDate
              }
            }
            ... on LikeQuestion {
              likeIcon {
                id
                creationDate
                url
                name
                type
                hash
                tags
              }
            }
            ... on LikeDislikeQuestion {
              likeIcon {
                id
                creationDate
                url
                name
                type
                hash
                tags
              }
              dislikeIcon {
                id
                creationDate
                url
                name
                type
                hash
                tags
              }
            }
            ... on RegulatorQuestion {
              min
              max
              default
              stepSize
              labels {
                id
                label
                value
                image {
                  id
                  url
                  name
                  type
                  hash
                  tags
                  creationDate
                }
              }
            }
            ... on ChoiceQuestion {
              choiceDefault: default
              choices {
                id
                code
                label
                image {
                  id
                  url
                  name
                  type
                  hash
                  tags
                  creationDate
                }
              }
            }
          }
          votes {
            id
            domain
            client
            creationDate
            answers {
              question
              ... on LikeAnswer {question liked}
              ... on LikeDislikeAnswer {question liked}
              ... on ChoiceAnswer {question choice}
              ... on RegulatorAnswer {question rating normalized}
              ... on RankingAnswer {question rankedItems}
              ... on FavoriteAnswer {question favoriteItem}
            }
          }
          domains { id }
          lastUpdate
          creationDate
          creator {
            id
            lastName
            firstName
            email
            creationDate
            lastUpdate
          }
        }
      }
    }`,
    variables: { title, description },
  },
)

const updateSurvey = (surveyID, title, description, isActive) => client.mutate(
  {
    mutation: gql`
    mutation updateSurvey(
      $surveyID: ID!,
      $title: String!,
      $description: String!,
      $isActive: Boolean!
    ) {
     updateSurvey(
       surveyID: $surveyID,
       data: {
         title: $title,
         description: $description,
         isActive: $isActive
       }
     ) {
       survey {
         id
         title
         isActive
         description
         types
         questions {
           id
           value
           type
           description
           items {
             id
             label
             image {
               id
               url
               name
               type
               hash
               tags
               creationDate
             }
           }
           ... on LikeQuestion {
             likeIcon {
               id
               creationDate
               url
               name
               type
               hash
               tags
             }
           }
           ... on LikeDislikeQuestion {
             likeIcon {
               id
               creationDate
               url
               name
               type
               hash
               tags
             }
             dislikeIcon {
               id
               creationDate
               url
               name
               type
               hash
               tags
             }
           }
           ... on RegulatorQuestion {
             min
             max
             default
             stepSize
             labels {
               id
               label
               value
               image {
                 id
                 url
                 name
                 type
                 hash
                 tags
                 creationDate
               }
             }
           }
           ... on ChoiceQuestion {
             choices {
               id
               code
               label
               image {
                 id
                 url
                 name
                 type
                 hash
                 tags
                 creationDate
               }
             }
           }
         }
         votes {
           id
           domain
           answers {
             question
             ... on LikeAnswer {question liked}
             ... on LikeDislikeAnswer {question liked}
             ... on ChoiceAnswer {question choice}
             ... on RegulatorAnswer {question rating normalized}
             ... on RankingAnswer {question rankedItems}
             ... on FavoriteAnswer {question favoriteItem}
           }
         }
         domains { id }
         lastUpdate
         creationDate
         creator {
           id
           lastName
           firstName
           email
           creationDate
           lastUpdate
         }
       }
     }
    }`,
    variables: {
      surveyID,
      title,
      description,
      isActive,
    },
  },
)

const changeSurveyisActive = (surveyID, isActive) => client.mutate(
  {
    mutation: gql`
    mutation setSurveyActive($surveyID: ID!, $isActive: Boolean!) {
      updateSurvey(surveyID: $surveyID, data: { isActive : $isActive }) {
        survey {
          id
          title
          isActive
          description
          types
          questions {
            id
            value
            type
            description
            items {
              id
              label
              image {
                id
                url
                name
                type
                hash
                tags
                creationDate
              }
            }
            ... on RegulatorQuestion {
              min
              max
              default
              stepSize
              labels {
                id
                label
                value
                image {
                  id
                  url
                  name
                  type
                  hash
                  tags
                  creationDate
                }
              }
            }
            ... on ChoiceQuestion {
              choices {
                id
                code
                label
                image {
                  id
                  url
                  name
                  type
                  hash
                  tags
                  creationDate
                }
              }
            }
          }
          votes {
            id
            domain
            answers {
              question
              ... on LikeAnswer {question liked}
              ... on LikeDislikeAnswer {question liked}
              ... on ChoiceAnswer {question choice}
              ... on RegulatorAnswer {question rating normalized}
              ... on RankingAnswer {question rankedItems}
              ... on FavoriteAnswer {question favoriteItem}
            }
          }
          domains { id }
          lastUpdate
          creationDate
          creator {
            id
            lastName
            firstName
            email
            creationDate
            lastUpdate
          }
        }
      }
    }`,
    variables: { surveyID, isActive },
  },
)

const deleteSurvey = surveyID => client.mutate(
  {
    mutation: gql`
    mutation deleteSurvey($surveyID: ID!) {
      deleteSurvey(surveyID: $surveyID) {
        success
      }
    }`,
    variables: { surveyID },
  },
)

const getSurveys = () => client.query(
  {
    query: gql`
    query getSurveys {
      surveys {
        id
        title
        isActive
        description
        types
        questions {
          id
          value
          type
          description
          ... on LikeQuestion {
            likeIcon {
              id
              creationDate
              url
              name
              type
              hash
              tags
            }
          }
          ... on LikeDislikeQuestion {
            likeIcon {
              id
              creationDate
              url
              name
              type
              hash
              tags
            }
            dislikeIcon {
              id
              creationDate
              url
              name
              type
              hash
              tags
            }
          }
          ... on RegulatorQuestion {
            labels {
              image { id }
            }
          }
          ... on ChoiceQuestion {
            choices {
              id
              code
              label
              image { id }
            }
          }
          ... on RankingQuestion {
            items {
              image {id}
            }
          }
          ... on FavoriteQuestion {
            items {
              image {id}
            }
          }
        }
        votes {
          id
          domain
          answers {
            question
            ... on LikeAnswer {question liked}
            ... on LikeDislikeAnswer {question liked}
            ... on ChoiceAnswer {question choice}
            ... on RegulatorAnswer {question rating normalized}
            ... on RankingAnswer {question rankedItems}
            ... on FavoriteAnswer {question favoriteItem}
          }
        }
        domains { id }
        lastUpdate
        creationDate
        creator {
          id
          lastName
          firstName
          email
          creationDate
          lastUpdate
        }
      }
    }`,
  },
)

const uploadImage = (surveyID, file, tags) => client.mutate(
  {
    mutation: gql`
    mutation createImage($surveyID: ID!, $file: Upload!, $tags: [String!]) {
      createBonusImage(
        data: {
          surveyID: $surveyID,
          tags: $tags
        },
        image: $file
      ) {
        image {
          id
          name
          url
          hash
          creationDate
          tags
        }
      }
    }`,
    variables: { surveyID, file, tags },
  },
)

const getSurvey = surveyID => client.query(
  {
    query: gql`
    query getSurvey($surveyID: ID!) {
      survey(surveyID: $surveyID) {
        id
        title
        isActive
        description
        types
        questions {
          id
          value
          type
          description
          items {
            id
            label
            image {
              id
              url
              name
              type
              hash
              tags
              creationDate
            }
          }
          ... on LikeQuestion {
            likeIcon {
              id
              creationDate
              url
              name
              type
              hash
              tags
            }
          }
          ... on LikeDislikeQuestion {
            likeIcon {
              id
              creationDate
              url
              name
              type
              hash
              tags
            }
            dislikeIcon {
              id
              creationDate
              url
              name
              type
              hash
              tags
            }
          }
          ... on RegulatorQuestion {
            min
            max
            default
            stepSize
            labels {
              id
              label
              value
              image {
                id
                url
                name
                type
                hash
                tags
                creationDate
              }
            }
          }
          ... on ChoiceQuestion {
            choiceDefault: default
            choices {
              id
              code
              label
              image {
                id
                url
                name
                type
                hash
                tags
                creationDate
              }
            }
          }
        }
        votes {
          id
          domain
          client
          creationDate
          answers {
            question
            ... on LikeAnswer {question liked}
            ... on LikeDislikeAnswer {question liked}
            ... on ChoiceAnswer {question choice}
            ... on RegulatorAnswer {question rating normalized}
            ... on RankingAnswer {question rankedItems}
            ... on FavoriteAnswer {question favoriteItem}
          }
        }
        domains { id }
        lastUpdate
        creationDate
        creator {
          id
          lastName
          firstName
          email
          creationDate
          lastUpdate
        }
      }
    }`,
    variables: { surveyID },
  },
)

const deleteImage = imageID => client.mutate(
  {
    mutation: gql`
    mutation deleteImage($imageID: ID!) {
      deleteBonusImage(
        imageID: $imageID
      ) {
        success
      }
    }`,
    variables: { imageID },
  },
)

const onNewVoteSubscription = (surveyID, scb, ecb) => client.subscribe(
  {
    query: gql`
    subscription onNewVote($surveyID: ID!){
      newVote(surveyID: $surveyID){
        event
        vote {
          id
          client
          domain
          answers {
            question
            ...on LikeAnswer {
              liked
            }
            ...on LikeDislikeAnswer {
              liked
            }
            ...on ChoiceAnswer {
              choice
            }
            ...on RegulatorAnswer {
              rating
              normalized
            }
            ...on RankingAnswer {
              rankedItems
            }
            ...on FavoriteAnswer {
              favoriteItem
            }
          }
          creationDate
        }
        surveyId
      }
    }`,
    variables: {
      surveyID,
    },
  },
).subscribe(
  {
    next(data) {
      scb(data)
    },
    error(error) {
      ecb(error)
    },
  },
)

const moveQuestion = (surveyID, questions) => client.mutate(
  {
    mutation: gql`
    mutation moveQuestion($surveyID: ID!, $questions: [ID!]) {
      updateSurvey(
        data: { questions: $questions },
        surveyID: $surveyID
      ) {
        survey {
          id
          title
          isActive
          description
          types
          questions {
            id
            value
            type
            description
            items {
              id
              label
              image {
                id
                url
                name
                type
                hash
                tags
                creationDate
              }
            }
            ... on LikeQuestion {
              likeIcon {
                id
                creationDate
                url
                name
                type
                hash
                tags
              }
            }
            ... on LikeDislikeQuestion {
              likeIcon {
                id
                creationDate
                url
                name
                type
                hash
                tags
              }
              dislikeIcon {
                id
                creationDate
                url
                name
                type
                hash
                tags
              }
            }
            ... on RegulatorQuestion {
              min
              max
              default
              stepSize
              labels {
                id
                label
                value
                image {
                  id
                  url
                  name
                  type
                  hash
                  tags
                  creationDate
                }
              }
            }
            ... on ChoiceQuestion {
              choiceDefault: default
              choices {
                id
                code
                label
                image {
                  id
                  url
                  name
                  type
                  hash
                  tags
                  creationDate
                }
              }
            }
          }
          votes {
            id
            domain
            client
            creationDate
            answers {
              question
              ... on LikeAnswer {question liked}
              ... on LikeDislikeAnswer {question liked}
              ... on ChoiceAnswer {question choice}
              ... on RegulatorAnswer {question rating normalized}
              ... on RankingAnswer {question rankedItems}
              ... on FavoriteAnswer {question favoriteItem}
            }
          }
          domains { id }
          lastUpdate
          creationDate
          creator {
            id
            lastName
            firstName
            email
            creationDate
            lastUpdate
          }
        }
      }
    }`,
    variables: { surveyID, questions }
  }
)

export default {
  createSurvey,
  updateSurvey,
  changeSurveyisActive,
  deleteSurvey,
  getSurveys,
  getSurvey,
  uploadImage,
  deleteImage,
  onNewVoteSubscription,
  moveQuestion,
}
