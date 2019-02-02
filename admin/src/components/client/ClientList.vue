<template>
  <div class="clientlist">

    <b-row class="list-options">
      <b-col cols="7" sm="6" lg="5" offset="5" offset-sm="6" offset-lg="7">
        <b-form class="search-form">
          <vue-instant v-model="search"
                       :suggestions="clients"
                       suggestion-attribute="name"
                       :show-autocomplete="true"
                       type="custom"
                       placeholder="Search...">
          </vue-instant>
        </b-form>
      </b-col>
    </b-row>

    <alert :data="error"></alert>

    <p class="text-center"
       v-if="clients && clients.length === 0">
      There are no clients.
    </p>

    <b-alert show
             v-if="filteredClients.length === 0 && clients.length !== 0">
      This search returned no results.
    </b-alert>

    <b-row>
      <b-col cols="12">
        <b-list-group>
          <b-list-group-item class="survey-item"
                             v-for="client in filteredClients"
                             v-bind:key="client.id">

            <b-row class="align-center">

              <b-col sm="6">
                  <h5>{{ client.name }}</h5>
                  <p class="domain"
                     v-if="client.domain">
                    {{ client.domain.name }}
                  </p>
                  <p class="domain"
                     v-else>
                    no domain
                  </p>
                  <!--<p v-if="client.domain && client.domain.activeSurvey">
                    Survey: {{ client.domain.activeSurvey.title}}
                  </p>
                  <p v-if="client.domain && client.domain.activeQuestion">
                    Question: {{ client.domain.activeQuestion.value}}
                  </p>-->
              </b-col>

              <b-col cols="6"
                     sm="4"
                     v-if="client.owners">

                <span v-bind:key="owner.id"
                      v-for="owner in client.owners">

                  <span class="badge badge-primary"
                        v-if="owner.id === currentUser.id">
                    My Client
                  </span>

                  <span v-if="owner.id !== currentUser.id">
                    {{ client.owners.length }} Owner
                  </span>
                </span>
              </b-col>

              <b-col cols="6"
                     sm="4"
                     v-if="!client.owners || (client.owners && client.owners.length === 0)">
                No Owner
              </b-col>

              <b-col cols="6"
                     sm="2"
                     class="text-right"
                     v-if="currentUser.isAdmin || isOwner(client.id, currentUser.id)">

                <router-link :to="{ path: '/clients/edit/' + client.id }"
                             class="btn btn-link">Edit</router-link>
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
    this.$store.dispatch('getClients').catch((error) => {
      this.error = error
    })
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

  .domain { margin-bottom: 0; color: #787d82; }

</style>
