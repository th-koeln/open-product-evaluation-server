<template>
  <b-form class="survey__meta"
          @submit.prevent="updateSurvey">
    <alert :data="error" />

    <b-alert v-if="survey.isActive"
             show
             variant="warning">
      You can only edit private surveys.
    </b-alert>

    <b-form-row>
      <b-col sm="8">
        <b-form-group label="Title"
                      label-for="input_title">
          <b-input id="input_title"
                   v-model="form.title"
                   :disabled="survey.isActive"
                   @change="updateSurvey" />
        </b-form-group>
      </b-col>
      <b-col sm="4">
        <b-form-group label="Available?"
                      label-for="">
          <b-button-group class="survey__state">
            <b-dropdown :text="surveyStateText(form.isActive)"
                        :variant="surveyState(form.isActive)"
                        right>
              <b-dropdown-item @click="updateisActive(true)">
                Yes
              </b-dropdown-item>
              <b-dropdown-item @click="updateisActive(false)">
                No
              </b-dropdown-item>
            </b-dropdown>
            <b-button v-b-tooltip.hover
                      title="Once the survey is available you can use it in a domain">
              ?
            </b-button>
          </b-button-group>
        </b-form-group>
      </b-col>
    </b-form-row>

    <!-- default textarea for now https://github.com/bootstrap-vue/bootstrap-vue/issues/1708 -->
    <b-form-group label="Description"
                  label-for="input_description">
      <textarea id="input_description"
                v-model="form.description"
                class="form-control"
                rows="3"
                :disabled="survey.isActive"
                @change="updateSurvey" />
    </b-form-group>
  </b-form>
</template>

<script>
import Alert from '@/components/misc/ErrorAlert.vue'

export default {
  name: 'SurveyEdit',
  components: {
    alert: Alert,
  },
  data() {
    return {
      error: null,
    }
  },
  computed: {
    form() {
      return JSON.parse(JSON.stringify(this.$store.getters.getSurvey))
    },
    survey() {
      return JSON.parse(JSON.stringify(this.$store.getters.getSurvey))
    },
  },
  created() {
    this.$store.dispatch('getSurvey', {
      surveyID: this.$route.params.id,
    }).catch((error) => {
      console.log()
      this.error = error
    })
  },
  methods: {
    updateSurvey() {
      this.$store.dispatch('updateSurvey', {
        id: this.$route.params.id,
        ...this.form,
      }).catch((error) => {
        this.error = error
      })
    },
    updateisActive(value) {
      // dont submit if form already active
      if(value && this.survey.isActive) {
        return
      }
      
      this.$store.dispatch('changeSurveyisActive', {
        id: this.$route.params.id,
        isActive: value,
      }).catch((error) => {
        this.error = error
      })
    },
    surveyState(surveyState) {
      if (surveyState) {
        return 'primary'
      }
      return 'secondary'
    },
    surveyStateText(state) {
      if (state) {
        return 'Yes'
      }
      return 'No'
    }
  },
}
</script>

<style scoped="true" lang="scss">

  .survey__meta { padding: 1.25rem; }

  .survey__state {
    display: flex;
    /deep/.dropdown {
      flex-grow: 1;
      /deep/button {
        flex-grow: 1;
        display: flex;
        width: 100%;

        &:after { margin: auto 0 auto auto !important; }

        +.dropdown-menu { width: 100%; }
      }
    }
  }
</style>
