<script setup>
import TagSearchBar from '@/components/TagSearchBar.vue';
import router from '@/router';
import { ref } from 'vue';

const searchStr = ref("")

function onSearch(ev) {
  router.push({name: "post-list", query: {q: searchStr.value}})
}
</script>

<template>
  <div class="d-block w-100 my-5">
    <div class="d-flex items-center justify-content-center flex-column p-4 bg-darker mx-auto" style="width: 90%; height: 80vh;">
      <div class="d-block">
        <h1 class="text-center">Cadian Archive</h1>
        <div style="max-width: 50%;" class="mx-auto">
          <TagSearchBar :button="'search'"/>
        </div>
      </div>
    </div>
  </div>
</template>
