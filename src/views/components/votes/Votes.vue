<template>
  <div class="votes">
    <b-row class="mb-4">
      <!-- visualisation / results tab -->
      <b-col sm="12"
             class="votes__options">
        <b-button-group>
          <b-dropdown :text="`Version: ${getVersionName(votes.versions, versionNumber)}`">
            <b-dropdown-item v-for="version in getReverseVersions()"
                             :key="version.versionNumber"
                             @click="selectVersion(version.versionNumber)">
              {{ version.versionNumber }}
            </b-dropdown-item>
          </b-dropdown>

          <b-dropdown :text="view"
                      right="">
            <b-dropdown-item @click="setView('Summary')">
              Summary
            </b-dropdown-item>
            <b-dropdown-item @click="setView('Answers')">
              Answers
            </b-dropdown-item>
          </b-dropdown>
        </b-button-group>

        <b-dropdown text="Export"
                    :disabled="!votes || votes && votes.length === 0"
                    class="ml-auto"
                    :right="true">
          <b-dropdown-item>CSV</b-dropdown-item>
          <b-dropdown-item @click="openPrintDialog()">
            Print
          </b-dropdown-item>
        </b-dropdown>
      </b-col>
    </b-row>

    <!-- visualisation view -->
    <visualisation v-if="view === 'Summary'"
                   :version-number="versionNumber" />
    
    <!-- results view -->
    <results v-if="view === 'Answers'"
             :version-number="versionNumber" />
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
      view: 'Summary',
      versionNumber: 1,
      reversedVersions: null,
    }
  },
  computed: {
    votes() {
      return JSON.parse(JSON.stringify(this.$store.getters.getVotes))
    },
  },
  created() {
    this.$store.dispatch('getSurvey', {
      surveyID: this.$route.params.id,
    }).then((data) => {
      if (data.data.survey.results
        && data.data.survey.results.versions
        && data.data.survey.results.versions.length > 0) {
        this.versionNumber = data.data.survey.results.versions.length
      }
    })
  },
  methods: {
    getVersionName(versions, versionNumber) {      
      if(versionNumber === 1 || versions === 1) {
        return 'Current'
      }

      if (versionNumber === versions.length) {
        return 'Current'
      }
      return versionNumber
    },
    getReverseVersions() {
      if(this.reversedVersions !== null) {
        return this.reversedVersions
      }

      if (this.votes.versions && this.votes.versions.length > 0) {
        this.reversedVersions = this.votes.versions.reverse()
        return this.reversedVersions
      }
      return null
    },
    selectVersion(versionNumber) {
      this.versionNumber = versionNumber
    },
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
    align-content: flex-start;
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
