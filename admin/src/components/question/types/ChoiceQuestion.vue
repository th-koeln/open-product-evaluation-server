<template>
  <div class="choice-options">
    <!-- question description -->
    <description v-if="question.description !== null || showDescription"
                 :question="question" />

    <!-- list of choices -->
    <div class="choices">
      <h6>Choices</h6>
      
      <draggable v-model="choices">
        <transition-group name="choices-complete">
          <choice v-for="choice in choices"
                  :key="choice.id"
                  class="choice-item"
                  :choice="choice"
                  :question="question" />
        </transition-group>
      </draggable>

      <b-btn variant="link"
             :class="{ 'disabled': survey.isActive }"
             @click="addChoice(question.id, $event)">
        New Choice
      </b-btn>
    </div>

    <!-- list of items -->
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
import Choice from '@/components/question/elements/Choice.vue'
import ContextMenu from '@/components/question/elements/ContextMenu.vue'
import draggable from 'vuedraggable'

export default {
  name: 'ChoiceQuestion',
  components: {
    items: Items,
    description: Description,
    choice: Choice,
    context: ContextMenu,
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
    choices: {
      get() {
        const value = JSON.parse(JSON.stringify(this.$store.state.questions.questions.find(item => item.id === this.question.id).choices))
        return value || []
      },
      set(choices) {
        this.$store.dispatch('orderChoices', {
          questionID: this.question.id,
          choices,
          oldState: this.question.choices,
        })
      }
    }
  },
  methods: {
    addChoice(id, event) {
      event.preventDefault()

      this.$store.dispatch('createChoice', {
        question: this.question,
      })
    },
  },
}
</script>

<style scoped="true" lang="scss">
.choice-item {
  cursor: grab;
  transition: transform 0.25s cubic-bezier(0.02, 1.01, 0.94, 1.01);
  will-change: transform;
}

.choices-complete-enter,
.choices-complete-leave-active {
  opacity: 0;
}
</style>
