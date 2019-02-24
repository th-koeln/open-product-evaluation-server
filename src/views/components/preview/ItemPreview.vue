<template>
  <div v-if="question.items && question.items.length > 0"
       class="row items">
    <div v-for="item in question.items"
         :key="item.id"
         class="col-6 col-sm-4">
      <div class="item"
           :style="getImage(item)" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'ItemPreview',
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
    getImage(item) {
      if(item && item.image && item.image.url) {
        return { backgroundImage: `url(${item.image.url})` }
      }
      return {}
    }
  },
}
</script>

<style scoped="true" lang="scss">

.items { margin-bottom: 3rem; }

.item {
  width: 100%;
  padding-top: 100%;
  background-size: cover;
  border: 1px solid #e7ebf3;
}

  .item img {
    width: 100%;
  }

</style>
