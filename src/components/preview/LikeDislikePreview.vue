<template>
  <ol class="options">
    <li class="like">
      <input :id="`like-${question.id}`"
             type="radio"
             :name="`likedislike-${question.id}`">
      <label :for="`like-${question.id}`"
             class="icon"
             :style="{backgroundImage: `url(${question.likeIcon.url})`}" />
      <span class="label">
        Like
      </span>
    </li>
    <li class="dislike">
      <input :id="`dislike-${question.id}`"
             type="radio"
             :name="`likedislike-${question.id}`">
      <label class="icon"
             :for="`dislike-${question.id}`"
             :style="{backgroundImage: `url(${question.dislikeIcon.url})`}" />
      <span class="label">
        Like
      </span>
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

  input[type="radio"]:checked+label+span {
    color: $primaryColor;
  }

  .like, .dislike {
    text-align: center;
    flex-grow: 1;

    input { display: none; }

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
