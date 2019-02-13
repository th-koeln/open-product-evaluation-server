import Clients from '@/api/clients'

const state = {
  clients: [],
  currentClient: {},
}

const getters = {
  getClients: _state => _state.clients || [],
  getClient: _state => _state.currentClient,
}

const mutations = {
  setCurrentClient(_state, payload) {
    // eslint-disable-next-line
    _state.currentClient = payload;
  },
  setClients(_state, payload) {
    // eslint-disable-next-line
    _state.clients = payload;
  },
}

const actions = {
  updateClient({ commit }, payload) {
    return Clients.updateClient(payload.id, payload.name)
      .then((data) => {
        commit('setCurrentClient', data.data.updateClient.client)
        commit('setForm', 'client_update_success')
        return data
      })
  },
  getClient({ commit }, payload) {
    return Clients.getClient(payload.id)
      .then((data) => {
        commit('setCurrentClient', data.data.client)
        return data
      })
  },
  getClients({ commit }) {
    return Clients.getClients()
      .then((data) => {
        commit('setClients', data.data.clients)
        return data
      })
  },
}

export default {
  state,
  getters,
  mutations,
  actions,
}
