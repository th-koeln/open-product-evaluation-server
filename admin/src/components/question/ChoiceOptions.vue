<template>
  <div class="choice-options">
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

    <div class="choices">
      <h6>Choices</h6>
      
      <b-form-row v-for="choice in question.choices"
                  :key="choice.code">
        <b-col cols="4"
               sm="3"
               md="2">
          <imagecontainer :image="choice.image"
                          class="image">
          <!--<b-button-group>
                <b-btn variant="secondary">
                  <font-awesome-icon icon="expand" />
                </b-btn>
                <b-btn variant="secondary">
                  <font-awesome-icon icon="times" />
                </b-btn>
              </b-button-group>-->
          </imagecontainer>
        </b-col>
        <b-col cols="8"
               sm="9"
               md="10">
          <b-form-group label="Label"
                        :label-for="`choice_label_${choice.id}`"
                        :label-sr-only="true">
            <b-input-group>
              <b-input :id="`choice_label_${choice.id}`"
                       v-model="choice.label"
                       placeholder="Label"
                       :disabled="survey.isPublic"
                       @change="updateChoice(question, choice)" />

              <b-form-file :id="`file_upload_choice_${choice.id}`"
                           placeholder="Choose a file..."
                           accept="image/*"
                           :disabled="survey.isPublic" 
                           @change="uploadChoiceImage($event, question.id, choice.id)" />

              <b-btn slot="append"
                     variant="secondary"
                     :disabled="survey.isPublic"
                     @click="openFileDialog(`file_upload_choice_${choice.id}`)">
                <font-awesome-icon icon="image" />
              </b-btn>
              <b-btn slot="append"
                     variant="secondary"
                     :class="{ 'disabled': survey.isPublic }"
                     :disabled="survey.isPublic"
                     @click="deleteChoice($event, question, choice)">
                <font-awesome-icon icon="times" />
              </b-btn>
            </b-input-group>
          </b-form-group>

          <b-form-group label="Code"
                        :label-for="`choice_code_${choice.id}`"
                        :label-sr-only="true">
            <b-input :id="`choice_code_${choice.id}`"
                     v-model="choice.code"
                     placeholder="Code"
                     :disabled="survey.isPublic"
                     @change="updateChoice(question, choice)" />
          </b-form-group>
        </b-col>
      </b-form-row>

      <b-btn variant="link"
             :class="{ 'disabled': survey.isPublic }"
             @click="addChoice(id, $event)">
        New Choice
      </b-btn>
    </div>

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
import ImageContainer from '@/components/misc/ImageContainer.vue'

export default {
  name: 'ChoiceOptions',
  components: {
    items: Items,
    imagecontainer: ImageContainer,
  },
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      file: '',
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
    updateQuestion() {
      this.$store.dispatch('updateQuestion', {
        surveyID: this.$route.params.id,
        question: this.question,
      })
    },
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
    uploadChoiceImage(event, questionID, choiceID) {
      event.preventDefault()

      this.$store.dispatch('uploadChoiceImage', {
        questionID,
        choiceID,
        file: document.getElementById(`file_upload_choice_${choiceID}`).files[0],
      })
    },
    deleteItem(event, question, item) {
      event.preventDefault()

      this.$store.dispatch('deleteItem', {
        question,
        item,
      })
    },
    addChoice(id, event) {
      event.preventDefault()

      this.$store.dispatch('createChoice', {
        question: this.question,
      })
    },
    updateChoice(question, choice) {
      this.$store.dispatch('updateChoice', {
        question,
        choice,
      })
    },
    deleteChoice(event, question, choice) {
      event.preventDefault()

      this.$store.dispatch('deleteChoice', {
        question,
        choice,
      })
    },
    openFileDialog(element) {
      document.getElementById(element).click()
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
  .image {
    padding-top: calc(33.5px * 2 + 1rem - 2px);
  }

  @media(max-width: 425px) {
    .choices .form-row .col-4,
    .choices .form-row .col-8 {
      flex: auto;
      max-width: 100%;
      margin-bottom: 1rem;
    }

    .choices .image, {
      width: 50%;
      margin: 0 auto;
    }
  }
</style>
