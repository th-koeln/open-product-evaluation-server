<template>
  <b-card header="Edit User"
          class="form">
    <alert :data="error" />

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
                 v-model.trim="$v.user.email.$model"
                 :state="state($v.user.email.$dirty, $v.user.email.$error)"
                 type="email" />
        <b-form-invalid-feedback v-if="!$v.user.email.email">
          Email needs to be valid
        </b-form-invalid-feedback>
      </b-form-group>

      <b-form-group label="Role"
                    label-for="input_role">
        <b-form-select v-model="user.isAdmin"
                       :options="options" />
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
import validationState from '@/mixins/validation'
import { email } from 'vuelidate/lib/validators'

export default {
  name: 'UserEdit',
  components: {
    alert: Alert,
  },
  mixins: [validationState],
  data() {
    return {
      error: null,
      user: {
        email: '',
      },
      options: [
        {
          value: false,
          text: 'User'
        },
        {
          value: true,
          text: 'Administrator'
        }
      ]
    }
  },
  validations: {
    user: {
      email: {
        email,
      },
    }
  },
  created() {
    this.$store.dispatch('getUser', {
      id: this.$route.params.id,
    }).then((data) => {
      this.user = Object.assign({}, data.data.user)
    }).catch((error) => {
      this.error = error
    })
  },
  methods: {
    hasUser(user) {
      return Object.keys(user).length
    },
    updateUser(event) {
      this.$v.$touch()

      if (!this.$v.$invalid) {
        this.$store.dispatch('updateUser', this.user)
          .then(() => {
            this.$router.push('/user')
          }).catch((error) => {
            this.error = error
          })
      }
    },
  },
}
</script>
