<template>
  <div class="survey">
    <b-row class="list-options">
      <b-col cols="4" sm="6" lg="7"></b-col>
      <b-col cols="8" sm="6" lg="5" class="text-right">
        <router-link :to="{ path: `/preview/${survey.id}` }"
                     class="btn btn-primary"
                     target="_blank">
           <font-awesome-icon icon="play" /> Preview
        </router-link>
      </b-col>
    </b-row>

    <b-card no-body>
      <b-tabs nav-class="nav-justified" card>
        <b-tab title="Survey"
               :active="true"
               no-body
               @click="changeTab('')">
          <editform></editform>
          <question-list></question-list>
        </b-tab>

        <b-tab title="Results"
               :active="currentTab === 'results'"
               @click="changeTab('results')">
          <votes></votes>
        </b-tab>
      </b-tabs>

    </b-card>

    <!--<b-card no-body>
        <nav class="card-header survey-navigation">

          <ul class="nav nav-tabs card-header-tabs">
            <li class="nav-item">
              <a class="nav-link"
                 href="#"
                 :class="{ 'active' : currentTab === '' }"
                 @click="changeTab('questions', $event)">
                Survey
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link"
                 href="#"
                 :class="{ 'active' : currentTab === 'results' }"
                 @click="changeTab('results', $event)">
                Results
              </a>
            </li>
          </ul>

          <b-dropdown :text="currentTabText"
                      class="nav-dropdown"
                      variant="secondary">
            <b-dropdown-item @click="changeTab('questions', $event)"
                             :active="currentTab === ''">
              Survey
            </b-dropdown-item>
            <b-dropdown-item @click="changeTab('results', $event)"
                             :active="currentTab === 'results'">
              Results
            </b-dropdown-item>
          </b-dropdown>
        </nav>

        <div class="tab-content">

          <div class="tab-pane"
               :class="{ 'active' : currentTab === '' }">
              <editform></editform>
              <question-list></question-list>
          </div>

          <div class="tab-pane"
               :class="{ 'active' : currentTab === 'results' }">
            <div class="card-body">
              <votes></votes>
            </div>
          </div>
        </div>

    </b-card>-->
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import SurveyFormEdit from '@/components/survey/SurveyFormEdit.vue'
import QuestionList from '@/components/question/QuestionList.vue'
import Votes from '@/components/votes/Votes.vue'

export default {
  name: 'Survey',
  components: {
    editform: SurveyFormEdit,
    'question-list': QuestionList,
    votes: Votes,
  },
  methods: {
    changeTab(tab) {
      const surveyID = this.$route.params.id
      this.$router.replace({ path: `/survey/${surveyID}/${tab}` })
    },
  },
  computed: {
    ...mapGetters({
      votes: 'getVotes',
    }),
    currentTab() {
      return this.$route.params.tab
    },
    survey() {
      return JSON.parse(JSON.stringify(this.$store.getters.getSurvey))
    },
  },
}
</script>

<style lang="scss">

  .survey { max-width: 690px; margin: 0 auto; }

</style>
