<template>
  <b-card header="Create New Survey">
    <b-form @submit.prevent="createSurvey">

      <alert :data="error"></alert>

      <b-form-group label="Title"
                    label-for="input_title">
        <b-input id="input_title"
                 v-model="survey.title">
        </b-input>
      </b-form-group>

      <b-form-group label="Description"
                    label-for="input_description">
        <b-form-textarea id="input_description"
                         v-model="survey.description"
                         :rows="3"
                         :max-rows="6">
        </b-form-textarea>
      </b-form-group>

      <b-btn variant="primary"
             type="submit">
        Save
      </b-btn>

    </b-form>
  </b-card>
</template>

<script>
import Alert from '@/components/misc/ErrorAlert.vue'

export default {
  name: 'SurveyNew',
  components: {
    alert: Alert,
  },
  data() {
    return {
      survey: {},
      error: null,
    }
  },
  methods: {
    createSurvey() {
      this.$store.dispatch('createSurvey', {
        ...this.survey,
      }).then((data) => {
        this.$router.push(`/survey/${data.data.createSurvey.survey.id}`)
      }).catch((error) => {
        this.error = error
      })
    },
  },
}
</script>
