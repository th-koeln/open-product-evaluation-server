<template>
  <div class="grid">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'GridView',
}
</script>

<style scoped="true">
  .grid {
    display: grid;
    grid-column-gap: 20px;
    grid-row-gap: 20px;
    grid-template-columns: 1fr 1fr 1fr;
  }

  @media(max-width: 1200px) {
    .grid {
      grid-template-columns: 1fr 1fr;
    }
  }

  @media(max-width: 991px) {
    .grid {
      grid-template-columns: 1fr 1fr;
    }
  }

  @media(max-width: 767px) {
    .grid {
      grid-template-columns: 1fr;
    }
  }
</style>
