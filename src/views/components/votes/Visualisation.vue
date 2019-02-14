<template>
  <div class="visualisation">
    <empty :show="show()"
           :card="false"
           icon="chart-area"
           headline="There is no data"
           description="Create questions and collect votes to see some awesome charts!" />

    <div v-if="!show()"
         class="visulisation__charts">
      <chart v-for="question in questions"
             :key="question.id"
             :question="question" />
    </div>
  </div>
</template>

<script>
import Chart from '@/components/votes/Chart.vue'
import EmptyState from '@/components/misc/EmptyState.vue'

export default {
  name: 'Visualisation',
  components: {
    chart: Chart,
    empty: EmptyState,
  },
  computed: {
    questions() {
      return JSON.parse(JSON.stringify(this.$store.getters.getQuestions))
    },
    votes() {
      return this.$store.getters.getVotes
    },
  },
  methods: {
    show() {      
      if(!this.questions || !this.votes) {
        return true
      }

      if (this.questions && this.questions.length === 0) {
        return true
      }

      if (this.votes && this.votes.length === 0) {
        return true
      }

      return false
    },
  },
}
</script>

<style lang="scss" scoped="true">

</style>
