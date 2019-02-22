<template>
  <ol class="options">
    <li class="like">
      <input :id="`like-${question.id}`"
             type="checkbox"
             :class="{ 'show': !hasLikeIcon(question) }"
             :name="`like-${question.id}`">
      <label class="icon"
             :for="`like-${question.id}`"
             :style="backgroundImage(question)">
        Like!
      </label>
    </li>
  </ol>
</template>

<script>

export default {
  name: 'LikePreview',
  props: {
    id: {
      type: String,
      required: true,
    }
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
    backgroundImage(question) {
      if (question && question.likeIcon && question.likeIcon.url) {
        return {backgroundImage: `url(${question.likeIcon.url})`}
      }
      return {}
    }
  }
}
</script>

<style scoped="true" lang="scss">

  .options {
    list-style: none;
    padding: 0;
  }

  input[type="checkbox"]:checked+label {
    color: $primaryColor;
  }

  .like {
    text-align: center;
    flex-grow: 1;

    input { display: none; }

    input.show { display: inline;}

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
