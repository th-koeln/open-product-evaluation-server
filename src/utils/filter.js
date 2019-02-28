const { CLIENT } = require('./roles')

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

const getStartsWithFilter = (attribute, startsWith) => ({
  [attribute]: { $regex: `^${startsWith}`, $options: 'i' }
})

const getContainsFilter = (attribute, startsWith) => ({
  [attribute]: { $regex: `.*${startsWith}.*`, $options: 'i' }
})

const createOwnerFilter = (name) => {
  const firstNameFilter = getStartsWithFilter('firstName', name)
  const lastNameFilter = getStartsWithFilter('lastName', name)
  const emailFilter = getContainsFilter('email', name)

  return [firstNameFilter, lastNameFilter, emailFilter]
}

const createSurveyFilter = async (role, filterBy, models) => {
  if (!filterBy) return {}

  const { search } = filterBy
  const filter = { $or: [] }

  filter.$or.push(getContainsFilter('title', search))

  filter.$or.push(getContainsFilter('description', search))

  if (role !== CLIENT) {
    try {
      const ownerFilters = createOwnerFilter(search)

      const possibleCreatorIds = (await models.user.get({
        $or: ownerFilters,
      })).map(user => user.id)

      filter.$or.push({ creator: { $in: possibleCreatorIds } })
    } catch (e) {}
  }

  return filter
}


const createUserFilter = async (filterBy) => {
  if (!filterBy) return {}

  const { search } = filterBy
  const filter = { $or: [] }

  filter.$or.push(getStartsWithFilter('firstName', search))

  filter.$or.push(getStartsWithFilter('lastName', search))

  filter.$or.push(getContainsFilter('email', search))

  return filter
}

const createClientFilter = async (role, filterBy, models) => {
  if (!filterBy) return {}

  const { search } = filterBy
  const filter = { $or: [] }

  filter.$or.push(getStartsWithFilter('name', search))

  if (role !== CLIENT) {
    try {
      const domainNameFilter = getStartsWithFilter('name', search)

      const possibleDomainIds = (await models.domain.get(domainNameFilter)).map(d => d.id)

      filter.$or.push({ domain: { $in: possibleDomainIds } })
    } catch (e) {}
  }

  if (role !== CLIENT) {
    try {
      const ownerFilters = createOwnerFilter(search)

      const possibleOwnerIds = (await models.user.get({
        $or: ownerFilters,
      })).map(user => user.id)

      filter.$or.push({ owners: { $in: possibleOwnerIds } })
    } catch (e) {}
  }

  return filter
}

const createDomainFilter = async (role, filterBy, models) => {
  if (!filterBy) return {}

  const { search } = filterBy
  const filter = { $or: [] }

  filter.$or.push(getStartsWithFilter('name', search))

  try {
    const surveyTitleFilter = getContainsFilter('title', search)

    const possibleSurveyIds = (await models.survey.get(surveyTitleFilter)).map(s => s.id)

    filter.$or.push({ activeSurvey: { $in: possibleSurveyIds } })
  } catch (e) {}

  try {
    const surveyTitleFilter = getContainsFilter('description', search)

    const possibleSurveyIds = (await models.survey.get(surveyTitleFilter)).map(s => s.id)

    filter.$or.push({ activeSurvey: { $in: possibleSurveyIds } })
  } catch (e) {}

  if (role !== CLIENT) {
    try {
      const ownerFilters = createOwnerFilter(search)

      const possibleOwnerIds = (await models.user.get({
        $or: ownerFilters,
      })).map(user => user.id)

      filter.$or.push({ owners: { $in: possibleOwnerIds } })
    } catch (e) {}
  }

  return filter
}

const createVoteFilter = async (filterBy, models) => {
  if (!filterBy) return {}

  const { search } = filterBy
  const filter = { $or: [] }

  try {
    const domainNameFilter = getStartsWithFilter('name', search)

    const possibleDomainIds = (await models.domain.get(domainNameFilter)).map(d => d.id)

    filter.$or.push({ domain: { $in: possibleDomainIds } })
  } catch (e) {}

  try {
    const clientNameFilter = getStartsWithFilter('name', search)

    const possibleClientIds = (await models.client.get(clientNameFilter)).map(c => c.id)

    filter.$or.push({ client: { $in: possibleClientIds } })
  } catch (e) {}

  return filter
}

module.exports = Object.freeze({
  getSortObjectFromRequest,
  getPaginationLimitFromRequest,
  getPaginationOffsetFromRequest,
  createSurveyFilter,
  createUserFilter,
  createClientFilter,
  createDomainFilter,
  createVoteFilter,
})
