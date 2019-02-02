<template>
  <b-form @submit.prevent="updateSurvey" class="updateSurvey">

    <alert :data="error"></alert>

    <b-alert show
             variant="warning"
             v-if="survey.isPublic">
      You can only edit private surveys.
    </b-alert>

    <b-form-row>
      <b-col sm="8">
        <b-form-group label="Title"
                      label-for="input_title">
          <b-input id="input_title"
                   :disabled="survey.isPublic"
                   @change="updateSurvey"
                   v-model="form.title">
          </b-input>
        </b-form-group>
      </b-col>
      <b-col sm="4">
        <b-form-group label="Visiblity"
                      label-for="input_visiblity">
          <b-form-select id="input_visiblity"
                         @change.native="updateIsPublic"
                         v-model="form.isPublic">

            <option :value="true">Public</option>
            <option :value="false">Private</option>

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
                @change="updateSurvey"
                :disabled="survey.isPublic"></textarea>
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
    updateIsPublic(value) {
      this.$store.dispatch('changeSurveyIsPublic', {
        id: this.$route.params.id,
        isPublic: (value.target.value === 'true'),
      }).catch((error) => {
        this.error = error
      })
    },
  },
  computed: {
    form() {
      return JSON.parse(JSON.stringify(this.$store.getters.getSurvey))
    },
    survey() {
      return JSON.parse(JSON.stringify(this.$store.getters.getSurvey))
    },
  },
}
</script>

<style scoped="true" lang="scss">

  .updateSurvey { padding: 1.25rem; }

</style>
