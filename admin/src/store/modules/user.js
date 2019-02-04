import User from '@/api/user'
import Auth from '@/api/auth'

const state = {
  users: [],
  currentUser: {},
}

const getters = {
  getUsers: _state => _state.users,
  getUser: _state => _state.currentUser,
}

const mutations = {
  setCurrentUser(_state, payload) {
    // eslint-disable-next-line
    _state.currentUser = payload;
  },
  setUsers(_state, payload) {
    // eslint-disable-next-line
    _state.users = payload;
  },
  hasUser(_state) {
    if (_state.currentUser !== null) {
      return
    }

    // eslint-disable-next-line
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser !== null) {
      // eslint-disable-next-line
      _state.currentUser = JSON.parse(currentUser);
    }
  },
}

const actions = {
  getUsers(context) {
    return User.getUsers()
      .then((data) => {
        context.commit('setUsers', data.data.users)
        return data
      })
  },
  getUser(context, payload) {
    return User.getUser(payload.id)
      .then((data) => {
        context.commit('setCurrentUser', data.data.user)
        return data
      })
  },
  updateProfile(context, payload) {
    return User.updateUser(
      payload.id,
      payload.firstName,
      payload.lastName,
      payload.email,
      payload.password,
    ).then((data) => {
      context.commit('setCurrentUser', data.data.updateUser.user)
      return data
    })
  },
  updateUser(context, payload) {
    return User.updateUser(
      payload.id,
      payload.firstName,
      payload.lastName,
      payload.email,
    ).then((data) => {
      context.commit('setCurrentUser', data.data.updateUser.user)
      return data
    })
  },
  register(context, payload) {
    return Auth.register(payload.firstname, payload.lastname, payload.email, payload.password)
      .then((data) => {
        context.commit('loginOnRegister', data.data.createUser)
        return data
      })
  },
  hasUser(context) {
    context.commit('hasUser')
  },
}

export default {
  state,
  getters,
  mutations,
  actions,
}
