// eslint-disable-next-line
const getSortObjectFromRequest = (sortArray) => {
  return sortArray
    ? sortArray.reduce((acc, option) => ({ ...acc, [option.fieldName]: option.sortOption }), {})
    : undefined
}

// eslint-disable-next-line
const getPaginationLimitFromRequest = pagination => pagination ? pagination.limit : undefined

// eslint-disable-next-line
const getPaginationOffsetFromRequest = pagination => pagination ? pagination.offset : undefined

// TODO: maybe regex and black-/whitelist characters
const getQueryObjectForParameter = parameter => Object.keys(parameter).reduce((acc, key) => {
  const { filterMethod } = parameter[key]
  const paramObject = {
    [key]: { [filterMethod]: parameter[key].value },
  }

  if (filterMethod === '$regex') {
    paramObject[key].$options = 'i'
  }

  return { ...acc, ...paramObject }
}, [])

const getQueryObjectForFilter = (filter) => {
  if (!filter) {
    return {}
  }

  let childFilter = []

  if (filter.moreFilter) {
    childFilter = [
      ...childFilter,
      ...filter.moreFilter.map(f => getQueryObjectForFilter(f)),
    ]
  }

  if (filter.parameters) {
    childFilter = [
      ...childFilter,
      ...filter.parameters.map(p => getQueryObjectForParameter(p)),
    ]
  }

  return { [filter.connector]: childFilter }
}

module.exports = Object.freeze({
  getSortObjectFromRequest,
  getPaginationLimitFromRequest,
  getPaginationOffsetFromRequest,
  getQueryObjectForFilter,
})
