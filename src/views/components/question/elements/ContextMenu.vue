<template>
  <div class="border-top pt-3 mt-3 clearfix">
    <b-btn :disabled="survey.isActive"
           class="mr-2 question__append"
           variant="primary"
           @click.prevent="appendQuestion(survey.id, question.id)">
      New Question
    </b-btn>

    <b-btn variant="secondary"
           class="mr-2 question__up"
           :disabled="survey.isActive"
           @click.prevent="moveUp(survey.id, question.id, questions)">
      <font-awesome-icon icon="arrow-up" />
    </b-btn>

    <b-btn variant="secondary"
           :disabled="survey.isActive"
           class="question__down"
           @click.prevent="moveDown(survey.id, question.id, questions)">
      <font-awesome-icon icon="arrow-down" />
    </b-btn>

    <b-dropdown :no-caret="true"
                right
                class="options_dropdown float-right"
                :disabled="survey.isActive">
      <font-awesome-icon slot="button-content"
                         icon="ellipsis-v" />

      <b-dropdown-item v-if="!value && question.description === null"
                       class="no-icon"
                       :disabled="survey.isActive"
                       @click.prevent="addDescription">
        Add Description
      </b-dropdown-item>
      <b-dropdown-item v-if="question.description !== null || value"
                       class="no-icon"
                       :disabled="survey.isActive"
                       @click.prevent="removeDescription">
        Remove Description
      </b-dropdown-item>

      <b-dropdown-divider v-if="hasSlot()" />

      <slot />

      <b-dropdown-divider />

      <b-dropdown-item :class="{ 'disabled': survey.isActive }"
                       @click.prevent="deleteQuestion(question.id)">
        <font-awesome-icon icon="trash-alt" /> Delete Question
      </b-dropdown-item>
    </b-dropdown>
  </div>
</template>

<script>
export default {
  name: 'ContextMenu',
  props: {
    value: {
      type: Boolean,
      required: true,
    },
    question: {
      type: Object,
      required: true,
    },
    survey: {
      type: Object,
      required: true,
    },
  },
  computed: {
    questions() {
      return this.$store.getters.getQuestions
    },
    selectedQuestion() {
      return this.$store.getters.getSelectedQuestion
    },
  },
  methods: {
    appendQuestion(surveyID, questionID) {
      this.$store.dispatch('appendQuestion', {
        surveyID,
        questionID,
      })
    },
    moveUp(surveyID, questionID, questions) {
      this.$store.dispatch('moveQuestion', {
        direction: 'UP',
        questionID,
        questions,
        surveyID,
      })
    },
    moveDown(surveyID, questionID, questions) {
      this.$store.dispatch('moveQuestion', {
        direction: 'DOWN',
        questionID,
        questions,
        surveyID,
      })
    },
    deleteQuestion(questionID) {
      this.$store.dispatch('deleteQuestion', {
        questionID: questionID,
      })
    },
    addDescription() {
      this.$emit('input', true)
    },
    removeDescription() {

      this.$store.dispatch('updateQuestion', {
        surveyID: this.$route.params.id,
        question: {
          ...this.question,
          description: null,
        },
      }).then(() => {
        this.$emit('input', false)
      })
    },
    hasSlot() {
      return !!this.$slots.default
    },
  },
}
</script>

<style lang="scss" scoped="true">

  @media print {
    div {
      display: none;
    }
  }
</style>
