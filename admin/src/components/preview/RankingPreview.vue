<template>
  <draggable v-model="question.items"
             class="options row"
             @start="drag = true"
             @end="drag = false">
    <div v-for="(item, index) in question.items"
         :key="item.id"
         class="col-6 col-sm-4">
      <div class="image"
           :style="{backgroundImage: `url(${item.image.url})`}">
        <span class="rank">
          {{ index + 1 }}
        </span>
      </div>
    </div>
  </draggable>
</template>

<script>
import draggable from 'vuedraggable'

export default {
  name: 'RankingPreview',
  components: {
    draggable,
  },
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

  .image {
    width: 100%;
    padding-top: 100%;
    background-size: cover;
    display: flex;
    flex-direction: column;
  }

  .rank {
    display: flex;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    align-items: center;
    justify-content: center;
    position: absolute;
    font-size: 2rem;
    color: $primaryColor;
  }
</style>
