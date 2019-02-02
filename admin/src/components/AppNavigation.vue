<template>
  <b-navbar toggleable="md">
    <b-container>
      <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>

      <b-navbar-brand href="/#/survey">OPE</b-navbar-brand>

      <b-collapse is-nav id="nav_collapse">

        <b-navbar-nav>
          <b-nav-item :to="{ path: '/survey'}">
            <font-awesome-icon icon="poll" /> Surveys
          </b-nav-item>
          <b-nav-item :to="{ path: '/domain'}">
            <font-awesome-icon icon="object-group" /> Domains
          </b-nav-item>
          <b-nav-item :to="{ path: '/clients'}">
            <font-awesome-icon icon="mobile-alt" /> Clients
          </b-nav-item>
          <b-nav-item :to="{ path: '/user'}"
                      v-if="currentUser.user.isAdmin">
            <font-awesome-icon icon="users" /> User
          </b-nav-item>
        </b-navbar-nav>

        <b-navbar-nav class="ml-auto">
          <b-nav-item-dropdown
            :text="`${currentUser.user.firstName} ${currentUser.user.lastName}`"
            right>
            <b-dropdown-item href="/#/profile">Profile</b-dropdown-item>
            <b-dropdown-item href="#" @click="logout">Logout</b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>
      </b-collapse>
    </b-container>
  </b-navbar>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'NavBar',
  computed: {
    ...mapGetters({
      currentUser: 'getCurrentUser',
    }),
  },
  methods: {
    logout(event) {
      event.preventDefault()
      this.$store.dispatch('logout').then(() => this.$router.replace('/'))
    },
  },
}
</script>

<style scoped="true" lang="scss">
.navbar { margin-bottom: 2rem; }

.navbar-brand {
  color: $primaryColor !important;

  &:hover { color: $primaryColor !important; }
}

.nav-link {
  color: $textColor !important;
}

.navbar-toggler { outline: none; }

@media(max-width: 991px) {
  .nav-link.active { color: $primaryColor !important; }
}

@media(min-width: 768px) {

  .navbar {
    padding: 0 1rem !important;
    background-color: #FFFFFF !important;

    .nav-link {
      padding: 1rem !important;
      border-bottom: 3px solid #FFFFFF;
      transition: border .4s, color .4s;

      &.active { border-bottom: 3px solid $primaryColor; color: $primaryColor !important; }

      &:hover {
        border-bottom: 3px solid $primaryColor;
        color: #1691d0 !important;
        background-color: transparent !important;
      }
    }
  }
}
</style>
