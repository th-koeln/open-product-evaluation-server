<template>
  <div class="register register--is-centered">
    <b-form class="register__content"
            @submit.prevent="register">
      <b-card>
        <h1 class="register__title">
          Create a new account
        </h1>
        <alert :data="error" />

        <b-form-group label="Firstname"
                      label-for="input_firstname">
          <b-form-input id="input_firstname"
                        v-model.trim="$v.firstname.$model"
                        :state="state($v.firstname.$dirty, $v.firstname.$error)" />
          <b-form-invalid-feedback v-if="!$v.firstname.required">
            Firstname is required
          </b-form-invalid-feedback>

          <b-form-invalid-feedback v-if="!$v.firstname.alpha">
            Firstname only allows alphabet characters
          </b-form-invalid-feedback>
        </b-form-group>

        <b-form-group label="Lastname"
                      label-for="input_lastname">
          <b-form-input id="input_lastname"
                        v-model.trim="$v.lastname.$model"
                        :state="state($v.lastname.$dirty, $v.lastname.$error)" />

          <b-form-invalid-feedback v-if="!$v.lastname.required">
            Lastname is required
          </b-form-invalid-feedback>
          <b-form-invalid-feedback v-if="!$v.lastname.alpha">
            Lastname only allows alphabet characters
          </b-form-invalid-feedback>
        </b-form-group>

        <b-form-group label="Email"
                      label-for="input_email">
          <b-form-input id="input_email"
                        v-model.trim="$v.email.$model"
                        :state="state($v.email.$dirty, $v.email.$error)" />

          <b-form-invalid-feedback v-if="!$v.email.required">
            Email is required
          </b-form-invalid-feedback>
          <b-form-invalid-feedback v-if="!$v.email.email">
            Email needs to be valid
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

          <b-form-invalid-feedback v-if="!$v.password.minLength">
            Password needs to be atleast 4 characters long
          </b-form-invalid-feedback>
        </b-form-group>

        <b-form-group label="Repeat Password"
                      label-for="input_password_repeat">
          <b-form-input id="input_password_repeat"
                        v-model.trim="$v.password_repeat.$model"
                        type="password"
                        :state="state($v.password_repeat.$dirty, $v.password_repeat.$error)" />

          <b-form-invalid-feedback v-if="!$v.password_repeat.required">
            You need to repeat the password
          </b-form-invalid-feedback>

          <b-form-invalid-feedback v-if="!$v.password_repeat.sameAs">
            Your passwords don't match
          </b-form-invalid-feedback>
        </b-form-group>

        <b-row>
          <b-col sm="6">
            <router-link :to="{ path: '/' }"
                         class="btn btn-default">
              Back
            </router-link>
          </b-col>
          <b-col sm="6"
                 class="text-right">
            <b-button type="submit"
                      variant="primary">
              Register
            </b-button>
          </b-col>
        </b-row>
      </b-card>
    </b-form>
  </div>
</template>

<script>
import Alert from '@/components/misc/ErrorAlert.vue'
import validationState from '@/mixins/validation'
import {
  required,
  email,
  alpha,
  sameAs,
  minLength,
} from 'vuelidate/lib/validators'

export default {
  name: 'RegisterForm',
  components: {
    alert: Alert,
  },
  mixins: [validationState],
  data() {
    return {
      firstname: '',
      lastname: '',
      email: '',
      password: '',
      password_repeat: '',
      error: null,
    }
  },
  validations: {
    firstname: {
      required,
      alpha,
    },
    lastname: {
      required,
      alpha,
    },
    email: {
      required,
      email,
    },
    password: {
      required,
      minLength: minLength(4),
    },
    password_repeat: {
      required,
      sameAs: sameAs('password'),
    },
  },
  methods: {
    register(event) {

      this.$v.$touch()

      if (!this.$v.$invalid) {
        this.$store.dispatch('register', {
          firstname: this.firstname,
          lastname: this.lastname,
          email: this.email,
          password: this.password,
        }).then(() => {
          this.$router.push('/')
        }).catch((error) => {
          this.error = error
        })
      }
    },
  },
}
</script>

<style lang="scss" scoped="true">

  .register {
    display: flex;

    &.register--is-centered {
      align-items: center;
      justify-content: center;
      height: 100%;
    }

    .register__content {
      width: 100%;
      max-width: 400px;
      padding: 0 15px;
      margin: 0px auto;
    }

    .register__title {
      font-size: 22px;
      text-align: center;
    }
  }
</style>
