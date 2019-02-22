<template>
  <b-card header="Edit Client"
          class="form">
    <alert :data="error" />

    <b-form @submit.prevent="updateClient">
      <b-form-group label="Name"
                    label-for="input_name">
        <b-input id="input_name"
                 v-model="client.name" />
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

export default {
  name: 'ClientEdit',
  components: {
    alert: Alert,
  },
  data() {
    return {
      error: null,
    }
  },
  computed: {
    client() {
      return JSON.parse(JSON.stringify(this.$store.getters.getClient))
    },
  },
  created() {
    this.$store.dispatch('getClient', {
      id: this.$route.params.id,
    }).catch((error) => {
      this.error = error
    })
  },
  methods: {
    updateClient(event) {
      event.preventDefault()
      this.$store.dispatch('updateClient', this.client)
        .then(() => {
          this.$router.push('/clients')
        })
        .catch((error) => {
          this.error = error
        })
    },
  },
}
</script>
