<template>
  <div class="question-list"
       :class="{empty : questions.length === 0}">
    <p v-if="questions.length === 0"
       class="text-center">
      This survey does not have any questions.
    </p>

    <b-form v-if="questions.length > 0"
            id="question-form"
            enctype="multipart/form-data"
            novalidate>
      <div class="questions">
        <question-item v-for="(question, index) in questions"
                       :id="question.id"
                       :key="question.id"
                       :selected="position === index"
                       @click.native="toggle(index)" />
      </div>
    </b-form>

    <div id="add-question">
      <b-btn variant="primary"
             :disabled="survey.isPublic"
             @click="addQuestion">
        New Question
      </b-btn>
    </div>
  </div>
</template>

<script>
import QuestionItem from '@/components/question/QuestionItem.vue'

export default {
  name: 'Questions',
  components: {
    'question-item': QuestionItem,
  },
  data() {
    return {
      position: 0,
      button: null,
    }
  },
  computed: {
    questions() {
      return JSON.parse(JSON.stringify(this.$store.getters.getQuestions))
    },
    survey() {
      return JSON.parse(JSON.stringify(this.$store.getters.getSurvey))
    },
  },
  methods: {
    addQuestion(event) {
      event.preventDefault()
      this.$store.dispatch('createQuestion', {
        surveyID: this.$route.params.id,
      })
    },
    toggle(index) {
      this.position = index
    },
  },
}
</script>

<style scoped="true" lang="scss">

  #add-question { text-align: center; }

  .question-alert { margin: 1.25rem; }

  .questions {
    border-top: 1px solid #dfdfdf;
  }

  #question-form {
    margin-bottom: 1.5rem;

    &.empty { border-bottom: 0; }
  }

</style>
