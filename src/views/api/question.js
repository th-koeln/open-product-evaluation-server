import client from '@/utils/client'
import gql from 'graphql-tag'

const createQuestion = surveyID => client.apollo.mutate(
  {
    mutation: gql`
    mutation createQuestion($surveyID: HashID!) {
      createQuestion(
        data: {
          surveyID: $surveyID,
          type: CHOICE,
          description: null,
          value: ""
        }
      ) {
        question {
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
      }
    }`,
    variables: { surveyID },
  },
)

const appendQuestion = (surveyID, questionID)=> client.apollo.mutate(
  {
    mutation: gql`
    mutation createQuestion($surveyID: HashID!, $questionID: HashID!) {
      createQuestion(
        data: {
          surveyID: $surveyID,
          type: CHOICE,
          description: null,
          value: "",
          previousQuestionID: $questionID
        }
      ) {
        question {
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
      }
    }`,
    variables: { surveyID, questionID },
  },
)

const updateQuestion = (questionID, value, description, type) => client.apollo.mutate(
  {
    mutation: gql`
    mutation updateQuestion(
      $questionID: HashID!,
      $value: String,
      $description: String,
      $type: QuestionType!
    ) {
      updateQuestion(
        questionID: $questionID,
        data: {
          value: $value,
          description: $description,
          type: $type
        }
      ) {
        question {
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
      }
    }`,
    variables: {
      questionID,
      value,
      description,
      type,
    },
  },
)

const updateRegulatorQuestion = (questionID, max, d) => client.apollo.mutate(
  {
    mutation: gql`
    mutation updateRegulatorQuestion(
      $questionID: HashID!,
      $max: Int,
      $default: Int
    ) {
      updateQuestion(
        questionID: $questionID,
        data: {
          max: $max,
          regulatorDefault: $default
        }
      ) {
        question {
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
      }
    }`,
    variables: {
      questionID,
      max,
      default: d,
    },
  },
)

const createChoice = questionID => client.apollo.mutate(
  {
    mutation: gql`
    mutation createChoice($questionID: HashID!) {
      createChoice(data: {label: ""}, questionID: $questionID) {
        choice {
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
    }`,
    variables: { questionID },
  },
)

const updateChoice = (questionID, choiceID, label) => client.apollo.mutate(
  {
    mutation: gql`
    mutation updateChoice(
      $questionID: HashID!,
      $choiceID: HashID!,
      $label: String!
    ) {
      updateChoice(
        data : { label: $label },
        questionID: $questionID,
        choiceID: $choiceID
      ) {
        choice {
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
    }`,
    variables: { questionID, choiceID, label },
  },
)

const orderChoices = (questionID, choices) => client.apollo.mutate(
  {
    mutation: gql`
    mutation orderChoices($questionID: HashID!, $choices: [HashID!]) {
      updateQuestion(
        data: {
          choiceOrder: $choices
        },
        questionID: $questionID
      ) {
        question {
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
      }
    }`,
    variables: { questionID, choices },
  },
)

const orderLabels = (questionID, labels) => client.apollo.mutate(
  {
    mutation: gql`
    mutation orderLabels($questionID: HashID!, $labels: [HashID!]) {
      updateQuestion(
        data: {
          labelOrder: $labels
        },
        questionID: $questionID
      ) {
        question {
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
      }
    }`,
    variables: { questionID, labels },
  },
)

const orderItems = (questionID, items) => client.apollo.mutate(
  {
    mutation: gql`
    mutation orderItems($questionID: HashID!, $items: [HashID!]) {
      updateQuestion(
        data: {
          itemOrder: $items
        },
        questionID: $questionID
      ) {
        question {
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
      }
    }`,
    variables: { questionID, items },
  },
)

const deleteChoice = (questionID, choiceID) => client.apollo.mutate(
  {
    mutation: gql`
    mutation deleteChoice($questionID: HashID!, $choiceID: HashID!) {
      deleteChoice(questionID: $questionID, choiceID: $choiceID) {
        success
      }
    }`,
    variables: { questionID, choiceID },
  },
)

const createItem = questionID => client.apollo.mutate(
  {
    mutation: gql`
    mutation createItem($questionID: HashID!) {
      createItem(data: {label: ""}, questionID: $questionID) {
        item {
          id
          image {
            id
          }
          label
        }
      }
    }`,
    variables: { questionID },
  },
)

const updateItem = (questionID, itemID, label) => client.apollo.mutate(
  {
    mutation: gql`
    mutation updateItem($questionID: HashID!, $itemID: HashID!, $label: String!) {
      updateItem(data: {label: $label}, questionID: $questionID, itemID: $itemID) {
        item {
          id
          image {
            id
            name
            url
            hash
          }
          label
        }
      }
    }`,
    variables: { questionID, itemID, label },
  },
)

const deleteItem = (questionID, itemID) => client.apollo.mutate(
  {
    mutation: gql`
    mutation deleteItem($questionID: HashID!, $itemID: HashID!) {
      deleteItem(itemID: $itemID, questionID: $questionID) {
        success
      }
    }`,
    variables: { questionID, itemID },
  },
)

