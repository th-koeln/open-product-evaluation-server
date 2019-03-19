<template>
  <div class="regulator">
    <!-- question description -->
    <description v-if="question.description !== null || showDescription"
                 :question="question" />

    <!-- range settings -->
    <h6>Range</h6>
    <b-form-row>
      <b-col cols="6"
             sm="4">
        <b-form-group label="From"
                      :label-for="`input_min_${question.id}`">
          <b-input :id="`input_min_${question.id}`"
                   v-model="question.min"
                   :disabled="true"
                   @change="updateRegulatorQuestion" />
        </b-form-group>
      </b-col>

      <b-col cols="6"
             sm="4">
        <b-form-group label="To"
                      :label-for="`input_max_${question.id}`">
          <b-input :id="`input_max_${question.id}`"
                   v-model="question.max"
                   :disabled="survey.isActive"
                   @change="updateRegulatorQuestion" />
        </b-form-group>
      </b-col>

      <b-col cols="6"
             sm="4">
        <b-form-group label="Default"
                      :label-for="`input_default_${question.id}`">
          <b-input :id="`input_default_${question.id}`"
                   v-model="question.default"
                   :disabled="survey.isActive" 
                   @change="updateRegulatorQuestion" />
        </b-form-group>
      </b-col>
    </b-form-row>

    <!-- list of labels -->
    <div class="labels">
      <h6>Labels</h6>

      <draggable v-model="labels">
        <transition-group name="labels-complete">
          <regulator-label v-for="label in question.labels"
                           :key="label.id"
                           :label="label"
                           :question="question" />
        </transition-group>
      </draggable>

      <b-btn variant="link"
             :class="{ 'disabled': survey.isActive }"
             @click.prevent="addLabel(question)">
        New Label
      </b-btn>
    </div>

    <!-- list of items-->
    <items :id="question.id" />

    <!-- context menu -->
    <context v-model="showDescription"
             :question="question"
             :survey="survey" />
  </div>
</template>

<script>
import Items from '@/components/question/elements/Items.vue'
import Description from '@/components/question/elements/Description.vue'
import ContextMenu from '@/components/question/elements/ContextMenu.vue'
import Label from '@/components/question/elements/Label.vue'
import draggable from 'vuedraggable'

export default {
  name: 'RegulatorOptions',
  components: {
    items: Items,
    description: Description,
    context: ContextMenu,
    'regulator-label': Label,
    draggable,
  },
  props: {
    question: {
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
    labels: {
      get() {
        const value = JSON.parse(JSON.stringify(this.$store.state.questions.questions.find(item => item.id === this.question.id).labels))
        return value || []
      },
      set(labels) {
        this.$store.dispatch('orderLabels', {
          questionID: this.question.id,
          labels,
          oldState: this.question.labels,
        })
      }
    }
  },
  methods: {
    updateRegulatorQuestion() {
      this.$store.dispatch('updateRegulatorQuestion', {
        surveyID: this.$route.params.id,
        question: this.question,
      })
    },
    addLabel(question) {
      this.$store.dispatch('createLabel', {
        question,
      })
    },
    openFileDialog(element) {
      document.getElementById(element).click()
    },
  },
}
</script>

<style scoped="true" lang="scss">

  @media print {
    .btn-link { display: none; }
  }
</style>
