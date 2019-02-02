<template>
  <div class="userlist">

    <b-row class="list-options">
      <b-col cols="7" sm="6" lg="5" offset="5" offset-sm="6" offset-lg="7">
        <b-form class="search-form">
          <b-input v-model="search"
                   placeholder="Search..."></b-input>
        </b-form>
      </b-col>
    </b-row>

    <alert :data="error"></alert>

    <p class="text-center"
       v-if="users && users.length === 0">
      There are no users.
    </p>

    <b-alert show
             v-if="filteredUsers.length === 0 && users.length !== 0">
      This search returned no results.
    </b-alert>


    <b-list-group>
      <b-list-group-item v-for="user in filteredUsers"
                         :key="user.id">
        <b-row class="align-center">

          <b-col cols="12" sm="4">
            {{ user.firstName + ' ' + user.lastName }}
          </b-col>

          <b-col cols="6" sm="4">
            {{ user.email }}
          </b-col>

          <b-col cols="6" sm="4" class="text-right">
            <router-link :to="{ path: '/user/edit/' + user.id }"
                         class="btn btn-link">Edit</router-link>
          </b-col>
        </b-row>
      </b-list-group-item>
    </b-list-group>
  </div>
</template>

<script>
import Alert from '@/components/misc/ErrorAlert.vue'

export default {
  name: 'UserList',
  data() {
    return {
      search: '',
      error: null,
    }
  },
  components: {
    alert: Alert,
  },
  created() {
    this.$store.dispatch('getUsers').catch((error) => {
      this.error = error
    })
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
}
</script>
