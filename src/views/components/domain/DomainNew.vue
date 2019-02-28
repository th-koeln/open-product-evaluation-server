<template>
  <b-card header="Create Domain"
          class="form">
    <alert :data="error" />

    <b-form @submit.prevent="createDomain">
      <b-form-group label="Name"
                    label-for="input_name">
        <b-input id="input_name"
                 v-model.trim="$v.domain.name.$model"
                 :state="state($v.domain.name.$dirty, $v.domain.name.$error)" />
        <b-form-invalid-feedback v-if="!$v.domain.name.required">
          Name is required
        </b-form-invalid-feedback>
      </b-form-group>

      <b-btn type="submit"
             variant="primary">
        Save
      </b-btn>
    </b-form>
  </b-card>
</template>

<script>
import Alert from '@/components/misc/ErrorAlert.vue'
import validationState from '@/mixins/validation'
import { required } from 'vuelidate/lib/validators'

export default {
  name: 'DomainNew',
  components: {
    alert: Alert,
  },
  mixins: [validationState],
  data() {
    return {
      domain: {
        name: ''
      },
      error: null,
    }
  },
  validations: {
    domain: {
      name: {
        required,
      },
    }
  },
  methods: {
    createDomain(event) {
      event.preventDefault()
      this.$v.$touch()

      if (!this.$v.$invalid) {
        this.$store.dispatch('createDomain', this.domain)
          .then((data) => {
            this.$router.push('/domain')
          }).catch((error) => {
            this.error = error
          })
      }
    },
  },
}
</script>
