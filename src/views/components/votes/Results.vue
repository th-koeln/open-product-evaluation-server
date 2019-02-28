<template>
  <div class="results">
    <b-row v-if="votes && votes.length > 0"
           class="mb-4">
      <b-col cols="12">
        <b-button-group>
          <b-button variant="primary"
                    @click="previous">
            <font-awesome-icon icon="arrow-left" />
          </b-button>
          <b-button variant="primary"
                    @click="next">
            <font-awesome-icon icon="arrow-right" />
          </b-button>
        </b-button-group>

        <b-input v-model="page"
                 class="results__page" />
        <em>of {{ votes.length }} results</em>
      </b-col>
    </b-row>

    <empty :show="!votes || votes && votes.length === 0"
           :card="false"
           icon="reply"
           headline="There are no answers"
           description="You need to collect answers to see some results" />


    <b-list-group v-if="votes && votes.length > 0">
      <b-list-group-item v-for="answer in votes[currentVote].answers"
                         :key="answer.question">
        <div v-if="answer.__typename === 'ChoiceAnswer'"
             class="choiceanswer">
          <strong>{{ getQuestion(answer.question).value }}</strong>
          <br>

          <span v-if="getQuestion(answer.question).items">
            Number of Items: {{ getQuestion(answer.question).items.length }}
            <br>
          </span>

          <span v-if="answer.choice !== null">
            Selected Choice: {{ getChoice(answer.question, answer.choice).label }}
          </span>

          <span v-if="answer.choice === null">
            Selected Choice: none
          </span>
        </div>

        <div v-if="answer.__typename === 'LikeAnswer'"
             class="likeanswer">
          <strong>{{ getQuestion(answer.question).value }}</strong>
          <br>

          <span v-if="getQuestion(answer.question).items">
            Number of Items: {{ getQuestion(answer.question).items.length }}
            <br>
          </span>

          <span v-if="answer.liked !== null">
            Selected Answer: Like
          </span>
          <span v-if="answer.liked === null">
            Selected Answer: none
          </span>
        </div>

        <div v-if="answer.__typename === 'LikeDislikeAnswer'"
             class="likedislikeanswer">
          <strong>{{ getQuestion(answer.question).value }}</strong>
          <br>

          <span v-if="getQuestion(answer.question).items">
            Number of Items: {{ getQuestion(answer.question).items.length }}
            <br>
          </span>

          <span v-if="answer.liked !== null && answer.liked === true">
            Selected Answer: Like
          </span>

          <span v-if="answer.liked !== null && answer.liked === false">
            Selected Answer: Dislike
          </span>

          <span v-if="answer.liked === null">
            Selected Answer: none
          </span>
        </div>

        <div v-if="answer.__typename === 'RegulatorAnswer'"
             class="regulatoranswer">
          <strong>{{ getQuestion(answer.question).value }}</strong>
          <br>

          <span v-if="getQuestion(answer.question).items">
            Number of Items: {{ getQuestion(answer.question).items.length }}
            <br>
          </span>

          <span v-if="answer.rating !== null">
            Selected Answer: {{ answer.rating }}
          </span>
          <span v-if="answer.rating === null">
            Selected Answer: none
          </span>
        </div>

        <div v-if="answer.__typename === 'RankingAnswer' && answer.rankedItems !== null"
             class="rankinganswer">
          <strong>{{ getQuestion(answer.question).value }}</strong>
          <br>

          <p>
            Selected Ranking:
          </p>

          <ol v-if="answer.rankedItems !== null">
            <li v-for="item in answer.rankedItems"
                :key="item"
                @click="showRankedPreview($event, item)">
              <a href="#">
                {{ getItem(answer.question, item).label }}
              </a>
            </li>
          </ol>

          <span v-if="answer.rankedItems === null">
            Selected Answer: none
          </span>

          <div v-for="item in answer.rankedItems"
               :key="item">
            <div :id="'preview' + answer.question"
                 class="preview"
                 :class="{ 'preview--is-visible' : showRankedItems.find(i => i === item)}">
              <b-btn variant="primary"
                     class="preview__close"
                     @click="closeRankedPreview($event, item)">
                <font-awesome-icon icon="times" />
              </b-btn>

              <div class="preview__image"
                   :style=" { 'background-image': 'url(' + getImage(answer.question, item) + ')' }" />
            </div>
          </div>
        </div>

        <div v-if="answer.__typename === 'FavoriteAnswer'"
             class="favoriteanswer">
          <b-btn v-if="answer.favoriteItem !== null"
                 variant="primary"
                 size="sm"
                 class="preview-btn float-right"
                 @click="showPreview($event, answer.question)">
            <font-awesome-icon icon="image" />
          </b-btn>


          <div v-if="answer.favoriteItem !== null"
               :id="'preview' + answer.question"
               class="preview"
               :class="{ 'preview--is-visible' : show.find(item => item === answer.question)}">
            <b-btn variant="primary"
                   class="preview__close"
                   @click="closePreview($event, answer.question)">
              <font-awesome-icon icon="times" />
            </b-btn>

            <div class="preview__image"
                 :style="{ 'background-image': 'url(' + getImage(answer.question, answer.favoriteItem) + ')' }" />
          </div>

          <strong>{{ getQuestion(answer.question).value }}</strong>
          <br>

          <span v-if="getQuestion(answer.question).items">
            Number of Items: {{ getQuestion(answer.question).items.length }}
            <br>
          </span>

          <span v-if="answer.favoriteItem !== null">
            Selected Favorite: {{ getItem(answer.question, answer.favoriteItem).label }}
          </span>

          <span v-if="answer.favoriteItem === null">
            Selected Favorite: none
          </span>
        </div>
      </b-list-group-item>
    </b-list-group>
  </div>
