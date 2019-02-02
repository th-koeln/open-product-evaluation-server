<template>
  <b-card header="Edit User">
    <alert :data="error" />>

    <b-alert v-if="!hasUser(user)"
             show
             variant="danger">
      This user doesn't exist.
    </b-alert>

    <b-form v-if="hasUser(user)"
            @submit.prevent="updateUser">
      <b-form-group label="Firstname"
                    label-for="input_firstname">
        <b-input id="input_firstname"
                 v-model="user.firstName"
                 :disabled="true" />
      </b-form-group>

      <b-form-group label="Lastname"
                    label-for="input_lastname">
        <b-input id="input_lastname"
                 v-model="user.lastName"
                 :disabled="true" />
      </b-form-group>

      <b-form-group label="E-Mail"
                    label-for="input_email">
        <b-input id="input_email"
                 v-model="user.email" />
      </b-form-group>

      <b-btn type="submit"
             variant="primary">
        Update
      </b-btn>
    </b-form>
  </b-card>
</template>

<script>
import Alert from '@/components/misc/ErrorAlert.vue'

export default {
  name: 'UserEdit',
  components: {
    alert: Alert,
  },
  data() {
    return {
      error: null,
    }
  },
  computed: {
    user() {
      return JSON.parse(JSON.stringify(this.$store.getters.getUser))
    },
  },
  created() {
    this.$store.dispatch('getUser', {
      id: this.$route.params.id,
    }).catch((error) => {
      this.error = error
    })
  },
  methods: {
    hasUser(user) {
      return Object.keys(user).length
    },
    updateUser(event) {
      event.preventDefault()
      this.$store.dispatch('updateUser', this.user)
        .then(() => {
          this.$router.push('/user')
        }).catch((error) => {
          this.error = error
        })
    },
  },
}
</script>
