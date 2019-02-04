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

    survey.isPublic = payload.isPublic

    // eslint-disable-next-line
    _state.currentSurvey = survey;
  },
  deleteSurvey(_state, payload) {
    // eslint-disable-next-line
    _state.surveys = _state.surveys.filter(s => s.id !== payload.id);
  },
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
      payload.isPublic,
    ).then((data) => {
      commit('updateSurvey', data.data.updateSurvey.survey)
      return data
    })
  },
  changeSurveyIsPublic({ commit }, payload) {
    return Surveys.changeSurveyIsPublic(
      payload.id,
      payload.isPublic,
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
}

export default {
  state,
  getters,
  mutations,
  actions,
}
