import client from '@/utils/client'
import gql from 'graphql-tag'

const createSurvey = (title, description) => client.apollo.mutate(
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
              }
              dislikeIcon {
                id
                creationDate
                url
                name
                type
                hash
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
          previewImage {
            id
            creationDate
            name
            type
            hash
            url
          }
        }
      }
    }`,
    variables: { title, description },
  },
)

const updateSurvey = (surveyID, title, description, isActive) => client.apollo.mutate(
  {
    mutation: gql`
    mutation updateSurvey(
      $surveyID: HashID!,
      $title: String!,
      $description: String,
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
             }
             dislikeIcon {
               id
               creationDate
               url
               name
               type
               hash
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
         previewImage {
           id
           creationDate
           name
           type
           hash
           url
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

const changeSurveyisActive = (surveyID, isActive) => client.apollo.mutate(
  {
    mutation: gql`
    mutation setSurveyActive($surveyID: HashID!, $isActive: Boolean!) {
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
          previewImage {
            id
            creationDate
            name
            type
            hash
            url
          }
        }
      }
    }`,
    variables: { surveyID, isActive },
  },
)

const deleteSurvey = surveyID => client.apollo.mutate(
  {
    mutation: gql`
    mutation deleteSurvey($surveyID: HashID!) {
      deleteSurvey(surveyID: $surveyID) {
        success
      }
    }`,
    variables: { surveyID },
  },
)

const getSurveys = () => client.apollo.query(
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
            }
            dislikeIcon {
              id
              creationDate
              url
              name
              type
              hash
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
    		previewImage {
          id
          creationDate
          name
          type
          hash
          url
        }
      }
    }`,
  },
)

const uploadImage = (surveyID, file) => client.apollo.mutate(
  {
    mutation: gql`
    mutation createImage($surveyID: HashID!, $file: Upload!]) {
      createBonusImage(
        data: {
          surveyID: $surveyID,
        },
        image: $file
      ) {
        image {
          id
          name
          url
          hash
          creationDate
        }
      }
    }`,
    variables: { surveyID, file },
  },
)

const getSurvey = surveyID => client.apollo.query(
  {
    query: gql`
    query getSurvey($surveyID: HashID!) {
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
            }
            dislikeIcon {
              id
              creationDate
              url
              name
              type
              hash
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
    		previewImage {
          id
          creationDate
          name
          type
          hash
          url
        }
      }
    }`,
    variables: { surveyID },
  },
)

const deleteImage = imageID => client.apollo.mutate(
  {
    mutation: gql`
    mutation deleteImage($imageID: HashID!) {
      deleteBonusImage(
        imageID: $imageID
      ) {
        success
      }
    }`,
    variables: { imageID },
  },
)

const subscription = surveyID => client.apollo.subscribe(
  {
    query: gql`
    subscription onNewVote($surveyID: HashID!){
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
)

const moveQuestion = (surveyID, questions) => client.apollo.mutate(
  {
    mutation: gql`
    mutation moveQuestion($surveyID: HashID!, $questions: [HashID!]) {
      updateSurvey(
        data: { questionOrder: $questions },
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
              }
              dislikeIcon {
                id
                creationDate
                url
                name
                type
                hash
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
          previewImage {
            id
            creationDate
            name
            type
            hash
            url
          }
        }
      }
    }`,
    variables: { surveyID, questions }
  }
)

const setPreviewImage = (surveyID, file) => client.apollo.mutate(
  {
    mutation: gql`
    mutation getSurvey($surveyID: HashID!, $file: Upload!) {
      setSurveyPreviewImage(data: { surveyID: $surveyID }, image: $file)  {
        image {
          id
          creationDate
          name
          type
          hash
          url
        }
      }
    }`,
    variables: { surveyID, file}
  }
)

const removeSurveyPreviewImage = surveyID => client.apollo.mutate(
  {
    mutation: gql`
    mutation removeSurveyPreviewImage($surveyID: HashID!) {
      removeSurveyPreviewImage(surveyID: $surveyID) {
        success
      }
    }`,
    variables: { surveyID}
  }
)

export default {
  createSurvey,
  updateSurvey,
  changeSurveyisActive,
  setPreviewImage,
  removeSurveyPreviewImage,
  deleteSurvey,
  getSurveys,
  getSurvey,
  uploadImage,
  deleteImage,
  subscription,
  moveQuestion,
}
