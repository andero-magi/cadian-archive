<template>
  <div class="d-block w-100 my-5">
    <div class="d-flex items-center justify-content-center flex-column p-4 bg-darker mx-auto" style="width: 50%; height: 80vh;">
      <div class="d-block">
        <h1 class="text-center my-5">Cadian Archive</h1>
        <div class="mx-auto w-50 d-flex flex-wrap" v-if="tags.length > 0">
          <template v-for="tag in tags">
            <SingleTag @tagclick="onTagRemove" :removecross="true" :tag="tag"/>
          </template>
        </div>
        <div style="max-width: 50%;" class="mx-auto">
          <TagSearchBar @tag-submit="onTagSubmit" :button="'submit'"/>
          <button @click="onSearch" class="btn btn-primary mt-2 w-100">Search...</button>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup lang="ts">
import SingleTag from '@/components/SingleTag.vue';
import TagSearchBar from '@/components/TagSearchBar.vue';
import router from '@/router';
import { FieldSearch, TagSearch } from '@/utilities/tags-parser';
import { searchTermsToString } from '@/utils';
import { ref } from 'vue';

type SearchTerm = TagSearch | FieldSearch

const tags = ref<SearchTerm[]>([])

function onTagSubmit(term: SearchTerm): void {
  if (tags.value.includes(term)) {
    return
  }

  tags.value.push(term)
}

function onTagRemove(term: SearchTerm): void {
  let idx = tags.value.indexOf(term)
  if (idx == -1) {
    return
  }

  tags.value.splice(idx, 1)
}

function onSearch(): void {
  router.push({name: 'post-list', query: {q: searchTermsToString(tags.value)}})
}
</script>