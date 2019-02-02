<template>
  <div class="center-container">
    <b-form @submit="login">
      <b-card footer-tag="footer">
        <h1 class="title">
          Open Product Evaluation
        </h1>

        <alert :data="error" />

        <b-form-group label="Email"
                      label-for="input_email">
          <b-form-input id="input_email"
                        v-model.trim="$v.email.$model"
                        :state="state($v.email.$dirty, $v.email.$error)" />

          <b-form-invalid-feedback v-if="!$v.email.required">
            Email is required
          </b-form-invalid-feedback>
        </b-form-group>

        <b-form-group label="Password"
                      label-for="input_password">
          <b-form-input id="input_password"
                        v-model.trim="$v.password.$model"
                        type="password"
                        :state="state($v.password.$dirty, $v.password.$error)" />

          <b-form-invalid-feedback v-if="!$v.password.required">
            Password is required
          </b-form-invalid-feedback>
        </b-form-group>

        <b-button type="submit"
                  variant="primary"
                  :block="true">
          Login
        </b-button>
        <div slot="footer"
             class="text-center">
          No Account?
          <router-link :to="{ path: 'register' }">
            Register!
          </router-link>
        </div>
      </b-card>
    </b-form>
  </div>
</template>

<script>
import Alert from '@/components/misc/ErrorAlert.vue'
import { required, alphaNum } from 'vuelidate/lib/validators'
import validationState from '@/mixins/validation'

export default {
  name: 'Login',
  components: {
    alert: Alert,
  },
  mixins: [validationState],
  data() {
    return {
      email: '',
      password: '',
      error: null,
    }
  },
  validations: {
    email: {
      required,
    },
    password: {
      required,
      alphaNum,
    },
  },
  methods: {
    login(event) {
      event.preventDefault()

      this.$v.$touch()

      if (!this.$v.$invalid) {
        this.$store.dispatch('login', {
          email: this.email,
          password: this.password,
        }).then(() => {
          this.$router.push('/survey')
        }).catch((error) => {
          this.error = error
        })
      }
    },
  },
}
</script>

<style scoped="scoped" lang="scss">
  .title { font-size: 22px; text-align: center; }
</style>
