<template>
  <b-card header="Create Domain"
          class="form">
    <alert :data="error" />

    <b-form @submit.prevent="createDomain">
      <b-form-group label="Name"
                    label-for="input_name">
        <b-input id="input_name"
                 v-model="domain.name" />
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

export default {
  name: 'DomainNew',
  components: {
    alert: Alert,
  },
  data() {
    return {
      domain: {},
      error: null,
    }
  },
  methods: {
    createDomain(event) {
      event.preventDefault()
      this.$store.dispatch('createDomain', this.domain)
        .then((data) => {
          this.$router.push('/domain')
        }).catch((error) => {
          this.error = error
        })
    },
  },
}
</script>
