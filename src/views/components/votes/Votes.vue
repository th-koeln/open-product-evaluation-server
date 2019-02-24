<template>
  <div class="votes">
    <b-row class="mb-4">
      <!-- visualisation / results tab -->
      <b-col sm="12"
             class="votes__options">
        <b-button-group>
          <b-btn :variant="checkView('visualisation')"
                 @click="setView('visualisation')">
            Zusammenfassung
          </b-btn>
          <b-btn :variant="checkView('results')"
                 @click="setView('results')">
            Antworten
          </b-btn>
        </b-button-group>

        <!-- export data dropdown -->
        <b-dropdown text="Export"
                    :disabled="!votes || votes && votes.length === 0"
                    :right="true">
          <b-dropdown-item>CSV</b-dropdown-item>
          <b-dropdown-item @click="openPrintDialog()">
            Print
          </b-dropdown-item>
        </b-dropdown>
      </b-col>
    </b-row>

    <!-- visualisation view -->
    <visualisation v-if="view === 'visualisation'" />
    
    <!-- results view -->
    <results v-if="view === 'results'" />
  </div>
</template>

<script>
import Visualisation from '@/components/votes/Visualisation.vue'
import Results from '@/components/votes/Results.vue'

export default {
  name: 'Votes',
  components: {
    visualisation: Visualisation,
    results: Results,
  },
  data() {
    return {
      view: 'visualisation',
    }
  },
  computed: {
    votes() {
      return this.$store.getters.getVotes
    },
  },
  methods: {
    checkView(name) {
      if (this.view === name) {
        return 'primary'
      }
      return 'secondary'
    },
    setView(name) {
      this.view = name
    },
    openPrintDialog() {
      window.print()
    }
  },
}
</script>

<style lang="scss" scoped="true">

  .votes .votes__options {
    display: flex;
    justify-content: space-between;
  }

 @media print {
   .votes .votes__options {
     display: none;
    }

   .votes .row.mb-4 {
     margin-bottom: 0 !important;
    }
 } 

</style>
