import Domain from '@/api/domain'
import Clients from '@/api/clients'

const state = {
  domain: [],
  currentDomain: {
    clients: [],
  },
  totalNumber: 0,
}

const getters = {
  getDomains: _state => _state.domain || [],
  getDomain: _state => _state.currentDomain,
  getTotalNumberOfDomains: _state => _state.totalNumber,
}

const mutations = {
  addClientToDomain(_state, payload) {
    const domain = { ..._state.currentDomain }

    if (Array.isArray(domain.clients)) {
      domain.clients = [payload, ...domain.clients.filter(item => item.id !== payload.id)]
    } else {
      domain.clients = [payload]
    }

    // eslint-disable-next-line
     _state.currentDomain = domain;
  },
  removeClientFromDomain(_state, payload) {
    const domain = { ...state.currentDomain }

    domain.clients = [...domain.clients.filter(item => item.id !== payload.id)]

    // eslint-disable-next-line
     _state.currentDomain = domain;
  },
  createDomain(_state, payload) {
    if (_state.domain && _state.domain.length > 0) {
      // eslint-disable-next-line
      _state.domain = [payload, ..._state.domain];
    } else {
      // eslint-disable-next-line
      _state.domain = [payload];
    }
  },
  updateDomain(_state, payload) {
    // eslint-disable-next-line
    _state.currentDomain = payload;
  },
  setCurrentDomain(_state, payload) {
    // eslint-disable-next-line
    _state.currentDomain = payload;
  },
  setDomains(_state, payload) {
    // eslint-disable-next-line
    _state.domain = payload;
  },
  deleteDomain(_state, payload) {
    // eslint-disable-next-line
    _state.domain = _state.domain.filter(c => c.id !== payload.id);
  },
  setTotalNumberOfDomains(_state, number) {
    _state.totalNumber = number
  }
}

const actions = {
  addClientToDomain({ commit }, payload) {
    return Clients.updateClientDomain(payload.client.id, payload.domain.id)
      .then(() => {
        commit('addClientToDomain', payload.client)
      })
  },
  removeClientFromDomain({ commit }, payload) {
    return Clients.updateClientDomain(payload.client.id, null)
      .then(() => {
        commit('removeClientFromDomain', payload.client)
      })
  },
  getDomains({ commit }) {
    return Domain.getDomains()
      .then((data) => {
        commit('setTotalNumberOfDomains', data.data.amount)
        commit('setDomains', data.data.domains || [])
        return data
      })
  },
  updateDomainVisibility({ commit }, payload) {
    return Domain.updateDomainVisibility(payload.id, payload.isPublic)
      .then((data) => {
        commit('updateDomain', data.data.updateDomain.domain)
        return data
      })
  },
  updateDomain({ commit }, payload) {
    return Domain.updateDomain(payload.id, payload.name, payload.isPublic, payload.surveyID)
      .then((data) => {
        commit('updateDomain', data.data.updateDomain.domain)
        commit('setForm', 'domain_update_success')
        return data
      })
  },
  getDomain({ commit }, payload) {
    return Domain.getDomain(payload.id)
      .then((data) => {
        commit('setCurrentDomain', data.data.domain)

        Domain.onDomainUpdate(payload.id, (d) => {
          commit('setCurrentDomain', d.data.domainUpdate.domain)
        })
        return data
      })
  },
  createDomain({ commit }, payload) {
    return Domain.createDomain(payload.name)
      .then((data) => {
        commit('createDomain', data.data.createDomain.domain)
        return data
      })
  },
  deleteDomain({ commit }, payload) {
    return Domain.deleteDomain(payload.id)
      .then(() => {
        commit('deleteDomain', payload)
      })
  },
}

export default {
  state,
  getters,
  mutations,
  actions,
}
