<template>
  <div class="options row">
    <div v-for="item in question.items"
         :key="item.id"
         class="col-6 col-sm-4">
      <a class="item"
         href="#"
         :class="{ selected: selected === item.id}"
         @click.prevent="select(item.id)">
        <div class="image"
             :style="getImage(item)">
          <font-awesome-icon icon="star" />
        </div>
      </a>
    </div>
  </div>
</template>

<script>

export default {
  name: 'FavoritePreview',
  props: {
    id: {
      type: String,
      required: true,
    }
  },
  data() {
    return {
      selected: '',
    }
  },
  computed: {
    question() {
      return JSON.parse(JSON.stringify(this.$store.getters.getQuestion(this.id)))
    },
  },
  methods: {
    select(id) {
      this.selected = id
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

  .item {
    display: block;
    border: 3px solid #FFFFFF;
  }

  .image {
    width: 100%;
    padding-top: 100%;
    background-size: cover;

    .oi {
      position: absolute;
      display: none;
      top: 50%;
      left: 50%;
      margin-left: -1rem;
      margin-top: -1rem;
      font-size: 2rem;
      color: $primaryColor;
    }
  }

  .selected {
    border: 3px solid $primaryColor;

    .oi {
      display: block;
    }
  }
</style>
