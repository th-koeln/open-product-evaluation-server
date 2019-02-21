const { sortObjectsByIdArray } = require('../../utils/sort')

module.exports = {
  VersionEntries: {
    votes: async (parent, args, { models }) => {
      try {
        return await models.vote.get(
          { version: parent.id },
          null,
          null,
          { creationDate: 'Ascending' },
        )
      } catch (e) { return null }
    },
    to: async parent => (parent.to) ? parent.to : new Date(),
    questions: async (parent, args, { models }) => {
      try {
        if (parent.questions && parent.questions.length > 0) return parent.questions
        const questions = await models.question.get({ survey: parent.survey })
        const [{ questionOrder }] = await models.survey.get({ _id: parent.survey })

        return sortObjectsByIdArray(questionOrder, questions)
      } catch (e) { return null }
    },
  },
  Results: {
    from: async (parent, args, { models }) => {
      try {
        const versions = await models.version.get(
          { survey: parent.id },
          null,
          null,
          { versionNumber: 'Ascending' },
        )

        return versions[0].from
      } catch (e) {
        return null
      }
    },
    to: async (parent, args, { models }) => {
      try {
        const versions = await models.version.get(
          { survey: parent.id },
          null,
          null,
          { versionNumber: 'Descending' },
        )

        return (versions[0].to) ? versions[0].to : new Date()
      } catch (e) { return null }
    },
    numberOfVotes: async (parent, args, { models }) => {
      try {
        const versions = await models.version.get({ survey: parent.id })
        const versionIds = versions.map(version => version.id)
        const votes = await models.vote.get({ version: { $in: versionIds }})
        return votes.length
      } catch (e) { return 0 }
    },
    versions: async (parent, args, { models }) => {
      try {
        return await models.version.get(
          { survey: parent.id },
          null,
          null,
          { versionNumber: 'Ascending' },
        )
      } catch (e) { return null }
    },
  },
}
