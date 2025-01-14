<template>
  <h3>Edit Tags</h3>

  <div class="d-flex flex-wrap">
    <SingleTag v-for="t in tags" :key="t.tagName" :tag="t" @tagclick="onTagRemoved" :dropdown="false" :removecross="false"/>
  </div>

  <TagSearchBar @tag-submit="onTagAdded"/>
</template>

<script setup lang="ts">
import { Post } from '@/post';
import { TagSearch } from '@/utilities/tags-parser';
import { ref } from 'vue';
import TagSearchBar from './TagSearchBar.vue';
import SingleTag from './SingleTag.vue';

const props = defineProps<{post: Post}>()

const post = props.post
const tags = ref<TagSearch[]>([])

reloadTags()

function reloadTags() {
  tags.value = post.tags.map(t => new TagSearch(t))
}

function findTagIndex(t: TagSearch): number {
  return post.tags.indexOf(t.tagName)
}

function onTagAdded(t: TagSearch): void {
  let idx = findTagIndex(t)

  if (idx != -1) {
    return
  }

  post.tags.push(t.tagName)
  tags.value.push(t)
}

function onTagRemoved(t: TagSearch) {
  let idx = findTagIndex(t)

  if (idx == -1) {
    return
  }

  post.tags.splice(idx, 1)
  tags.value.splice(idx, 1)
}
</script>