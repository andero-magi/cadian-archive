<script setup>
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
        <form @submit.prevent="onSearch" class="d-flex mt-5 gap-4 justify-content-center">
          <input v-model="searchStr" style="max-width: 400px;" class="form-control" placeholder="search">
          <button type="submit" class="btn btn-primary">Search</button>
        </form>
      </div>
    </div>
  </div>
</template>
