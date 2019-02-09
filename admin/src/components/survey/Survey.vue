<template>
  <div class="survey">
    <b-row class="list-options">
      <b-col cols="4"
             sm="6"
             lg="7" />
      
      <b-col cols="8"
             sm="6"
             lg="5"
             class="text-right">
        <router-link :to="{ path: `/preview/${survey.id}` }"
                     class="btn btn-primary"
                     target="_blank">
          <font-awesome-icon icon="play" /> Preview
        </router-link>
      </b-col>
    </b-row>

    <b-card no-body>
      <b-tabs nav-class="nav-justified"
              card>
        <b-tab title="Survey"
               :active="true"
               no-body
               @click="changeTab('')">
          <editform />
          <question-list />
        </b-tab>

        <b-tab title="Results"
               :active="currentTab === 'results'"
               @click="changeTab('results')">
          <votes />
        </b-tab>
      </b-tabs>
    </b-card>
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
  methods: {
    changeTab(tab) {
      const surveyID = this.$route.params.id
      this.$router.replace({ path: `/survey/${surveyID}/${tab}` })
    },
  },
}
</script>

<style lang="scss">

  .survey {
    max-width: 690px;
    margin: 0 auto;

    .card-header {
      padding: 0;
      background-color: #FFFFFF;
      border:0;

      .card-header-tabs {
        margin: 0;

        .nav-link {
          border: 0;
          padding-bottom: calc(1rem + 2px);
          border-bottom: $inputBorder;
          color: $secondaryColor;

          &.active {
            padding-bottom: 1rem;
            color: $primaryColor;
            border-bottom: 3px solid $primaryColor;
          }

        }
      }
    }
  }

</style>
