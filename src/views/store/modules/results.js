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
    let versions =  [ ..._state.votes.versions]
    let lastVersion = Object.assign({}, versions[versions.length - 1].summaries)
    lastVersion.summaries = payload.summaries
    versions[versions.length - 1] = lastVersion

    _state.votes = { ..._state.votes, versions }
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
