<template>
  <b-card header="Update Profile"
          class="form">
    <alert :data="error" />

    <successalert message="Profile update successful!"
                  :show="success" />

    <b-form @submit.prevent="updateProfile">
      <b-form-group label="Firstname"
                    label-for="input_firstname">
        <b-input id="input_firstname"
                 v-model.trim="$v.user.firstName.$model"
                 :state="state($v.user.firstName.$dirty, $v.user.firstName.$error)" />
        <b-form-invalid-feedback v-if="!$v.user.firstName.required">
          Firstname is required
        </b-form-invalid-feedback>
      </b-form-group>

      <b-form-group label="Lastname"
                    label-for="input_lastname">
        <b-input id="input_lastname"
                 v-model.trim="$v.user.lastName.$model"
                 :state="state($v.user.lastName.$dirty, $v.user.lastName.$error)" />
        
        <b-form-invalid-feedback v-if="!$v.user.lastName.required">
          Lastname is required
        </b-form-invalid-feedback>
        <b-form-invalid-feedback v-if="!$v.user.lastName.alpha">
          Lastname only allows alphabet characters
        </b-form-invalid-feedback>
      </b-form-group>

      <b-form-group label="E-Mail"
                    label-for="input_email">
        <b-input id="input_email" 
                 v-model.trim="$v.user.email.$model"
                 :state="state($v.user.email.$dirty, $v.user.email.$error)"
                 type="email" />
          
        <b-form-invalid-feedback v-if="!$v.user.email.required">
          Email is required
        </b-form-invalid-feedback>
        <b-form-invalid-feedback v-if="!$v.user.email.email">
          Email needs to be valid
        </b-form-invalid-feedback>
      </b-form-group>

      <b-form-group label="Password"
                    label-for="input_password">
        <b-input id="input_password"
                 v-model.trim="$v.user.password.$model"
                 type="password"
                 :state="state($v.user.password.$dirty, $v.user.password.$error)" />
      
        <b-form-invalid-feedback v-if="!$v.user.password.minLength">
          Password needs to be atleast 4 characters long
        </b-form-invalid-feedback>
      </b-form-group>

      <b-form-group label="Repeat Password"
                    label-for="input_password_repeat">
        <b-form-input id="input_password_repeat"
                      v-model.trim="$v.user.password_repeat.$model"
                      type="password"
                      :state="state($v.user.password_repeat.$dirty, $v.user.password_repeat.$error)" />

        <b-form-invalid-feedback v-if="!$v.user.password_repeat.sameAs">
          Your passwords don't match
        </b-form-invalid-feedback>
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
import SuccessAlert from '@/components/misc/SuccessAlert.vue'
import validationState from '@/mixins/validation'
import {
  required,
  email,
  alpha,
  minLength,
  sameAs
} from 'vuelidate/lib/validators'

export default {
  name: 'ProfileForm',
  components: {
    alert: Alert,
    successalert : SuccessAlert,
  },
  mixins: [validationState],
  data() {
    return {
      error: null,
      user: {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
      },
      success: false,
    }
  },
  validations: {
    user: {
      firstName: {
        required,
        alpha,
      },
      lastName: {
        required,
        alpha,
      },
      email: {
        required,
        email,
      },
      password: {
        minLength: minLength(4),
      },
      password_repeat: {
        sameAs: sameAs('password'),
      },
    }
  },
  created() {
    this.$store.dispatch('getCurrentUser', {
      id: this.$store.getters.getCurrentUser.user.id,
    }).then((data) => {
      const user = Object.assign({}, data.data.user)
      user.password = ''
      user.password_repeat = ''
      this.user = user
    }).catch((error) => {
      this.error = error
    })
  },
  methods: {
    updateProfile() {
      this.$v.$touch()

      if (!this.$v.$invalid) {
        this.$store.dispatch('updateProfile', this.user)
          .then( () => {
            this.success = true
          })
          .catch((error) => {
            this.error = error
          })
      }
    },
  },
}
</script>
