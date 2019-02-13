<template>
  <div class="userlist">
    <alert :data="error" />

    <successalert message="User update successful"
                  :show="updatedUser" />

    <b-row class="list-options">
      <b-col cols="7"
             sm="6"
             lg="5"
             offset="5"
             offset-sm="6"
             offset-lg="7">
        <b-form class="search-form">
          <b-input v-model="search"
                   placeholder="Search..." />
        </b-form>
      </b-col>
    </b-row>

    <b-alert v-if="filteredUsers.length === 0 && users.length !== 0"
             show>
      This search returned no results.
    </b-alert>


    <b-list-group>
      <b-list-group-item v-for="user in filteredUsers"
                         :key="user.id">
        <b-row class="align-center">
          <b-col cols="12"
                 sm="4">
            {{ user.firstName + ' ' + user.lastName }}
          </b-col>

          <b-col cols="6"
                 sm="4">
            {{ user.email }}
          </b-col>

          <b-col cols="6"
                 sm="4"
                 class="text-right">
            <router-link :to="{ path: '/user/edit/' + user.id }"
                         class="btn btn-link">
              Edit
            </router-link>
          </b-col>
        </b-row>
      </b-list-group-item>
    </b-list-group>
  </div>
</template>

<script>
import Alert from '@/components/misc/ErrorAlert.vue'
import SuccessAlert from '@/components/misc/SuccessAlert.vue'

export default {
  name: 'UserList',
  components: {
    alert: Alert,
    successalert: SuccessAlert,
  },
  data() {
    return {
      search: '',
      error: null,
      updatedUser: false,
    }
  },
  computed: {
    filteredUsers() {
      return this.users.filter((user) => {
        let contains = (user.firstName.toLowerCase() + user.lastName
          .toLowerCase()).includes(this.search.toLowerCase())

        if (!contains) {
          contains = user.email.toLowerCase().includes(this.search.toLowerCase())
        }

        return contains
      })
    },
    users() {
      return this.$store.getters.getUsers
    },
  },
  created() {
    this.$store.dispatch('getUsers').catch((error) => {
      this.error = error
    })

    const state = this.$store.getters.getForm('user_update_success')
    if(state) {
      this.$store.commit('removeForm', 'user_update_success')
      this.updatedUser = true
    }
  },
}
</script>
