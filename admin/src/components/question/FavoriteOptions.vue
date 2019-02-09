<template>
  <div class="favorite">
    <b-form-row v-if="question.description !== null || showDescription">
      <b-col>
        <h6>Description</h6>
        <!-- default textarea for now https://github.com/bootstrap-vue/bootstrap-vue/issues/1708 -->
        <b-form-group label="Description"
                      :label-for="'input_description_' + question.id"
                      :label-sr-only="true">
          <textarea :id="'input_description_' + question.id"
                    v-model="question.description"
                    class="form-control"
                    rows="3"
                    :disabled="survey.isPublic" 
                    @change="updateQuestion" />
        </b-form-group>
      </b-col>
    </b-form-row>

    <items :id="question.id" />

    <div class="border-top pt-3 mt-3 clearfix">
      <b-dropdown :no-caret="true"
                  right
                  class="options_dropdown float-right"
                  :disabled="survey.isPublic">
        <font-awesome-icon slot="button-content"
                           icon="ellipsis-v" />

        <b-dropdown-item v-if="!showDescription && question.description === null"
                         class="no-icon"
                         :class="{ 'disabled': survey.isPublic }"
                         @click="addDescription">
          Add Description
        </b-dropdown-item>
        <b-dropdown-item v-if="question.description !== null || showDescription"
                         class="no-icon"
                         :class="{ 'disabled': survey.isPublic }"
                         @click="removeDescription">
          Remove Description
        </b-dropdown-item>

        <b-dropdown-divider />

        <b-dropdown-item :class="{ 'disabled': survey.isPublic }"
                         @click="deleteQuestion(id, $event)">
          <font-awesome-icon icon="trash-alt" /> Delete Question
        </b-dropdown-item>
      </b-dropdown>
    </div>
  </div>
</template>

<script>
import Items from '@/components/question/Items.vue'

export default {
  name: 'FavoriteOptions',
  components: {
    items: Items,
  },
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      showDescription: false,
    }
  },
  computed: {
    question() {
      return JSON.parse(JSON.stringify(this.$store.getters.getQuestion(this.id)))
    },
    survey() {
      return JSON.parse(JSON.stringify(this.$store.getters.getSurvey))
    },
  },
  methods: {
    deleteQuestion(questionID, event) {
      event.preventDefault()
      this.$store.dispatch('deleteQuestion', {
        questionID: this.id,
      })
    },
    addItem(event, question) {
      event.preventDefault()

      this.$store.dispatch('createItem', {
        question,
      })
    },
    updateItem(question, item) {
      this.$store.dispatch('updateItem', {
        question,
        item,
      })
    },
    deleteItem(event, question, item) {
      event.preventDefault()

      this.$store.dispatch('deleteItem', {
        question,
        item,
      })
    },
    updateQuestion() {
      this.$store.dispatch('updateQuestion', {
        surveyID: this.$route.params.id,
        question: this.question,
      })
    },
    addDescription(event) {
      event.preventDefault()

      this.showDescription = true
    },
    removeDescription(event) {
      event.preventDefault()

      this.showDescription = false

      this.$store.dispatch('updateQuestion', {
        surveyID: this.$route.params.id,
        question: {
          ...this.question,
          description: null,
        },
      })
    },
  },
}
</script>

<style scoped="true" lang="scss">

</style>
