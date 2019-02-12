<template>
  <div class="border-top pt-3 mt-3 clearfix">
    <b-btn variant="secondary"
           class="mr-3"
           :disabled="survey.isActive"
           @click.prevent="moveUp(survey.id, question.id, questions)">
      <font-awesome-icon icon="arrow-up" />
    </b-btn>

    <b-btn variant="secondary"
           :disabled="survey.isActive"
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
                       @click="addDescription">
        Add Description
      </b-dropdown-item>
      <b-dropdown-item v-if="question.description !== null || value"
                       class="no-icon"
                       :disabled="survey.isActive"
                       @click="removeDescription">
        Remove Description
      </b-dropdown-item>

      <b-dropdown-divider v-if="hasSlot()" />

      <slot />

      <b-dropdown-divider />

      <b-dropdown-item :class="{ 'disabled': survey.isActive }"
                       @click="deleteQuestion(id, $event)">
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
    moveUp(surveyID, questionID, questions) {
      this.$store.dispatch('moveQuestion', {
        direction: 'UP',
        questionID,
        questions,
        surveyID,
      }).then(() => {
        this.$store.dispatch('updateSelectedQuestion', this.selectedQuestion - 1)
      })
    },
    moveDown(surveyID, questionID, questions) {
      this.$store.dispatch('moveQuestion', {
        direction: 'DOWN',
        questionID,
        questions,
        surveyID,
      }).then(() => {
        this.$store.dispatch('updateSelectedQuestion', this.selectedQuestion + 1)
      })
    },
    deleteQuestion(questionID, event) {
      event.preventDefault()
      this.$store.dispatch('deleteQuestion', {
        questionID: this.id,
      })
    },
    addChoice(id, event) {
      event.preventDefault()

      this.$store.dispatch('createChoice', {
        question: this.question,
      })
    },
    addDescription(event) {
      event.preventDefault()
      this.$emit('input', true)
    },
    removeDescription(event) {
      event.preventDefault()

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

</style>
