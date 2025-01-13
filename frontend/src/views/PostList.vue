<template> 
  <Leftsidebar/>
  
  <div class="d-block w-100 my-5">
    <div class="d-flex align-items-start flex-wrap flex-row gap-3 p-4 bg-darker mx-auto" style="width: 90%; min-height: 80vh;">
      <RouterLink :to="{name: 'post', params: {id: post.id}, query: {...route.query}}" class="card postcard" v-for="post in foundPosts">
        <div class="card-body">
          <template v-for="c in post.content">
            <h5 v-if="c.type == 'title'" class="card-title mb-3">{{ c.data }}</h5>
            <h6 v-if="c.type == 'header'" class="card-subtitle mb-3">{{ c.data }}</h6>
            <img v-if="c.type == 'imageref'" class="card-img" :src="`${API_URL}/images/${c.data}`">
            <img v-if="c.type == 'imagedata'" class="card-img" :src="c.data">
            <div v-if="c.type == 'section'" class="card-text">{{ c.data }}</div>
          </template>
        </div>
      </RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeMount, ref } from 'vue';
import { useRoute } from 'vue-router';
import { API_URL } from '@/consts';
import router from '@/router';
import { Content, Post } from '@/post';
import Leftsidebar from '@/components/leftsidebar.vue';

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

  const MAX_TEXT_SIZE = 50
  const MAX_CONTENT_SIZE = 3

  console.log(json)

  json = json.filter(p => p != null)

  for (let p of json) {

    let content: Content[] = p.content

    if (content.length > MAX_CONTENT_SIZE) {
      p.content = content = content.slice(0, MAX_CONTENT_SIZE)
    }

    for (let c of content) {
      if (c.type.startsWith("image")) {
        continue
      }

      let data = c.data 
      if (data.length > MAX_TEXT_SIZE) {
        data = data.substring(0, MAX_TEXT_SIZE) + "..."
      }

      c.data = data
    }
  }

  foundPosts.value = json
}

</script>

<style>
.postcard {
  width: 250px;
  padding: 10px;
  text-decoration: none;
  max-height: 430px;
  overflow-y: hidden;

  &:hover {
    background-color: var(--bs-gray-800);
  }
}
</style>