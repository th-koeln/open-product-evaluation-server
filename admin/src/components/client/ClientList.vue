<template>
  <div class="clientlist">
    <b-row class="list-options">
      <b-col cols="7"
             sm="6"
             lg="5"
             offset="5"
             offset-sm="6"
             offset-lg="7">
        <b-form class="search-form">
          <vue-instant v-model="search"
                       :suggestions="clients"
                       suggestion-attribute="name"
                       :show-autocomplete="true"
                       type="custom"
                       placeholder="Search..." />
        </b-form>
      </b-col>
    </b-row>

    <alert :data="error" />

    <p v-if="clients && clients.length === 0"
       class="text-center">
      There are no clients.
    </p>

    <b-alert v-if="filteredClients.length === 0 && clients.length !== 0"
             show>
      This search returned no results.
    </b-alert>

    <b-row>
      <b-col cols="12">
        <b-list-group>
          <b-list-group-item v-for="client in filteredClients"
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
  </div>
</template>

<script>
import Alert from '@/components/misc/ErrorAlert.vue'

export default {
  name: 'ClientList',
  components: {
    alert: Alert,
  },
  data() {
    return {
      search: '',
      error: null,
    }
  },
  computed: {
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
  created() {
    this.$store.dispatch('getClients').catch((error) => {
      this.error = error
    })
  },
  methods: {
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

</style>
