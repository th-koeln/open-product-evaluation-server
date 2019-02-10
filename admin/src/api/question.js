import client from '@/utils/client'
import gql from 'graphql-tag'

const createQuestion = surveyID => client.mutate(
  {
    mutation: gql`
    mutation createQuestion($surveyID: ID!) {
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
          type
          value
          lastUpdate
          description
          creationDate
          __typename
        }
      }
    }`,
    variables: { surveyID },
  },
)

const updateQuestion = (questionID, value, description, type) => client.mutate(
  {
    mutation: gql`
    mutation updateQuestion(
      $questionID: ID!,
      $value: String!,
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
          type
          value
          lastUpdate
          description
          creationDate
          __typename
          ... on RegulatorQuestion {
            min
            max
            default
            stepSize
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

const updateRegulatorQuestion = (questionID, min, max, stepSize, d) => client.mutate(
  {
    mutation: gql`
    mutation updateRegulatorQuestion(
      $questionID: ID!,
      $min: Float!,
      $max: Float!,
      $default: Float!,
      $stepSize: Float!
    ) {
      updateQuestion(
        questionID: $questionID,
        data: {
          min: $min,
          max: $max,
          regulatorDefault: $default,
          stepSize: $stepSize
        }
      ) {
        question {
          id
          type
          value
          lastUpdate
          description
          creationDate
          __typename
          ... on RegulatorQuestion {
            min
            max
            default
            stepSize
          }
        }
      }
    }`,
    variables: {
      questionID,
      min,
      max,
      stepSize,
      d,
    },
  },
)

const createChoice = questionID => client.mutate(
  {
    mutation: gql`
    mutation createChoice($questionID: ID!) {
      createChoice(data: {label: ""}, questionID: $questionID) {
        choice {
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

const updateChoice = (questionID, choiceID, label) => client.mutate(
  {
    mutation: gql`
    mutation updateChoice(
      $questionID: ID!,
      $choiceID: ID!,
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
        }
      }
    }`,
    variables: { questionID, choiceID, label },
  },
)

const deleteChoice = (questionID, choiceID) => client.mutate(
  {
    mutation: gql`
    mutation deleteChoice($questionID: ID!, $choiceID: ID!) {
      deleteChoice(questionID: $questionID, choiceID: $choiceID) {
        success
      }
    }`,
    variables: { questionID, choiceID },
  },
)

const createItem = questionID => client.mutate(
  {
    mutation: gql`
    mutation createItem($questionID: ID!) {
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

const updateItem = (questionID, itemID, label) => client.mutate(
  {
    mutation: gql`
    mutation updateItem($questionID: ID!, $itemID: ID!, $label: String!) {
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

const deleteItem = (questionID, itemID) => client.mutate(
  {
    mutation: gql`
    mutation deleteItem($questionID: ID!, $itemID: ID!) {
      deleteItem(itemID: $itemID, questionID: $questionID) {
        success
      }
    }`,
    variables: { questionID, itemID },
  },
)

const deleteQuestion = questionID => client.mutate(
  {
    mutation: gql`
    mutation deleteQuestion($questionID: ID!) {
      deleteQuestion(questionID: $questionID) { success }
    }`,
    variables: { questionID },
  },
)

const createLabel = questionID => client.mutate(
  {
    mutation: gql`
    mutation createLabel($questionID: ID!) {
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

const updateLabel = (questionID, labelID, label, value) => client.mutate(
  {
    mutation: gql`
    mutation updateLabel($questionID: ID!, $labelID: ID!, $label: String!, $value: Float!) {
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

const deleteLabel = (questionID, labelID) => client.mutate(
  {
    mutation: gql`
    mutation deleteLabel($questionID: ID!, $labelID: ID!) {
      deleteLabel(labelID: $labelID, questionID: $questionID) { success }
    }`,
    variables: { questionID, labelID },
  },
)

const uploadChoiceImage = (questionID, choiceID, file) => client.mutate(
  {
    mutation: gql`
    mutation setChoiceImage($questionID: ID!, $choiceID: ID!, $file: Upload!) {
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
            tags
            creationDate
          }
        }
      }
    }`,
    variables: { questionID, choiceID, file },
  },
)

const removeChoiceImage = (questionID, choiceID) => client.mutate(
  {
    mutation: gql`
    mutation removeChoiceImage($questionID: ID!, $choiceID: ID!) {
      removeChoiceImage(questionID: $questionID, choiceID: $choiceID ) {
        success
      }
    }`,
    variables: {questionID, choiceID}
  }
)

const uploadItemImage = (questionID, itemID, file) => client.mutate(
  {
    mutation: gql`
    mutation setItemImage($questionID: ID!, $itemID: ID!, $file: Upload!) {
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
            tags
            creationDate
          }
        }
      }
    }`,
    variables: { questionID, itemID, file },
  },
)

const uploadLabelImage = (questionID, labelID, file) => client.mutate(
  {
    mutation: gql`
    mutation setLabelImage($questionID: ID!, $labelID: ID!, $file: Upload!) {
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
            tags
            creationDate
          }
        }
      }
    }`,
    variables: { questionID, labelID, file },
  },
)

const uploadLikeIcon = (questionID, file) => client.mutate(
  {
    mutation: gql`
    mutation uploadLikeIcon($questionID: ID!, $file: Upload!) {
      updateQuestion(
        data: {
          likeIcon: $file
        },
        questionID: $questionID
      ) {
        question {
          id
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
        }
      }
    }`,
    variables: { questionID, file },
  },
)

const uploadDislikeIcon = (questionID, file) => client.mutate(
  {
    mutation: gql`
    mutation uploadDislikeIcon($questionID: ID!, $file: Upload!) {
      updateQuestion(
        data: {
          dislikeIcon: $file
        },
        questionID: $questionID
      ) {
        question {
          id
          ... on LikeDislikeQuestion {
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
        }
      }
    }`,
    variables: { questionID, file },
  },
)

export default {
  createQuestion,
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
  uploadChoiceImage,
  removeChoiceImage,
  uploadItemImage,
  uploadLabelImage,
  uploadLikeIcon,
  uploadDislikeIcon,
}
