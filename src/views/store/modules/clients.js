import Clients from '@/api/clients'

const state = {
  clients: [],
  currentClient: {},
  totalNumber: 0,
}

const getters = {
  getClients: _state => _state.clients || [],
  getClient: _state => _state.currentClient,
  getTotalNumberOfClients: _state => _state.totalNumber,
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
  setTotalNumberOfClients(_state, number) {
    _state.totalNumber = number
  }
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
  getClients({ commit }, payload) {
    return Clients.getClients(payload.filter, payload.order)
      .then((data) => {
        commit('setTotalNumberOfClients', data.data.amount)
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
