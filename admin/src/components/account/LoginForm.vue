<template>
  <div class="login login--is-centered">
    <b-form class="login__content"
            @submit="login">
      <b-card footer-tag="footer">
        <!-- form title -->
        <h1 class="login__title">
          Open Product Evaluation
        </h1>

        <!-- alert -->
        <alert :data="error" />

        <!-- email input -->
        <b-form-group label="Email"
                      label-for="input_email">
          <b-form-input id="input_email"
                        v-model.trim="$v.email.$model"
                        :state="state($v.email.$dirty, $v.email.$error)" />

          <b-form-invalid-feedback v-if="!$v.email.required">
            Email is required
          </b-form-invalid-feedback>
        </b-form-group>

        <!-- password input -->
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

        <!-- form submit -->
        <b-button id="login"
                  type="submit"
                  variant="primary"
                  :block="true">
          Login
        </b-button>

        <!-- Card Footer -->
        <div slot="footer"
             class="login__footer">
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
  .login {
    display: flex;

    &.login--is-centered {
      align-items: center;
      justify-content: center;
      height: 100%;
    }

    .login__content {
      width: 100%;
      max-width: 400px;
      padding: 0 15px;
      margin: 0px auto;
    }

    .login__title {
      font-size: 22px;
      text-align: center;
    }

    .login__footer {
      text-align: center;
    }
  }
</style>
