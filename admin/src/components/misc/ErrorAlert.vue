<template>
  <div class="message"
       v-if="data">
       {{ data }}
    <b-alert show
             v-if="data.networkError === null"
             variant="warning">
      <span>
        {{ data.graphQLErrors[0].message }}
      </span>
    </b-alert>
    <b-alert show
             v-else
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
