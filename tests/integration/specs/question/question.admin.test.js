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
const { updateSurveyMutation, resultsQuery } = require('../../requests/survey.requests')

const seeder = new Seeder(config.seeder)
const collections = seeder.readCollectionsFromPath(config.seeder.inputPath)

describe('Admin', () => {
  const user = users[1]
  let jwt = ''

  beforeEach(async () => {
    await seeder.import(collections)
    const query = loginUserMutation(user.email, 'password')
    const { data, errors } = await unauthRequest(query)

    expect(data.login).not.toBeNull()
    expect(errors).toBeUndefined()

    const { login: { token } } = data
    jwt = token

    const inactiveQuery = updateSurveyMutation(
      getSeedID(surveys[0]),
      { isActive: false }
    )
    const { errors: inactiveErrors } = await authRequest(inactiveQuery, jwt)

    expect(inactiveErrors).toBeUndefined()

    const secondInactiveQuery = updateSurveyMutation(
      getSeedID(surveys[1]),
      { isActive: false }
    )
    const { errors: secondInactiveErrors } = await authRequest(secondInactiveQuery, jwt)

    expect(secondInactiveErrors).toBeUndefined()
  })

  describe('should', async () => {
    it('create a like question for an owned inactive survey',async () => {
      const query = createQuestionMutation(
        getSeedID(surveys[0]),
        'LIKE',
        { value: 'New value', description: 'New description' }
      )
      const { data, errors } = await authRequest(query, jwt)

      expect(errors).toBeUndefined()
      expect(data.createQuestion).toMatchSnapshot()
    })
    it('create a dislike question for an owned inactive survey', async () => {
      const query = createQuestionMutation(
        getSeedID(surveys[0]),
        'LIKEDISLIKE',
        { value: 'New value', description: 'New description' }
      )
      const { data, errors } = await authRequest(query, jwt)

      expect(errors).toBeUndefined()
      expect(data.createQuestion).toMatchSnapshot()
    })
    it('create a choice question for an owned inactive survey', async () => {
      const query = createQuestionMutation(
        getSeedID(surveys[0]),
        'CHOICE',
        { value: 'New value', description: 'New description' }
      )
      const { data, errors } = await authRequest(query, jwt)

      expect(errors).toBeUndefined()
      expect(data.createQuestion).toMatchSnapshot()
    })
    it('create a regulator question for an owned inactive survey', async () => {
      const query = createQuestionMutation(
        getSeedID(surveys[0]),
        'REGULATOR',
        { value: 'New value', description: 'New description' }
      )
      const { data, errors } = await authRequest(query, jwt)

      expect(errors).toBeUndefined()
      expect(data.createQuestion).toMatchSnapshot()
    })
    it('create a favorite question for an owned inactive survey', async () => {
      const query = createQuestionMutation(
        getSeedID(surveys[0]),
        'FAVORITE',
        { value: 'New value', description: 'New description' }
      )
      const { data, errors } = await authRequest(query, jwt)

      expect(errors).toBeUndefined()
      expect(data.createQuestion).toMatchSnapshot()
    })
    it('create a ranking question for an owned inactive survey', async () => {
      const query = createQuestionMutation(
        getSeedID(surveys[0]),
        'RANKING',
        { value: 'New value', description: 'New description' }
      )
      const { data, errors } = await authRequest(query, jwt)

      expect(errors).toBeUndefined()
      expect(data.createQuestion).toMatchSnapshot()
    })
    it('update value of a question of an owned inactive survey', async () => {
      const query = updateQuestionMutation(
        getSeedID(questions[0]),
        { value: 'New title' },
      )
      const { data, errors } = await authRequest(query, jwt)

      expect(errors).toBeUndefined()
      expect(data.updateQuestion).toMatchSnapshot()
    })
    it('update description of a question of an owned inactive survey', async () => {
      const query = updateQuestionMutation(
        getSeedID(questions[0]),
        { description: 'New title' },
      )
      const { data, errors } = await authRequest(query, jwt)

      expect(errors).toBeUndefined()
      expect(data.updateQuestion).toMatchSnapshot()
    })
    it('update type of a question of an owned inactive survey', async () => {
      const query = updateQuestionMutation(
        getSeedID(questions[0]),
        { type: 'CHOICE' },
      )
      const { data, errors } = await authRequest(query, jwt)

      expect(errors).toBeUndefined()
      expect(data.updateQuestion).toMatchSnapshot()
    })
    it('update itemOrder of a question of an owned inactive survey', async () => {
      const query = updateQuestionMutation(
        getSeedID(questions[1]),
        { itemOrder: [
          getSeedID({ _id: questions[1].itemOrder[1] }),
          getSeedID({ _id: questions[1].itemOrder[0] }),
        ] },
      )
      const { data, errors } = await authRequest(query, jwt)

      expect(errors).toBeUndefined()
      expect(data.updateQuestion).toMatchSnapshot()
    })
    it('update max of a regulator question of an owned inactive survey', async () => {
      const query = updateQuestionMutation(
        getSeedID(questions[3]),
        { max: 20 },
      )
      const { data, errors } = await authRequest(query, jwt)

      expect(errors).toBeUndefined()
      expect(data.updateQuestion).toMatchSnapshot()
    })
    it('update regulatorDefault of a regulator question of an owned inactive survey', async () => {
      const query = updateQuestionMutation(
        getSeedID(questions[3]),
        { regulatorDefault: 6 },
      )
      const { data, errors } = await authRequest(query, jwt)

      expect(errors).toBeUndefined()
      expect(data.updateQuestion).toMatchSnapshot()
    })
    it('update labelOrder of a regulator question of an owned inactive survey', async () => {
      const query = updateQuestionMutation(
        getSeedID(questions[3]),
        { labelOrder: [
          getSeedID({ _id: questions[3].labelOrder[2] }),
          getSeedID({ _id: questions[3].labelOrder[1] }),
          getSeedID({ _id: questions[3].labelOrder[0] }),
        ] },
      )
      const { data, errors } = await authRequest(query, jwt)

      expect(errors).toBeUndefined()
      expect(data.updateQuestion).toMatchSnapshot()
    })
    it('update choiceDefault of a choice question of an owned inactive survey', async () => {
      const query = updateQuestionMutation(
        getSeedID(questions[2]),
        { choiceDefault: getSeedID(questions[2].choices[2]) },
      )
      const { data, errors } = await authRequest(query, jwt)

      expect(errors).toBeUndefined()
      expect(data.updateQuestion).toMatchSnapshot()
    })
    it('update choiceOrder of a choice question of an owned inactive survey', async () => {
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
      const { data, errors } = await authRequest(query, jwt)

      expect(errors).toBeUndefined()
      expect(data.updateQuestion).toMatchSnapshot()
    })
    it('delete a question of an owned inactive survey', async () => {
      const query = deleteQuestionMutation(getSeedID(questions[0]))
      const { data, errors } = await authRequest(query, jwt)

      expect(errors).toBeUndefined()
      expect(data.deleteQuestion.success).toBe(true)
    })
    it('create an item for a question of an owned inactive survey', async () => {
      const query = createItemMutation(
        getSeedID(questions[0]),
        'New item',
      )
      const { data, errors } = await authRequest(query, jwt)

      expect(errors).toBeUndefined()
      expect(data.createItem).toMatchSnapshot()
    })
    it('update label of an item of a question of an owned inactive survey', async () => {
      const query = updateItemMutation(
        getSeedID(questions[1]),
        getSeedID(questions[1].items[0]),
        'New item',
      )
      const { data, errors } = await authRequest(query, jwt)

      expect(errors).toBeUndefined()
      expect(data.updateItem).toMatchSnapshot()
    })
    it('delete an item of a question of an owned inactive survey', async () => {
      const query = deleteItemMutation(
        getSeedID(questions[1]),
        getSeedID(questions[1].items[0]),
      )
      const { data, errors } = await authRequest(query, jwt)

      expect(errors).toBeUndefined()
      expect(data.deleteItem.success).toBe(true)
    })
    it('create a label for a question of an owned inactive survey', async () => {
      const query = createLabelMutation(
        getSeedID(questions[3]),
        { label: 'New label', value: 3 },
      )
      const { data, errors } = await authRequest(query, jwt)

      expect(errors).toBeUndefined()
      expect(data.createLabel).toMatchSnapshot()
    })
    it('update label of a label of a question of an owned inactive survey', async () => {
      const query = updateLabelMutation(
        getSeedID(questions[3]),
        getSeedID(questions[3].labels[0]),
        { label: 'New label' },
      )
      const { data, errors } = await authRequest(query, jwt)

      expect(errors).toBeUndefined()
      expect(data.updateLabel).toMatchSnapshot()
    })
    it('update value of a label of a question of an owned inactive survey', async () => {
      const query = updateLabelMutation(
        getSeedID(questions[3]),
        getSeedID(questions[3].labels[0]),
        { value: 3 },
      )
      const { data, errors } = await authRequest(query, jwt)

      expect(errors).toBeUndefined()
      expect(data.updateLabel).toMatchSnapshot()
    })
    it('delete a label of a question of an owned inactive survey', async () => {
      const query = deleteLabelMutation(
        getSeedID(questions[3]),
        getSeedID(questions[3].labels[0]),
      )
      const { data, errors } = await authRequest(query, jwt)

      expect(errors).toBeUndefined()
      expect(data.deleteLabel.success).toBe(true)
    })
    it('create a choice for a question of an owned inactive survey', async () => {
      const query = createChoiceMutation(
        getSeedID(questions[2]),
        { label: 'New label', code: 'X' },
      )
      const { data, errors } = await authRequest(query, jwt)

      expect(errors).toBeUndefined()
      expect(data.createChoice).toMatchSnapshot()
    })
    it('update label of a choice of a question of an owned inactive survey', async () => {
      const query = updateChoiceMutation(
        getSeedID(questions[2]),
        getSeedID(questions[2].choices[0]),
        { label: 'New label' },
      )
      const { data, errors } = await authRequest(query, jwt)

      expect(errors).toBeUndefined()
      expect(data.updateChoice).toMatchSnapshot()
    })
    it('update code of a choice of a question of an owned inactive survey', async () => {
      const query = updateChoiceMutation(
        getSeedID(questions[2]),
        getSeedID(questions[2].choices[0]),
        { code: 'X' },
      )
      const { data, errors } = await authRequest(query, jwt)

      expect(errors).toBeUndefined()
      expect(data.updateChoice).toMatchSnapshot()
    })
    it('delete a choice of a question of an owned inactive survey', async () => {
      const query = deleteChoiceMutation(
        getSeedID(questions[2]),
        getSeedID(questions[2].choices[0]),
      )
      const { data, errors } = await authRequest(query, jwt)

      expect(errors).toBeUndefined()
      expect(data.deleteChoice.success).toBe(true)
    })
    it('create a like question for a not owned inactive survey',async () => {
      const query = createQuestionMutation(
        getSeedID(surveys[1]),
        'LIKE',
        { value: 'New value', description: 'New description' }
      )
      const { data, errors } = await authRequest(query, jwt)

      expect(errors).toBeUndefined()
      expect(data.createQuestion).toMatchSnapshot()
    })
    it('create a dislike question for a not owned inactive survey', async () => {
      const query = createQuestionMutation(
        getSeedID(surveys[1]),
        'LIKEDISLIKE',
        { value: 'New value', description: 'New description' }
      )
      const { data, errors } = await authRequest(query, jwt)

      expect(errors).toBeUndefined()
      expect(data.createQuestion).toMatchSnapshot()
    })
    it('create a choice question for a not owned inactive survey', async () => {
      const query = createQuestionMutation(
        getSeedID(surveys[1]),
        'CHOICE',
        { value: 'New value', description: 'New description' }
      )
      const { data, errors } = await authRequest(query, jwt)

      expect(errors).toBeUndefined()
      expect(data.createQuestion).toMatchSnapshot()
    })
    it('create a regulator question for a not owned inactive survey', async () => {
      const query = createQuestionMutation(
        getSeedID(surveys[1]),
        'REGULATOR',
        { value: 'New value', description: 'New description' }
      )
      const { data, errors } = await authRequest(query, jwt)

      expect(errors).toBeUndefined()
      expect(data.createQuestion).toMatchSnapshot()
    })
    it('create a favorite question for a not owned inactive survey', async () => {
      const query = createQuestionMutation(
        getSeedID(surveys[1]),
        'FAVORITE',
        { value: 'New value', description: 'New description' }
      )
      const { data, errors } = await authRequest(query, jwt)

      expect(errors).toBeUndefined()
      expect(data.createQuestion).toMatchSnapshot()
    })
    it('create a ranking question for a not owned inactive survey', async () => {
      const query = createQuestionMutation(
        getSeedID(surveys[1]),
        'RANKING',
        { value: 'New value', description: 'New description' }
      )
      const { data, errors } = await authRequest(query, jwt)

      expect(errors).toBeUndefined()
      expect(data.createQuestion).toMatchSnapshot()
    })
    it('update value of a question of a not owned inactive survey', async () => {
      const query = updateQuestionMutation(
        getSeedID(questions[6]),
        { value: 'New title' },
      )
      const { data, errors } = await authRequest(query, jwt)

      expect(errors).toBeUndefined()
      expect(data.updateQuestion).toMatchSnapshot()
    })
    it('update description of a question of a not owned inactive survey', async () => {
      const query = updateQuestionMutation(
        getSeedID(questions[6]),
        { description: 'New title' },
      )
      const { data, errors } = await authRequest(query, jwt)

      expect(errors).toBeUndefined()
      expect(data.updateQuestion).toMatchSnapshot()
    })
    it('update type of a question of a not owned inactive survey', async () => {
      const query = updateQuestionMutation(
        getSeedID(questions[6]),
        { type: 'CHOICE' },
      )
      const { data, errors } = await authRequest(query, jwt)

      expect(errors).toBeUndefined()
      expect(data.updateQuestion).toMatchSnapshot()
    })
    it('update itemOrder of a question of a not owned inactive survey', async () => {
      const query = updateQuestionMutation(
        getSeedID(questions[7]),
        { itemOrder: [
          getSeedID({ _id: questions[7].itemOrder[1] }),
          getSeedID({ _id: questions[7].itemOrder[0] }),
        ] },
      )
      const { data, errors } = await authRequest(query, jwt)

      expect(errors).toBeUndefined()
      expect(data.updateQuestion).toMatchSnapshot()
    })
    it('update max of a regulator question of a not owned inactive survey', async () => {
      const query = updateQuestionMutation(
        getSeedID(questions[9]),
        { max: 20 },
      )
      const { data, errors } = await authRequest(query, jwt)

      expect(errors).toBeUndefined()
      expect(data.updateQuestion).toMatchSnapshot()
    })
    it('update regulatorDefault of a regulator question of a not owned inactive survey', async () => {
      const query = updateQuestionMutation(
        getSeedID(questions[9]),
        { regulatorDefault: 4 },
      )
      const { data, errors } = await authRequest(query, jwt)

      expect(errors).toBeUndefined()
      expect(data.updateQuestion).toMatchSnapshot()
    })
    it('update labelOrder of a regulator question of a not owned inactive survey', async () => {
      const query = updateQuestionMutation(
        getSeedID(questions[9]),
        { labelOrder: [
          getSeedID({ _id: questions[9].labelOrder[1] }),
          getSeedID({ _id: questions[9].labelOrder[0] }),
        ] },
      )
      const { data, errors } = await authRequest(query, jwt)

      expect(errors).toBeUndefined()
      expect(data.updateQuestion).toMatchSnapshot()
    })
    it('update choiceDefault of a choice question of a not owned inactive survey', async () => {
      const query = updateQuestionMutation(
        getSeedID(questions[8]),
        { choiceDefault: getSeedID(questions[8].choices[2]) },
      )
      const { data, errors } = await authRequest(query, jwt)

      expect(errors).toBeUndefined()
      expect(data.updateQuestion).toMatchSnapshot()
    })
    it('update choiceOrder of a choice question of a not owned inactive survey', async () => {
      const query = updateQuestionMutation(
        getSeedID(questions[8]),
        { choiceOrder: [
          getSeedID({ _id: questions[8].choiceOrder[3] }),
          getSeedID({ _id: questions[8].choiceOrder[2] }),
          getSeedID({ _id: questions[8].choiceOrder[1] }),
          getSeedID({ _id: questions[8].choiceOrder[0] }),
        ] },
      )
      const { data, errors } = await authRequest(query, jwt)

      expect(errors).toBeUndefined()
      expect(data.updateQuestion).toMatchSnapshot()
    })
    it('delete a question of a not owned inactive survey', async () => {
      const query = deleteQuestionMutation(getSeedID(questions[6]))
      const { data, errors } = await authRequest(query, jwt)

      expect(errors).toBeUndefined()
      expect(data.deleteQuestion.success).toBe(true)
    })
    it('create an item for a question of a not owned inactive survey', async () => {
      const query = createItemMutation(
        getSeedID(questions[6]),
        'New item',
      )
      const { data, errors } = await authRequest(query, jwt)

      expect(errors).toBeUndefined()
      expect(data.createItem).toMatchSnapshot()
    })
    it('update label of an item of a question of a not owned inactive survey', async () => {
      const query = updateItemMutation(
        getSeedID(questions[7]),
        getSeedID(questions[7].items[0]),
        'New item',
      )
      const { data, errors } = await authRequest(query, jwt)

      expect(errors).toBeUndefined()
      expect(data.updateItem).toMatchSnapshot()
    })
    it('delete an item of a question of a not owned inactive survey', async () => {
      const query = deleteItemMutation(
        getSeedID(questions[7]),
        getSeedID(questions[7].items[0]),
      )
      const { data, errors } = await authRequest(query, jwt)

      expect(errors).toBeUndefined()
      expect(data.deleteItem.success).toBe(true)
    })
    it('create a label for a question of a not owned inactive survey', async () => {
      const query = createLabelMutation(
        getSeedID(questions[9]),
        { label: 'New label', value: 3 },
      )
      const { data, errors } = await authRequest(query, jwt)

      expect(errors).toBeUndefined()
      expect(data.createLabel).toMatchSnapshot()
    })
    it('update label of a label of a question of a not owned inactive survey', async () => {
      const query = updateLabelMutation(
        getSeedID(questions[9]),
        getSeedID(questions[9].labels[0]),
        { label: 'New label' },
      )
      const { data, errors } = await authRequest(query, jwt)

      expect(errors).toBeUndefined()
      expect(data.updateLabel).toMatchSnapshot()
    })
    it('update value of a label of a question of a not owned inactive survey', async () => {
      const query = updateLabelMutation(
        getSeedID(questions[9]),
        getSeedID(questions[9].labels[0]),
        { value: 3 },
      )
      const { data, errors } = await authRequest(query, jwt)

      expect(errors).toBeUndefined()
      expect(data.updateLabel).toMatchSnapshot()
    })
    it('delete a label of a question of a not owned inactive survey', async () => {
      const query = deleteLabelMutation(
        getSeedID(questions[9]),
        getSeedID(questions[9].labels[0]),
      )
      const { data, errors } = await authRequest(query, jwt)

      expect(errors).toBeUndefined()
      expect(data.deleteLabel.success).toBe(true)
    })
    it('create a choice for a question of a not owned inactive survey', async () => {
      const query = createChoiceMutation(
        getSeedID(questions[8]),
        { label: 'New label', code: 'X' },
      )
      const { data, errors } = await authRequest(query, jwt)

      expect(errors).toBeUndefined()
      expect(data.createChoice).toMatchSnapshot()
    })
    it('update label of a choice of a question of a not owned inactive survey', async () => {
      const query = updateChoiceMutation(
        getSeedID(questions[8]),
        getSeedID(questions[8].choices[0]),
        { label: 'New label' },
      )
      const { data, errors } = await authRequest(query, jwt)

      expect(errors).toBeUndefined()
      expect(data.updateChoice).toMatchSnapshot()
    })
    it('update code of a choice of a question of a not owned inactive survey', async () => {
      const query = updateChoiceMutation(
        getSeedID(questions[8]),
        getSeedID(questions[8].choices[0]),
        { code: 'X' },
      )
      const { data, errors } = await authRequest(query, jwt)

      expect(errors).toBeUndefined()
      expect(data.updateChoice).toMatchSnapshot()
    })
    it('delete a choice of a question of a not owned inactive survey', async () => {
      const query = deleteChoiceMutation(
        getSeedID(questions[8]),
        getSeedID(questions[8].choices[0]),
      )
      const { data, errors } = await authRequest(query, jwt)

      expect(errors).toBeUndefined()
      expect(data.deleteChoice.success).toBe(true)
    })
    it('create a question for an inactive survey with empty description',async () => {
      const query = createQuestionMutation(
        getSeedID(surveys[0]),
        'LIKE',
        { value: 'New value' }
      )
      const { data, errors } = await authRequest(query, jwt)

      expect(errors).toBeUndefined()
      expect(data.createQuestion).toMatchSnapshot()
    })
    it('create a question for an inactive survey with empty value',async () => {
      const query = createQuestionMutation(
        getSeedID(surveys[0]),
        'LIKE',
        { value: '', description: 'New description' }
      )
      const { data, errors } = await authRequest(query, jwt)

      expect(errors).toBeUndefined()
      expect(data.createQuestion).toMatchSnapshot()
    })
    it('create a choice for a question of an inactive survey without providing code', async () => {
      const query = createChoiceMutation(
        getSeedID(questions[2]),
        { label: 'New label' },
      )
      const { data, errors } = await authRequest(query, jwt)

      expect(errors).toBeUndefined()
      expect(data.createChoice).toMatchSnapshot()
    })
    it('create a new version when creating question and votes are present',async () => {
      const query = createQuestionMutation(
        getSeedID(surveys[0]),
        'LIKE',
        { value: 'New value' }
      )
      const { errors } = await authRequest(query, jwt)

      expect(errors).toBeUndefined()

      const getQuery = resultsQuery(getSeedID(surveys[0]))
      const { data: getData, errors: getErrors } = await authRequest(getQuery, jwt)

      expect(getErrors).toBeUndefined()
      expect(getData.survey.results).toMatchSnapshot()
    })
    it('create a new version when updating question and votes are present',async () => {
      const query = updateQuestionMutation(
        getSeedID(questions[0]),
        { value: 'New title' },
      )
      const { errors } = await authRequest(query, jwt)

      expect(errors).toBeUndefined()

      const getQuery = resultsQuery(getSeedID(surveys[0]))
      const { data: getData, errors: getErrors } = await authRequest(getQuery, jwt)

      expect(getErrors).toBeUndefined()
      expect(getData.survey.results).toMatchSnapshot()
    })
    it('create a new version when deleting question and votes are present',async () => {
      const query = deleteQuestionMutation(getSeedID(questions[0]))
      const { errors } = await authRequest(query, jwt)

      expect(errors).toBeUndefined()

      const getQuery = resultsQuery(getSeedID(surveys[0]))
      const { data: getData, errors: getErrors } = await authRequest(getQuery, jwt)

      expect(getErrors).toBeUndefined()
      expect(getData.survey.results).toMatchSnapshot()
    })
    it('create a new version when creating item and votes are present',async () => {
      const query = createItemMutation(getSeedID(questions[0]), 'New item')
      const { errors } = await authRequest(query, jwt)

      expect(errors).toBeUndefined()

      const getQuery = resultsQuery(getSeedID(surveys[0]))
      const { data: getData, errors: getErrors } = await authRequest(getQuery, jwt)

      expect(getErrors).toBeUndefined()
      expect(getData.survey.results).toMatchSnapshot()
    })
    it('create a new version when updating item and votes are present',async () => {
      const query = updateItemMutation(
        getSeedID(questions[1]),
        getSeedID(questions[1].items[0]),
        'New item',
      )
      const { errors } = await authRequest(query, jwt)

      expect(errors).toBeUndefined()

      const getQuery = resultsQuery(getSeedID(surveys[0]))
      const { data: getData, errors: getErrors } = await authRequest(getQuery, jwt)

      expect(getErrors).toBeUndefined()
      expect(getData.survey.results).toMatchSnapshot()
    })
    it('create a new version when deleting item and votes are present',async () => {
      const query = deleteItemMutation(
        getSeedID(questions[1]),
        getSeedID(questions[1].items[0]),
      )
      const { errors } = await authRequest(query, jwt)

      expect(errors).toBeUndefined()

      const getQuery = resultsQuery(getSeedID(surveys[0]))
      const { data: getData, errors: getErrors } = await authRequest(getQuery, jwt)

      expect(getErrors).toBeUndefined()
      expect(getData.survey.results).toMatchSnapshot()
    })
    it('create a new version when creating label and votes are present',async () => {
      const query = createLabelMutation(
        getSeedID(questions[3]),
        { label: 'New label', value: 2 },
      )
      const { errors } = await authRequest(query, jwt)

      expect(errors).toBeUndefined()

      const getQuery = resultsQuery(getSeedID(surveys[0]))
      const { data: getData, errors: getErrors } = await authRequest(getQuery, jwt)

      expect(getErrors).toBeUndefined()
      expect(getData.survey.results).toMatchSnapshot()
    })
    it('create a new version when updating label and votes are present',async () => {
      const query = updateLabelMutation(
        getSeedID(questions[3]),
        getSeedID(questions[3].labels[0]),
        { label: 'New label' },
      )
      const { errors } = await authRequest(query, jwt)

      expect(errors).toBeUndefined()

      const getQuery = resultsQuery(getSeedID(surveys[0]))
      const { data: getData, errors: getErrors } = await authRequest(getQuery, jwt)

      expect(getErrors).toBeUndefined()
      expect(getData.survey.results).toMatchSnapshot()
    })
    it('create a new version when deleting label and votes are present',async () => {
      const query = deleteLabelMutation(
        getSeedID(questions[3]),
        getSeedID(questions[3].labels[0]),
      )
      const { errors } = await authRequest(query, jwt)

      expect(errors).toBeUndefined()

      const getQuery = resultsQuery(getSeedID(surveys[0]))
      const { data: getData, errors: getErrors } = await authRequest(getQuery, jwt)

      expect(getErrors).toBeUndefined()
      expect(getData.survey.results).toMatchSnapshot()
    })
    it('create a new version when creating choice and votes are present',async () => {
      const query = createChoiceMutation(
        getSeedID(questions[2]),
        { label: 'New label', code: 'X' },
      )
      const { errors } = await authRequest(query, jwt)

      expect(errors).toBeUndefined()

      const getQuery = resultsQuery(getSeedID(surveys[0]))
      const { data: getData, errors: getErrors } = await authRequest(getQuery, jwt)

      expect(getErrors).toBeUndefined()
      expect(getData.survey.results).toMatchSnapshot()
    })
    it('create a new version when updating choice and votes are present',async () => {
      const query = updateChoiceMutation(
        getSeedID(questions[2]),
        getSeedID(questions[2].choices[0]),
        { label: 'New label' },
      )
      const { errors } = await authRequest(query, jwt)

      expect(errors).toBeUndefined()

      const getQuery = resultsQuery(getSeedID(surveys[0]))
      const { data: getData, errors: getErrors } = await authRequest(getQuery, jwt)

      expect(getErrors).toBeUndefined()
      expect(getData.survey.results).toMatchSnapshot()
    })
    it('create a new version when deleting choice and votes are present',async () => {
      const query = deleteChoiceMutation(
        getSeedID(questions[2]),
        getSeedID(questions[2].choices[0]),
      )
      const { errors } = await authRequest(query, jwt)

      expect(errors).toBeUndefined()

      const getQuery = resultsQuery(getSeedID(surveys[0]))
      const { data: getData, errors: getErrors } = await authRequest(getQuery, jwt)

      expect(getErrors).toBeUndefined()
      expect(getData.survey.results).toMatchSnapshot()
    })
    it('reset question when changing type',async () => {
      const query = updateQuestionMutation(
        getSeedID(questions[9]),
        { type: 'LIKE'},
      )
      const { errors } = await authRequest(query, jwt)

      expect(errors).toBeUndefined()

      const updateQuery = updateQuestionMutation(
        getSeedID(questions[9]),
        { type: 'REGULATOR'},
      )
      const { data: updateData, errors: updateErrors } = await authRequest(updateQuery, jwt)

      expect(updateErrors).toBeUndefined()
      expect(updateData.updateQuestion).toMatchSnapshot()
    })
  })
  describe('should not', async () => {
    it('create a like question for an active survey',async () => {
      const secondInactiveQuery = updateSurveyMutation(
        getSeedID(surveys[1]),
        { isActive: true }
      )
      const { errors: secondInactiveErrors } = await authRequest(secondInactiveQuery, jwt)

      expect(secondInactiveErrors).toBeUndefined()

      const query = createQuestionMutation(
        getSeedID(surveys[1]),
        'LIKE',
        { value: 'New value', description: 'New description' }
      )
      const { data, errors } = await authRequest(query, jwt)

      expect(data).toBeNull()
      expect(errors.length).toBeGreaterThan(0)
    })
    it('create a dislike question for an active survey', async () => {
      const secondInactiveQuery = updateSurveyMutation(
        getSeedID(surveys[1]),
        { isActive: true }
      )
      const { errors: secondInactiveErrors } = await authRequest(secondInactiveQuery, jwt)

      expect(secondInactiveErrors).toBeUndefined()

      const query = createQuestionMutation(
        getSeedID(surveys[1]),
        'LIKEDISLIKE',
        { value: 'New value', description: 'New description' }
      )
      const { data, errors } = await authRequest(query, jwt)

      expect(data).toBeNull()
      expect(errors.length).toBeGreaterThan(0)
    })
    it('create a choice question for an active survey', async () => {
      const secondInactiveQuery = updateSurveyMutation(
        getSeedID(surveys[1]),
        { isActive: true }
      )
      const { errors: secondInactiveErrors } = await authRequest(secondInactiveQuery, jwt)

      expect(secondInactiveErrors).toBeUndefined()

      const query = createQuestionMutation(
        getSeedID(surveys[1]),
        'CHOICE',
        { value: 'New value', description: 'New description' }
      )
      const { data, errors } = await authRequest(query, jwt)

      expect(data).toBeNull()
      expect(errors.length).toBeGreaterThan(0)
    })
    it('create a regulator question for an active survey', async () => {
      const secondInactiveQuery = updateSurveyMutation(
        getSeedID(surveys[1]),
        { isActive: true }
      )
      const { errors: secondInactiveErrors } = await authRequest(secondInactiveQuery, jwt)

      expect(secondInactiveErrors).toBeUndefined()

      const query = createQuestionMutation(
        getSeedID(surveys[1]),
        'REGULATOR',
        { value: 'New value', description: 'New description' }
      )
      const { data, errors } = await authRequest(query, jwt)

      expect(data).toBeNull()
      expect(errors.length).toBeGreaterThan(0)
    })
    it('create a favorite question for an survey', async () => {
      const secondInactiveQuery = updateSurveyMutation(
        getSeedID(surveys[1]),
        { isActive: true }
      )
      const { errors: secondInactiveErrors } = await authRequest(secondInactiveQuery, jwt)

      expect(secondInactiveErrors).toBeUndefined()

      const query = createQuestionMutation(
        getSeedID(surveys[1]),
        'FAVORITE',
        { value: 'New value', description: 'New description' }
      )
      const { data, errors } = await authRequest(query, jwt)

      expect(data).toBeNull()
      expect(errors.length).toBeGreaterThan(0)
    })
    it('create a ranking question for an active survey', async () => {
      const secondInactiveQuery = updateSurveyMutation(
        getSeedID(surveys[1]),
        { isActive: true }
      )
      const { errors: secondInactiveErrors } = await authRequest(secondInactiveQuery, jwt)

      expect(secondInactiveErrors).toBeUndefined()

      const query = createQuestionMutation(
        getSeedID(surveys[1]),
        'RANKING',
        { value: 'New value', description: 'New description' }
      )
      const { data, errors } = await authRequest(query, jwt)

      expect(data).toBeNull()
      expect(errors.length).toBeGreaterThan(0)
    })
    it('update a question of an active survey', async () => {
      const secondInactiveQuery = updateSurveyMutation(
        getSeedID(surveys[1]),
        { isActive: true }
      )
      const { errors: secondInactiveErrors } = await authRequest(secondInactiveQuery, jwt)

      expect(secondInactiveErrors).toBeUndefined()

      const query = updateQuestionMutation(
        getSeedID(questions[7]),
        { value: 'New title' },
      )
      const { data, errors } = await authRequest(query, jwt)

      expect(data).toBeNull()
      expect(errors.length).toBeGreaterThan(0)
    })
    it('delete a question of an active survey', async () => {
      const secondInactiveQuery = updateSurveyMutation(
        getSeedID(surveys[1]),
        { isActive: true }
      )
      const { errors: secondInactiveErrors } = await authRequest(secondInactiveQuery, jwt)

      expect(secondInactiveErrors).toBeUndefined()

      const query = deleteQuestionMutation(getSeedID(questions[6]))
      const { data, errors } = await authRequest(query, jwt)

      expect(data).toBeNull()
      expect(errors.length).toBeGreaterThan(0)
    })
    it('create an item for a question of an active survey', async () => {
      const secondInactiveQuery = updateSurveyMutation(
        getSeedID(surveys[1]),
        { isActive: true }
      )
      const { errors: secondInactiveErrors } = await authRequest(secondInactiveQuery, jwt)

      expect(secondInactiveErrors).toBeUndefined()

      const query = createItemMutation(
        getSeedID(questions[6]),
        'New item',
      )
      const { data, errors } = await authRequest(query, jwt)

      expect(data).toBeNull()
      expect(errors.length).toBeGreaterThan(0)
    })
    it('update an item of a question of an active survey', async () => {
      const secondInactiveQuery = updateSurveyMutation(
        getSeedID(surveys[1]),
        { isActive: true }
      )
      const { errors: secondInactiveErrors } = await authRequest(secondInactiveQuery, jwt)

      expect(secondInactiveErrors).toBeUndefined()

      const query = updateItemMutation(
        getSeedID(questions[7]),
        getSeedID(questions[7].items[0]),
        'New item',
      )
      const { data, errors } = await authRequest(query, jwt)

      expect(data).toBeNull()
      expect(errors.length).toBeGreaterThan(0)
    })
    it('delete an item of a question of an active survey', async () => {
      const secondInactiveQuery = updateSurveyMutation(
        getSeedID(surveys[1]),
        { isActive: true }
      )
      const { errors: secondInactiveErrors } = await authRequest(secondInactiveQuery, jwt)

      expect(secondInactiveErrors).toBeUndefined()

      const query = deleteItemMutation(
        getSeedID(questions[7]),
        getSeedID(questions[7].items[0]),
      )
      const { data, errors } = await authRequest(query, jwt)

      expect(data).toBeNull()
      expect(errors.length).toBeGreaterThan(0)
    })
    it('create a label for a question of an active survey', async () => {
      const secondInactiveQuery = updateSurveyMutation(
        getSeedID(surveys[1]),
        { isActive: true }
      )
      const { errors: secondInactiveErrors } = await authRequest(secondInactiveQuery, jwt)

      expect(secondInactiveErrors).toBeUndefined()

      const query = createLabelMutation(
        getSeedID(questions[9]),
        { label: 'New label', value: 3 },
      )
      const { data, errors } = await authRequest(query, jwt)

      expect(data).toBeNull()
      expect(errors.length).toBeGreaterThan(0)
    })
    it('update a label of a question of an active survey', async () => {
      const secondInactiveQuery = updateSurveyMutation(
        getSeedID(surveys[1]),
        { isActive: true }
      )
      const { errors: secondInactiveErrors } = await authRequest(secondInactiveQuery, jwt)

      expect(secondInactiveErrors).toBeUndefined()

      const query = updateLabelMutation(
        getSeedID(questions[9]),
        getSeedID(questions[9].labels[0]),
        { label: 'New label' },
      )
      const { data, errors } = await authRequest(query, jwt)

      expect(data).toBeNull()
      expect(errors.length).toBeGreaterThan(0)
    })
    it('delete a label of a question of an active survey', async () => {
      const secondInactiveQuery = updateSurveyMutation(
        getSeedID(surveys[1]),
        { isActive: true }
      )
      const { errors: secondInactiveErrors } = await authRequest(secondInactiveQuery, jwt)

      expect(secondInactiveErrors).toBeUndefined()

      const query = deleteLabelMutation(
        getSeedID(questions[9]),
        getSeedID(questions[9].labels[0]),
      )
      const { data, errors } = await authRequest(query, jwt)

      expect(data).toBeNull()
      expect(errors.length).toBeGreaterThan(0)
    })
    it('create a choice for a question of an active survey', async () => {
      const secondInactiveQuery = updateSurveyMutation(
        getSeedID(surveys[1]),
        { isActive: true }
      )
      const { errors: secondInactiveErrors } = await authRequest(secondInactiveQuery, jwt)

      expect(secondInactiveErrors).toBeUndefined()

      const query = createChoiceMutation(
        getSeedID(questions[8]),
        { label: 'New label', code: 'X' },
      )
      const { data, errors } = await authRequest(query, jwt)

      expect(data).toBeNull()
      expect(errors.length).toBeGreaterThan(0)
    })
    it('update a choice of a question of an active survey', async () => {
      const secondInactiveQuery = updateSurveyMutation(
        getSeedID(surveys[1]),
        { isActive: true }
      )
      const { errors: secondInactiveErrors } = await authRequest(secondInactiveQuery, jwt)

      expect(secondInactiveErrors).toBeUndefined()

      const query = updateChoiceMutation(
        getSeedID(questions[8]),
        getSeedID(questions[8].choices[0]),
        { label: 'New label' },
      )
      const { data, errors } = await authRequest(query, jwt)

      expect(data).toBeNull()
      expect(errors.length).toBeGreaterThan(0)
    })
    it('delete a choice of a question of an active survey', async () => {
      const secondInactiveQuery = updateSurveyMutation(
        getSeedID(surveys[1]),
        { isActive: true }
      )
      const { errors: secondInactiveErrors } = await authRequest(secondInactiveQuery, jwt)

      expect(secondInactiveErrors).toBeUndefined()

      const query = deleteChoiceMutation(
        getSeedID(questions[8]),
        getSeedID(questions[8].choices[0]),
      )
      const { data, errors } = await authRequest(query, jwt)

      expect(data).toBeNull()
      expect(errors.length).toBeGreaterThan(0)
    })
    it('update type of a question to be invalid', async () => {
      const query = updateQuestionMutation(
        getSeedID(questions[6]),
        { type: 'NOTVALID' },
      )
      const { data, errors } = await authRequest(query, jwt)

      expect(data).toBeUndefined()
      expect(errors.length).toBeGreaterThan(0)
    })
    it('update itemOrder of a question with missing item', async () => {
      const query = updateQuestionMutation(
        getSeedID(questions[7]),
        { itemOrder: [
          getSeedID({ _id: questions[7].itemOrder[0] }),
        ] },
      )
      const { data, errors } = await authRequest(query, jwt)

      expect(data).toBeNull()
      expect(errors.length).toBeGreaterThan(0)
    })
    it('update itemOrder of a question with bonus item', async () => {
      const query = updateQuestionMutation(
        getSeedID(questions[7]),
        { itemOrder: [
          getSeedID({ _id: questions[8].itemOrder[0] }),
          getSeedID({ _id: questions[7].itemOrder[1] }),
          getSeedID({ _id: questions[7].itemOrder[0] }),
        ] },
      )
      const { data, errors } = await authRequest(query, jwt)

      expect(data).toBeNull()
      expect(errors.length).toBeGreaterThan(0)
    })
    it('update max of a regulator question to be 0', async () => {
      const query = updateQuestionMutation(
        getSeedID(questions[9]),
        { max: 0 },
      )
      const { data, errors } = await authRequest(query, jwt)

      expect(data).toBeNull()
      expect(errors.length).toBeGreaterThan(0)
    })
    it('update max of a regulator question to be smaller than 0', async () => {
      const query = updateQuestionMutation(
        getSeedID(questions[9]),
        { max: -10 },
      )
      const { data, errors } = await authRequest(query, jwt)

      expect(data).toBeNull()
      expect(errors.length).toBeGreaterThan(0)
    })
    it('update regulatorDefault of a regulator question to be greater than max', async () => {
      const query = updateQuestionMutation(
        getSeedID(questions[9]),
        { regulatorDefault: 20 },
      )
      const { data, errors } = await authRequest(query, jwt)

      expect(data).toBeNull()
      expect(errors.length).toBeGreaterThan(0)
    })
    it('update regulatorDefault of a regulator question to be smaller than min', async () => {
      const query = updateQuestionMutation(
        getSeedID(questions[9]),
        { regulatorDefault: -4 },
      )
      const { data, errors } = await authRequest(query, jwt)

      expect(data).toBeNull()
      expect(errors.length).toBeGreaterThan(0)
    })
    it('update labelOrder of a regulator question with missing label', async () => {
      const query = updateQuestionMutation(
        getSeedID(questions[9]),
        { labelOrder: [
          getSeedID({ _id: questions[9].labelOrder[0] }),
        ] },
      )
      const { data, errors } = await authRequest(query, jwt)

      expect(data).toBeNull()
      expect(errors.length).toBeGreaterThan(0)
    })
    it('update labelOrder of a regulator question with bonus label', async () => {
      const query = updateQuestionMutation(
        getSeedID(questions[9]),
        { labelOrder: [
          getSeedID({ _id: questions[3].labelOrder[0] }),
          getSeedID({ _id: questions[9].labelOrder[1] }),
          getSeedID({ _id: questions[9].labelOrder[0] }),
        ] },
      )
      const { data, errors } = await authRequest(query, jwt)

      expect(data).toBeNull()
      expect(errors.length).toBeGreaterThan(0)
    })
    it('update choiceDefault of a choice question with a choice that is not in this question', async () => {
      const query = updateQuestionMutation(
        getSeedID(questions[8]),
        { choiceDefault: getSeedID(questions[2].choices[2]) },
      )
      const { data, errors } = await authRequest(query, jwt)

      expect(data).toBeNull()
      expect(errors.length).toBeGreaterThan(0)
    })
    it('update choiceOrder of a choice question with missing choice', async () => {
      const query = updateQuestionMutation(
        getSeedID(questions[8]),
        { choiceOrder: [
          getSeedID({ _id: questions[8].choiceOrder[2] }),
          getSeedID({ _id: questions[8].choiceOrder[1] }),
          getSeedID({ _id: questions[8].choiceOrder[0] }),
        ] },
      )
      const { data, errors } = await authRequest(query, jwt)

      expect(data).toBeNull()
      expect(errors.length).toBeGreaterThan(0)
    })
    it('update choiceOrder of a choice question with bonus choice', async () => {
      const query = updateQuestionMutation(
        getSeedID(questions[8]),
        { choiceOrder: [
          getSeedID({ _id: questions[2].choiceOrder[0] }),
          getSeedID({ _id: questions[8].choiceOrder[3] }),
          getSeedID({ _id: questions[8].choiceOrder[2] }),
          getSeedID({ _id: questions[8].choiceOrder[1] }),
          getSeedID({ _id: questions[8].choiceOrder[0] }),
        ] },
      )
      const { data, errors } = await authRequest(query, jwt)

      expect(data).toBeNull()
      expect(errors.length).toBeGreaterThan(0)
    })
    it('create a label with a value out of range', async () => {
      const query = createLabelMutation(
        getSeedID(questions[9]),
        { label: 'New label', value: 20 },
      )
      const { data, errors } = await authRequest(query, jwt)

      expect(data).toBeNull()
      expect(errors.length).toBeGreaterThan(0)
    })
    it('update a label with a value out of range', async () => {
      const query = updateLabelMutation(
        getSeedID(questions[9]),
        getSeedID(questions[9].labels[0]),
        { value: 20 },
      )
      const { data, errors } = await authRequest(query, jwt)

      expect(data).toBeNull()
      expect(errors.length).toBeGreaterThan(0)
    })
    it('create a choice with a duplicate code', async () => {
      const query = createChoiceMutation(
        getSeedID(questions[8]),
        { label: 'New label', code: 'A' },
      )
      const { data, errors } = await authRequest(query, jwt)

      expect(data).toBeNull()
      expect(errors.length).toBeGreaterThan(0)
    })
    it('update a choice with a duplicate code', async () => {
      const query = updateChoiceMutation(
        getSeedID(questions[8]),
        getSeedID(questions[8].choices[1]),
        { code: 'A' },
      )
      const { data, errors } = await authRequest(query, jwt)

      expect(data).toBeNull()
      expect(errors.length).toBeGreaterThan(0)
    })
  })
})
