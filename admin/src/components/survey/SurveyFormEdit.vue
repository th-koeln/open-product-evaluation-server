<template>
  <b-form class="updateSurvey"
          @submit.prevent="updateSurvey">
    <alert :data="error" />

    <b-alert v-if="survey.isActive"
             show
             variant="warning">
      You can only edit private surveys.
    </b-alert>

    <b-form-row>
      <b-col sm="8">
        <b-form-group label="Title"
                      label-for="input_title">
          <b-input id="input_title"
                   v-model="form.title"
                   :disabled="survey.isActive"
                   @change="updateSurvey" />
        </b-form-group>
      </b-col>
      <b-col sm="4">
        <b-form-group label="Visiblity"
                      label-for="input_visiblity">
          <b-form-select id="input_visiblity"
                         v-model="form.isActive"
                         @change.native="updateisActive">
            <option :value="true">
              Public
            </option>
            <option :value="false">
              Private
            </option>
          </b-form-select>
        </b-form-group>
      </b-col>
    </b-form-row>

    <!-- default textarea for now https://github.com/bootstrap-vue/bootstrap-vue/issues/1708 -->
    <b-form-group label="Description"
                  label-for="input_description">
      <textarea id="input_description"
                v-model="form.description"
                class="form-control"
                rows="3"
                :disabled="survey.isActive"
                @change="updateSurvey" />
    </b-form-group>
  </b-form>
</template>

<script>
import Alert from '@/components/misc/ErrorAlert.vue'

export default {
  name: 'SurveyEdit',
  components: {
    alert: Alert,
  },
  data() {
    return {
      error: null,
    }
  },
  computed: {
    form() {
      return JSON.parse(JSON.stringify(this.$store.getters.getSurvey))
    },
    survey() {
      return JSON.parse(JSON.stringify(this.$store.getters.getSurvey))
    },
  },
  created() {
    this.$store.dispatch('getSurvey', {
      surveyID: this.$route.params.id,
    }).catch((error) => {
      console.log()
      this.error = error
    })
  },
  methods: {
    updateSurvey() {
      this.$store.dispatch('updateSurvey', {
        id: this.$route.params.id,
        ...this.form,
      }).catch((error) => {
        this.error = error
      })
    },
    updateisActive(value) {
      this.$store.dispatch('changeSurveyisActive', {
        id: this.$route.params.id,
        isActive: (value.target.value === 'true'),
      }).catch((error) => {
        this.error = error
      })
    },
  },
}
</script>

<style scoped="true" lang="scss">

  .updateSurvey { padding: 1.25rem; }

</style>
