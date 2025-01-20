<template> 
  <Leftsidebar/>
  
  <div class="d-block w-100 my-5">
    <div class="p-4 bg-darker mx-auto mb-4" style="width: 90%;">
      <h3>Search results</h3>
      <div>Found {{ foundPosts.length }}  results.</div>
    </div>

    <div class="d-flex align-items-stretch flex-wrap flex-row gap-3 p-4 bg-darker mx-auto" style="width: 90%;">
      <template v-for="post in foundPosts">
        <PostCard :post="post" />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeMount, ref } from 'vue';
import { useRoute } from 'vue-router';
import { API_URL } from '@/consts';
import router from '@/router';
import { Post } from '@/post';
import Leftsidebar from '@/components/leftsidebar.vue';
import PostCard from '@/components/posts/PostCard.vue';

let route = useRoute()
let foundPosts = ref<Post[]>([]);

onBeforeMount(reloadShit);
router.afterEach(async (to, from, fail) => await reloadShit())

async function reloadShit() {
  let queryParam = route.query.q ?? "";
  await doPostSearch(queryParam)
}


async function doPostSearch(queryParam) {
  let queryUrl = `${API_URL}/posts?search=${encodeURIComponent(queryParam)}`

  let response = await fetch(queryUrl)
  if (!response.ok) {
    return
  }

  let json: Post[] = await response.json()
  json = json.filter(p => p != null)

  foundPosts.value = json
}

</script>

<style scoped>
.postcard {
  width: 250px;
  padding: 10px;
  text-decoration: none;

  &:hover {
    background-color: var(--bs-gray-800);
  }
}

.post-content {
  max-height: 430px;
  overflow-y: hidden;
}
</style>