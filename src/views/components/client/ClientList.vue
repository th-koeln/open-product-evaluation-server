<template>
  <div class="clients">
    <alert :data="error" />

    <successalert message="Client update successful"
                  :show="updatedClient" />

    <b-row class="list-options">
      <b-col cols="7"
             sm="6"
             lg="5"
             offset="5"
             offset-sm="6"
             offset-lg="7">
        <b-form class="search-form">
          <search v-model="search"
                  :suggestions="clients"
                  attribute="name" />
        </b-form>
      </b-col>
    </b-row>

    <empty :show="clients && clients.length === 0 || !clients"
           icon="mobile-alt"
           headline="No clients yet"
           description="You need to connect clients to display your surveys!"
           link="https://github.com/th-koeln/open-product-evaluation-server/wiki"
           link-text="Find out how to connect a client" />

    <b-alert v-if="filteredClients.length === 0 && clients.length !== 0"
             show>
      This search returned no results.
    </b-alert>

    <b-row class="clients__list">
      <b-col cols="12">
        <b-list-group>
          <b-list-group-item v-for="client in getClientsToDisplay(currentPage, perPage)"
                             :key="client.id"
                             class="survey-item">
            <b-row class="align-center">
              <b-col sm="6">
                <h5>{{ client.name }}</h5>
                <p v-if="client.domain"
                   class="text-secondary mb-0">
                  {{ client.domain.name }}
                </p>
                <p v-else
                   class="text-secondary mb-0">
                  no domain
                </p>
              </b-col>

              <b-col v-if="client.owners"
                     cols="6"
                     sm="4">
                <span v-for="owner in client.owners"
                      :key="owner.id">
                  <span v-if="owner.id === currentUser.id"
                        class="badge badge-primary">
                    My Client
                  </span>

                  <span v-if="owner.id !== currentUser.id">
                    {{ client.owners.length }} Owner
                  </span>
                </span>
              </b-col>

              <b-col v-if="!client.owners || (client.owners && client.owners.length === 0)"
                     cols="6"
                     sm="4">
                No Owner
              </b-col>

              <b-col v-if="currentUser.isAdmin || isOwner(client.id, currentUser.id)"
                     cols="6"
                     sm="2"
                     class="text-right">
                <router-link :to="{ path: '/clients/edit/' + client.id }"
                             class="btn btn-link">
                  Edit
                </router-link>
              </b-col>
            </b-row>
          </b-list-group-item>
        </b-list-group>
      </b-col>
    </b-row>

    <b-pagination v-if="numberOfClients > perPage"
                  v-model="currentPage"
                  :per-page="perPage"
                  :total-rows="numberOfClients" />
  </div>
</template>

<script>
import Alert from '@/components/misc/ErrorAlert.vue'
import SuccessAlert from '@/components/misc/SuccessAlert.vue'
import SearchInput from '@/components/misc/SearchInput.vue'
import EmptyState from '@/components/misc/EmptyState.vue'

export default {
  name: 'ClientList',
  components: {
    alert: Alert,
    successalert: SuccessAlert,
    search: SearchInput,
    empty: EmptyState,
  },
  data() {
    return {
      search: '',
      error: null,
      updatedClient: false,
      currentPage: 1,
      perPage: 10,
    }
  },
  computed: {
    numberOfClients() {
      const amount = this.$store.getters.getTotalNumberOfClients

      if (this.filteredClients.length < amount) {
        return this.filteredClients.length
      }
      return amount
    },
    filteredClients() {
      return this.clients.filter((clients) => {
        let contains = clients.name.toLowerCase().includes(this.search.toLowerCase())

        if (!contains && clients.domain) {
          contains = clients.domain.name.toLowerCase().includes(this.search.toLowerCase())
        }

        return contains
      })
    },
    clients() {
      return this.$store.getters.getClients
    },
    currentUser() {
      return this.$store.getters.getCurrentUser.user
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
      this.$router.push(`/clients/page/${this.currentPage}`)
    }
  },
  created() {
    this.$store.dispatch('getClients').catch((error) => {
      this.error = error
    })

    const state = this.$store.getters.getForm('client_update_success')
    if(state) {
      this.$store.commit('removeForm', 'client_update_success')
      this.updatedClient = true
    }
  },
  methods: {
    getClientsToDisplay(currentPage, clientsPerPage) {
      if (this.filteredClients && this.filteredClients.length && this.filteredClients.length > 0) {
        return this.filteredClients.slice((currentPage - 1) * clientsPerPage, currentPage * clientsPerPage)
      }
    },
    isOwner(clientID, userID) {
      const client = this.clients.find(d => d.id === clientID)

      if (!client) {
        return false
      }

      if (!client.owners) {
        return false
      }

      if (client.owners.length === 0) {
        return false
      }

      const user = client.owners.filter(o => o.id === userID)
      if (user.length > 0) {
        return true
      }
      return false
    },
  },
}
</script>

<style scoped="true" lang="scss">
  
  .clients .pagination  {
    margin-top: $marginDefault;
  }
</style>
