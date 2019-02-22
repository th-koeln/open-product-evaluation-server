<template>
  <b-form-row>
    <b-col>
      <h6>Description</h6>
      <!-- default textarea for now https://github.com/bootstrap-vue/bootstrap-vue/issues/1708 -->
      <b-form-group label="Description"
                    :label-for="'input_description_' + question.id"
                    :label-sr-only="true">
        <textarea :id="'input_description_' + question.id"
                  class="form-control"
                  rows="3"
                  :value="question.description"
                  :disabled="survey.isActive"
                  @change="updateQuestion($event)" />
      </b-form-group>
    </b-col>
  </b-form-row>
</template>

<script>
export default {
  name: 'Description',
  props: {
    question: {
      type: Object,
      required: true,
    }
  },
  computed: {
    survey() {
      return JSON.parse(JSON.stringify(this.$store.getters.getSurvey))
    },
  },
  methods: {
    updateQuestion(event) {
      this.$store.dispatch('updateQuestion', {
        surveyID: this.$route.params.id,
        question: {
          ...this.question,
          description: event.target.value,
        },
      })
    },
  }
}
</script>

