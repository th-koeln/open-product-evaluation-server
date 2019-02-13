<template>
  <b-form-row class="choice">
    <div class="choice__drag">
      <font-awesome-icon icon="grip-lines-vertical" />
    </div>
    <div class="choice__content form-row">
      <b-col cols="4"
             sm="3"
             md="2">
        <imagecontainer :image="choice.image"
                        class="image">
          <b-button-group>
            <b-btn variant="secondary"
                   @click="removeImage($event, question.id, choice.id)">
              <font-awesome-icon icon="times" />
            </b-btn>
          </b-button-group>
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
                     :disabled="survey.isActive"
                     @change="updateChoice(question, choice)" />

            <b-form-file :id="`file_upload_choice_${choice.id}`"
                         placeholder="Choose a file..."
                         accept="image/*"
                         :disabled="survey.isActive" 
                         @change="uploadImage($event, question.id, choice.id)" />

            <b-btn slot="append"
                   variant="secondary"
                   :disabled="survey.isActive"
                   @click="openFileDialog(`file_upload_choice_${choice.id}`)">
              <font-awesome-icon icon="image" />
            </b-btn>
            <b-btn slot="append"
                   variant="secondary"
                   :class="{ 'disabled': survey.isActive }"
                   :disabled="survey.isActive"
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
                   :disabled="true" />
        </b-form-group>
      </b-col>
    </div>
  </b-form-row>
</template>

<script>
import ImageContainer from '@/components/misc/ImageContainer.vue'

export default {
  name: 'Choice',
  components: {
    imagecontainer: ImageContainer,
  },
  props: {
    question: {
      type: Object,
      required: true,
    },
    choice: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      file: '',
    }
  },
  computed: {
    survey() {
      return JSON.parse(JSON.stringify(this.$store.getters.getSurvey))
    },
  },
  methods: {
    uploadImage(event, questionID, choiceID) {
      event.preventDefault()

      this.$store.dispatch('uploadChoiceImage', {
        questionID,
        choiceID,
        file: document.getElementById(`file_upload_choice_${choiceID}`).files[0],
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
    removeImage(event, questionID, choiceID) {
      event.preventDefault()

      this.$store.dispatch('removeChoiceImage', {
        questionID,
        choiceID,
      })
    },
  },
}
</script>

<style lang="scss" scoped="true">
  .image {
    padding-top: calc(33.5px * 2 + 1rem - 2px);
  }

  .choice {

    &:hover .choice__drag .fa-grip-lines-vertical {
      display: inline;
    }

    .choice__drag {
      width: 1.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      height: calc(33.5px * 2 + 1rem - 2px);
      cursor: grab;

      .fa-grip-lines-vertical {
        display: none;
        color: $secondaryColor;
      }
    }

    .choice__content {
      display: flex;
      flex-grow: 1;
    }
  }

  @media(max-width: 425px) {
    .choices .form-row .col-4,
    .choices .form-row .col-8 {
      flex: auto;
      max-width: 100%;
      margin-bottom: 1rem;
    }

    .choice .choice__drag {
      height: calc((33.5px * 2 + 1rem - 2px) * 2 + 1.5rem);
    }
  }
</style>
