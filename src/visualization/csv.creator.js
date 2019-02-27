const converter = require('json-2-csv')

const { createHashFromId } = require('../store/id.store')
const { sortObjectsByIdArray } = require('../utils/sort')

const flattenAnswersIntoVoteObjects = (votes, version) => votes.map((vote, index) => {
  const flattenedVote = vote.answers.reduce((acc, answer, index) => {
    const flattenedAnswer = { }

    switch (answer.type) {
      case 'LIKE': {
        flattenedAnswer[`Question_${index + 1}`] = (answer.liked) ? 'Like' : ''
        break
      }
      case 'LIKEDISLIKE': {
        if (answer.liked === null) flattenedAnswer[`Question_${index + 1}`] = ''
        else {
          flattenedAnswer[`Question_${index + 1}`] = (answer.liked)
            ? 'Like'
            : 'Dislike'
        }
        break
      }
      case 'CHOICE': {
        flattenedAnswer[`Question_${index + 1}`] = (answer.choice)
          ? createHashFromId(answer.choice)
          : ''
        break
      }
      case 'REGULATOR': {
        flattenedAnswer[`Question_${index + 1}`] = answer.rating
        break
      }
      case 'FAVORITE': {
        flattenedAnswer[`Question_${index + 1}`] = (answer.favoriteItem)
          ? createHashFromId(answer.favoriteItem) : ''
        break
      }
      case 'RANKING': {
        version.questions[index].items.forEach((question, i) => {
          flattenedAnswer[`Question_${index + 1}_Place_${i + 1}`] = ''
        })

        if (answer.rankedItems) {
          answer.rankedItems.forEach((id, i) => {
            flattenedAnswer[`Question_${index + 1}_Place_${i + 1}`] = createHashFromId(id)
          })
        }
        break
      }
    }

    return {
      ...acc,
      ...flattenedAnswer,
    }
  }, {
    Vote: `Vote_${index + 1}`,
    VoteID: createHashFromId(vote.id),
    VersionID: createHashFromId(version._id.toString()),
    CreationDate: vote.creationDate,
    Creation: {
      Date: vote.creationDate.toLocaleDateString(),
      Hours: vote.creationDate.getHours(),
      Minutes: vote.creationDate.getMinutes(),
      Seconds: vote.creationDate.getSeconds(),
      Milliseconds: vote.creationDate.getMilliseconds(),
    },
    Client: createHashFromId(vote.client),
    Domain: createHashFromId(vote.domain),
  })

  return flattenedVote
})

const prepareVoteData = async (version, models) => {
  const votes = await models.vote.get({ version: version._id })

  return flattenAnswersIntoVoteObjects(votes, version)
}

const prepareVersionData = async (version) => {
  const to = (version.to) ? version.to : new Date()
  return [{
    Version: `Version_${version.versionNumber}`,
    VersionID: createHashFromId(version._id.toString()),
    SurveyID: createHashFromId(version.survey.toString()),
    CreationDate: version.from,
    Creation: {
      Date: version.from.toLocaleDateString(),
      Hours: version.from.getHours(),
      Minutes: version.from.getMinutes(),
      Seconds: version.from.getSeconds(),
      Milliseconds: version.from.getMilliseconds(),
    },
    EndingDate: to,
    Ending: {
      Date: to.toLocaleDateString(),
      Hours: to.getHours(),
      Minutes: to.getMinutes(),
      Seconds: to.getSeconds(),
      Milliseconds: to.getMilliseconds(),
    },
  }]
}

