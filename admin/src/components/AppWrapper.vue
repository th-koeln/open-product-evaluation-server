<template>
  <div>
    <app-navigation></app-navigation>

    <div class="container content">

      <router-view></router-view>

      <opensource></opensource>

    </div>
  </div>
</template>

<script>
import AppNavigation from '@/components/AppNavigation.vue'
import OpenSourceNote from '@/components/misc/OpenSourceNote.vue'

export default {
  name: 'AppWrapper',
  components: {
    'app-navigation': AppNavigation,
    opensource: OpenSourceNote,
  },
}
</script>

<style scoped="true" lang="scss">

  .container { margin-bottom: 1.5rem; }

</style>
