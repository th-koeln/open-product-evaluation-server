<template>
  <b-card header="Update Profile">

    <alert :data="error"></alert>

    <b-form @submit.prevent="updateProfile">

      <b-form-group label="Firstname"
                    label-for="input_firstname">
        <b-input id="input_firstname"
                 v-model="user.firstName">
        </b-input>
      </b-form-group>

      <b-form-group label="Lastname"
                    label-for="input_lastname">
        <b-input id="input_lastname"
                 v-model="user.lastName">
        </b-input>
      </b-form-group>

      <b-form-group label="E-Mail"
                    label-for="input_email">
        <b-input type="email"
                 id="input_email"
                 v-model="user.email">
        </b-input>
      </b-form-group>

      <b-form-group label="Password"
                    label-for="input_password">
        <b-input type="password"
                 id="input_password"
                 v-model="user.password">
        </b-input>
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
  name: 'ProfileForm',
  data() {
    return {
      error: null,
    }
  },
  components: {
    alert: Alert,
  },
  created() {
    this.$store.dispatch('getCurrentUser', {
      id: this.$store.getters.getCurrentUser.user.id,
    }).catch((error) => {
      this.error = error
    })
  },
  computed: {
    user() {
      return JSON.parse(JSON.stringify(this.$store.getters.getUser))
    },
  },
  methods: {
    updateProfile() {
      this.$store.dispatch('updateProfile', this.user)
        .catch((error) => {
          this.error = error
        })
    },
  },
}
</script>
