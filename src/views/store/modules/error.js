const state = {
  errors: [],
}

const getters = {
  getError: _state => (key) => {
    const error = _state.errors.find(e => e.key === key)

    if (error !== undefined) {
      return _state.errors.find(e => e.key === key).error
    }

    return null
  },
}

const mutations = {
  setError(_state, payload) {
    const key = _state.errors.findIndex(err => err.key === payload.key)

    const error = {
      key: payload.key,
      error: {
        ...payload.error,
      },
    }

    if (key === -1) {
      // eslint-disable-next-line
      _state.errors = [..._state.errors, error]
    } else {
      // eslint-disable-next-line
      _state.errors[payload.key] = error
    }
  },
  clearError(_state, key) {
    // eslint-disable-next-line
    _state.errors = _state.errors.filter(item => item.key !== key)
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
