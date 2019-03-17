const countDecimals = (value) => {
  if(Math.floor(value.valueOf()) === value.valueOf()) return 0
  return value.toString().split('.')[1].length || 0
}

const getRoundingMultiplicator = (value, stepsize) =>
  Math.pow(10, Math.max(countDecimals(value), countDecimals(stepsize)))

const isValueInRange = (value, min, max) => value >= min && value <= max

const isValidLabelValue = (value, min, max, stepsize) => {
  const multiplicator = getRoundingMultiplicator(value, stepsize)
  return isValueInRange(value, min, max)
    && ((value * multiplicator) % (stepsize * multiplicator)) === 0
}

const calculateValidValue = (value, stepsize) => {
  const multiplicator = getRoundingMultiplicator(value, stepsize)
  const difference = (multiplicator * value) % (multiplicator * stepsize) / multiplicator
  return (difference < stepsize / 2) ? value - difference : value + (stepsize - difference)
}

const getNearestPossibleLabelValue = (value, min, max, stepsize) => {
  if (isValidLabelValue(value, min, max, stepsize)) return value
  if (value > max) return max
  if (value < min) return min
  return calculateValidValue(value, stepsize)
}

module.exports = Object.freeze({
  isValueInRange,
  isValidLabelValue,
  getNearestPossibleLabelValue,
})
