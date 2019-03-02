<template>
  <b-card header="Edit Client"
          class="form">
    <alert :data="error" />

    <b-form @submit.prevent="updateClient">
      <b-form-group label="Name"
                    label-for="input_name">
        <b-input id="input_name"
                 v-model.trim="name"
                 :state="state($v.name.$dirty, $v.name.$error)"
                 @input="setName($event)" />
        <b-form-invalid-feedback v-if="!$v.name.required">
          Client name is required
        </b-form-invalid-feedback>
        <b-form-invalid-feedback v-if="!$v.name.alpha">
          Client name only allows alphabet characters
        </b-form-invalid-feedback>
      </b-form-group>

      <b-row class="client__heading">
        <b-col cols="12"
               md="6"
               class="client__title">
          <h5>
            Owners
          </h5>
        </b-col>
        <b-col cols="12"
               md="6"
               class="client__form">
          <b-input-group>
            <b-input v-model="email"
                     placeholder="E-Mail" />
            <b-btn slot="append"
                   variant="secondary"
                   @click.prevent="setClientOwner(client.id, email)">
              Add Owner
            </b-btn>
          </b-input-group>
        </b-col>
      </b-row>

      <b-list-group v-if="client && client.owners && client.owners.length > 0"
                    class="mb-4">
        <b-list-group-item v-for="owners in client.owners"
                           :key="owners.id">
          {{ `${owners.firstName} ${owners.lastName}` }}

          <a href="#"
             class="float-right"
             @click.prevent="removeClientOwner(client.id, owners.id)">
            <font-awesome-icon icon="times" />
          </a>
        </b-list-group-item>
      </b-list-group>
      <b-list-group v-else>
        <b-list-group-item>
          This client has no owners.
        </b-list-group-item>
      </b-list-group>

      <b-btn variant="primary"
             type="submit">
        Update
      </b-btn>
    </b-form>
  </b-card>
</template>

<script>
import Alert from '@/components/misc/ErrorAlert.vue'
import validationState from '@/mixins/validation'
import {
  required,
  alpha,
} from 'vuelidate/lib/validators'

export default {
  name: 'ClientEdit',
  components: {
    alert: Alert,
  },
  mixins: [validationState],
  data() {
    return {
      error: null,
      name: '',
      email: '',
    }
  },
  validations: {
    name: {
      required,
      alpha,
    },
  },
  computed: {
    client() {
      return this.$store.getters.getClient
    }
  },
  created() {
    
    this.$store.dispatch('getClient', {
      id: this.$route.params.id,
    }).then((data) => {
      this.name = data.data.client.name
    }).catch((error) => {
      this.error = error
    })
  },
  methods: {
    setName(value) {
      this.name = value
      this.$v.name.$touch()
    },
    updateClient(event) {
      this.$v.$touch()

      if (!this.$v.$invalid) {
        const newClient = { ...this.client, name: this.name}
        this.$store.dispatch('updateClient', newClient)
          .then(() => {
            this.$router.push('/clients')
          })
          .catch((error) => {
            this.error = error
          })
      }
    },
    setClientOwner(clientID, email) {
      this.$store.dispatch('setClientOwner', {
        clientID,
        email
      }).catch((error) => {
        this.error = error
      })
    },
    removeClientOwner(clientID, ownerID) {
      this.$store.dispatch('removeClientOwner', {
        clientID,
        ownerID
      }).catch((error) => {
        this.error = error
      })
    }
  },
}
</script>

<style lang="scss" scoped="true">
  .client__title {
    display: flex;
    align-items: center;
  }

  .client__heading {
    margin-bottom: $marginSmall;
  }

  .list-group {
    margin-bottom: $marginDefault;
  }
</style>
