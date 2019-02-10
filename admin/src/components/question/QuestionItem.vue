<template>
  <div class="question"
       :class="{ selected: selected }">
    <h6>Question</h6>
    <b-form-row>
      <b-col sm="8">
        <b-form-group label="Question"
                      :label-for="'input_value_' + question.id"
                      :label-sr-only="true">
          <b-input-group>
            <b-input :id="'input_value_' + question.id"
                     v-model="question.value"
                     :disabled="survey.isPublic" 
                     @change="updateQuestion" />
          </b-input-group>
        </b-form-group>
      </b-col>
      <b-col sm="4">
        <b-form-group label="Type"
                      :label-for="'input_type_' + question.id"
                      :label-sr-only="true">
          <b-dropdown :id="'input_type_' + question.id"
                      :text="getQuestionType(question.type)"
                      class="type_dropdown"
                      :disabled="survey.isPublic">
            <b-dropdown-item @click="changeQuestionType($event, question, 'LIKE')">
              Like
            </b-dropdown-item>
            <b-dropdown-item @click="changeQuestionType($event, question, 'LIKEDISLIKE')">
              Like and Dislike
            </b-dropdown-item>
            <b-dropdown-item @click="changeQuestionType($event, question, 'CHOICE')">
              Choice
            </b-dropdown-item>
            <b-dropdown-item @click="changeQuestionType($event, question, 'REGULATOR')">
              Regulator
            </b-dropdown-item>
            <b-dropdown-item @click="changeQuestionType($event, question, 'FAVORITE')">
              Favorite
            </b-dropdown-item>
            <b-dropdown-item @click="changeQuestionType($event, question, 'RANKING')">
              Ranking
            </b-dropdown-item>
          </b-dropdown>
        </b-form-group>
      </b-col>
    </b-form-row>

    <div class="options clearfix">
      <like-options v-if="question.type === 'LIKE'"
                    :id="question.id" />

      <like-dislike-options v-if="question.type === 'LIKEDISLIKE'"
                            :id="question.id" />

      <choice-options v-if="question.type === 'CHOICE'"
                      :id="question.id" />

      <ranking-options v-if="question.type === 'RANKING'"
                       :id="question.id" />

      <favorite-options v-if="question.type === 'FAVORITE'"
                        :id="question.id" />

      <regulator-options v-if="question.type === 'REGULATOR'"
                         :id="question.id" />
    </div>
  </div>
</template>

<script>
import ChoiceOptions from '@/components/question/ChoiceOptions.vue'
import RankingOptions from '@/components/question/RankingOptions.vue'
import FavoriteOptions from '@/components/question/FavoriteOptions.vue'
import RegulatorOptions from '@/components/question/RegulatorOptions.vue'
import LikeOptions from '@/components/question/LikeOptions.vue'
import LikeDislikeOptions from '@/components/question/LikeDislikeOptions.vue'

export default {
  name: 'QuestionItem',
  components: {
    'choice-options': ChoiceOptions,
    'ranking-options': RankingOptions,
    'favorite-options': FavoriteOptions,
    'regulator-options': RegulatorOptions,
    'like-options': LikeOptions,
    'like-dislike-options': LikeDislikeOptions,
  },
  props: {
    id: {
      type: String,
      required: true,
    },
    selected: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    question() {
      return JSON.parse(JSON.stringify(this.$store.getters.getQuestion(this.id)))
    },
    survey() {
      return JSON.parse(JSON.stringify(this.$store.getters.getSurvey))
    },
  },
  methods: {
    updateQuestion() {
      this.$store.dispatch('updateQuestion', {
        question: this.question,
      })
    },
    getQuestionType(type) {
      if (type === 'LIKE') {
        return 'Like'
      }

      if (type === 'LIKEDISLIKE') {
        return 'Like and Dislike'
      }

      if (type === 'CHOICE') {
        return 'Choice'
      }

      if (type === 'RANKING') {
        return 'Ranking'
      }

      if (type === 'FAVORITE') {
        return 'Favorite'
      }

      if (type === 'REGULATOR') {
        return 'Regulator'
      }

      return 'Unkown'
    },
    capitalize(string) {
      return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase()
    },
    changeQuestionType(event, question, type) {
      this.$store.dispatch('changeQuestionType', {
        question: {
          ...question,
          type,
        },
      })
    },
  },
}
</script>

<style scoped="true" lang="scss">

  .question {
    padding: 1.25rem;
    cursor: pointer;
    border-bottom: 1px solid #dfdfdf;
    border-left: 3px solid #FFF;

    &.selected {
      border-left: 3px solid $primaryColor;
      margin-left: -1px;
      cursor: auto;
    }

    &:not(.selected) {
      .description  { display: none; }
      .actions { display: none; }
      .options { display: none; }
    }

    .type_dropdown {
      display: block;

      /deep/ .btn {
        display: flex;
        width: 100%;

        &:after { margin: auto 0 auto auto !important; }

        +.dropdown-menu { width: 100%; }
      }
    }
  }

</style>
