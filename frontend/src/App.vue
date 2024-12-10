<script setup>
  import topbar from "./components/topbar.vue"
  import leftsidebar from "./components/leftsidebar.vue"
  import PageContent from "./components/PageContent.vue"
  import PostTags from "./components/PostTags.vue"
</script>

<template>
  <topbar />

  <div class="d-flex align-items-start w-100">
    <leftsidebar />

    <div class="d-flex justify-content-center" style="width: 100%;">
      <PageContent />
    </div>

    <PostTags />
  </div>
</template>

<style scoped>

</style>
