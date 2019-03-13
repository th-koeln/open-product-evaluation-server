<template>
  <b-form class="survey__meta"
          @submit.prevent="updateSurvey">
    <alert :data="error" />

    <b-alert v-if="survey.isActive"
             show
             variant="warning">
      You can only edit inactive surveys.
    </b-alert>

    <b-form-row>
      <b-col sm="8">
        <b-form-group label="Title"
                      label-for="input_title">
          <b-input id="input_title"
                   v-model="form.title"
                   :disabled="survey.isActive"
                   @change="updateSurvey" />
        </b-form-group>
      </b-col>
      <b-col sm="4">
        <b-form-group label="Active?"
                      label-for="">
          <b-button-group class="survey__state">
            <b-dropdown :text="surveyStateText(form.isActive)"
                        :variant="surveyState(form.isActive)"
                        right>
              <b-dropdown-item @click="updateisActive(true)">
                Yes
              </b-dropdown-item>
              <b-dropdown-item @click="updateisActive(false)">
                No
              </b-dropdown-item>
            </b-dropdown>
            <b-button v-b-tooltip.hover
                      variant="info"
                      title="Once the survey is active you can use it in a domain">
              <font-awesome-icon icon="question-circle" />
            </b-button>
          </b-button-group>
        </b-form-group>
      </b-col>
    </b-form-row>

    <!-- default textarea for now https://github.com/bootstrap-vue/bootstrap-vue/issues/1708 -->
    <b-form-group v-if="survey.description !== null || showDescription"
                  label="Description"
                  label-for="input_description">
      <textarea id="input_description"
                v-model="form.description"
                class="form-control"
                rows="3"
                :disabled="survey.isActive"
                @change="updateSurvey" />
    </b-form-group>

    <b-form-file :id="`survey_upload_${survey.id}`"
                 placeholder="Choose a file..."
                 accept="image/*"
                 :disabled="survey.isActive" 
                 @change.prevent="uploadImage(survey.id)" />

    <h6 v-if="survey.previewImage">
      Preview
    </h6>

    <imagecontainer v-if="survey.previewImage"
                    :image="survey.previewImage"
                    class="survey__preview">
      <b-btn variant="secondary"
             @click.prevent="removePreviewImage(survey.id)">
        <font-awesome-icon icon="times" />
      </b-btn>
    </imagecontainer>

    <b-form-row class="survey__context">
      <b-col>
        <b-dropdown :no-caret="true"
                    right
                    class="options_dropdown float-right"
                    :disabled="survey.isActive">
          <font-awesome-icon slot="button-content"
                             icon="ellipsis-v" />

          <b-dropdown-item v-if="!showDescription && survey.description === null"
                           class="no-icon"
                           :disabled="survey.isActive"
                           @click.prevent="addDescription">
            Add Description
          </b-dropdown-item>
          <b-dropdown-item v-if="survey.description !== null || showDescription"
                           class="no-icon"
                           :disabled="survey.isActive"
                           @click.prevent="removeDescription">
            Remove Description
          </b-dropdown-item>

          <b-dropdown-divider />


          <b-dropdown-item :disabled="survey.isActive"
                           @click="openFileDialog(`survey_upload_${survey.id}`)">
            <font-awesome-icon icon="image" /> Add Survey Preview
          </b-dropdown-item>
        </b-dropdown>
      </b-col>
    </b-form-row>
  </b-form>
</template>

<script>
import Alert from '@/components/misc/ErrorAlert.vue'
import ImageContainer from '@/components/misc/ImageContainer.vue'

export default {
  name: 'SurveyEdit',
  components: {
    alert: Alert,
    imagecontainer: ImageContainer,
  },
  data() {
    return {
      error: null,
      showDescription: false,
    }
  },
  computed: {
    form() {
      return JSON.parse(JSON.stringify(this.$store.getters.getSurvey))
    },
    survey() {
      return JSON.parse(JSON.stringify(this.$store.getters.getSurvey))
    },
  },
  created() {
    this.$store.dispatch('getSurvey', {
      surveyID: this.$route.params.id,
    }).catch((error) => {
      this.error = error
    })
  },
  methods: {
    uploadImage(surveyID) {
      this.$store.dispatch('setPreviewImage', {
        surveyID,
        file: document.getElementById(`survey_upload_${surveyID}`).files[0]
      })
    },
    updateSurvey() {
      this.$store.dispatch('updateSurvey', {
        id: this.$route.params.id,
        ...this.form,
      }).catch((error) => {
        this.error = error
      })
    },
    updateisActive(value) {
      // dont submit if form already active
      if(value && this.survey.isActive) {
        return
      }
      
      this.$store.dispatch('changeSurveyisActive', {
        id: this.$route.params.id,
        isActive: value,
      }).catch((error) => {
        this.error = error
      })
    },
    surveyState(surveyState) {
      if (surveyState) {
        return 'primary'
      }
      return 'secondary'
    },
    surveyStateText(state) {
      if (state) {
        return 'Yes'
      }
      return 'No'
    },
    openFileDialog(element) {
      document.getElementById(element).click()
    },
    addDescription() {
      this.showDescription = true
    },
    removeDescription() {
      this.form.description = null

      this.$store.dispatch('updateSurvey', {
        id: this.$route.params.id,
        ...this.form,
      }).then(() => {
        
      })
    },
    removePreviewImage(surveyID) {
      this.$store.dispatch('removeSurveyPreviewImage', surveyID)
    }
  },
}
</script>

<style scoped="true" lang="scss">

  .survey__meta { padding: 1.25rem; }

  .survey__state {
    display: flex;
    /deep/.dropdown {
      flex-grow: 1;
      /deep/button {
        flex-grow: 1;
        display: flex;
        width: 100%;

        &:after { margin: auto 0 auto auto !important; }

        +.dropdown-menu { width: 100%; }
      }

      +button { 
        flex: 0;
      }
    }
  }

  .survey__preview {
    max-width: 150px;
    padding-top: 100px;
  }

  @media print {
    .survey__context {
      display: none;
    }
  }
</style>
