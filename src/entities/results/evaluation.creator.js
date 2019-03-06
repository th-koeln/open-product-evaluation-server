const { propertyExists } = require('../../utils/checks')

const countAmountOfAnswersForOptions = (answers, key, answerOptions) =>
  answers.reduce((acc, answer) => {
    acc[`${answer[key]}`] += 1
    return acc
  }, { ...answerOptions })

const createScoreForRankingOptions = (answers, answerOptions) => {
  const tempOptions = { ...answerOptions }
  if (propertyExists(tempOptions, 'null')) {
    delete tempOptions.null
  }

  const keys = Object.keys(tempOptions)

  const filteredAnswers = answers.filter(answer =>
    answer.rankedItems || answer.rankedItems.length > 0
  )

  const countObject = filteredAnswers.reduce((acc, answer) => {
    keys.forEach(key =>
      acc[key] += (keys.length - answer.rankedItems.indexOf(key) - 1)
    )
    return acc
  }, tempOptions)

  keys.forEach(key => {
    countObject[key] =
      Math.round(( countObject[key] / filteredAnswers.length ) / ( keys.length - 1 ) * 1000) / 100
  })

  return countObject
}

const countAmountOfPlacementForRankingOptions = (answers, placement, answerOptions) =>
  answers.reduce((acc, answer) => {
    if (!answer.rankedItems || answer.rankedItems.length === 0) acc.null += 1
    else {
      acc[`${answer.rankedItems[placement]}`] += 1
    }
    return acc
  }, { ...answerOptions })

const getLikeEvaluations = (answers) => {
  const counts = countAmountOfAnswersForOptions(
    answers,
    'liked',
    { true: 0, false: 0, null: 0 },
  )

  const amountEvaluation = {
    metric: 'Amount of votes',
    data: [
      { label: 'Liked', total: counts.true },
      { label: 'Neutral', total: counts.false + counts.null },
    ]
  }

  return [amountEvaluation]
}

const getLikeDislikeEvaluations = (answers) => {
  const counts = countAmountOfAnswersForOptions(
    answers,
    'liked',
    { true: 0, false: 0, null: 0 },
  )

  const amountEvaluation = {
    metric: 'Amount of votes',
    data: [
      { label: 'Liked', total: counts.true },
      { label: 'Disliked', total: counts.false },
      { label: 'Neutral', total: counts.null },
    ]
  }

  return [amountEvaluation]
}

const getChoiceEvaluations = (answers, question) => {
  const answerOptions = question.choices.reduce((acc, choice) => {
    acc[choice.id] = 0
    return acc
  }, { null: 0 })

  const counts = countAmountOfAnswersForOptions(
    answers,
    'choice',
    answerOptions,
  )

  const data = Array.from(
    question.choices.map(choice => ({ label: choice.code, total: counts[choice.id] }))
  )

  data.push({ label: 'Neutral', total: counts.null })

  const amountEvaluation = {
    data,
    metric: 'Amount of votes',
  }

  return [amountEvaluation]
}

const getRegulatorEvaluations = (answers, question) => {
  const range = []
  for (let i = question.min; i <= question.max; i += question.stepSize) {
    range.push(i)
  }

  const answerOptions = range.reduce((acc, rating) => {
    acc[rating] = 0
    return acc
  }, { null: 0 })

  const counts = countAmountOfAnswersForOptions(
    answers,
    'rating',
    answerOptions,
  )

  const data = Array.from(
    range.map(rating => ({ label: `Rating ${rating}`, total: counts[rating] }))
  )

  data.push({ label: 'Neutral', total: counts.null })

  const amountEvaluation = {
    data,
    metric: 'Amount of votes',
  }

  return [amountEvaluation]
}

const getFavoriteEvaluations = (answers, question) => {
  const answerOptions = question.items.reduce((acc, item) => {
    acc[item.id] = 0
    return acc
  }, { null: 0 })

  const counts = countAmountOfAnswersForOptions(
    answers,
    'favoriteItem',
    answerOptions,
  )

  const data = Array.from(
    question.items.map((item, index) => ({
      label:  (item.label) ? item.label : `Item ${index}`,
      total: counts[item.id]
    }))
  )

  data.push({ label: 'Neutral', total: counts.null })

  const amountEvaluation = {
    data,
    metric: 'Amount of votes',
  }

  return [amountEvaluation]
}

const getRankingEvaluations = (answers, question) => {
  const answerOptions = question.items.reduce((acc, item) => {
    acc[item.id] = 0
    return acc
  }, { null: 0 })

  const counts = createScoreForRankingOptions(
    answers,
    answerOptions,
  )

  const data = Array.from(
    question.items.map((item, index) => ({
      label: (item.label) ? item.label : `Item ${index}`,
      total: counts[item.id]
    }))
  )

  const scoreEvaluation = {
    data,
    metric: 'Average item-scores (higher = better average placements)',
  }

  const placementEvaluations = question.items.map((item, index) => {
    const placementCounts = countAmountOfPlacementForRankingOptions(answers, index, answerOptions)

    const placementData = Array.from(
      question.items.map((item, index) => ({
        label: (item.label) ? item.label : `Item ${index}`,
        total: placementCounts[item.id]
      }))
    )

    placementData.push({ label: 'Neutral', total: placementCounts.null })

    return {
      data: placementData,
      metric: `Amount of votes for place ${index + 1}`,
    }
  })

  return [scoreEvaluation, ...placementEvaluations]
}

module.exports = Object.freeze({
  getLikeEvaluations,
  getLikeDislikeEvaluations,
  getChoiceEvaluations,
  getRegulatorEvaluations,
  getFavoriteEvaluations,
  getRankingEvaluations
})
