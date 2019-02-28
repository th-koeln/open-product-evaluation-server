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

const createOwnerFilter = (name) => {
  const firstNameFilter = getStartsWithFilter('firstName', name)
  const lastNameFilter = getStartsWithFilter('lastName', name)
  const emailFilter = getStartsWithFilter('email', name)

  return [firstNameFilter, lastNameFilter, emailFilter]
}

const createSurveyFilter = async (filterBy, models) => {
  if (!filterBy) return {}

  let filter = {}

  if (filterBy.title) filter = getStartsWithFilter('title', filterBy.title)

  if (Object.prototype.hasOwnProperty.call(filterBy, 'isActive')) filter.isActive = filterBy.isActive

  if (filterBy.creator) {
    const ownerFilters = createOwnerFilter(filterBy.creator)

    try {
      const possibleCreatorIds = (await models.user.get({
        $or: ownerFilters,
      })).map(user => user.id)

      filter.creator = { $in: possibleCreatorIds }
    } catch (e) { throw new Error('No Survey found.') }
  }

  return filter
}


const createUserFilter = async (filterBy) => {
  if (!filterBy) return {}

  let filter = {}

  if (filterBy.firstName) filter = getStartsWithFilter('firstName', filterBy.firstName)

  if (filterBy.lastName) filter.lastName = getStartsWithFilter('lastName', filterBy.lastName)

  if (filterBy.email) filter.email = getStartsWithFilter('email', filterBy.email)

  if (filterBy.isAdmin) filter.isAdmin = filterBy.isAdmin

  return filter
}

const createClientFilter = async (filterBy, models) => {
  if (!filterBy) return {}

  let filter = {}

  if (filterBy.name) filter = getStartsWithFilter('name', filterBy.name)

  if (filterBy.domain) {
    const domainNameFilter = getStartsWithFilter('name', filterBy.domain)

    try {
      const possibleDomainIds = (await models.domain.get(domainNameFilter)).map(d => d.id)

      filter.domain = { $in: possibleDomainIds }
    } catch (e) { throw new Error('No Client found.') }
  }

  if (filterBy.owner) {
    const ownerFilters = createOwnerFilter(filterBy.owner)

    try {
      const possibleOwnerIds = (await models.user.get({
        $or: ownerFilters,
      })).map(user => user.id)

      filter.owners = { $in: possibleOwnerIds }
    } catch (e) {
      throw new Error('No Client found.')
    }
  }

  return filter
}

const createDomainFilter = async (filterBy, models) => {
  if (!filterBy) return {}

  let filter = {}

  if (filterBy.name) filter = getStartsWithFilter('name', filterBy.name)

  if (filterBy.activeSurvey) {
    const surveyTitleFilter = getStartsWithFilter('title', filterBy.activeSurvey)

    try {
      const possibleSurveyIds = (await models.survey.get(surveyTitleFilter)).map(s => s.id)

      filter.activeSurvey = { $in: possibleSurveyIds }
    } catch (e) { throw new Error('No Domain found.') }
  }

  if (Object.prototype.hasOwnProperty.call(filterBy, 'isPublic')) filter.isPublic = filterBy.isPublic

  if (filterBy.owner) {
    const ownerFilters = createOwnerFilter(filterBy.owner)

    try {
      const possibleOwnerIds = (await models.user.get({
        $or: ownerFilters,
      })).map(user => user.id)

      filter.owners = { $in: possibleOwnerIds }
    } catch (e) {
      throw new Error('No Domain found.')
    }
  }

  return filter
}

const createVoteFilter = async (filterBy, models) => {
  if (!filterBy) return {}

  let filter = {}

  if (filterBy.domain) {
    const domainNameFilter = getStartsWithFilter('name', filterBy.domain)

    try {
      const possibleDomainIds = (await models.domain.get(domainNameFilter)).map(d => d.id)

      filter.domain = { $in: possibleDomainIds }
    } catch (e) { throw new Error('No Vote found.') }
  }

  if (filterBy.client) {
    const clientNameFilter = getStartsWithFilter('name', filterBy.client)

    try {
      const possibleClientIds = (await models.client.get(clientNameFilter)).map(c => c.id)

      filter.client = { $in: possibleClientIds }
    } catch (e) { throw new Error('No Vote found.') }
  }

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
