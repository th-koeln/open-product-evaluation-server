const users = require('../../../seeds/data/user/user')
const surveys = require('../../../seeds/data/survey/survey')
const questions = require('../../../seeds/data/question/question')
const { Seeder } = require('mongo-seeding')
const config = require('../../../../config')
const { unauthRequest, authRequest } = require('../../helper/requests')
const { getSeedID } = require('../../helper/helpers')
const {
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
} = require('../../requests/question.requests')
const { loginUserMutation } = require('../../requests/user.requests')
const { updateSurveyMutation } = require('../../requests/survey.requests')

const seeder = new Seeder(config.seeder)
const collections = seeder.readCollectionsFromPath(config.seeder.inputPath)

describe('Unauthorized', () => {
  const admin = users[1]

  beforeEach(async () => {
    await seeder.import(collections)

    const adminQuery = loginUserMutation(admin.email, 'password')
    const { data: adminData, errors: adminErrors } = await unauthRequest(adminQuery)

    expect(adminData.login).not.toBeNull()
    expect(adminErrors).toBeUndefined()

    const { login: { token: adminToken } } = adminData

    const inactiveQuery = updateSurveyMutation(
      getSeedID(surveys[0]),
      { isActive: false }
    )
    const { errors: inactiveErrors } = await authRequest(inactiveQuery, adminToken)

    expect(inactiveErrors).toBeUndefined()
  })

  describe('should not', async () => {
    it('create a like question', async () => {
      const query = createQuestionMutation(
        getSeedID(surveys[0]),
        'LIKE',
        { value: 'New value', description: 'New description' }
      )
      const { data, errors } = await unauthRequest(query)

      expect(data).toBeNull()
      expect(errors.length).toBeGreaterThan(0)
    })
    it('create a dislike question', async () => {
      const query = createQuestionMutation(
        getSeedID(surveys[0]),
        'LIKEDISLIKE',
        { value: 'New value', description: 'New description' }
      )
      const { data, errors } = await unauthRequest(query)

      expect(data).toBeNull()
      expect(errors.length).toBeGreaterThan(0)
    })
    it('create a choice question', async () => {
      const query = createQuestionMutation(
        getSeedID(surveys[0]),
        'CHOICE',
        { value: 'New value', description: 'New description' }
      )
      const { data, errors } = await unauthRequest(query)

      expect(data).toBeNull()
      expect(errors.length).toBeGreaterThan(0)
    })
    it('create a regulator question', async () => {
      const query = createQuestionMutation(
        getSeedID(surveys[0]),
        'REGULATOR',
        { value: 'New value', description: 'New description' }
      )
      const { data, errors } = await unauthRequest(query)

      expect(data).toBeNull()
      expect(errors.length).toBeGreaterThan(0)
    })
    it('create a favorite question', async () => {
      const query = createQuestionMutation(
        getSeedID(surveys[0]),
        'FAVORITE',
        { value: 'New value', description: 'New description' }
      )
      const { data, errors } = await unauthRequest(query)

      expect(data).toBeNull()
      expect(errors.length).toBeGreaterThan(0)
    })
    it('create a ranking question', async () => {
      const query = createQuestionMutation(
        getSeedID(surveys[0]),
        'RANKING',
        { value: 'New value', description: 'New description' }
      )
      const { data, errors } = await unauthRequest(query)

      expect(data).toBeNull()
      expect(errors.length).toBeGreaterThan(0)
    })
    it('update value of any question', async () => {
      const query = updateQuestionMutation(
        getSeedID(questions[0]),
        { value: 'New title' },
      )
      const { data, errors } = await unauthRequest(query)

      expect(data).toBeNull()
      expect(errors.length).toBeGreaterThan(0)
    })
    it('update description of any question', async () => {
      const query = updateQuestionMutation(
        getSeedID(questions[0]),
        { description: 'New title' },
      )
      const { data, errors } = await unauthRequest(query)

      expect(data).toBeNull()
      expect(errors.length).toBeGreaterThan(0)
    })
    it('update type of any question', async () => {
      const query = updateQuestionMutation(
        getSeedID(questions[0]),
        { type: 'CHOICE' },
      )
      const { data, errors } = await unauthRequest(query)

      expect(data).toBeNull()
      expect(errors.length).toBeGreaterThan(0)
    })
    it('update itemOrder of any question', async () => {
      const query = updateQuestionMutation(
        getSeedID(questions[1]),
        { itemOrder: [
          getSeedID({ _id: questions[1].itemOrder[1] }),
          getSeedID({ _id: questions[1].itemOrder[0] }),
        ] },
      )
      const { data, errors } = await unauthRequest(query)

      expect(data).toBeNull()
      expect(errors.length).toBeGreaterThan(0)
    })
    it('update max of any regulator question', async () => {
      const query = updateQuestionMutation(
        getSeedID(questions[3]),
        { max: 20 },
      )
      const { data, errors } = await unauthRequest(query)

      expect(data).toBeNull()
      expect(errors.length).toBeGreaterThan(0)
    })
    it('update regulatorDefault of any regulator question', async () => {
      const query = updateQuestionMutation(
        getSeedID(questions[3]),
        { regulatorDefault: 6 },
      )
      const { data, errors } = await unauthRequest(query)

      expect(data).toBeNull()
      expect(errors.length).toBeGreaterThan(0)
    })
    it('update labelOrder of any regulator question', async () => {
      const query = updateQuestionMutation(
        getSeedID(questions[3]),
        { labelOrder: [
          getSeedID({ _id: questions[3].labelOrder[2] }),
          getSeedID({ _id: questions[3].labelOrder[1] }),
          getSeedID({ _id: questions[3].labelOrder[0] }),
        ] },
      )
      const { data, errors } = await unauthRequest(query)

      expect(data).toBeNull()
      expect(errors.length).toBeGreaterThan(0)
    })
    it('update choiceDefault of any choice question', async () => {
      const query = updateQuestionMutation(
        getSeedID(questions[2]),
        { choiceDefault: getSeedID(questions[2].choices[2]) },
      )
      const { data, errors } = await unauthRequest(query)

      expect(data).toBeNull()
      expect(errors.length).toBeGreaterThan(0)
    })
    it('update choiceOrder of any choice question', async () => {
      const query = updateQuestionMutation(
        getSeedID(questions[2]),
        { choiceOrder: [
          getSeedID({ _id: questions[2].choiceOrder[5] }),
          getSeedID({ _id: questions[2].choiceOrder[4] }),
          getSeedID({ _id: questions[2].choiceOrder[3] }),
          getSeedID({ _id: questions[2].choiceOrder[2] }),
          getSeedID({ _id: questions[2].choiceOrder[1] }),
          getSeedID({ _id: questions[2].choiceOrder[0] }),
        ] },
      )
      const { data, errors } = await unauthRequest(query)

      expect(data).toBeNull()
      expect(errors.length).toBeGreaterThan(0)
    })
    it('delete any question', async () => {
      const query = deleteQuestionMutation(getSeedID(questions[0]))
      const { data, errors } = await unauthRequest(query)

      expect(data).toBeNull()
      expect(errors.length).toBeGreaterThan(0)
    })
    it('create an item', async () => {
      const query = createItemMutation(
        getSeedID(questions[0]),
        'New item',
      )
      const { data, errors } = await unauthRequest(query)

      expect(data).toBeNull()
      expect(errors.length).toBeGreaterThan(0)
    })
    it('update label of an item', async () => {
      const query = updateItemMutation(
        getSeedID(questions[1]),
        getSeedID(questions[1].items[0]),
        'New item',
      )
      const { data, errors } = await unauthRequest(query)

      expect(data).toBeNull()
      expect(errors.length).toBeGreaterThan(0)
    })
    it('delete an item', async () => {
      const query = deleteItemMutation(
        getSeedID(questions[1]),
        getSeedID(questions[1].items[0]),
      )
      const { data, errors } = await unauthRequest(query)

      expect(data).toBeNull()
      expect(errors.length).toBeGreaterThan(0)
    })
    it('create a label', async () => {
      const query = createLabelMutation(
        getSeedID(questions[3]),
        { label: 'New label', value: 3 },
      )
      const { data, errors } = await unauthRequest(query)

      expect(data).toBeNull()
      expect(errors.length).toBeGreaterThan(0)
    })
    it('update label of a label', async () => {
      const query = updateLabelMutation(
        getSeedID(questions[3]),
        getSeedID(questions[3].labels[0]),
        { label: 'New label' },
      )
      const { data, errors } = await unauthRequest(query)

      expect(data).toBeNull()
      expect(errors.length).toBeGreaterThan(0)
    })
    it('update value of a label', async () => {
      const query = updateLabelMutation(
        getSeedID(questions[3]),
        getSeedID(questions[3].labels[0]),
        { value: 3 },
      )
      const { data, errors } = await unauthRequest(query)

      expect(data).toBeNull()
      expect(errors.length).toBeGreaterThan(0)
    })
    it('delete a label', async () => {
      const query = deleteLabelMutation(
        getSeedID(questions[3]),
        getSeedID(questions[3].labels[0]),
      )
      const { data, errors } = await unauthRequest(query)

      expect(data).toBeNull()
      expect(errors.length).toBeGreaterThan(0)
    })
    it('create a choice', async () => {
      const query = createChoiceMutation(
        getSeedID(questions[2]),
        { label: 'New label', code: 'X' },
      )
      const { data, errors } = await unauthRequest(query)

      expect(data).toBeNull()
      expect(errors.length).toBeGreaterThan(0)
    })
    it('update label of a choice', async () => {
      const query = updateLabelMutation(
        getSeedID(questions[2]),
        getSeedID(questions[2].choices[0]),
        { label: 'New label' },
      )
      const { data, errors } = await unauthRequest(query)

      expect(data).toBeNull()
      expect(errors.length).toBeGreaterThan(0)
    })
    it('update code of a choice', async () => {
      const query = updateChoiceMutation(
        getSeedID(questions[2]),
        getSeedID(questions[2].choices[0]),
        { code: 'X' },
      )
      const { data, errors } = await unauthRequest(query)

      expect(data).toBeNull()
      expect(errors.length).toBeGreaterThan(0)
    })
    it('delete a choice', async () => {
      const query = deleteChoiceMutation(
        getSeedID(questions[2]),
        getSeedID(questions[2].choices[0]),
      )
      const { data, errors } = await unauthRequest(query)

      expect(data).toBeNull()
      expect(errors.length).toBeGreaterThan(0)
    })
  })
})
