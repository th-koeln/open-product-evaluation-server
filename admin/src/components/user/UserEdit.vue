<template>
  <b-card header="Edit User">

    <alert :data="error"></alert>

    <b-alert show
             v-if="!hasUser(user)"
             variant="danger">
      This user doesn't exist.
    </b-alert>

    <b-form @submit.prevent="updateUser"
            v-if="hasUser(user)">

      <b-form-group label="Firstname"
                    label-for="input_firstname">
        <b-input id="input_firstname"
                 v-model="user.firstName"
                 :disabled="true"></b-input>
      </b-form-group>

      <b-form-group label="Lastname"
                    label-for="input_lastname">
        <b-input id="input_lastname"
                 v-model="user.lastName"
                 :disabled="true"></b-input>
      </b-form-group>

      <b-form-group label="E-Mail"
                    label-for="input_email">
        <b-input id="input_email"
                 v-model="user.email"></b-input>
      </b-form-group>

      <b-btn type="submit"
             variant="primary">Update</b-btn>
    </b-form>
  </b-card>
</template>

<script>
import Alert from '@/components/misc/ErrorAlert.vue'

export default {
  name: 'UserEdit',
  data() {
    return {
      error: null,
    }
  },
  created() {
    this.$store.dispatch('getUser', {
      id: this.$route.params.id,
    }).catch((error) => {
      this.error = error
    })
  },
  components: {
    alert: Alert,
  },
  computed: {
    user() {
      return JSON.parse(JSON.stringify(this.$store.getters.getUser))
    },
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
