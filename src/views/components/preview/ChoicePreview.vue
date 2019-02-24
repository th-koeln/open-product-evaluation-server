<template>
  <ol class="choices">
    <li v-for="choice in question.choices"
        :key="choice.id"
        class="choice"
        :class="{'no-image': !choice.image }">
      <input v-if="choice.image && choice.image.url"
             :id="`choice-${choice.id}`"
             type="radio"
             :name="`choice-${question.id}`"
             :value="choice.label">
      <label v-if="!choice.image"
             :for="`choice-${choice.id}`">
        <input :id="`choice-${choice.id}`"
               type="radio"
               :name="`choice-${question.id}`"
               :value="choice.label">
        {{ choice.label }}
      </label>
      <label v-if="choice.image && choice.image.url"
             class="icon"
             :for="`choice-${choice.id}`"
             :style="{backgroundImage: `url(${choice.image.url})`}" />
      <span v-if="choice.image && choice.image.url"
            class="label">
        {{ choice.label }}
      </span>
    </li>
  </ol>
</template>

<script>

export default {
  name: 'ChoicePreview',
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

  .choices {
    padding: 0;
    display: flex;
    flex-direction: row;
    list-style: none;
    margin-bottom: 2rem;
  }

  input[type="radio"]:checked + label + span { color: $primaryColor; }

  .choice {
    text-align: center;
    flex-grow: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;

    &.no-image {
      flex-direction: row;
      label { margin-bottom: 0;}
      input { display: inline; margin-right: 5px; }
    }

    input { display: none;}

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
