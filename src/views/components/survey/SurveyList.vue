<template>
  <div class="surveys">
    <alert :data="error" />

    <b-row class="list-options">
      <b-col cols="12"
             sm="4"
             md="6"
             lg="7">
        <router-link :to="{ path: '/survey/new' }"
                     class="btn btn-primary">
          New Survey
        </router-link>
      </b-col>
      <b-col cols="12"
             sm="8"
             md="6"
             lg="5">
        <b-form class="search-form">
          <search v-model="search"
                  :suggestions="surveys"
                  class="mr-3"
                  attribute="title" />
          <b-button-group>
            <b-dropdown text="Sorting"
                        variant="primary"
                        right="">
              <b-dropdown-item @click="filterSurveys('TITLE', order)">
                <font-awesome-icon :icon="checked(filter, 'TITLE')" /> Title
              </b-dropdown-item>
              <b-dropdown-item @click="filterSurveys('IS_ACTIVE', order)">
                <font-awesome-icon :icon="checked(filter, 'IS_ACTIVE')" /> Active
              </b-dropdown-item>
              <b-dropdown-item @click="filterSurveys('CREATION_DATE', order)">
                <font-awesome-icon :icon="checked(filter, 'CREATION_DATE')" /> Creation Date
              </b-dropdown-item>
              <b-dropdown-item @click="filterSurveys('LAST_UPDATE', order)">
                <font-awesome-icon :icon="checked(filter, 'LAST_UPDATE')" /> Last Update
              </b-dropdown-item>
              <b-dropdown-divider />
              <b-dropdown-item @click="filterSurveys(filter, 'ASCENDING')">
                <font-awesome-icon :icon="checked(order, 'ASCENDING')" /> Ascending
              </b-dropdown-item>
              <b-dropdown-item @click="filterSurveys(filter, 'DESCENDING')">
                <font-awesome-icon :icon="checked(order, 'DESCENDING')" /> Descending
              </b-dropdown-item>
            </b-dropdown>
          </b-button-group>
        </b-form>
      </b-col>
    </b-row>

    <empty :show="surveys && surveys.length === 0 || !surveys"
           icon="poll"
           headline="Add some surveys"
           description="You need to add surveys to gather data. Start now!"
           link="survey/new"
           link-text="Create new Survey" />

    <empty :show="filteredSurveys.length === 0 && surveys.length !== 0"
           icon="sad-cry"
           headline="No results"
           description="There are no results. Please try something else." />

    <grid v-if="!(surveys && surveys.length === 0 || !surveys) && !(filteredSurveys.length === 0 && surveys.length !== 0)"
          class="surveys__grid">
      <b-card v-for="survey in getSurveysToDisplay(currentPage, perPage)"
              :key="survey.id">
        <h5 class="card-title">
          <b-badge v-if="survey.isActive"
                   variant="primary">
            active
          </b-badge>

          <b-badge v-if="!survey.isActive"
                   variant="secondary">
            inactive
          </b-badge>

          {{ survey.title }}
        </h5>
        <p class="creator">
          created by <strong>{{ survey.creator.firstName + ' ' + survey.creator.lastName }}</strong>
        </p>
        <p class="survey__description">
          {{ survey.description }}
        </p>

        <div class="survey__meta">
          <b-row class="survey__dates">
            <b-col cols="6">
              <strong>
                Creation Date
              </strong>
              <br>
              <time :datetime="survey.creationDate">
                {{ date(survey.creationDate) }}
              </time>
            </b-col>
            <b-col cols="6">
              <strong>
                Last Update
              </strong>
              <br>
              <time :datetime="survey.lastUpdate">
                {{ date(survey.lastUpdate) }}
              </time>
            </b-col>
          </b-row>

          <div class="card-links">
            <router-link :to="{ path: '/survey/' + survey.id }"
                         class="card-link survey__details">
              Details
            </router-link>

            <a href="#"
               class="card-link survey__delete"
               @click.prevent="showModal(survey.id)">
              Remove
            </a>

            <b-modal :id="'modal-grid-' + survey.id"
                     :ref="'modal-grid-' + survey.id"
                     size="sm"
                     title="Confirm deletion"
                     centered>
              Do you really want to delete this survey?
              <div slot="modal-footer">
                <b-btn variant="primary"
                       @click.prevent="deleteSurvey(survey.id);">
                  Remove
                </b-btn>
              </div>
            </b-modal>
          </div>
        </div>
      </b-card>
    </grid>

    <b-pagination v-if="numberOfSurveys > perPage"
                  v-model="currentPage"
                  :per-page="perPage"
                  :total-rows="numberOfSurveys" />
  </div>
