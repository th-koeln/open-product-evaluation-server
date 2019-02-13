<template>
  <b-card header="Update Domain"
          class="form">
    <alert :data="error" />

    <b-form @submit.prevent="updateDomain">
      <b-form-row>
        <b-col md="8">
          <b-form-group label="Name"
                        label-for="input_name">
            <b-input id="input_name"
                     v-model="domain.name" />
          </b-form-group>
        </b-col>
        <b-col md="4">
          <b-form-group label="Public?"
                        label-for="">
            <b-button-group class="domain__state">
              <b-dropdown :text="domainStateText(domain.isPublic)"
                          :variant="domainState(domain.isPublic)">
                <b-dropdown-item @click="updateDomainVisibility(true)">
                  Public
                </b-dropdown-item>
                <b-dropdown-item @click="updateDomainVisibility(false)">
                  Private
                </b-dropdown-item>
              </b-dropdown>
            </b-button-group>
          </b-form-group>
        </b-col>
      </b-form-row>  
      <b-form-row>
        <b-col>
          <b-form-group label="Active Survey"
                        label-for="input_survey">
            <b-form-select v-if="domain.activeSurvey"
                           v-model="domain.activeSurvey.id">
              <option value="null">
                No Survey
              </option>
              <option v-for="survey in surveys"
                      :key="survey.id"
                      :value="survey.id">
                {{ survey.title }}
              </option>
            </b-form-select>

            <b-form-select v-if="!domain.activeSurvey"
                           v-model="selectedSurvey">
              <option value="null">
                No Survey
              </option>
              <option v-for="survey in surveys"
                      :key="survey.id"
                      :value="survey.id">
                {{ survey.title }}
              </option>
            </b-form-select>
          </b-form-group>
        </b-col>
      </b-form-row>

      <h5 v-if="domain.owners">
        Owners
      </h5>
      <b-list-group v-if="domain.owners"
                    class="mb-4">
        <b-list-group-item v-for="owners in domain.owners"
                           :key="owners.id">
          {{ owners.firstName + ' ' + owners.lastName }}
        </b-list-group-item>
      </b-list-group>

      <h5 v-if="domain.clients && domain.clients.length > 0">
        Clients
      </h5>
      <b-list-group class="mb-4">
        <b-list-group-item v-for="client in domain.clients"
                           :key="client.id">
          {{ client.name }}

          <a v-if="isOwner(client.id, currentUser.id)"
             href="#"
             class="float-right"
             @click="remove($event, client)">
            <font-awesome-icon icon="times" />
          </a>
        </b-list-group-item>
      </b-list-group>

      <b-btn type="submit"
             variant="primary">
        Save
      </b-btn>
    </b-form>
  </b-card>
</template>

<script>
import Alert from '@/components/misc/ErrorAlert.vue'

export default {
  name: 'DomainEdit',
  components: {
    alert: Alert,
  },
  data() {
    return {
      selectedSurvey: null,
      error: null,
    }
  },
  computed: {
    clients() {
      let clients = JSON.parse(JSON.stringify(this.$store.getters.getClients))
      clients = clients.filter(client => client.domain === null)

      return clients
    },
    domainSurvey() {
      const domain = JSON.parse(JSON.stringify(this.$store.getters.getDomain))

      if (domain.activeSurvey) {
        return domain.activeSurvey.id
      }

      return null
    },
    domain() {
      return JSON.parse(JSON.stringify(this.$store.getters.getDomain))
    },
    surveys() {
      return JSON.parse(JSON.stringify(this.$store.getters.getSurveys))
    },
    currentUser() {
      return this.$store.getters.getCurrentUser.user
    },
  },
  created() {
    this.$store.dispatch('getClients').catch((error) => {
      this.error = error
    })

    this.$store.dispatch('getSurveys').catch((error) => {
      this.error = error
    })

    this.$store.dispatch('getDomain', {
      id: this.$route.params.id,
    }).catch((error) => {
      this.error = error
    })
  },
  methods: {
    updateDomainVisibility(isPublic) {
      const payload = {
        id: this.domain.id,
        name: this.domain.name,
        isPublic,
      }

      if (this.domain.activeSurvey) {
        payload.surveyID = this.domain.activeSurvey.id
      } else {
        payload.surveyID = this.selectedSurvey
      }      

      this.$store.dispatch('updateDomainVisibility', payload)
        .catch((error) => {
          this.error = error
        })
    },
    updateDomain() {
      const payload = {
        id: this.domain.id,
        name: this.domain.name,
      }

      if (this.domain.activeSurvey) {
        payload.surveyID = this.domain.activeSurvey.id
      } else {
        payload.surveyID = this.selectedSurvey
      }

      this.$store.dispatch('updateDomain', payload)
        .then((data) => {
          this.$router.push('/domain')
        })
        .catch((error) => {
          this.error = error
        })
    },
    isOwner(clientID, userID) {
      const client = this.domain.clients.find(d => d.id === clientID)

      if (!client.owners) {
        return false
      }

      if (client.owners.length === 0) {
        return false
      }

      const user = client.owners.filter(o => o.id === userID)

      if (user.length > 0) {
        return true
      }

      return false
    },
    domainState(domainState) {
      if (domainState) {
        return 'primary'
      }
      return 'secondary'
    },
    domainStateText(state) {
      if (state) {
        return 'Public'
      }
      return 'Private'
    }
  },
}
</script>

<style scoped="true" lang="scss" >
  .domain__state {
    display: flex;
    /deep/.dropdown {
      flex-grow: 1;
      /deep/button {
        flex-grow: 1;
        display: flex;
        width: 100%;

        &:after { margin: auto 0 auto auto !important; }

        +.dropdown-menu { width: 100%; }
      }
    }
  }
</style>
