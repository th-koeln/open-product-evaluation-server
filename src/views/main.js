import Vue from 'vue'
import Vuelidate from 'vuelidate'
import BootstrapVue from 'bootstrap-vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faUserSecret,
  faPoll,
  faObjectGroup,
  faMobileAlt,
  faUsers,
  faPlus,
  faTimes,
  faStar,
  faExpand,
  faImage,
  faEllipsisV,
  faTrashAlt,
  faPlay,
  faArrowLeft,
  faArrowRight,
  faArrowUp,
  faArrowDown,
  faQuestionCircle,
  faInfoCircle,
  faChartArea,
  faReply,
  faGripLinesVertical,
  faSadCry,
} from '@fortawesome/free-solid-svg-icons'
import { faSquare, faCheckSquare } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import VueInstant from 'vue-instant'
import vSelect from 'vue-select'
import App from './App.vue'
import router from './router'
import store from './store/store'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import 'vue-instant/dist/vue-instant.css'
import '@/scss/base.scss'

library.add(
  faUserSecret,
  faPoll,
  faObjectGroup,
  faMobileAlt,
  faUsers,
  faPlus,
  faTimes,
  faStar,
  faExpand,
  faImage,
  faEllipsisV,
  faTrashAlt,
  faPlay,
  faArrowLeft,
  faArrowRight,
  faArrowUp,
  faArrowDown,
  faQuestionCircle,
  faInfoCircle,
  faChartArea,
  faReply,
  faGripLinesVertical,
  faSadCry,
  faCheckSquare,
  faSquare,
)

Vue.component('font-awesome-icon', FontAwesomeIcon)
Vue.use(VueInstant)
Vue.use(BootstrapVue)
Vue.use(Vuelidate)
Vue.use(vSelect)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
