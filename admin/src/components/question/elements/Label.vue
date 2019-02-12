<template>
  <b-form-row class="label">
    <div class="label__drag">
      <font-awesome-icon icon="grip-lines-vertical" />
    </div>
    <div class="label__content form-row">
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
    </div>
  </b-form-row>
</template>

<script>
import ImageContainer from '@/components/misc/ImageContainer.vue'

export default {
  name: 'Label',
  components: {
    imagecontainer: ImageContainer,
  },
  props: {
    question: {
      type: Object,
      required: true,
    },
    label: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      showDescription: false,
    }
  },
  computed: {
    survey() {
      return this.$store.getters.getSurvey
    },
  },
  methods: {
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

<style lang="scss" scoped="true">
  .image {
    padding-top: calc(33.5px * 2 + 1rem - 2px);
  }

 .label {
    .label__drag {
      width: 1.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      height: calc(33.5px * 2 + 1rem - 2px);
      cursor: grab;
    }

    .label__content {
      display: flex;
      flex-grow: 1;
    }
  }

  @media(max-width: 425px) {
    .labels .form-row .col-4,
    .labels .form-row .col-8 {
      flex: auto;
      max-width: 100%;
      margin-bottom: 1rem;
    }
    
    .labels .choice__drag {
      height: calc((33.5px * 2 + 1rem - 2px) * 2 + 1.5rem);
    }
  }
</style>
