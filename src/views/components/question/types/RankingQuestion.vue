<template>
  <div class="ranking">
    <!-- question description -->
    <description v-if="question.description !== null || showDescription"
                 :question="question" />

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
import ContextMenu from '@/components/question/elements/ContextMenu.vue'

export default {
  name: 'RankingOptions',
  components: {
    items: Items,
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
      showDescription: false,
    }
  },
  computed: {
    survey() {
      return this.$store.getters.getSurvey
    },
  },
}
</script>

<style scoped="true" lang="scss">

</style>
