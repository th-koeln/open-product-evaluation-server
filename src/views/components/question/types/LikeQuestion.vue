<template>
  <div class="like">
    <!-- question description -->
    <description v-if="question.description !== null || showDescription"
                 :question="question" />

    <!-- like image -->
    <b-form-row class="form-group">
      <b-col sm="12">
        <h6>Like Icon</h6>
      </b-col>

      <b-col cols="5"
             sm="3"
             md="2">
        <imagecontainer :image="question.likeIcon"
                        class="image">
          <b-button-group>
            <b-btn variant="secondary"
                   @click="openFileDialog(`upload_like_${question.id}`)">
              <font-awesome-icon icon="plus" />
            </b-btn>
          </b-button-group>
        </imagecontainer>
      </b-col>

      <b-form-file :id="`upload_like_${question.id}`"
                   class="file_upload"
                   placeholder="Choose a file..."
                   accept="image/*"
                   :disabled="survey.isActive"
                   @change="uploadLikeIcon(question.id)" />
    </b-form-row>

    <!-- list of items -->
    <items :id="question.id" />

    <!-- context menu -->
    <context v-model="showDescription"
             :question="question"
             :survey="survey">
      <b-dropdown-item :class="{ 'disabled': survey.isActive }"
                       class="no-icon"
                       @click="openFileDialog(`upload_like_${question.id}`)">
        Upload Like Icon
      </b-dropdown-item>
    </context>
  </div>
</template>

<script>
import Items from '@/components/question/elements/Items.vue'
import Description from '@/components/question/elements/Description.vue'
import ImageContainer from '@/components/misc/ImageContainer.vue'
import ContextMenu from '@/components/question/elements/ContextMenu.vue'

export default {
  name: 'LikeQuestion',
  components: {
    items: Items,
    imagecontainer: ImageContainer,
    description: Description,
    context: ContextMenu,
  },
  props: {
    question: {
      type: Object,
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
    survey() {
      return this.$store.getters.getSurvey
    },
  },
  methods: {
    uploadLikeIcon(questionID) {

      const file = document.getElementById(`upload_like_${questionID}`).files[0]

      if (file !== null) {
        this.$store.dispatch('uploadLikeIcon', {
          questionID,
          file,
        })
      }
    },
    openFileDialog(element) {
      document.getElementById(element).click()
    },
  },
}
</script>

<style scoped="true" lang="scss">
  .image {
    padding-top: calc(33.5px * 2 + 1rem - 2px);
  }
</style>
