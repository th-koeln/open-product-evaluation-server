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
  },
  removeClientOwner(_state, payload) {
    const owners = [ ..._state.currentClient.owners]
    const newOwners = owners.filter((owner) => owner.id !== payload)    
    _state.currentClient = { ..._state.currentClient, owners: newOwners}
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
  setClientOwner({ commit }, payload) {
    return Clients.setClientOwner(payload.clientID, payload.email)
      .then((data) => {
        commit('setCurrentClient', data.data.setClientOwner.client)
        return data
      })
  },
  removeClientOwner({ commit }, payload) {
    return Clients.removeClientOwner(payload.clientID, payload.ownerID)
      .then(() => {
        commit('removeClientOwner', payload.ownerID)
      })
  }
}

export default {
  state,
  getters,
  mutations,
  actions,
}
