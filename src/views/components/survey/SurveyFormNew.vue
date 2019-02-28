<template>
  <b-card header="Create New Survey"
          class="form">
    <b-form @submit.prevent="createSurvey">
      <alert :data="error" />

      <b-form-group label="Title"
                    label-for="input_title">
        <b-input id="input_title"
                 v-model.trim="$v.survey.title.$model"
                 :state="state($v.survey.title.$dirty, $v.survey.title.$error)" />
        <b-form-invalid-feedback v-if="!$v.survey.title.required">
          Title is required
        </b-form-invalid-feedback>
      </b-form-group>

      <b-form-group label="Description"
                    label-for="input_description">
        <b-form-textarea id="input_description"
                         v-model="survey.description"
                         :rows="3"
                         :max-rows="6" />
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
import validationState from '@/mixins/validation'
import { required } from 'vuelidate/lib/validators'

export default {
  name: 'SurveyNew',
  components: {
    alert: Alert,
  },
  mixins: [validationState],
  data() {
    return {
      survey: {},
      error: null,
    }
  },
  validations: {
    survey: {
      title: {
        required,
      },
    }
  },
  methods: {
    createSurvey() {
      this.$v.$touch()

      if (!this.$v.$invalid) {
        this.$store.dispatch('createSurvey', {
          ...this.survey,
        }).then((data) => {
          this.$router.push(`/survey/${data.data.createSurvey.survey.id}`)
        }).catch((error) => {
          this.error = error
        })
      }
    },
  },
}
</script>
