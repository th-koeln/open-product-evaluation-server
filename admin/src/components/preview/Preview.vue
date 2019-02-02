<template>
  <div class="preview">
    <div class="container">
      <b-card>

        <alert :data="error"></alert>

        <b-alert variant="warning"
                 show
                 dismissible>
          <p>
            <strong>This preview is only an example</strong>
          </p>
          <hr />
          The final look of your survey depends on the selected client.
          Also, you can not vote in this preview.
        </b-alert>

        <h3>{{ survey.title }}</h3>

        <p class="description">
          {{ survey.description }}
        </p>

        <div class="question" v-if="survey.questions
                                    && survey.questions.length
                                    && survey.questions.length > 0">

          <!-- display question title and description -->
          <questionmeta :id="survey.questions[index].id"></questionmeta>

          <!-- display question items -->
          <items :id="survey.questions[index].id"
                 v-if="displayItems(survey.questions[index].type)">
          </items>

          <!-- display choices -->
          <choice :id="survey.questions[index].id"
                  v-if="survey.questions[index].type === 'CHOICE'">
          </choice>

          <!-- display like / dislike options -->
          <likedislike :id="survey.questions[index].id"
                       v-if="survey.questions[index].type === 'LIKEDISLIKE'">
          </likedislike>

          <!-- display like option -->
          <like :id="survey.questions[index].id"
                v-if="survey.questions[index].type === 'LIKE'">
          </like>

          <!-- display regulator option -->
          <regulator :id="survey.questions[index].id"
                     v-if="survey.questions[index].type === 'REGULATOR'">
          </regulator>

          <!-- display special ranking options -->
          <ranking :id="survey.questions[index].id"
                   v-if="survey.questions[index].type === 'RANKING'">
          </ranking>

          <!-- display special favorite options -->
          <favorite :id="survey.questions[index].id"
                    v-if="survey.questions[index].type === 'FAVORITE'">
          </favorite>
        </div>

        <b-row v-if="survey.questions
                     && survey.questions.length
                     && survey.questions.length > 0">
          <b-col cols="4">
            <b-btn variant="primary"
                   @click="previous"
                   v-if="index !== 0">
              Previous
            </b-btn>
          </b-col>
          <b-col class="text-center">
            <b-btn variant="secondary"
                   @click="index = 0"
                   v-if="index > 0">
              Start
            </b-btn>
          </b-col>
          <b-col cols="4" class="text-right">
            <b-btn variant="primary"
                   @click="next"
                   v-if="index !== survey.questions.length - 1">
              Next
            </b-btn>
          </b-col>
        </b-row>
      </b-card>
    </div>
  </div>
</template>

<script>
import ChoicePreview from '@/components/preview/ChoicePreview.vue'
import FavoritePreview from '@/components/preview/FavoritePreview.vue'
import LikeDislikePreview from '@/components/preview/LikeDislikePreview.vue'
import LikePreview from '@/components/preview/LikePreview.vue'
import RankingPreview from '@/components/preview/RankingPreview.vue'
import RegulatorPreview from '@/components/preview/RegulatorPreview.vue'
import QuestionPreview from '@/components/preview/QuestionPreview.vue'
import ItemPreview from '@/components/preview/ItemPreview.vue'
import Alert from '@/components/misc/ErrorAlert.vue'

export default {
  name: 'Preview',
  components: {
    choice: ChoicePreview,
    favorite: FavoritePreview,
    likedislike: LikeDislikePreview,
    like: LikePreview,
    ranking: RankingPreview,
    regulator: RegulatorPreview,
    questionmeta: QuestionPreview,
    items: ItemPreview,
    alert: Alert,
  },
  created() {
    this.$store.dispatch('getSurvey', {
      surveyID: this.$route.params.id,
    }).catch((error) => {
      this.error = error
    })
  },
  data() {
    return {
      index: 0,
      error: null,
    }
  },
  computed: {
    survey() {
      return JSON.parse(JSON.stringify(this.$store.getters.getSurvey))
    },
  },
  methods: {
    displayItems(type) {
      return !(type === 'RANKING' || type === 'FAVORITE')
    },
    next() {
      if (this.index < this.survey.questions.length - 1) {
        this.index += 1
      }
    },
    previous() {
      if (this.index > 0) {
        this.index -= 1
      }
    },
  },
}
</script>

<style scoped="true" lang="scss">
  .preview { padding: 3rem 0; }
  .preview .container { max-width: 700px; }
  .preview .question { margin-bottom: 4rem; }
  .preview .description { margin-bottom: 3rem; color: rgba(0, 0, 0, 0.5); }
</style>
