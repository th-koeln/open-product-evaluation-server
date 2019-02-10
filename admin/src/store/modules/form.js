
const state = {
  success: [], // saves form keys on success
}

const getters = {
  getForm: _state => formKey =>  _state.success.includes(formKey)
}

const mutations = {
  setForm(_state, key) {
    _state.success = [... _state.success, key]
  },
  removeForm(_state, key) {
    _state.success = _state.success.filter(formKey => formKey !== key)
    console.log(_state.success)
    
  }
}

const actions = { }

export default {
  state,
  getters,
  mutations,
  actions,
}