const prepareQuestionData = async (version) => version.questions.map((question, index) => ({
  Question: `Question_${index + 1}`,
  QuestionID: createHashFromId(question.id),
  VersionID: createHashFromId(version._id.toString()),
  CreationDate: question.creationDate,
  Creation: {
    Date: question.creationDate.toLocaleDateString(),
    Hours: question.creationDate.getHours(),
    Minutes: question.creationDate.getMinutes(),
    Seconds: question.creationDate.getSeconds(),
    Milliseconds: question.creationDate.getMilliseconds(),
  },
  LastUpdate: question.lastUpdate,
  Update: {
    Date: question.lastUpdate.toLocaleDateString(),
    Hours: question.lastUpdate.getHours(),
    Minutes: question.lastUpdate.getMinutes(),
    Seconds: question.lastUpdate.getSeconds(),
    Milliseconds: question.lastUpdate.getMilliseconds(),
  },
  Type: question.type || '',
  Value: question.value || '',
  Description: question.description || '',
  Choice: {
    Default: (question.choiceDefault) ? createHashFromId(question.choiceDefault) : '',
  },
  Regulator: {
    Min: (question.type === 'REGULATOR') ? question.min : '',
    Max: (question.type === 'REGULATOR') ? question.max : '',
    StepSize: (question.type === 'REGULATOR') ? question.stepSize : '',
    Default: (question.type === 'REGULATOR') ? question.regulatorDefault : '',
  },
}))

const prepareItemsData = async (version) => version.questions.reduce((acc, question) => {
  if (!question.items || question.items.length === 0) return acc

  const itemData = question.items.map((item, index) => ({
    Item: `Item_${acc.length + 1 + index}`,
    ItemID: createHashFromId(item.id),
    VersionID: createHashFromId(version._id.toString()),
    QuestionID: createHashFromId(question.id),
    Text: item.label || '',
  }))

  return [...acc, ...itemData]
}, [])

const prepareChoicesData = async (version) => version.questions.reduce((acc, question) => {
  if (!question.choices || question.choices.length === 0) return acc

  const choiceData = question.choices.map((choice, index) => ({
    Choice: `Choice_${acc.length + 1 + index}`,
    ChoiceID: createHashFromId(choice.id),
    VersionID: createHashFromId(version._id.toString()),
    QuestionID: createHashFromId(question.id),
    Text: choice.label || '',
    Code: choice.code || '',
  }))

  return [...acc, ...choiceData]
}, [])

const prepareLabelsData = async (version) => version.questions.reduce((acc, question) => {
  if (!question.labels || question.labels.length === 0) return acc

  const labelData = question.labels.map((label, index) => ({
    Label: `Label_${acc.length + 1 + index}`,
    ChoiceID: createHashFromId(label.id),
    VersionID: createHashFromId(version._id.toString()),
    QuestionID: createHashFromId(question.id),
    Text: label.label || '',
    Value: label.value || 0,
  }))

  return [...acc, ...labelData]
}, [])

const createCSVForVersion = async (version, models) => {
  const [survey] = await models.survey.get({ _id: version.survey })
  const versionWithQuestions = { ...version.toObject() }

  if (!versionWithQuestions.questions || versionWithQuestions.questions.length === 0) {
    versionWithQuestions.questions = sortObjectsByIdArray(
      survey.questionOrder,
      await models.question.get({ survey: survey.id }),
    )
  }

  const preparedVersionData = await prepareVersionData(versionWithQuestions)
  const preparedQuestionData = await prepareQuestionData(versionWithQuestions)
  const preparedItemData = await prepareItemsData(versionWithQuestions)
  const preparedChoiceData = await prepareChoicesData(versionWithQuestions)
  const preparedLabelData = await prepareLabelsData(versionWithQuestions)
  const preparedVoteData = await prepareVoteData(versionWithQuestions, models)

  const versionCSV = await converter.json2csvAsync(preparedVersionData, {
    emptyFieldValue: '',
  })

  const questionCSV = await converter.json2csvAsync(preparedQuestionData, {
    emptyFieldValue: '',
  })

  const itemCSV = await converter.json2csvAsync(preparedItemData, {
    emptyFieldValue: '',
  })

  const choiceCSV = await converter.json2csvAsync(preparedChoiceData, {
    emptyFieldValue: '',
  })

  const labelCSV = await converter.json2csvAsync(preparedLabelData, {
    emptyFieldValue: '',
  })

  const voteCSV = await converter.json2csvAsync(preparedVoteData, {
    emptyFieldValue: '',
  })

  return {
    version: versionCSV,
    question: questionCSV,
    item: itemCSV,
    choice: choiceCSV,
    label: labelCSV,
    vote: voteCSV,
  }
}

module.exports = Object.freeze({
  createCSVForVersion
})
