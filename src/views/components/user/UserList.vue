<template>
  <div class="users">
    <alert :data="error" />

    <successalert message="User update successful"
                  :show="updatedUser" />

    <b-row class="list-options">
      <b-col cols="12"
             sm="4"
             md="6"
             lg="7"
             offset-sm="8"
             offset-md="6"
             offset-lg="5">
        <b-form class="search-form">
          <b-input v-model="search"
                   class="mr-3"
                   placeholder="Search..." />
          <b-button-group>
            <b-dropdown text="Sorting"
                        variant="primary"
                        right="">
              <b-dropdown-item @click="filterUsers('CREATION_DATE', order)">
                <font-awesome-icon :icon="checked(filter, 'CREATION_DATE')" /> Creation Date
              </b-dropdown-item>
              <b-dropdown-item @click="filterUsers('LAST_UPDATE', order)">
                <font-awesome-icon :icon="checked(filter, 'LAST_UPDATE')" /> Last Update
              </b-dropdown-item>
              <b-dropdown-item @click="filterUsers('FIRST_NAME', order)">
                <font-awesome-icon :icon="checked(filter, 'FIRST_NAME')" /> Firstname
              </b-dropdown-item>
              <b-dropdown-item @click="filterUsers('LAST_NAME', order)">
                <font-awesome-icon :icon="checked(filter, 'LAST_NAME')" /> Lastname
              </b-dropdown-item>
              <b-dropdown-item @click="filterUsers('EMAIL', order)">
                <font-awesome-icon :icon="checked(filter, 'EMAIL')" /> E-Mail
              </b-dropdown-item>
              <b-dropdown-divider />
              <b-dropdown-item @click="filterUsers(filter, 'ASCENDING')">
                <font-awesome-icon :icon="checked(order, 'ASCENDING')" /> Ascending
              </b-dropdown-item>
              <b-dropdown-item @click="filterUsers(filter, 'DESCENDING')">
                <font-awesome-icon :icon="checked(order, 'DESCENDING')" /> Descending
              </b-dropdown-item>
            </b-dropdown>
          </b-button-group>
        </b-form>
      </b-col>
    </b-row>

    <empty :show="filteredUsers.length === 0 && users.length !== 0"
           icon="sad-cry"
           headline="No results"
           description="There are no results. Please try something else." />

    <b-list-group class="users__list">
      <b-list-group-item v-for="user in getUsersToDisplay(currentPage, perPage)"
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

    <b-pagination v-if="numberOfUsers > perPage"
                  v-model="currentPage"
                  :per-page="perPage"
                  :total-rows="numberOfUsers" />
  </div>
</template>

<script>
import Alert from '@/components/misc/ErrorAlert.vue'
import SuccessAlert from '@/components/misc/SuccessAlert.vue'
import EmptyState from '@/components/misc/EmptyState.vue'

export default {
  name: 'UserList',
  components: {
    alert: Alert,
    successalert: SuccessAlert,
    empty: EmptyState,
  },
  data() {
    return {
      search: '',
      error: null,
      updatedUser: false,
      currentPage: 1,
      perPage: 10,
      filter: 'LAST_UPDATE',
      order: 'DESCENDING',
    }
  },
  computed: {
    numberOfUsers() {
      const amount = this.$store.getters.getTotalNumberOfUsers

      if (this.filteredUsers.length < amount) {
        return this.filteredUsers.length
      }
      return amount
    },
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
  watch: {
    '$route' (to, from) {
      // route changed, update current page
      const page = parseInt(this.$route.params.page, 10)

      if (!isNaN(page) && Number.isInteger(page)) {
        this.currentPage = parseInt(this.$route.params.page, 10)
      }
    },
    // needs function keyword because reasons
    'currentPage': function () {
      this.$router.push(`/user/page/${this.currentPage}`)
    }
  },
  created() {
    this.$store.dispatch('getUsers', {
      filter: 'LAST_UPDATE',
      order: 'DESCENDING'
    }).catch((error) => {
      this.error = error
    })

    const state = this.$store.getters.getForm('user_update_success')
    if(state) {
      this.$store.commit('removeForm', 'user_update_success')
      this.updatedUser = true
    }
  },
  methods: {
    getUsersToDisplay(currentPage, usersPerPage) {
      if (this.filteredUsers && this.filteredUsers.length && this.filteredUsers.length > 0) {
        return this.filteredUsers.slice((currentPage - 1) * usersPerPage, currentPage * usersPerPage)
      }
    },
    filterUsers(filter, order) {
      this.filter = filter
      this.order = order

      this.$store.dispatch('getUsers', {
        filter,
        order,
      })
    },
    checked(value, match) {
      if (value === match) {
        return ['far', 'check-square']
      }
      return ['far', 'square']
    },
  }
}
</script>

<style scoped="true" lang="scss">
  .users .pagination  {
    margin-top: $marginDefault;
  }
  
  .search-form {
    display: flex;
  }

  .list-options {
    margin-bottom: 0;

    >div {
      margin-bottom: 1.5rem;

      .search-form >div:first-child {
        flex: 1;
      }
    }
  }
  @media print {
    .list-options,
    .btn-link { 
      display: none;
    }
  }
</style>
