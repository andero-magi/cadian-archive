<script setup>
import { RouterView } from 'vue-router'
import topbar from "./components/topbar.vue"
import leftsidebar from "./components/leftsidebar.vue"
</script>

<template>
  <topbar />

  <div class="d-flex align-items-start w-100">
    <Suspense><RouterView /></Suspense>
  </div>
</template>

<style scoped>
</style>
