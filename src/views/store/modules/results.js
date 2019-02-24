const state = {
  votes: [],
}

const getters = {
  getVotes: _state => _state.votes || [],
}

const mutations = {
  currentVotes(_state, payload) {
    // eslint-disable-next-line
    _state.votes = payload
  },
  addVote(_state, payload) {
    // eslint-disable-next-line
    _state.votes = [ ..._state.votes, payload]
  },
}

const actions = {

}

export default {
  state,
  getters,
  mutations,
  actions,
}
