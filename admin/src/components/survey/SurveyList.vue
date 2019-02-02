<template>
  <div class="surveylist">

    <b-row class="list-options">
      <b-col cols="5" sm="6" lg="7">
        <router-link :to="{ path: 'survey/new' }"
                     class="btn btn-primary">New Survey</router-link>
      </b-col>
      <b-col cols="7" sm="6" lg="5">
        <b-form class="search-form">
          <vue-instant v-model="search"
                       :suggestions="surveys"
                       suggestion-attribute="title"
                       :show-autocomplete="true"
                       type="custom"
                       placeholder="Search...">
          </vue-instant>
        </b-form>
      </b-col>
    </b-row>

    <alert :data="error"></alert>

    <p class="text-center"
       v-if="surveys.length === 0">
      There are no surveys.
    </p>

    <b-alert show
             v-if="filteredSurveys.length === 0 && surveys.length !== 0">
      This search returned no results.
    </b-alert>

    <grid>
      <b-card v-for="survey in filteredSurveys"
              :key="survey.id">
        <h5 class="card-title">

          <b-badge variant="primary"
                   v-if="survey.isPublic">public</b-badge>

          <b-badge variant="secondary"
                   v-if="!survey.isPublic">private</b-badge>

          {{ survey.title }}
        </h5>
        <p class="creator">
          created by <strong>{{ survey.creator.firstName + ' ' + survey.creator.lastName}}</strong>
        </p>
        <p class="description">
          {{ survey.description }}
        </p>

        <div class="card-links">
          <router-link :to="{ path: '/survey/' + survey.id }"
                       class="card-link">Details</router-link>

          <a href="#" @click="showModal(survey.id, $event)" class="card-link">Remove</a>

          <b-modal :ref="'modal-grid-' + survey.id"
                   :id="'modal-grid-' + survey.id"
                   size="sm"
                   title="Confirm deletion"
                   centered>
            Do you really want to delete this survey?
            <div slot="modal-footer">
              <b-btn variant="primary"
                     @click="deleteSurvey($event, survey.id);">Remove</b-btn>
            </div>
          </b-modal>
        </div>

      </b-card>
    </grid>
  </div>
</template>

<script>
import Alert from '@/components/misc/ErrorAlert.vue'
import GridView from '@/components/misc/Grid.vue'
import { mapGetters } from 'vuex'

export default {
  name: 'SurveyList',
  data() {
    return {
      search: '',
      error: null,
    }
  },
  components: {
    alert: Alert,
    grid: GridView,
  },
  created() {
    this.$store.dispatch('getSurveys').catch((error) => {
      this.error = error
    })
  },
  computed: {
    ...mapGetters({
      surveys: 'getSurveys',
    }),
    filteredSurveys() {
      return this.surveys.filter((survey) => {
        let contains = false

        const state = survey.isPublic ? 'public' : 'private'

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
  methods: {
    deleteSurvey(event, surveyID) {
      event.preventDefault()
      this.$store.dispatch('deleteSurvey', {
        id: surveyID,
      }).catch((error) => {
        this.error = error
      })
    },
    showModal(surveyID, event) {
      event.preventDefault()
      this.$refs[`modal-grid-${surveyID}`][0].show()
    },
  },
}
</script>

<style scoped="true" lang="scss">

  .card {

    >.card-body {
      display: flex;
      flex-direction: column;

      >.card-title .badge { font-size: 0.8rem; }

      >.card-title {
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }

      >.card-links {
        margin-top: auto;

        a:first-child { padding-left: 0; }
      }
    }
  }
</style>
