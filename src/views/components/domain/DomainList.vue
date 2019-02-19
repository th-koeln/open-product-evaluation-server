<template>
  <div class="domains">
    <alert :data="error" />

    <successalert message="Domain update successful"
                  :show="updatedDomain" />

    <b-row class="list-options">
      <b-col cols="5"
             sm="6"
             lg="7">
        <router-link :to="{ path: '/domain/new' }"
                     class="btn btn-primary">
          New Domain
        </router-link>
      </b-col>
      <b-col cols="7"
             sm="6"
             lg="5">
        <b-form class="search-form">
          <search v-model="search"
                  :suggestions="domains"
                  attribute="name" />
        </b-form>
      </b-col>
    </b-row>

    <empty :show="domains && domains.length === 0 || !domains"
           icon="object-group"
           headline="No domains yet"
           description="Start to add domains to show your surveys everywhere!"
           link="domain/new"
           link-text="Create new domain" />

    <empty :show="filteredDomains.length === 0 && domains.length !== 0"
           icon="sad-cry"
           headline="No results"
           description="There are no results. Please try something else." />

    <grid class="domains__grid">
      <b-card v-for="domain in getDomainsToDisplay(currentPage, perPage)"
              :key="domain.id">
        <h4>{{ domain.name }}</h4>

        <strong>
          Active Survey
        </strong>
        <p v-if="domain.activeSurvey">
          {{ domain.activeSurvey.title }}
        </p>
        <p v-else>
          No survey active
        </p>

        <b-row>
          <b-col sm="6">
            <strong>Clients</strong>
            <p v-if="domain.clients && domain.clients.length > 0">
              {{ domain.clients.length }} Clients online
            </p>
            <p v-else>
              No Clients online
            </p>
          </b-col>
          <b-col sm="6">
            <strong>Owner</strong>
            <p v-if="domain.owners && domain.owners.length > 0 ">
              {{ domain.owners.length }} Owner
            </p>
            <p v-else>
              No Owner
            </p>
          </b-col>
        </b-row>

        <div class="card-links">
          <router-link :to="{ path: '/domain/edit/' + domain.id }"
                       class="btn btn-link">
            Edit
          </router-link>

          <b-btn v-b-modal="'modal-grid-' + domain.id"
                 variant="link">
            Remove
          </b-btn>

          <b-modal :id="'modal-grid-' + domain.id"
                   size="sm"
                   title="Confirm deletion"
                   centered>
            Do you really want to delete this domain?
            <div slot="modal-footer">
              <b-btn variant="primary"
                     @click="deleteDomain($event, domain.id);">
                Remove
              </b-btn>
            </div>
          </b-modal>
        </div>
      </b-card>
    </grid>

    <b-pagination v-if="numberOfDomains > perPage"
                  v-model="currentPage"
                  :per-page="perPage"
                  :total-rows="numberOfDomains" />
  </div>
</template>

<script>
import Alert from '@/components/misc/ErrorAlert.vue'
import GridView from '@/components/misc/Grid.vue'
import SuccessAlert from '@/components/misc/SuccessAlert.vue'
import SearchInput from '@/components/misc/SearchInput.vue'
import EmptyState from '@/components/misc/EmptyState.vue'

export default {
  name: 'DomainList',
  components: {
    grid: GridView,
    alert: Alert,
    successalert: SuccessAlert,
    search: SearchInput,
    empty: EmptyState,
  },
  data() {
    return {
      search: '',
      view: 'grid',
      error: null,
      updatedDomain: false,
      currentPage: 1,
      perPage: 9,
    }
  },
  computed: {
    numberOfDomains() {
      const amount = this.$store.getters.getTotalNumberOfDomains

      if (this.filteredDomains.length < amount) {
        return this.filteredDomains.length
      }
      return amount
    },
    filteredDomains() {
      return this.domains.filter((domain) => {
        let contains = false

        contains = domain.name.toLowerCase().includes(this.search.toLowerCase())

        if (!contains && domain.activeSurvey) {
          contains = domain.activeSurvey.title.toLowerCase().includes(this.search.toLowerCase())
        }

        if (!contains && domain.activeQuestion) {
          contains = domain.activeQuestion.value.toLowerCase().includes(this.search.toLowerCase())
        }

        if (!contains && domain.clients) {
          const result = domain.clients
            .filter(client => client.name
              .toLowerCase()
              .includes(this.search.toLowerCase()))
          if (result.length > 0) {
            contains = true
          }
        }

        if (!contains && domain.owners) {
          const result = domain.owners
            .filter((owner) => {
              const name = `${owner.firstName} ${owner.lastName}`.toLowerCase()
              return name.includes(this.search.toLowerCase())
            })
          if (result.length > 0) {
            contains = true
          }
        }
        return contains
      })
    },
    domains() {
      return this.$store.getters.getDomains
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
      this.$router.push(`/domain/page/${this.currentPage}`)
    }
  },
  created() {
    this.$store.dispatch('getDomains').catch((error) => {
      this.error = error
    })

    const state = this.$store.getters.getForm('domain_update_success')
    if(state) {
      this.$store.commit('removeForm', 'domain_update_success')
      this.updatedDomain = true
    }
  },
  methods: {
    getDomainsToDisplay(currentPage, domainsPerPage) {
      if (this.filteredDomains && this.filteredDomains.length && this.filteredDomains.length > 0) {
        return this.filteredDomains.slice((currentPage - 1) * domainsPerPage, currentPage * domainsPerPage)
      }
    },
    deleteDomain(event, id) {
      event.preventDefault()
      this.$store.dispatch('deleteDomain', { id }).catch((error) => {
        this.error = error
      })
    },
  },
}
</script>

<style scoped="true" lang="scss">

  .domains .pagination  {
    margin-top: $marginDefault;
  }
  
  @media print {
    .list-options,
    .btn-link {
      display: none;
    }
  }
</style>
