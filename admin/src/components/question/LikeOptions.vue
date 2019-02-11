<template>
  <div class="like">
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


    <b-form-row class="form-group">
      <b-col sm="12">
        <h6>Like Icon</h6>
      </b-col>

      <b-col cols="5"
             sm="3"
             md="2">
        <imagecontainer :image="question.likeIcon"
                        class="image" />
      </b-col>

      <b-form-file :id="'upload_like_' + question.id"
                   class="file_upload"
                   placeholder="Choose a file..."
                   accept="image/*"
                   :disabled="survey.isActive"
                   @change="uploadLikeIcon($event, question.id)" />
    </b-form-row>

    <items :id="question.id" />

    <div class="border-top pt-3 mt-3 clearfix">
      <b-dropdown :no-caret="true"
                  right
                  class="options_dropdown float-right"
                  :disabled="survey.isActive">
        <font-awesome-icon slot="button-content"
                           icon="ellipsis-v" />

        <b-dropdown-item :class="{ 'disabled': survey.isActive }"
                         class="no-icon"
                         @click="openFileDialog('upload_like_' + question.id)">
          Upload Like Icon
        </b-dropdown-item>

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
  name: 'LikeOptions',
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
    uploadLikeIcon(event, questionID) {
      event.preventDefault()

      const file = document.getElementById(`upload_like_${questionID}`).files[0]

      if (file !== null) {
        this.$store.dispatch('uploadLikeIcon', {
          questionID,
          file,
        })
      }
    },
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
</style>
