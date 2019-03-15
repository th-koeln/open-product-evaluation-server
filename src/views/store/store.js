import Vue from 'vue'
import Vuex from 'vuex'
import Survey from '@/store/modules/survey'
import Questions from '@/store/modules/questions'
import Clients from '@/store/modules/clients'
import Results from '@/store/modules/results'
import Domain from '@/store/modules/domain'
import User from '@/store/modules/user'
import Auth from '@/store/modules/auth'
import Errors from '@/store/modules/error'
import Form from '@/store/modules/form'

Vue.use(Vuex)

export default new Vuex.Store({
  strict: true,
  modules: {
    survey: Survey,
    questions: Questions,
    results: Results,
    user: User,
    domain: Domain,
    clients: Clients,
    auth: Auth,
    error: Errors,
    form: Form,
  },
})
