<template>
  <div class="visualisation">
    <empty :show="show()"
           :card="false"
           icon="chart-area"
           headline="There is no data"
           description="Create questions and collect votes to see some awesome charts!" />

    <empty :show="emptySummary()"
           :card="false"
           icon="chart-area"
           headline="This version has no votes"
           description="Let your users vote to see some data!" />
    
    <div v-if="!show()"
         class="visulisation__charts">
      <chart v-for="summary in version.summaries"
             :key="summary.question"
             :summary="summary" />
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
  props: {
    versionNumber: {
      type: Number,
      required: true,
      default: 0,
    }
  },
  computed: {
    votes() {
      return this.$store.getters.getVotes
    },
    version() {
      const data = this.$store.getters.getVotes
      if (data && data.versions && data.versions.length > 0) {
        return data.versions.find((version) => {
          return version.versionNumber === this.versionNumber
        })
      }
      return null
    },
  },
  methods: {
    show() {      
      if(!this.version) {
        return true
      }

      return false
    },
    emptySummary() {
      if (!this.version) {
        return true
      }

      if (!this.version.summaries) {
        return true
      }

      if (this.version.summaries && this.version.summaries.length == 0) {
        return true
      }

      return false
    }
  },
}
</script>

<style lang="scss" scoped="true">

</style>
