<template>
  <ol class="options">
    <li class="like">
      <input :id="`like-${question.id}`"
             type="radio"
             :class="{ 'show': !hasLikeIcon() }"
             :name="`likedislike-${question.id}`">
      <label :for="`like-${question.id}`"
             :class="{ 'icon' : hasLikeIcon(question) }"
             :style="likeIcon(question)">
        Like
      </label>
    </li>
    <li class="dislike">
      <input :id="`dislike-${question.id}`"
             type="radio"
             :class="{ 'show': !hasDislikeIcon() }"
             :name="`likedislike-${question.id}`">
      <label :class="{ 'icon' : hasDislikeIcon(question) }"
             :for="`dislike-${question.id}`"
             :style="dislikeIcon(question)">
        Dislike
      </label>
    </li>
  </ol>
</template>

<script>

export default {
  name: 'LikeDislikePreview',
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  computed: {
    question() {
      return JSON.parse(JSON.stringify(this.$store.getters.getQuestion(this.id)))
    },
  },
  methods: {
    hasLikeIcon(question) {
      return question && question.likeIcon && question.likeIcon.url
    },
    hasDislikeIcon(question) {
      return question && question.dislike && question.dislike.url
    },
    likeIcon(question) {
      if( question && question.likeIcon && question.likeIcon.url) {
        return {backgroundImage: `url(${question.likeIcon.url})`}
      }
      return {}
    },
    dislikeIcon(question) {
      if( question && question.dislikeIcon && question.dislikeIcon.url) {
        return {backgroundImage: `url(${question.dislikeIcon.url})`}
      }
      return {}
    }
  }
}

</script>


<style scoped="true" lang="scss">

  .options {
    padding: 0;
    display: flex;
    flex-direction: row;
    list-style: none;
    margin-bottom: 2rem;
  }

  input[type="radio"]:checked+label {
    color: $primaryColor;
  }

  .like, .dislike {
    text-align: center;
    flex-grow: 1;

    input { display: none; }

    input.show { display: inline; margin-right: 0.5rem; }

    .icon {
      display: block;
      cursor: pointer;
      width: 2.5rem;
      margin-bottom: 0.5rem;
      background-size: contain;
      margin: 0 auto 0.5rem;
      height: 2.5rem;
      background-position: center;
      background-repeat: no-repeat;
    }
  }
</style>
