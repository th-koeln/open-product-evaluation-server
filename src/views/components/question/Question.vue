<template>
  <div class="question"
       :class="{ 'question--is-selected': selected }">
    <h6>Question</h6>

    <b-form-row>
      <!-- question title -->
      <b-col sm="8">
        <b-form-group label="Question"
                      :label-for="`input_value_${id}`"
                      :label-sr-only="true">
          <b-input-group>
            <b-input :id="`'input_value_${id}`"
                     v-model="question.value"
                     :disabled="survey.isActive" 
                     @change="updateQuestion" />
          </b-input-group>
        </b-form-group>
      </b-col>

      <!-- question type -->
      <b-col sm="4">
        <b-form-group label="Type"
                      :label-for="`input_type_${id}`"
                      :label-sr-only="true">
          <b-dropdown :id="`input_type_${id}`"
                      :text="getCapitalizedType(question.type)"
                      class="question__type"
                      :disabled="survey.isActive">
            <b-dropdown-item @click="changeType($event, 'LIKE')">
              Like
            </b-dropdown-item>
            <b-dropdown-item @click="changeType($event, 'LIKEDISLIKE')">
              Like and Dislike
            </b-dropdown-item>
            <b-dropdown-item @click="changeType($event, 'CHOICE')">
              Choice
            </b-dropdown-item>
            <b-dropdown-item @click="changeType($event, 'REGULATOR')">
              Regulator
            </b-dropdown-item>
            <b-dropdown-item @click="changeType($event, 'FAVORITE')">
              Favorite
            </b-dropdown-item>
            <b-dropdown-item @click="changeType($event, 'RANKING')">
              Ranking
            </b-dropdown-item>
          </b-dropdown>
        </b-form-group>
      </b-col>
    </b-form-row>

    <!-- question data based on type -->
    <div class="question__options clearfix">
      <like v-if="question.type === 'LIKE'"
            :question="question" />

      <likedislike v-if="question.type === 'LIKEDISLIKE'"
                   :question="question" />

      <choice v-if="question.type === 'CHOICE'"
              :question="question" />

      <ranking v-if="question.type === 'RANKING'"
               :question="question" />

      <favorite v-if="question.type === 'FAVORITE'"
                :question="question" />

      <regulator v-if="question.type === 'REGULATOR'"
                 :question="question" />
    </div>
  </div>
</template>

<script>
import Choice from '@/components/question/types/ChoiceQuestion.vue'
import Ranking from '@/components/question/types/RankingQuestion.vue'
import Favorite from '@/components/question/types/FavoriteQuestion.vue'
import Regulator from '@/components/question/types/RegulatorQuestion.vue'
import Like from '@/components/question/types/LikeQuestion.vue'
import LikeDislike from '@/components/question/types/LikeDislikeQuestion.vue'

export default {
  name: 'QuestionItem',
  components: {
    choice: Choice,
    ranking: Ranking,
    favorite: Favorite,
    regulator: Regulator,
    like: Like,
    likedislike: LikeDislike,
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
    getCapitalizedType(type) {
      if (type === null || type === undefined || type === '') {
        return 'Unkown'
      }
      return this.capitalize(type)
    },
    capitalize(string) {
      return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase()
    },
    changeType(event, type) {
      this.$store.dispatch('changeQuestionType', {
        question: {
          ...this.question,
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

    &.question--is-selected {
      border-left: 3px solid $primaryColor;
      margin-left: -1px;
      cursor: auto;
    }

    &:not(.question--is-selected) {
      .question__options { display: none; }
    }

    .question__type {
      display: block;

      /deep/ .btn {
        display: flex;
        width: 100%;

        &:after { margin: auto 0 auto auto !important; }

        +.dropdown-menu { width: 100%; }
      }
    }
  }

  @media print {
    .question {
      page-break-before: always;
      
      &.question--is-selected {
        border-left: 0;
      }
      &:not(.question--is-selected) {
        .question__options {
          display: block !important; 
          width: 100%;
        }
      }
    }
  }

</style>
