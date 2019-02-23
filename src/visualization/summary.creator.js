const {
  getLikeEvaluations,
  getLikeDislikeEvaluations,
  getChoiceEvaluations,
  getRegulatorEvaluations,
  getFavoriteEvaluations,
  getRankingEvaluations,
} = require('./evaluation.creator')

const getVotesAndQuestionsOfVersion = async (versionId, models) => {
  const [version] = await models.version.get({ _id: versionId })
  const votes = await models.vote.get({ version: version.id })
  const questions = (version.questions && version.questions.length > 0)
    ? version.questions
    : await models.question.get({ survey: version.survey })
  return { questions, votes }
}

/** preparedData = [{
 *    question,
 *    answers
 *  }] **/
const prepareDataForCalculations = async (questions, votes) => {
  const assignmentObject = questions.reduce((acc, question) => ({
    ...acc,
    [question.id]: {
      question,
      answers: [],
    },
  }), {})

  votes.forEach((vote) => {
    vote.answers.forEach((answer) => {
      assignmentObject[answer.question].answers.push(answer)
    })
  })

  return Object.values(assignmentObject)
}

const calculateSummaries = async preparedData => preparedData.map((data) => {
  const summary = {
    question: data.question.id,
    type: data.question.type,
    value: data.question.value,
    evaluations: [],
  }

  switch(data.question.type) {
    case 'LIKE': {
      summary.evaluations = getLikeEvaluations(data.answers)
      break
    }
    case 'LIKEDISLIKE': {
      summary.evaluations = getLikeDislikeEvaluations(data.answers)
      break
    }
    case 'CHOICE': {
      summary.evaluations = getChoiceEvaluations(data.answers, data.question)
      break
    }
    case 'REGULATOR': {
      summary.evaluations = getRegulatorEvaluations(data.answers, data.question)
      break
    }
    case 'FAVORITE': {
      summary.evaluations = getFavoriteEvaluations(data.answers, data.question)
      break
    }
    case 'RANKING': {
      summary.evaluations = getRankingEvaluations(data.answers, data.question)
      break
    }
    default: break
  }

  return summary
})

const createSummaryForVersion = async (versionId, models) => {
  try {
    const { questions, votes } = await getVotesAndQuestionsOfVersion(versionId, models)
    const preparedData = await prepareDataForCalculations(questions, votes)
    const summaries = await calculateSummaries(preparedData)

    return summaries
  } catch (e) {
    return null
  }
}

const createAndPersistSummaryForVersion = async (versionId, models) => {
  const summaries = await createSummaryForVersion(versionId, models)
  if (summaries) await models.version.update({ _id: versionId }, { summaries })
  return summaries
}

module.exports = Object.freeze({
  createSummaryForVersion,
  createAndPersistSummaryForVersion
})
