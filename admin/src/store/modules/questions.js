import Questions from '@/api/question'

const state = {
  questions: [],
  selectedQuestion: 0,
}

const getters = {
  getQuestions: _state => _state.questions || [],
  getQuestion: _state => questionID => _state.questions
    .find(question => question.id === questionID),
  getSelectedQuestion: _state => _state.selectedQuestion,
}


const mutations = {
  currentQuestions(_state, payload) {
    // eslint-disable-next-line
    _state.questions = payload
  },
  createLabel(_state, payload) {
    const questions = [..._state.questions]

    const questionIndex = questions.findIndex(item => item.id === payload.id)

    const question = { ...questions[questionIndex] }

    let labels = []

    if (question.labels) {
      labels = [...question.labels]
    }

    labels.push(payload.label)

    question.labels = labels
    questions[questionIndex] = question

    // eslint-disable-next-line
    _state.questions = questions
  },
  updateLabel(_state, payload) {
    const questions = [..._state.questions]
    const questionIndex = questions.findIndex(item => item.id === payload.question.id)

    const question = { ...questions[questionIndex] }

    const labels = [...question.labels]

    const labelIndex = labels.findIndex(item => item.id === payload.label.id)

    labels[labelIndex] = payload.label

    question.labels = labels

    questions[questionIndex] = question

    // eslint-disable-next-line
    _state.questions = questions
  },
  deleteLabel(_state, payload) {
    const questions = [..._state.questions]
    const questionIndex = questions.findIndex(item => item.id === payload.question.id)
    const question = { ...questions[questionIndex] }
    const labels = [...question.labels].filter(c => c.id !== payload.label.id)

    question.labels = labels
    questions[questionIndex] = question

    // eslint-disable-next-line
    _state.questions = questions
  },
  createChoice(_state, payload) {
    const questions = [..._state.questions]

    const questionIndex = questions.findIndex(item => item.id === payload.id)

    const question = { ...questions[questionIndex] }

    let choices = []

    if (question.choices) {
      choices = [...question.choices]
    }

    choices.push(payload.choice)

    question.choices = choices
    questions[questionIndex] = question

    // eslint-disable-next-line
    _state.questions = questions
  },
  updateChoice(_state, payload) {
    const questions = [..._state.questions]
    const questionIndex = questions.findIndex(item => item.id === payload.question.id)
    const question = { ...questions[questionIndex] }
    const choices = [...question.choices]
    const choiceIndex = choices.findIndex(c => c.id === payload.choice.id)

    choices[choiceIndex] = payload.choice

    question.choices = choices
    questions[questionIndex] = question

    // eslint-disable-next-line
    _state.questions = questions
  },
  deleteChoice(_state, payload) {
    const questions = [..._state.questions]
    const questionIndex = questions.findIndex(item => item.id === payload.question.id)
    const question = { ...questions[questionIndex] }
    const choices = [...question.choices].filter(c => c.id !== payload.choice.id)

    question.choices = choices
    questions[questionIndex] = question

    // eslint-disable-next-line
    _state.questions = questions
  },
  createItem(_state, payload) {
    const questions = [..._state.questions]
    const questionIndex = questions.findIndex(item => item.id === payload.id)

    const question = { ...questions[questionIndex] }

    let items = []

    if (question.items) {
      items = [...question.items]
    }

    items.push(payload.item)

    question.items = items

    questions[questionIndex] = question

    // eslint-disable-next-line
    _state.questions = questions
  },
  updateItem(_state, payload) {
    const questions = [..._state.questions]
    const questionIndex = questions.findIndex(item => item.id === payload.question.id)

    const question = { ...questions[questionIndex] }

    const items = [...question.items]

    const itemIndex = items.findIndex(item => item.id === payload.item.id)

    items[itemIndex] = payload.item

    question.items = items

    questions[questionIndex] = question

    // eslint-disable-next-line
    _state.questions = questions
  },
  deleteItem(_state, payload) {
    const questions = [..._state.questions]
    const questionIndex = questions.findIndex(item => item.id === payload.question.id)

    const question = { ...questions[questionIndex] }

    const items = [...question.items].filter(item => item.id !== payload.item.id)

    question.items = items

    questions[questionIndex] = question

    // eslint-disable-next-line
    _state.questions = questions
  },
  createQuestion(_state, payload) {
    let questions = []

    if (_state.questions && _state.questions.length > 0) {
      questions = [..._state.questions, payload]
    } else {
      questions = [payload]
    }

    // eslint-disable-next-line
    _state.questions = questions
  },
  appendQuestion(_state, payload) {

    const index = _state.questions.findIndex(item => {
      return item.id === payload.previousID
    })
    
    let questions = [..._state.questions]
    questions.splice(index + 1, 0, payload.question)

    // eslint-disable-next-line
    _state.questions = questions
  },
  updateQuestion(_state, payload) {
    const questions = [..._state.questions]

    const questionIndex = questions.findIndex(q => q.id === payload.id)

    questions[questionIndex] = { ...payload }

    // eslint-disable-next-line
    _state.questions = questions
  },
  updateRegulatorQuestion(_state, payload) {
    const questions = [..._state.questions]

    const questionIndex = questions.findIndex(q => q.id === payload.id)

    const question = { ...questions[questionIndex] }

    question.min = payload.min
    question.max = payload.max
    question.default = payload.default
    question.stepSize = payload.stepSize

    questions[questionIndex] = question

    // eslint-disable-next-line
    _state.questions = questions
  },
  deleteQuestion(_state, payload) {
    // eslint-disable-next-line
    _state.questions = [..._state.questions].filter(item => item.id !== payload.questionID)
  },
  uploadChoiceImage(_state, payload) {
    const questions = [..._state.questions]
    const questionIndex = questions.findIndex(item => item.id === payload.questionID)
    const question = { ...questions[questionIndex] }
    const choices = [...question.choices]
    const choiceIndex = choices.findIndex(c => c.id === payload.choice.id)

    choices[choiceIndex] = payload.choice

    question.choices = choices
    questions[questionIndex] = question

    // eslint-disable-next-line
    _state.questions = questions
  },
  uploadItemImage(_state, payload) {
    const questions = [..._state.questions]
    const questionIndex = questions.findIndex(item => item.id === payload.questionID)
    const question = { ...questions[questionIndex] }
    const items = [...question.items]
    const itemIndex = items.findIndex(i => i.id === payload.item.id)

    items[itemIndex] = payload.item

    question.items = items
    questions[questionIndex] = question

    // eslint-disable-next-line
    _state.questions = questions
  },
  uploadLabelImage(_state, payload) {
    const questions = [..._state.questions]
    const questionIndex = questions.findIndex(item => item.id === payload.questionID)
    const question = { ...questions[questionIndex] }
    const labels = [...question.labels]
    const labelIndex = labels.findIndex(l => l.id === payload.label.id)

    labels[labelIndex] = payload.label

    question.labels = labels
    questions[questionIndex] = question

    // eslint-disable-next-line
    _state.questions = questions
  },
  uploadLikeIcon(_state, payload) {
    const questions = [..._state.questions]
    const questionIndex = questions.findIndex(item => item.id === payload.questionID)
    const question = { ...questions[questionIndex] }

    question.likeIcon = payload.likeIcon

    questions[questionIndex] = question

    // eslint-disable-next-line
    _state.questions = questions
  },
  uploadDislikeIcon(_state, payload) {
    const questions = [..._state.questions]
    const questionIndex = questions.findIndex(item => item.id === payload.questionID)
    const question = { ...questions[questionIndex] }

    question.dislikeIcon = payload.dislikeIcon

    questions[questionIndex] = question

    // eslint-disable-next-line
    _state.questions = questions
  },
  removeChoiceImage(_state, payload) {
    const questions = [..._state.questions]
    const questionIndex = questions.findIndex(item => item.id === payload.questionID)
    const question = { ...questions[questionIndex] }
    const choices = [...question.choices]
    const choiceIndex = choices.findIndex(c => c.id === payload.choiceID)
    const choice = { ...choices[choiceIndex] }

    choice.image = null

    choices[choiceIndex] = choice
    question.choices = choices
    questions[questionIndex] = question

    // eslint-disable-next-line
    _state.questions = questions
  },
  removeLabelImage(_state, payload) {
    const questions = [..._state.questions]
    const questionIndex = questions.findIndex(item => item.id === payload.questionID)
    const question = { ...questions[questionIndex] }
    const labels = [...question.labels]
    const labelIndex = labels.findIndex(c => c.id === payload.labelID)
    const label = { ...labels[labelIndex] }

    label.image = null

    labels[labelIndex] = label
    question.labels = labels
    questions[questionIndex] = question

    // eslint-disable-next-line
    _state.questions = questions
  },
  removeItemImage(_state, payload) {
    const questions = [..._state.questions]
    const questionIndex = questions.findIndex(item => item.id === payload.questionID)
    const question = { ...questions[questionIndex] }
    const items = [...question.items]
    const itemIndex = items.findIndex(c => c.id === payload.itemID)
    const item = { ...items[itemIndex] }

    item.image = null

    items[itemIndex] = item
    question.items = items
    questions[questionIndex] = question

    // eslint-disable-next-line
    _state.questions = questions
  },
  updateQuestions(_state, payload) {
    // eslint-disable-next-line
    _state.questions = [...payload]
  },
  updateSelectedQuestion(_state, payload) {
    // eslint-disable-next-line
    _state.selectedQuestion = payload
  },
  incrementSelectedQuestion(_state) {
    // eslint-disable-next-line
    _state.selectedQuestion += 1
  }
}


