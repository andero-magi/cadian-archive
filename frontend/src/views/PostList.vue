<template> 
  <div class="d-block w-100 my-5">
    <div class="flex-column p-4 bg-darker mx-auto" style="width: 90%; height: 80vh;">
      <div v-for="post in foundPosts">
        <RouterLink :to="{name: 'post', params: {id: post.id}}">{{ post.id }}</RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onBeforeMount, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { API_URL } from '@/consts';
import router from '@/router';

let route = useRoute()
let foundPosts = ref([]);

onBeforeMount(reloadShit);
router.afterEach(async (to, from, fail) => await reloadShit())

async function reloadShit() {
  let queryParam = route.query.q ?? "";
  await doPostSearch(queryParam)
}

async function doPostSearch(queryParam) {
  let queryUrl = `${API_URL}/posts?search=${encodeURIComponent(queryParam)}`
  console.log(`queryUrl=${queryUrl}`) 

  let response = await fetch(queryUrl)
  if (!response.ok) {
    return
  }

  let json = await response.json()
  foundPosts.value = json

  console.log(json)
  console.log(foundPosts.value)
}

</script>