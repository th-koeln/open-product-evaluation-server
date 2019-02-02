<template>
  <div class="editor">
    <navigation></navigation>

    <div class="container">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import EditorNavigation from '@/components/editor/EditorNavigation.vue'

export default {
  name: 'AppEditor',
  components: {
    navigation: EditorNavigation,
  },
}
</script>

<style>
  .editor { padding-top: 6rem; }
</style>
