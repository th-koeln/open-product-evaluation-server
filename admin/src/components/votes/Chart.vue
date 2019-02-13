<template>
  <div class="chart">
    here will be a magic chart
  </div>
</template>

<script>
export default {
  name: 'Chart',
  props: {
    question: {
      type: Object,
      required: true,
    },
  },
}
</script>

<style lang="scss" scoped="true">

  .visualisation .chart:last-child { margin-bottom: 0; }

  .chart {
    border: $inputBorder;
    margin-bottom: $marginDefault;
    padding: $paddingDefault;
  }
</style>