const deleteQuestion = questionID => client.apollo.mutate(
  {
    mutation: gql`
    mutation deleteQuestion($questionID: HashID!) {
      deleteQuestion(questionID: $questionID) { success }
    }`,
    variables: { questionID },
  },
)

const createLabel = questionID => client.apollo.mutate(
  {
    mutation: gql`
    mutation createLabel($questionID: HashID!) {
      createLabel(
        data: {
          label: "",
          value: 0.0
        },
        questionID: $questionID,
      ) {
        label {
          id
          label
          value
        }
      }
    }`,
    variables: { questionID },
  },
)

const updateLabel = (questionID, labelID, label, value) => client.apollo.mutate(
  {
    mutation: gql`
    mutation updateLabel($questionID: HashID!, $labelID: HashID!, $label: String!, $value: Int!) {
      updateLabel(
        data: {
          label: $label,
          value: $value,
        },
        questionID: $questionID,
        labelID: $labelID,
      ) {
        label {
          id
          label
          value
        }
      }
    }`,
    variables: {
      questionID,
      labelID,
      label,
      value,
    },
  },
)

const deleteLabel = (questionID, labelID) => client.apollo.mutate(
  {
    mutation: gql`
    mutation deleteLabel($questionID: HashID!, $labelID: HashID!) {
      deleteLabel(labelID: $labelID, questionID: $questionID) { success }
    }`,
    variables: { questionID, labelID },
  },
)

const uploadChoiceImage = (questionID, choiceID, file) => client.apollo.mutate(
  {
    mutation: gql`
    mutation setChoiceImage($questionID: HashID!, $choiceID: HashID!, $file: Upload!) {
      setChoiceImage(image: $file, questionID: $questionID, choiceID: $choiceID) {
        choice {
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
    }`,
    variables: { questionID, choiceID, file },
  },
)

const removeChoiceImage = (questionID, choiceID) => client.apollo.mutate(
  {
    mutation: gql`
    mutation removeChoiceImage($questionID: HashID!, $choiceID: HashID!) {
      removeChoiceImage(questionID: $questionID, choiceID: $choiceID ) {
        success
      }
    }`,
    variables: {questionID, choiceID}
  }
)

const uploadItemImage = (questionID, itemID, file) => client.apollo.mutate(
  {
    mutation: gql`
    mutation setItemImage($questionID: HashID!, $itemID: HashID!, $file: Upload!) {
      setItemImage(image: $file, questionID: $questionID, itemID: $itemID) {
        item {
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
      }
    }`,
    variables: { questionID, itemID, file },
  },
)

const removeItemImage = (questionID, itemID) => client.apollo.mutate(
  {
    mutation: gql`
    mutation removeItemImage($questionID: HashID!, $itemID: HashID!) {
      removeItemImage(questionID: $questionID, itemID: $itemID ) {
        success
      }
    }`,
    variables: {questionID, itemID}
  }
)

const uploadLabelImage = (questionID, labelID, file) => client.apollo.mutate(
  {
    mutation: gql`
    mutation setLabelImage($questionID: HashID!, $labelID: HashID!, $file: Upload!) {
      setLabelImage(image: $file, questionID: $questionID, labelID: $labelID) {
        label {
          id
          value
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
    }`,
    variables: { questionID, labelID, file },
  },
)

const removeLabelImage = (questionID, labelID) => client.apollo.mutate(
  {
    mutation: gql`
    mutation removeLabelImage($questionID: HashID!, $labelID: HashID!) {
      removeLabelImage(questionID: $questionID, labelID: $labelID ) {
        success
      }
    }`,
    variables: {questionID, labelID}
  }
)

const uploadLikeIcon = (questionID, file) => client.apollo.mutate(
  {
    mutation: gql`
    mutation uploadLikeIcon($questionID: HashID!, $file: Upload!) {
      updateQuestion(
        data: {
          likeIcon: $file
        },
        questionID: $questionID
      ) {
        question {
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
      }
    }`,
    variables: { questionID, file },
  },
)

const uploadDislikeIcon = (questionID, file) => client.apollo.mutate(
  {
    mutation: gql`
    mutation uploadDislikeIcon($questionID: HashID!, $file: Upload!) {
      updateQuestion(
        data: {
          dislikeIcon: $file
        },
        questionID: $questionID
      ) {
        question {
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
      }
    }`,
    variables: { questionID, file },
  },
)

export default {
  createQuestion,
  appendQuestion,
  updateQuestion,
  updateRegulatorQuestion,
  deleteQuestion,
  createItem,
  updateItem,
  deleteItem,
  createChoice,
  updateChoice,
  deleteChoice,
  createLabel,
  updateLabel,
  deleteLabel,
  orderChoices,
  orderItems,
  orderLabels,
  uploadChoiceImage,
  removeChoiceImage,
  uploadItemImage,
  removeItemImage,
  uploadLabelImage,
  removeLabelImage,
  uploadLikeIcon,
  uploadDislikeIcon,
}
