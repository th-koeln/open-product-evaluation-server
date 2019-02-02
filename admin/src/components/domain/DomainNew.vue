<template>
  <b-card header="Create Domain">

    <alert :data="error"></alert>

    <b-form @submit.prevent="createDomain">

      <b-form-group label="Name" label-for="input_name">
        <b-input id="input_name" v-model="domain.name"></b-input>
      </b-form-group>

      <b-btn type="submit" variant="primary">Save</b-btn>

    </b-form>
  </b-card>
</template>

<script>
import Alert from '@/components/misc/ErrorAlert.vue'

export default {
  name: 'DomainNew',
  data() {
    return {
      domain: {},
      error: null,
    }
  },
  components: {
    alert: Alert,
  },
  methods: {
    createDomain(event) {
      event.preventDefault()
      this.$store.dispatch('createDomain', this.domain)
        .then((data) => {
          this.$router.push(`/domain/${data.data.createDomain.domain.id}`)
        }).catch((error) => {
          this.error = error
        })
    },
  },
}
</script>
