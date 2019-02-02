<template>
  <div class="items">

    <h6>Items</h6>
    <b-form-row v-for="item in question.items"
                :key="item.id"
                class="image-row">
      <b-col cols="4" sm="3" md="2">
        <imagecontainer :image="item.image"
                        class="image">
        </imagecontainer>
      </b-col>
      <b-col cols="8" sm="9" md="10">
        <b-form-group label="Label"
                      :label-for="`item_label_${item.id}`"
                      :label-sr-only="true">
          <b-input-group>
            <b-input v-model="item.label"
                     :id="`item_label_${item.id}`"
                     @change="updateItem(question, item)"
                     :disabled="survey.isPublic">
            </b-input>

            <b-form-file class="file_upload"
                         placeholder="Choose a file..."
                         :id="`file_upload_item_${item.id}`"
                         accept="image/*"
                         @change="uploadItemImage($event, question.id, item.id)"
                         :disabled="survey.isPublic">
            </b-form-file>

            <b-btn variant="secondary"
                   slot="append"
                   @click="openFileDialog(`file_upload_item_${item.id}`)"
                   :disabled="survey.isPublic">
              <font-awesome-icon icon="image" />
            </b-btn>

            <b-btn slot="append"
                   @click="deleteItem($event, question, item)"
                   variant="secondary"
                   :disabled="survey.isPublic">
                   <font-awesome-icon icon="times" />
            </b-btn>
          </b-input-group>
        </b-form-group>
      </b-col>
    </b-form-row>
    <b-btn variant="link"
           @click="addItem($event, question)"
           :class="{ 'disabled': survey.isPublic }">
      New Item
    </b-btn>
  </div>
</template>

<script>
import ImageContainer from '@/components/misc/ImageContainer.vue'

export default {
  name: 'Items',
  props: {
    id: String,
  },
  data() {
    return {
      file: '',
    }
  },
  components: {
    imagecontainer: ImageContainer,
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
    uploadItemImage(event, questionID, itemID) {
      event.preventDefault()

      this.$store.dispatch('uploadItemImage', {
        questionID,
        itemID,
        file: document.getElementById(`file_upload_item_${itemID}`).files[0],
      })
    },
    openFileDialog(element) {
      document.getElementById(element).click()
    },
  },
}
</script>


<style scoped="true" lang="scss">

  h6 { margin-top: 1rem; }

  .image-row { margin-bottom: 1rem; }

  .file_upload { display: none !important; }

  .image {
    padding-top: calc(33.5px * 2 + 1rem - 2px);
    border: 1px solid #ced4da;
  }

  @media(max-width: 425px) {
    .items .form-row .col-4,
    .items .form-row .col-8 {
      flex: auto;
      max-width: 100%;
      margin-bottom: 1rem;
    }
  }
</style>
