<template>
      <RouterLink :to="{name: 'post', params: {id: post.id}, query: {...route.query}}" class="card postcard">
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
</template>

<script setup lang="ts">
import { API_URL } from '@/consts';
import { Content, Post } from '@/post';
import { ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute()

let props = defineProps<{post: Post}>()
let post = ref(props.post)

filterPostData()

function filterPostData() {
  post.value.content = filterContentForDisplay(post.value.content)
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