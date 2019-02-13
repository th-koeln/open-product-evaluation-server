<template>
  <div id="app">
    <router-view :key="$route.fullName" />
  </div>
</template>

<script>
export default {
  name: 'App',
}
</script>
