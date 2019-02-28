<template>
  <b-card header="Edit Client"
          class="form">
    <alert :data="error" />

    <b-form @submit.prevent="updateClient">
      <b-form-group label="Name"
                    label-for="input_name">
        <b-input id="input_name"
                 v-model.trim="$v.client.name.$model"
                 :state="state($v.client.name.$dirty, $v.client.name.$error)" />
        <b-form-invalid-feedback v-if="!$v.client.name.required">
          Client name is required
        </b-form-invalid-feedback>
        <b-form-invalid-feedback v-if="!$v.client.name.alpha">
          Client name only allows alphabet characters
        </b-form-invalid-feedback>
      </b-form-group>

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
      client: {
        name: '',
      }
    }
  },
  validations: {
    client: {
      name: {
        required,
        alpha,
      },
    }
  },
  created() {
    this.$store.dispatch('getClient', {
      id: this.$route.params.id,
    }).then((data) => {
      this.client = Object.assign({}, data.data.client)
    }).catch((error) => {
      this.error = error
    })
  },
  methods: {
    updateClient(event) {
      this.$v.$touch()

      if (!this.$v.$invalid) {
        this.$store.dispatch('updateClient', this.client)
          .then(() => {
            this.$router.push('/clients')
          })
          .catch((error) => {
            this.error = error
          })
      }
    },
  },
}
</script>
