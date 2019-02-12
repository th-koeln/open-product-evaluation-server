<template>
  <div class="questions">
    <!-- Empty state if there are no questions (yet) -->
    <empty :show="!questions || questions && questions.length === 0"
           :card="false"
           icon="question-circle"
           headline="There are no questions"
           description="Start to create some questions!" />

    <!-- question form -->
    <b-form v-if="questions.length > 0"
            class="questions__form"
            enctype="multipart/form-data"
            novalidate>
      <!-- list of questions -->
      <question v-for="(question, index) in questions"
                :id="question.id"
                :key="question.id"
                :selected="isSelected(index)"
                @click.native="select(index)" />
    </b-form>

    <!-- option to create a question --> 
    <div class="text-center">
      <b-btn variant="primary"
             :disabled="survey.isActive"
             @click="addQuestion">
        New Question
      </b-btn>
    </div>
  </div>
</template>

<script>
import Question from '@/components/question/Question.vue'
import EmptyState from '@/components/misc/EmptyState.vue'

export default {
  name: 'Questions',
  components: {
    question: Question,
    empty: EmptyState,
  },
  data() {
    return {
      currentIndex: 0,
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
    select(index) {
      this.currentIndex = index
    },
    isSelected(index) {
      return index === this.currentIndex
    }
  },
}
</script>

<style scoped="true" lang="scss">
  .questions .questions__form {
    margin-bottom: 1.5rem;
    border-top: $inputBorder;
  }
</style>
