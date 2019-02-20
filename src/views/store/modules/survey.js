import Surveys from '@/api/survey'

const state = {
  surveys: [],
  currentSurvey: { },
  totalNumber: 0,
}

const getters = {
  getSurveys: _state => _state.surveys || [],
  getSurvey: _state => _state.currentSurvey,
  getTotalNumberOfSurveys: _state => _state.totalNumber,
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
  },
  setTotalNumberOfSurveys(_state, number) {
    _state.totalNumber = number
  },
  removeSurveyPreviewImage(_state) {
    // eslint-disable-next-line
    _state.currentSurvey = { ..._state.currentSurvey, previewImage: null } 
  }
}

const actions = {
  getSurveys({ commit }, payload) {
    return Surveys.getSurveys(payload.filter, payload.order)
      .then((data) => {
        commit('setTotalNumberOfSurveys', data.data.amount)
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
  },
  removeSurveyPreviewImage({ commit }, payload) {
    return Surveys.removeSurveyPreviewImage(payload)
      .then(() => {
        commit('removeSurveyPreviewImage')
      })
  },
  subscribeSurvey({ commit }, surveyID) {
    // subscription is not saved in store because of mutation problems
    // gets passed back to component
    const subscription = Surveys.subscription(surveyID)
    const v = subscription.subscribe({
      next(data) {
        if(!data.errors) {
          // completely retarded implementation, but ... https://github.com/apollographql/apollo-client/issues/1909
          // ... also, once in store it is frozen again.
          commit('addVote', JSON.parse(JSON.stringify(data.data.newVote.vote)))
        } else {
          console.log(data.errors)
        }
      }
    })
    return v
  },
  unsubscribeSurvey(context, payload) {
    // component passes subscription via payload
    payload.then((data) => data.unsubscribe())
  }
}

export default {
  state,
  getters,
  mutations,
  actions,
}
