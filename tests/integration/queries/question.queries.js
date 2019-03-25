const { getRequestString } = require('../helper/helpers')
const replaceTypes = (query) => query.replace(/(\")(LIKE|LIKEDISLIKE|CHOICE|REGULATOR|FAVORITE|RANKING)(\")/g, '$2')

function createQuestionMutation(surveyID, type, createData) {
  return {
    query: replaceTypes(getRequestString(
      'mutation',
      'createQuestion',
      `
        question {
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
      `,
      { data: { surveyID, type, ...createData } }
    ))
  }
}

function updateQuestionMutation(questionID, updateData) {
  return {
    query: replaceTypes(getRequestString(
      'mutation',
      'updateQuestion',
      `
        question {
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
      `,
      { questionID, data: updateData }
    )),
  }
}

function deleteQuestionMutation(questionID) {
  return {
    query: `mutation {
      deleteQuestion(questionID:"${questionID}"){
        success
      }
    }`,
  }
}

function createItemMutation(questionID, label) {
  return {
    query: getRequestString(
      'mutation',
      'createItem',
      `
        item {
          label
        }
      `,
      { questionID, data: { label } }
    )
  }
}

function updateItemMutation(questionID, itemID, label) {
  return {
    query: getRequestString(
      'mutation',
      'updateItem',
      `
        item {
          id
          label
        }
      `,
      { questionID, itemID, data: { label } }
    ),
  }
}

function deleteItemMutation(questionID, itemID) {
  return {
    query: `mutation {
      deleteItem(questionID:"${questionID}", itemID:"${itemID}"){
        success
      }
    }`,
  }
}

function createChoiceMutation(questionID, createData) {
  return {
    query: getRequestString(
      'mutation',
      'createChoice',
      `
        choice {
          label
        }
      `,
      { questionID, data: createData }
    )
  }
}

function updateChoiceMutation(questionID, choiceID, updateData) {
  return {
    query: getRequestString(
      'mutation',
      'updateChoice',
      `
        choice {
          id
          label
          code
        }
      `,
      { questionID, choiceID, data: updateData }
    ),
  }
}

function deleteChoiceMutation(questionID, choiceID) {
  return {
    query: `mutation {
      deleteChoice(questionID:"${questionID}", choiceID:"${choiceID}"){
        success
      }
    }`,
  }
}

function createLabelMutation(questionID, createData) {
  return {
    query: getRequestString(
      'mutation',
      'createLabel',
      `
        label {
          label
          value
        }
      `,
      { questionID, data: createData }
    )
  }
}

function updateLabelMutation(questionID, labelID, updateData) {
  return {
    query: getRequestString(
      'mutation',
      'updateLabel',
      `
        label {
          id
          label
          value
        }
      `,
      { questionID, labelID, data: updateData }
    ),
  }
}

function deleteLabelMutation(questionID, labelID) {
  return {
    query: `mutation {
      deleteLabel(questionID:"${questionID}", labelID:"${labelID}"){
        success
      }
    }`,
  }
}

module.exports = {
  createQuestionMutation,
  updateQuestionMutation,
  deleteQuestionMutation,
  createItemMutation,
  updateItemMutation,
  deleteItemMutation,
  createChoiceMutation,
  updateChoiceMutation,
  deleteChoiceMutation,
  createLabelMutation,
  updateLabelMutation,
  deleteLabelMutation
}
