<template>
  <b-card header="Update Domain"
          class="form domain">
    <alert :data="error" />

    <b-form @submit.prevent="updateDomain">
      <div class="domain__group">
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
                <option :value="null">
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
                <option :value="null">
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
      </div>

      <div class="domain__group">
        <h5>
          Owners
        </h5>

        <b-input-group class="domain__action">
          <b-input v-model="email"
                   placeholder="E-Mail" />
          <b-btn slot="append"
                 variant="secondary"
                 @click.prevent="setDomainOwner(domain.id, email)">
            Add Owner
          </b-btn>
        </b-input-group>

        <b-list-group v-if="domain && domain.owners && domain.owners.length > 0"
                      class="mb-4">
          <b-list-group-item v-for="owners in domain.owners"
                             :key="owners.id">
            {{ owners.firstName + ' ' + owners.lastName }}

            <a href="#"
               class="float-right"
               @click.prevent="removeDomainOwner(domain.id, owners.id)">
              <font-awesome-icon icon="times" />
            </a>
          </b-list-group-item>
        </b-list-group>
        <b-list-group v-else>
          <b-list-group-item>
            This domain has no additional owners.
          </b-list-group-item>
        </b-list-group>
      </div>

      <div class="domain__group">
        <h5>
          Clients
        </h5>
        
        <b-input-group class="domain__action">
          <search v-model="recommendedClient"
                  :suggestions="clients"
                  placeholder="Name"
                  class="domain__autocomplete"
                  attribute="name" />
          <b-btn slot="append"
                 variant="secondary"
                 @click="addClient(recommendedClient)">
            Add Client
          </b-btn>
        </b-input-group>

        <b-list-group v-if="domain && domain.clients && domain.clients.length > 0"
                      class="mb-4">
          <b-list-group-item v-for="client in domain.clients"
                             :key="client.id">
            {{ client.name }}

            <a href="#"
               class="float-right"
               @click.prevent="removeClient(client.id)">
              <font-awesome-icon icon="times" />
            </a>
          </b-list-group-item>
        </b-list-group>
        <b-list-group v-else>
          <b-list-group-item>
            This domain has no clients.
          </b-list-group-item>
        </b-list-group>
      </div>

      <b-btn type="submit"
             variant="primary">
        Save
      </b-btn>
    </b-form>
  </b-card>
</template>

<script>
import Alert from '@/components/misc/ErrorAlert.vue'
import SearchInput from '@/components/misc/SearchInput.vue'

export default {
  name: 'DomainEdit',
  components: {
    alert: Alert,
    search: SearchInput,
  },
  data() {
    return {
      selectedSurvey: null,
      error: null,
      email: '',
      recommendedClient: '',
    }
  },
  computed: {
    clients() {
      return JSON.parse(JSON.stringify(this.$store.getters.getClients))
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
    this.$store.dispatch('getClients', {
      filter: 'LAST_UPDATE',
      order: 'DESCENDING'
    }).catch((error) => {
      this.error = error
    })

    this.$store.dispatch('getSurveys', {
      filter: 'LAST_UPDATE',
      order: 'DESCENDING'
    }).catch((error) => {
      this.error = error
    })

    this.$store.dispatch('getDomain', {
      id: this.$route.params.id,
    }).catch((error) => {
      this.error = error
    })
  },
  methods: {
    setDomainOwner(domainID, email) {
      this.$store.dispatch('setDomainOwner', {
        domainID,
        email
      }).catch((error) => {
        this.error = error
      })
    },
    removeDomainOwner(domainID, ownerID) {
      this.$store.dispatch('removeDomainOwner', {
        domainID,
        ownerID
      }).catch((error) => {
        this.error = error
      })
    },
    addClient(name) {
      const client = this.clients.find((client) => {
        return client.name.includes(name)
      })

      if(!client) {
        // throw fake error message
        const error = Error('Client not found.')
        error.networkError = null
        error.graphQLErrors = [
          { message: 'Client not found.'}
        ]
        this.error = error
        return
      }

      this.recommendedClient = ''

      this.$store.dispatch('addClientToDomain', {
        domainID: this.domain.id,
        clientID: client.id,
      })
    },
    removeClient(clientID) {
      this.$store.dispatch('removeClientFromDomain', clientID)
    },
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

<style scoped="true" lang="scss">
  .domain {
    .domain__group {
      margin-bottom: $marginDefault;

      .form-row:last-child {
        margin-bottom: 0;

        .form-group {
          margin-bottom: 0;
        }
      }
    }

    .domain__action { margin-bottom: $marginDefault; }

    .domain__autocomplete { flex: 1 1 auto; }

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
  }
</style>
