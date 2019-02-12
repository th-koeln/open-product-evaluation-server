import Surveys from '@/api/survey'

const state = {
  surveys: [],
  currentSurvey: { },
}

const getters = {
  getSurveys: _state => _state.surveys || [],
  getSurvey: _state => _state.currentSurvey,
}

const mutations = {
  currentSurvey(_state, payload) {
    // eslint-disable-next-line
    _state.currentSurvey = payload;
  },
  setSurveys(_state, surveys) {
    // eslint-disable-next-line
    _state.surveys = surveys;
  },
  createSurvey(_state, survey) {
    if (_state.surveys && _state.surveys.length > 0) {
      // eslint-disable-next-line
      _state.surveys = [survey, ..._state.surveys];
    } else {
      // eslint-disable-next-line
      _state.surveys = [survey];
    }
  },
  updateSurvey(_state, payload) {
    const survey = { ...payload }

    survey.title = payload.title
    survey.description = payload.description

    survey.isActive = payload.isActive

    // eslint-disable-next-line
    _state.currentSurvey = survey;
  },
  deleteSurvey(_state, payload) {
    // eslint-disable-next-line
    _state.surveys = _state.surveys.filter(s => s.id !== payload.id);
  },
  setPreviewImage(_state, payload) {
    // eslint-disable-next-line
    _state.currentSurvey.previewImage = payload
  }
}

const actions = {
  getSurveys({ commit }) {
    return Surveys.getSurveys()
      .then((data) => {
        commit('setSurveys', data.data.surveys || [])
        return data
      })
  },
  getSurvey({ commit }, payload) {
    return Surveys.getSurvey(payload.surveyID)
      .then((data) => {
        commit('currentSurvey', data.data.survey)
        commit('currentQuestions', data.data.survey.questions)
        commit('currentVotes', data.data.survey.votes)

        Surveys.onNewVoteSubscription(payload.surveyID, (d) => {
          commit('addVote', d.data.newVote.vote)
        })

        return data
      })
  },
  createSurvey({ commit }, payload) {
    return Surveys.createSurvey(payload.title, payload.description)
      .then((data) => {
        commit('createSurvey', data.data.createSurvey.survey)
        return data
      })
  },
  updateSurvey({ commit }, payload) {
    return Surveys.updateSurvey(
      payload.id,
      payload.title,
      payload.description,
      payload.isActive,
    ).then((data) => {
      commit('updateSurvey', data.data.updateSurvey.survey)
      return data
    })
  },
  changeSurveyisActive({ commit }, payload) {
    return Surveys.changeSurveyisActive(
      payload.id,
      payload.isActive,
    ).then((data) => {
      commit('updateSurvey', data.data.updateSurvey.survey)
      return data
    })
  },
  deleteSurvey({ commit }, payload) {
    return Surveys.deleteSurvey(payload.id)
      .then(() => {
        commit('deleteSurvey', payload)
      })
  },
  moveQuestion({ dispatch, commit }, payload) {
    let questions = payload.questions.reduce((acc, value) => {
      let collection = acc || []
      collection.push(value.id)
      return collection
    }, [])

    const index = questions.findIndex(item => item === payload.questionID)
    if (index <= 0 && payload.direction === 'UP') {
      return // out of bounds, doin nothin
    }
    
    if (index >= questions.length -1 && payload.direction === 'DOWN') {
      return // out of bounds, doin nothin
    }
    
    if (payload.direction === 'UP') {
      const element = questions[index]
      questions.splice(index, 1)
      questions.splice(index - 1, 0, element)
    }

    if (payload.direction === 'DOWN') {
      const element = questions[index]
      questions.splice(index, 1)
      questions.splice(index + 1, 0, element)
    }
    
    return Surveys.moveQuestion(
      payload.surveyID,
      questions
    ).then((data) => {
      commit('clearVotes')
      commit('updateSurvey', data.data.updateSurvey.survey)
      if (payload.direction === 'UP') {
        dispatch('updateSelectedQuestion', index - 1)
      }

      if (payload.direction === 'DOWN') {
        dispatch('updateSelectedQuestion', index + 1)
      }
      commit('updateQuestions', data.data.updateSurvey.survey.questions)
    })  
  },
  setPreviewImage({ commit }, payload) {
    return Surveys.setPreviewImage(
      payload.surveyID,
      payload.file
    ).then((data) => {
      commit('clearVotes')
      commit('setPreviewImage', data.data.setSurveyPreviewImage.image)
    })
  }
}

export default {
  state,
  getters,
  mutations,
  actions,
}
