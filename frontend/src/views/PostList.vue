<template> 
  <Leftsidebar/>
  
  <div class="d-block w-100 my-5">
    <div class="p-4 bg-darker mx-auto mb-4" style="width: 90%;">
      <h3>Search results</h3>
      <div>Found {{ foundPosts.length }}  results.</div>
    </div>

    <div class="d-flex align-items-stretch flex-wrap flex-row gap-3 p-4 bg-darker mx-auto" style="width: 90%;">
      <RouterLink :to="{name: 'post', params: {id: post.id}, query: {...route.query}}" class="card postcard" v-for="post in foundPosts">
        <div class="card-body post-content">
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

function filterContentForDisplay(content: Content[]): Content[] {
  let result: Content[] = []
  let typeCounter: {[key: string]: number} = {}

  const MAX_TEXT_SIZE = 50
  const MAX_CONTENT_SIZE = 3

  for (let c of content) {
    let count = typeCounter[c.type] ?? 0
    if (count > 0) {
      continue
    }

    if (c.type != 'imageref' && c.type != 'imagedata' && c.data.length > MAX_TEXT_SIZE) {
      c.data = c.data.substring(0, MAX_TEXT_SIZE)
    }

    result.push(c)
    typeCounter[c.type] = count + 1

    if (result.length > MAX_CONTENT_SIZE) {
      break
    }
  }

  if (content.length != result.length) {
    let newC: Content = {type: 'section', data: '... (more)'}
    result.push(newC)
  }

  return result
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
    p.content = filterContentForDisplay(p.content)
  }

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