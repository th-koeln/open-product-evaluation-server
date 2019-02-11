<template>
  <div class="regulator">
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
                    :disabled="survey.isActive"
                    @change="updateQuestion" />
        </b-form-group>
      </b-col>
    </b-form-row>

    <h6>Settings</h6>
    <b-form-row>
      <b-col cols="6"
             sm="3">
        <b-form-group label="From"
                      :label-for="'input_min_' + question.id">
          <b-input :id="'input_min_' + question.id"
                   v-model="question.min"
                   :disabled="survey.isActive"
                   @change="updateRegulatorQuestion" />
        </b-form-group>
      </b-col>

      <b-col cols="6"
             sm="3">
        <b-form-group label="To"
                      :label-for="'input_max_' + question.id">
          <b-input :id="'input_max_' + question.id"
                   v-model="question.max"
                   :disabled="survey.isActive"
                   @change="updateRegulatorQuestion" />
        </b-form-group>
      </b-col>

      <b-col cols="6"
             sm="3">
        <b-form-group label="Stepsize"
                      :label-for="'input_stepsize_' + question.id">
          <b-input :id="'input_stepsize_' + question.id"
                   v-model="question.stepSize"
                   :disabled="survey.isActive"
                   @change="updateRegulatorQuestion" />
        </b-form-group>
      </b-col>

      <b-col cols="6"
             sm="3">
        <b-form-group label="Default"
                      :label-for="'input_default_' + question.id">
          <b-input :id="'input_default_' + question.id"
                   v-model="question.default"
                   :disabled="survey.isActive" 
                   @change="updateRegulatorQuestion" />
        </b-form-group>
      </b-col>
    </b-form-row>

    <div class="labels">
      <h6>Labels</h6>
      <b-form-row v-for="label in question.labels"
                  :key="label.id">
        <b-col cols="4"
               sm="3"
               md="2">
          <imagecontainer :image="label.image"
                          class="image">
            <b-button-group>
              <b-btn variant="secondary"
                     @click="removeLabelImage($event, question.id, label.id)">
                <font-awesome-icon icon="times" />
              </b-btn>
            </b-button-group>
          </imagecontainer>
        </b-col>

        <b-col cols="8"
               sm="9"
               md="10">
          <b-form-group label="Label"
                        :label-for="`regulator_label_${label.id}`"
                        :label-sr-only="true">
            <b-input-group>
              <b-input :id="`regulator_label_${label.id}`"
                       v-model="label.label"
                       :disabled="survey.isActive" 
                       @change="updateLabel(question, label)" />

              <b-form-file :id="`input_upload_label_${label.id}`"
                           placeholder="Choose a file..."
                           accept="image/*"
                           :disabled="survey.isActive"
                           @change="uploadLabelImage($event, question.id, label.id)" />

              <b-btn slot="append"
                     variant="secondary"
                     :class="{ 'disabled': survey.isActive }"
                     @click="openFileDialog(`input_upload_label_${label.id}`)">
                <font-awesome-icon icon="image" />
              </b-btn>

              <b-btn slot="append"
                     variant="secondary"
                     :class="{ 'disabled': survey.isActive }"
                     @click="removeLabel($event, question, label)">
                <font-awesome-icon icon="times" />
              </b-btn>
            </b-input-group>
          </b-form-group>

          <b-form-group :id="`regulator_value_${label.id}`"
                        label="Value"
                        :label-sr-only="true">
            <b-input :id="`regulator_value_${label.id}`"
                     v-model="label.value"
                     placeholder="value"
                     :disabled="survey.isActive"
                     @change="updateLabel(question, label)" />
          </b-form-group>
        </b-col>
      </b-form-row>

      <b-btn variant="link"
             :class="{ 'disabled': survey.isActive }"
             @click="addLabel($event, question)">
        New Label
      </b-btn>
    </div>

    <items :id="question.id" />

    <div class="border-top pt-3 mt-3 clearfix">
      <b-dropdown :no-caret="true"
                  right
                  class="options_dropdown float-right"
                  :disabled="survey.isActive">
        <font-awesome-icon slot="button-content"
                           icon="ellipsis-v" />

        <b-dropdown-item v-if="!showDescription && question.description === null"
                         :class="{ 'disabled': survey.isActive }"
                         class="no-icon"
                         @click="addDescription">
          Add Description
        </b-dropdown-item>
        <b-dropdown-item v-if="question.description !== null || showDescription"
                         :class="{ 'disabled': survey.isActive }"
                         class="no-icon"
                         @click="removeDescription">
          Remove Description
        </b-dropdown-item>

        <b-dropdown-divider />
        <b-dropdown-item :class="{ 'disabled': survey.isActive }"
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
  name: 'RegulatorOptions',
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
    updateRegulatorQuestion() {
      this.$store.dispatch('updateRegulatorQuestion', {
        surveyID: this.$route.params.id,
        question: this.question,
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
    addLabel(event, question) {
      event.preventDefault()

      this.$store.dispatch('createLabel', {
        question,
      })
    },
    updateLabel(question, label) {
      this.$store.dispatch('updateLabel', {
        question,
        label,
      })
    },
    removeLabel(event, question, label) {
      event.preventDefault()

      this.$store.dispatch('deleteLabel', {
        question,
        label,
      })
    },
    uploadLabelImage(event, questionID, labelID) {
      event.preventDefault()


      const file = document.getElementById(`input_upload_label_${labelID}`).files[0]

      if (file !== null) {
        this.$store.dispatch('uploadLabelImage', {
          questionID,
          labelID,
          file,
        })
      }
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
    removeLabelImage(event, questionID, labelID) {
      event.preventDefault()

      this.$store.dispatch('removeLabelImage', {
        questionID,
        labelID,
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
    .labels .form-row .col-4,
    .labels .form-row .col-8 {
      flex: auto;
      max-width: 100%;
      margin-bottom: 1rem;
    }
    
    .labels .image {
      width: 50%;
      margin: 0 auto;
    }
  }
</style>
