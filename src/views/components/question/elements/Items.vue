<template>
  <div class="items">
    <h6>Items</h6>

    <draggable v-model="items">
      <transition-group name="choices-complete">
        <b-form-row v-for="item in question.items"
                    :key="item.id"
                    class="mb-3">
          <div class="item__drag">
            <font-awesome-icon icon="grip-lines-vertical" />
          </div>
          <div class="item__content form-row">
            <b-col cols="4"
                   sm="3"
                   md="2">
              <imagecontainer :image="item.image"
                              class="image">   
                <b-button-group v-if="item.image">
                  <b-btn variant="secondary"
                         @click.prevent="removeItemImage(question.id, item.id)">
                    <font-awesome-icon icon="times" />
                  </b-btn>
                </b-button-group>
                <b-button-group v-if="!item.image">
                  <b-btn variant="secondary"
                         @click="openFileDialog(`file_upload_item_${item.id}`)">
                    <font-awesome-icon icon="plus" />
                  </b-btn>
                </b-button-group>
              </imagecontainer>
            </b-col>
            <b-col cols="8"
                   sm="9"
                   md="10">
              <b-form-group label="Label"
                            :label-for="`item_label_${item.id}`"
                            :label-sr-only="true">
                <b-input-group>
                  <b-input :id="`item_label_${item.id}`"
                           v-model="item.label"
                           :disabled="survey.isActive"
                           @change="updateItem(question, item)" />

                  <b-form-file :id="`file_upload_item_${item.id}`"
                               placeholder="Choose a file..."
                               accept="image/*"
                               :disabled="survey.isActive"
                               @change="uploadItemImage(question.id, item.id)" />

                  <b-btn slot="append"
                         variant="secondary"
                         :disabled="survey.isActive"
                         @click="openFileDialog(`file_upload_item_${item.id}`)">
                    <font-awesome-icon icon="image" />
                  </b-btn>

                  <b-btn slot="append"
                         variant="secondary"
                         :disabled="survey.isActive"
                         @click.prevent="deleteItem(question, item)">
                    <font-awesome-icon icon="times" />
                  </b-btn>
                </b-input-group>
              </b-form-group>
            </b-col>
          </div>
        </b-form-row>
      </transition-group>
    </draggable>


    <b-btn variant="link"
           :class="{ 'disabled': survey.isActive }"
           @click.prevent="addItem(question)">
      New Item
    </b-btn>
  </div>
</template>

<script>
import ImageContainer from '@/components/misc/ImageContainer.vue'
import draggable from 'vuedraggable'

export default {
  name: 'Items',
  components: {
    imagecontainer: ImageContainer,
    draggable,
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
    }
  },
  computed: {
    question() {
      return JSON.parse(JSON.stringify(this.$store.getters.getQuestion(this.id)))
    },
    survey() {
      return JSON.parse(JSON.stringify(this.$store.getters.getSurvey))
    },
    items: {
      get() {
        const value = JSON.parse(JSON.stringify(this.$store.state.questions.questions.find(item => item.id === this.question.id).items))
        return value || []
      },
      set(items) {
        this.$store.dispatch('orderItems', {
          questionID: this.question.id,
          items,
          oldState: this.question.items,
        })
      }
    }
  },
  methods: {
    addItem(question) {
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
    deleteItem(question, item) {
      this.$store.dispatch('deleteItem', {
        question,
        item,
      })
    },
    uploadItemImage(questionID, itemID) {
      this.$store.dispatch('uploadItemImage', {
        questionID,
        itemID,
        file: document.getElementById(`file_upload_item_${itemID}`).files[0],
      })
    },
    openFileDialog(element) {
      document.getElementById(element).click()
    },
    removeItemImage(questionID, itemID) {
      this.$store.dispatch('removeItemImage', {
        questionID,
        itemID,
      })
    },
  },
}
</script>


<style scoped="true" lang="scss">
  h6 { margin-top: 1rem; }

  .image {
    padding-top: calc(33.5px * 2 + 1rem - 2px);
    border: 1px solid #ced4da;
  }

  .items {
    .item__drag {
      width: 1.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      height: calc(33.5px * 2 + 1rem - 2px);
      cursor: grab;

      .fa-grip-lines-vertical {
        color: $secondaryColor;
      }
    }

    .item__content {
      display: flex;
      flex-grow: 1;
    }
  }

  @media(max-width: 425px) {
    .items .form-row .col-4,
    .items .form-row .col-8 {
      flex: auto;
      max-width: 100%;
      margin-bottom: 1rem;
    }

    .items .item__drag {
      height: calc((33.5px * 2 + 1rem - 2px) * 1.9);
    }
  }

  @media print {

    .item__drag,
    .item__content .col-sm-9 .input-group .input-group-append {
      display: none !important;
    }

    .btn-link {
      display: none;
    }
  }
</style>
