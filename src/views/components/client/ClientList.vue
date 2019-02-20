<template>
  <div class="clients">
    <alert :data="error" />

    <successalert message="Client update successful"
                  :show="updatedClient" />

    <b-row class="list-options">
      <b-col cols="12"
             sm="8"
             md="6"
             lg="5"
             offset-sm="4"
             offset-md="6"
             offset-lg="7">
        <b-form class="search-form">
          <search v-model="search"
                  :suggestions="clients"
                  class="mr-3"
                  attribute="name" />

          <b-button-group>
            <b-dropdown text="Sorting"
                        variant="primary"
                        right="">
              <b-dropdown-item @click="filterClients('NAME', order)">
                <font-awesome-icon :icon="checked(filter, 'NAME')" /> Name
              </b-dropdown-item>
              <b-dropdown-item @click="filterClients('DOMAIN', order)">
                <font-awesome-icon :icon="checked(filter, 'DOMAIN')" /> Domain
              </b-dropdown-item>
              <b-dropdown-item @click="filterClients('CREATION_DATE', order)">
                <font-awesome-icon :icon="checked(filter, 'CREATION_DATE')" /> Creation Date
              </b-dropdown-item>
              <b-dropdown-item @click="filterClients('LAST_UPDATE', order)">
                <font-awesome-icon :icon="checked(filter, 'LAST_UPDATE')" /> Last Update
              </b-dropdown-item>
              <b-dropdown-divider />
              <b-dropdown-item @click="filterClients(filter, 'ASCENDING')">
                <font-awesome-icon :icon="checked(order, 'ASCENDING')" /> Ascending
              </b-dropdown-item>
              <b-dropdown-item @click="filterClients(filter, 'DESCENDING')">
                <font-awesome-icon :icon="checked(order, 'DESCENDING')" /> Descending
              </b-dropdown-item>
            </b-dropdown>
          </b-button-group>
        </b-form>
      </b-col>
    </b-row>

    <empty :show="clients && clients.length === 0 || !clients"
           icon="mobile-alt"
           headline="No clients yet"
           description="You need to connect clients to display your surveys!"
           link="https://github.com/th-koeln/open-product-evaluation-server/wiki"
           link-text="Find out how to connect a client" />

    <empty :show="filteredClients.length === 0 && clients.length !== 0"
           icon="sad-cry"
           headline="No results"
           description="There are no results. Please try something else." />

    <b-row class="clients__list">
      <b-col cols="12">
        <b-list-group>
          <b-list-group-item v-for="client in getClientsToDisplay(currentPage, perPage)"
                             :key="client.id"
                             class="survey-item">
            <b-row class="align-center">
              <b-col cols="12"
                     lg="5"
                     class="clients__title">
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
                     cols="4"
                     lg="2"
                     class="clients__owner">
                <span v-for="owner in client.owners"
                      :key="owner.id">
                  <strong>Owner</strong>
                  <br>
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
                     cols="4"
                     lg="2"
                     class="clients__owner">
                <strong>Owner</strong>
                <br>
                No Owner
              </b-col>


              <b-col cols="4"
                     lg="2"
                     class="clients__time">
                <strong>Creation Date</strong>
                <br>
                <time v-b-tooltip
                      :datetime="client.creationDate"
                      :title="time(client.creationDate)">
                  {{ date(client.creationDate) }}
                </time>
              </b-col>

              <b-col cols="4"
                     lg="2"
                     class="clients__time">
                <strong>Last Update</strong>
                <br>
                <time v-b-tooltip
                      :datetime="client.lastUpdate"
                      :title="time(client.lastUpdate)">
                  {{ date(client.lastUpdate) }}
                </time>
              </b-col>

              <b-col v-if="currentUser.isAdmin || isOwner(client.id, currentUser.id)"
                     cols="6"
                     lg="1"
                     class="clients__action">
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
      filter: 'LAST_UPDATE',
      order: 'DESCENDING',
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
    this.$store.dispatch('getClients', {
      filter: 'LAST_UPDATE',
      order: 'DESCENDING'
    }).catch((error) => {
      this.error = error
    })

    const state = this.$store.getters.getForm('client_update_success')
    if(state) {
      this.$store.commit('removeForm', 'client_update_success')
      this.updatedClient = true
    }
  },
  methods: {
    date(datetime) {
      const date = new Date(datetime)
      return `${date.getFullYear()}-${this.prependZero(date.getMonth())}-${this.prependZero(date.getDay())}`
    },
    prependZero(input) {
      return ('0' + input).slice(-2)
    },
    time(time) {
      const date = new Date(time)
      return `${this.prependZero(date.getHours())}:${this.prependZero(date.getMinutes())}`
    },
    filterClients(filter, order) {
      this.filter = filter
      this.order = order

      this.$store.dispatch('getClients', {
        filter,
        order,
      })
    },
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
    checked(value, match) {
      if (value === match) {
        return ['far', 'check-square']
      }
      return ['far', 'square']
    },
  },
}
</script>

<style scoped="true" lang="scss">

  time {
    border-bottom: 1px dotted $secondaryColor;
  }
  
  .clients .pagination  {
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

  @media(max-width: 991px) {
    .clients {

      .clients__title,
      .clients__time,
      .clients__owner {
        margin-bottom: $marginDefault;
      }
    }
  }

  @media print {
    .list-options,
    .btn-link {
      display: none;
    }

    .clientlist .badge {
      border: 1px solid $secondaryColor;
    }

    .clientlist .badge-primary {
      background-color: $primaryColorPrint;
      color: #000000;
    }
  }
</style>
