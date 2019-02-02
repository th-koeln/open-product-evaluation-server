<template>
  <b-card :header="domain.name">
    <alert :data="error" />

    <b-row>
      <b-col sm="6">
        <h5 v-if="domain.activeSurvey">
          Active Survey
        </h5>
        
        <p v-if="domain.activeSurvey">
          {{ domain.activeSurvey.title }}
        </p>

        <h5 v-if="domain.activeQuestion">
          Active Question
        </h5>
        
        <p v-if="domain.activeQuestion">
          {{ domain.activeQuestion.value }}
        </p>

        <h5 v-if="domain.owners">
          Owner
        </h5>
        
        <ul v-if="domain.owners">
          <li v-for="owners in domain.owners"
              :key="owners.id">
            {{ owners.firstName + ' ' + owners.lastName }}
          </li>
        </ul>
      </b-col>

      <b-col sm="6">
        <h5>Clients</h5>
        <ul v-if="domain.clients"
            class="list">
          <li v-for="client in domain.clients"
              :key="client.id">
            {{ client.name }}
          </li>
        </ul>
      </b-col>
    </b-row>
    <div class="options">
      <router-link :to="{ path: '/domain/edit/' + domain.id }"
                   class="btn btn-link">
        Edit
      </router-link>

      <b-btn v-b-modal="'modal-grid-' + domain.id"
             variant="link">
        Remove
      </b-btn>
      <b-modal :id="'modal-grid-' + domain.id"
               size="sm"
               title="Confirm deletion"
               centered>
        Do you really want to delete this domain?
        <div slot="modal-footer">
          <b-btn variant="primary"
                 @click="deleteDomain($event, domain.id);">
            Remove
          </b-btn>
        </div>
      </b-modal>
    </div>
  </b-card>
</template>

<script>
import Alert from '@/components/misc/ErrorAlert.vue'

export default {
  name: 'Domain',
  components: {
    alert: Alert,
  },
  data() {
    return {
      error: null,
    }
  },
  computed: {
    domain() {
      return this.$store.getters.getDomain
    },
  },
  created() {
    this.$store.dispatch('getDomain', {
      id: this.$route.params.id,
    }).catch((error) => {
      this.error = error
    })
  },
  methods: {
    deleteDomain(event, id) {
      event.preventDefault()
      this.$store.dispatch('deleteDomain', { id })
        .then(() => {
          this.$router.push('/domain')
        }).catch((error) => {
          this.error = error
        })
    },
  },
}
</script>

<style scoped="true" lang="scss">

.list {
  list-style: none;
  margin: 0;
  padding: 0;
  border-top: 1px solid #e9ecef;
  border-left: 1px solid #e9ecef;
  border-right: 1px solid #e9ecef;
  li {
    line-height: 3rem;
    text-indent: 2rem;
    border-bottom: 1px solid #e9ecef;
  }
}
</style>