const actions = {
  createLabel({ commit }, payload) {
    return Questions.createLabel(payload.question.id)
      .then((data) => {
        commit('clearVotes')
        commit('createLabel', {
          id: payload.question.id,
          label: data.data.createLabel.label,
        })
        return data
      })
  },
  updateLabel({ commit }, payload) {
    return Questions.updateLabel(
      payload.question.id,
      payload.label.id,
      payload.label.label,
      payload.label.value,
    ).then(() => {
      commit('clearVotes')
      commit('updateLabel', payload)
    })
  },
  deleteLabel({ commit }, payload) {
    return Questions.deleteLabel(payload.question.id, payload.label.id)
      .then(() => {
        commit('clearVotes')
        commit('deleteLabel', payload)
      })
  },
  createChoice({ commit }, payload) {
    return Questions.createChoice(payload.question.id)
      .then((data) => {
        commit('clearVotes')
        commit('createChoice', {
          id: payload.question.id,
          choice: data.data.createChoice.choice,
        })
        return data
      })
  },
  updateChoice({ commit }, payload) {
    return Questions.updateChoice(payload.question.id, payload.choice.id, payload.choice.label)
      .then(() => {
        commit('clearVotes')
        commit('updateChoice', payload)
      })
  },
  deleteChoice({ commit }, payload) {
    return Questions.deleteChoice(payload.question.id, payload.choice.id)
      .then(() => {
        commit('clearVotes')
        commit('deleteChoice', payload)
      })
  },
  updateItem({ commit }, payload) {
    return Questions.updateItem(payload.question.id, payload.item.id, payload.item.label)
      .then(() => {
        commit('clearVotes')
        commit('updateItem', payload)
      })
  },
  deleteItem({ commit }, payload) {
    return Questions.deleteItem(payload.question.id, payload.item.id)
      .then(() => {
        commit('clearVotes')
        commit('deleteItem', payload)
      })
  },
  createQuestion({ commit }, payload) {
    return Questions.createQuestion(payload.surveyID)
      .then((data) => {
        commit('clearVotes')
        commit('createQuestion', data.data.createQuestion.question)
        return data
      })
  },
  appendQuestion({ commit }, payload) {
    return Questions.appendQuestion(payload.surveyID, payload.questionID)
      .then((data) => {
        commit('clearVotes')
        commit('appendQuestion', {
          question: data.data.createQuestion.question,
          previousID: payload.questionID,
        })
        commit('incrementSelectedQuestion')
        return data
      })
  },
  updateQuestion({ commit }, payload) {
    return Questions.updateQuestion(
      payload.question.id,
      payload.question.value,
      payload.question.description,
      payload.question.type,
    ).then((data) => {
      commit('clearVotes')
      commit('updateQuestion', data.data.updateQuestion.question)
      return data
    })
  },
  updateRegulatorQuestion({ commit }, payload) {
    return Questions.updateRegulatorQuestion(
      payload.question.id,
      payload.question.min,
      payload.question.max,
      payload.question.stepSize,
      payload.question.default,
    ).then((data) => {
      commit('clearVotes')
      commit('updateRegulatorQuestion', data.data.updateQuestion.question)
      return data
    })
  },
  changeQuestionType({ commit }, payload) {
    return Questions.updateQuestion(
      payload.question.id,
      payload.question.value,
      payload.question.description,
      payload.question.type,
    ).then((data) => {
      commit('clearVotes')
      commit('updateQuestion', data.data.updateQuestion.question)
      return data
    })
  },
  deleteQuestion({ commit }, payload) {
    return Questions.deleteQuestion(payload.questionID)
      .then(() => {
        commit('clearVotes')
        commit('deleteQuestion', payload)
      })
  },
  createItem({ commit }, payload) {
    return Questions.createItem(payload.question.id)
      .then((data) => {
        commit('clearVotes')
        commit('createItem', {
          id: payload.question.id,
          item: data.data.createItem.item,
        })
        return data
      })
  },
  uploadChoiceImage({ commit }, payload) {
    return Questions.uploadChoiceImage(
      payload.questionID,
      payload.choiceID,
      payload.file,
    ).then((data) => {
      commit('clearVotes')
      commit('uploadChoiceImage', {
        questionID: payload.questionID,
        choice: data.data.setChoiceImage.choice,
      })
      return data
    })
  },
  uploadItemImage({ commit }, payload) {
    return Questions.uploadItemImage(
      payload.questionID,
      payload.itemID,
      payload.file,
    ).then((data) => {
      commit('clearVotes')
      commit('uploadItemImage', {
        questionID: payload.questionID,
        item: data.data.setItemImage.item,
      })
      return data
    })
  },
  uploadLabelImage({ commit }, payload) {
    return Questions.uploadLabelImage(
      payload.questionID,
      payload.labelID,
      payload.file,
    ).then((data) => {
      commit('clearVotes')
      commit('uploadLabelImage', {
        questionID: payload.questionID,
        label: data.data.setLabelImage.label,
      })
      return data
    })
  },
  uploadLikeIcon({ commit }, payload) {
    return Questions.uploadLikeIcon(
      payload.questionID,
      payload.file,
    ).then((data) => {
      commit('clearVotes')
      commit('uploadLikeIcon', {
        questionID: payload.questionID,
        likeIcon: data.data.updateQuestion.question.likeIcon,
      })
      return data
    })
  },
  uploadDislikeIcon({ commit }, payload) {
    return Questions.uploadDislikeIcon(
      payload.questionID,
      payload.file,
    ).then((data) => {
      commit('clearVotes')
      commit('uploadDislikeIcon', {
        questionID: payload.questionID,
        dislikeIcon: data.data.updateQuestion.question.dislikeIcon,
      })
      return data
    })
  },
  removeChoiceImage({ commit }, payload) {
    return Questions.removeChoiceImage(
      payload.questionID,
      payload.choiceID,
    ).then((data) => {
      commit('clearVotes')
      commit('removeChoiceImage', {
        questionID: payload.questionID,
        choiceID: payload.choiceID,
      })
      return data
    })
  },
  removeLabelImage({ commit }, payload) {
    return Questions.removeLabelImage(
      payload.questionID,
      payload.labelID
    ).then((data) => {
      commit('clearVotes')
      commit('removeLabelImage', {
        questionID: payload.questionID,
        labelID: payload.labelID,
      })
      return data
    })
  },
  removeItemImage({ commit }, payload) {
    return Questions.removeItemImage(
      payload.questionID,
      payload.itemID
    ).then((data) => {
      commit('clearVotes')
      commit('removeItemImage', {
        questionID: payload.questionID,
        itemID: payload.itemID,
      })
      return data
    })
  },
  updateSelectedQuestion({ commit }, payload) {
    commit('updateSelectedQuestion', payload)
  },
}

export default {
  state,
  getters,
  mutations,
  actions,
}
