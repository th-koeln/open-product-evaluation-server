<template>
  <div class="question-list"
       v-bind:class="{empty : questions.length === 0}">

    <p class="text-center"
       v-if="questions.length === 0">
      This survey does not have any questions.
    </p>

    <b-form id="question-form"
            v-if="questions.length > 0"
            enctype="multipart/form-data"
            novalidate>
      <div class="questions">
        <question-item :id="question.id"
                       v-for="(question, index) in questions"
                       :key="question.id"
                       @click.native="toggle(index)"
                       :selected="position === index">
        </question-item>
      </div>
    </b-form>

    <div id="add-question">
      <b-btn variant="primary"
             @click="addQuestion"
             :disabled="survey.isPublic">
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
  computed: {
    questions() {
      return JSON.parse(JSON.stringify(this.$store.getters.getQuestions))
    },
    survey() {
      return JSON.parse(JSON.stringify(this.$store.getters.getSurvey))
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
