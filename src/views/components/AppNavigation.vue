<template>
  <b-navbar toggleable="sm"
            class="navigation">
    <b-container>
      <b-navbar-toggle target="nav_collapse" />

      <b-navbar-brand href="/#/survey"
                      class="navigation__brand">
        OPE
      </b-navbar-brand>

      <b-collapse id="nav_collapse"
                  is-nav>
        <b-navbar-nav>
          <b-nav-item :to="{ path: '/survey'}"
                      class="navigation__item">
            <font-awesome-icon icon="poll" /> Surveys
          </b-nav-item>
          <b-nav-item :to="{ path: '/domain'}"
                      class="navigation__item">
            <font-awesome-icon icon="object-group" /> Domains
          </b-nav-item>
          <b-nav-item :to="{ path: '/clients'}"
                      class="navigation__item">
            <font-awesome-icon icon="mobile-alt" /> Clients
          </b-nav-item>
          <b-nav-item v-if="currentUser.user.isAdmin"
                      class="navigation__item"
                      :to="{ path: '/user'}">
            <font-awesome-icon icon="users" /> User
          </b-nav-item>
        </b-navbar-nav>

        <b-navbar-nav class="ml-auto">
          <b-nav-item-dropdown
            :text="`${currentUser.user.firstName} ${currentUser.user.lastName}`"
            right>
            <b-dropdown-item href="/#/profile">
              Profile
            </b-dropdown-item>
            <b-dropdown-item href="#"
                             @click="logout">
              Logout
            </b-dropdown-item>
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

  .navigation {
    margin-bottom: 2rem;
    background-color: #FFFFFF;
    z-index: 1;

    .navigation__brand {
      color: $primaryColor !important;

      &:hover { color: $primaryColor !important; }
    }

    .navigation__item /deep/ .nav-link {
      color: $textColor !important;
    }

    .navbar-toggler { outline: none; }
  }
  @media(max-width: 991px) {
    .navigation .nav-link.active { color: $primaryColor !important; }
  }

  @media(min-width: 575px) {

    .navigation {
      padding: 0 1rem !important;

      .nav-link {
        padding: 1rem !important;
        border-bottom: 3px solid #FFFFFF;
        transition: border .4s, color .4s;

        &.active { border-bottom: 3px solid $primaryColor; color: $primaryColor !important; }

        &:hover {
          border-bottom: 3px solid $primaryColor;
          color: $primaryColorHover !important;
          background-color: transparent !important;
        }
      }
    }
  }

  @media(max-width: 575px) {
    .navigation {
      padding: 0;

      .container {
        flex-direction: row-reverse;
      }

      .navigation__brand, .navbar-toggler {
        margin: 0.5rem 1rem;
      }

      .nav-link.active {
        background-color: $primaryColor;
        color: #FFFFFF !important;
      }

      .nav-link {
        padding: 1rem !important;
      }

      /deep/.dropdown-toggle {
        padding: 1rem !important;
      }

      /deep/.dropdown-menu {
        background-color: #eef1f5 !important;
        border: 0;
        border-radius: 0;
        margin-bottom: 1rem;
        padding: 0;

        .dropdown-item {
          padding: 1rem 2rem;

          &:hover {
            color: #FFFFFF;
            background-color: $primaryColor !important;
          }

          &:focus {
            background-color: transparent;
          }
        }
      }
    }
  }

  @media print {
    .navigation {
      display: none;
    }
  }
</style>
