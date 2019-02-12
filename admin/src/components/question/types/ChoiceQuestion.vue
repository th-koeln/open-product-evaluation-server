<template>
  <div class="choice-options">
    <!-- question description -->
    <description v-if="question.description !== null || showDescription"
                 :question="question" />

    <!-- list of choices -->
    <div class="choices">
      <h6>Choices</h6>
      
      <choice v-for="choice in question.choices"
              :key="choice.id"
              :choice="choice"
              :question="question" />

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

export default {
  name: 'ChoiceQuestion',
  components: {
    items: Items,
    description: Description,
    choice: Choice,
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
      showDescription: false,
    }
  },
  computed: {
    survey() {
      return this.$store.getters.getSurvey
    },
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

</style>