</template>

<script>
import Alert from '@/components/misc/ErrorAlert.vue'
import GridView from '@/components/misc/Grid.vue'
import SearchInput from '@/components/misc/SearchInput.vue'
import EmptyState from '@/components/misc/EmptyState.vue'
import { mapGetters } from 'vuex'

export default {
  name: 'SurveyList',
  components: {
    alert: Alert,
    grid: GridView,
    search: SearchInput,
    empty: EmptyState,
  },
  data() {
    return {
      search: '',
      error: null,
      currentPage: 1,
      perPage: 9,
      filter: 'LAST_UPDATE',
      order: 'DESCENDING',
    }
  },
  computed: {
    ...mapGetters({
      surveys: 'getSurveys',
    }),
    numberOfSurveys() {
      const amount = this.$store.getters.getTotalNumberOfSurveys

      if (this.filteredSurveys.length < amount) {
        return this.filteredSurveys.length
      }
      return amount
    },
    filteredSurveys() {
      return this.surveys.filter((survey) => {
        let contains = false

        const state = survey.isActive ? 'active' : 'inactive'

        contains = survey.title.toLowerCase().includes(this.search.toLowerCase())

        if (!contains) {
          contains = survey.description.toLowerCase().includes(this.search.toLowerCase())
        }

        if (!contains) {
          contains = survey.creator.firstName.toLowerCase().includes(this.search.toLowerCase())
        }

        if (!contains) {
          contains = survey.creator.lastName.toLowerCase().includes(this.search.toLowerCase())
        }

        if (!contains) {
          contains = state.includes(this.search.toLowerCase())
        }

        return contains
      })
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
      this.$router.push(`/survey/page/${this.currentPage}`)
    }
  },
  created() {
    this.$store.dispatch('getSurveys', {
      filter: 'LAST_UPDATE',
      order: 'DESCENDING'
    }).catch((error) => {
      this.error = error
    })
  },
  methods: {
    date(datetime) {
      const date = new Date(datetime)
      return `${date.getFullYear()}-${this.prependZero(date.getMonth() + 1)}-${this.prependZero(date.getDate())} ${this.prependZero(date.getHours())}:${this.prependZero(date.getMinutes())}`
    },
    prependZero(input) {
      return ('0' + input).slice(-2)
    },
    filterSurveys(filter, order) {
      this.filter = filter
      this.order = order

      this.$store.dispatch('getSurveys', {
        filter,
        order,
      })
    },
    deleteSurvey(surveyID) {
      this.$store.dispatch('deleteSurvey', {
        id: surveyID,
      }).catch((error) => {
        this.error = error
      })
    },
    getSurveysToDisplay(currentPage, surveysPerPage) {
      if (this.filteredSurveys && this.filteredSurveys.length && this.filteredSurveys.length > 0) {
        return this.filteredSurveys.slice((currentPage - 1) * surveysPerPage, currentPage * surveysPerPage)
      }
    },
    showModal(surveyID) {
      this.$refs[`modal-grid-${surveyID}`][0].show()
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

  .surveys .pagination  {
    margin-top: $marginDefault;
  }

  .surveys .survey__dates, .surveys .survey__description {
    margin-bottom: $marginDefault;
  }

  .surveys .survey__meta {
    margin-top: auto;
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
    .card-links {
      display: none;
    }

    .surveylist .badge {
      border: 1px solid $secondaryColor;
    }

    .surveylist .badge-primary {
      background-color: $primaryColorPrint;
      color: #000000;
    }
  }
</style>