</template>

<script>
import EmptyState from '@/components/misc/EmptyState.vue'

export default {
  name: 'Results',
  components: {
    empty: EmptyState,
  },
  props: {
    versionNumber: {
      type: Number,
      required: true,
      default: 0,
    }
  },
  data() {
    return {
      page: 1,
      currentVote: 0,
      show: [],
      showRankedItems: [],
    }
  },
  computed: {
    votes() {
      const data = this.$store.getters.getVotes
      if (data && data.versions && data.versions.length > 0) {
        const version = data.versions.find((version) => {
          return version.versionNumber === this.versionNumber
        })
        if (version.votes) {
          return version.votes
        }
      }
      return null
    },
  },
  watch: {
    page(value) {
      if (value >= 1 && value <= this.votes.length) {
        this.page = value
        this.currentVote = value - 1
      } else if (value > this.votes.length + 1) {
        this.currentVote = this.votes.length - 1
      } else if (value < 1) {
        this.currentVote = 0
      }
    },
  },
  methods: {
    getQuestion(questionID) {
      return this.$store.getters.getQuestion(questionID)
    },
    getItem(questionID, itemID) {
      const question = this.$store.getters.getQuestion(questionID)

      if (question.items) {
        return question.items.find(i => i.id === itemID)
      }

      return {}
    },
    getChoice(questionID, choiceID) {
      const question = this.$store.getters.getQuestion(questionID)

      if (question.choices) {
        return question.choices.find(i => i.id === choiceID)
      }

      return {}
    },
    showRankedPreview(event, item) {
      event.preventDefault()
      this.showRankedItems.push(item)
    },
    closeRankedPreview(event, item) {
      event.preventDefault()
      this.showRankedItems = this.showRankedItems.filter(i => i !== item)
    },
    closePreview(event, questionID) {
      event.preventDefault()
      this.show = this.show.filter(item => item !== questionID)
    },
    showPreview(event, questionID) {
      event.preventDefault()
      this.show.push(questionID)
    },
    next() {
      if (this.page !== this.votes.length) {
        this.currentVote += 1
        this.page += 1
      }

      if (this.page > this.votes.length) {
        this.page = this.votes.length
        this.currentVote = (this.votes.length - 1)
      }

      this.show = []
      this.showRankedItems = []
    },
    previous() {
      if (this.page > 1 && this.page <= this.votes.length + 1) {
        this.currentVote -= 1
        this.page -= 1
      }

      if (this.page <= 1) {
        this.page = 1
        this.currentVote = 0
      }

      this.show = []
      this.showRankedItems = []
    },
    getImage(question, item) {
      const i = this.getItem(question, item)
      
      if(i.image && i.image.url) {
        return i.image.url
      }
      return ''
    }
  },
}
</script>

<style lang="scss" scoped="true">

  .results {
    .btn-group {
      vertical-align: baseline;
    }

    .results__page {
      display: inline-block;
      margin: 0 1em;
      width: 4rem;
    }
  } 

  .preview {
    background-color: rgba(0, 0, 0, 0.3);
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    padding: 5%;
    z-index: 99999;
    display: none;

    &.preview--is-visible { display: block; }

    .preview__image {
      height: 100%;
      background-size: cover;
      background-position: center center;
      border-radius: .25rem;
    }

    .preview__close { position: absolute; right: 5%; }
  }
</style>

