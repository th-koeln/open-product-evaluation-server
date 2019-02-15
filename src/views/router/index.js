import Vue from 'vue'
import Router from 'vue-router'

// account
import LoginForm from '@/components/account/LoginForm.vue'
import RegisterForm from '@/components/account/RegisterForm.vue'
import ProfileForm from '@/components/account/ProfileForm.vue'

// survey
import Survey from '@/components/survey/Survey.vue'
import SurveyList from '@/components/survey/SurveyList.vue'
import SurveyFormNew from '@/components/survey/SurveyFormNew.vue'

// user
import UserList from '@/components/user/UserList.vue'
import UserEdit from '@/components/user/UserEdit.vue'

// domains
import DomainList from '@/components/domain/DomainList.vue'
import DomainNew from '@/components/domain/DomainNew.vue'
import DomainEdit from '@/components/domain/DomainEdit.vue'

// clients
import ClientList from '@/components/client/ClientList.vue'
import ClientEdit from '@/components/client/ClientEdit.vue'

// preview
import Preview from '@/components/preview/Preview.vue'

// app
import AppWrapper from '@/components/AppWrapper.vue'
import store from '@/store/store'

Vue.use(Router)

const loginGuard = (to, from, next) => {
  if (store.state.auth.currentUser === null) {
    next('/')
  } else {
    next()
  }
}

const isAdminGuard = (to, from, next) => {
  if (store.state.auth.currentUser && store.state.auth.currentUser.user.isAdmin) {
    next()
  } else {
    next('/')
  }
}

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Login',
      component: LoginForm,
      beforeEnter: (to, from, next) => {
        if (store.state.auth.currentUser !== null) {
          next('/survey')
        } else {
          next()
        }
      },
    },
    {
      path: '/register',
      name: 'Register',
      component: RegisterForm,
    },
    {
      path: '/survey',
      component: AppWrapper,
      beforeEnter: loginGuard,
      children: [
        {
          path: '',
          name: 'SurveyList',
          component: SurveyList,
        },
        {
          path: 'new',
          name: 'SurveyNew',
          component: SurveyFormNew,
        },
        {
          path: 'page/:page',
          name: 'SurveyPagination',
          component: SurveyList,
        },
        {
          path: ':id',
          name: 'Survey',
          component: Survey,
        },
        {
          path: ':id/:tab',
          name: 'SurveyTab',
          component: Survey,
        },
      ],
    },
    {
      path: '/preview/:id',
      component: Preview,
      beforeEnter: loginGuard,
    },
    {
      path: '/domain',
      component: AppWrapper,
      children: [
        {
          path: '',
          name: 'DomainList',
          component: DomainList,
        },
        {
          path: 'page/:page',
          name: 'DomainPagination',
          component: DomainList,
        },
        {
          path: 'new',
          name: 'DomainNew',
          component: DomainNew,
        },
        {
          path: 'edit/:id',
          name: 'DomainEdit',
          component: DomainEdit,
        },
      ],
    },
    {
      path: '/clients',
      component: AppWrapper,
      children: [
        {
          path: '',
          name: 'ClientList',
          component: ClientList,
        },
        {
          path: 'page/:page',
          name: 'ClientPagination',
          component: ClientList,
        },
        {
          path: 'edit/:id',
          name: 'ClientEdit',
          component: ClientEdit,
        },
      ],
    },
    {
      path: '/profile',
      component: AppWrapper,
      children: [
        {
          path: '',
          name: 'Profile',
          component: ProfileForm,
        },
      ],
    },
    {
      path: '/user',
      component: AppWrapper,
      beforeEnter: isAdminGuard,
      children: [
        {
          path: '',
          name: 'UserList',
          component: UserList,
        },
        {
          path: 'page/:page',
          name: 'UserPagination',
          component: UserList,
        },
        {
          path: 'edit/:id',
          name: 'UserEdit',
          component: UserEdit,
        },
      ],
    },
  ],
})
