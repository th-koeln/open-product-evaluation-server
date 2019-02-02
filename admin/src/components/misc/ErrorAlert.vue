<template>
  <div v-if="data"
       class="message">
    {{ data }}
    <b-alert v-if="data.networkError === null"
             show
             variant="warning">
      <span>
        {{ data.graphQLErrors[0].message }}
      </span>
    </b-alert>
    <b-alert v-else
             show
             variant="danger">
      <span>
        {{ data.message }}
      </span>
    </b-alert>
  </div>
</template>

<script>
export default {
  name: 'ErrorAlert',
  props: {
    data: Error,
    variant: {
      type: String,
      default: 'warning',
    },
  },
}
</script>
