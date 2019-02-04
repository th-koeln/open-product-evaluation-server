<template>
  <div class="likedislike">
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

    <b-form-row class="form-group">
      <b-col cols="5"
             sm="3"
             md="2">
        <h6>Like Icon</h6>

        <imagecontainer :image="question.likeIcon"
                        class="image" />

        <b-form-file :id="'upload_like_' + question.id"
                     class="file_upload"
                     placeholder="Choose a file..."
                     accept="image/*"
                     :disabled="survey.isPublic" 
                     @change="uploadLikeIcon($event, question.id)" />
      </b-col>

      <b-col cols="5"
             sm="3"
             md="2">
        <h6>Dislike Icon</h6>

        <imagecontainer :image="question.dislikeIcon"
                        class="image" />

        <b-form-file :id="'upload_dislike_' + question.id"
                     class="file_upload"
                     placeholder="Choose a file..."
                     accept="image/*"
                     :disabled="survey.isPublic" 
                     @change="uploadDislikeIcon($event, question.id)" />
      </b-col>
    </b-form-row>

    <items :id="question.id" />

    <div class="actions">
      <b-dropdown :no-caret="true"
                  right
                  class="options_dropdown float-right"
                  :disabled="survey.isPublic">
        <font-awesome-icon slot="button-content"
                           icon="ellipsis-v" />

        <b-dropdown-item class="no-icon"
                         :class="{ 'disabled': survey.isPublic }"
                         @click="openFileDialog('upload_like_' + question.id)">
          Upload Like Icon
        </b-dropdown-item>

        <b-dropdown-item class="no-icon"
                         :class="{ 'disabled': survey.isPublic }"
                         @click="openFileDialog('upload_dislike_' + question.id)">
          Upload Dislike Icon
        </b-dropdown-item>

        <b-dropdown-item v-if="!showDescription && question.description === null"
                         :class="{ 'disabled': survey.isPublic }"
                         class="no-icon"
                         @click="addDescription">
          Add Description
        </b-dropdown-item>
        <b-dropdown-item v-if="question.description !== null || showDescription"
                         :class="{ 'disabled': survey.isPublic }"
                         class="no-icon"
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
  name: 'LikeDislikeOptions',
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
    uploadDislikeIcon(event, questionID) {
      event.preventDefault()

      const file = document.getElementById(`upload_dislike_${questionID}`).files[0]

      if (file !== null) {
        this.$store.dispatch('uploadDislikeIcon', {
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

  .image-row { margin-bottom: 2rem; }

  .file_upload { display: none !important; }

  .image {
    padding-top: calc(33.5px * 2 + 1rem - 2px);
    border: 1px solid #ced4da;
  }

  .actions {
    border-top: 1px solid #ced4da;
    padding-top: 1rem;
    margin-top: 1rem;
  }
</style>
