<script setup>
import { RouterLink, RouterView } from 'vue-router'
import topbar from "./components/topbar.vue"
import leftsidebar from "./components/leftsidebar.vue"
import PageContent from "./components/PageContent.vue"
import PostTags from "./components/PostTags.vue"
</script>

<template>
  <topbar />

  <div class="d-flex align-items-start w-100">
    <leftsidebar />
    <RouterView />
  </div>
</template>

<style scoped>
</style>
