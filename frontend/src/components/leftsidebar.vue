<template>
  <div class="sticky-top d-flex flex-column flex-shrink-0 p-3 text-white bg-darker" style="width: 280px; height: 100vh;">
    <h5 class="mb-4">Search</h5>

    <div>
      <Suspense>
        <TagSearchBar @tag-submit="onTagSubmit" :button="'none'"/>
      </Suspense>

      <select v-model="sortTag" class="form-control mt-3">
        <option disabled selected value="" class="text-muted">Post sorting...</option>
        <option value="created">Creation Date</option>
        <option value="modified">Last Modified Date</option>
      </select>
    </div>


    <h5 class="my-4">Searched Tags</h5>
    <template v-for="(tag, idx) in tagList" :key="tag">
      <SingleTag :fullwidth="true" @tagclick="onTagRemove" :tag="tag" :removecross="true"/>
    </template>

    <button @click="onSearch" class="mt-2 btn btn-primary">Search...</button>
  </div>
</template>

<script setup lang="ts">
import router from '@/router';
import { onMounted, onUnmounted, ref } from 'vue';
import { SEARCH_ADD_EVENT, SEARCH_EXCLUDE_EVENT, SEARCH_REMOVE_EVENT, SEARCH_SET_EVENT } from '@/consts';
import { useRoute } from 'vue-router';
import { FieldSearch, parseTags, TagSearch } from '@/utilities/tags-parser';
import TagSearchBar from './TagSearchBar.vue';
import SingleTag from './SingleTag.vue';
import { searchTermsToString } from '@/utils';

const route = useRoute()

const tagList = ref<(TagSearch|FieldSearch)[]>([])
const sortTag = ref<string>("")

reloadTagList()

router.afterEach((to, from, a) => {
  reloadTagList()
})

function onTagSubmit(tag: TagSearch | FieldSearch): void {
  if (tagList.value.includes(tag)) {
    return
  }

  tagList.value.push(tag)
}

function onTagRemove(tag: TagSearch | FieldSearch): void {
  let idx = tagList.value.indexOf(tag)
  if (idx == -1) {
    return
  }

  tagList.value.splice(idx, 1)
}

// Called when the "Search" button is clickeed
function onSearch() {
  runSearch()
}

function getSortTag(): FieldSearch | undefined {
  for (let t of tagList.value) {
    if (t instanceof FieldSearch && t.fieldName == "sort") {
      return t
    }
  }

  return undefined
}

function runSearch() {
  let tags = [...tagList.value]
  if (sortTag.value != null && sortTag.value != "") {
    let sortSearch = getSortTag() ?? new FieldSearch()
    sortSearch.fieldName = "sort"
    sortSearch.fieldValue = sortTag.value
    tags.push(sortSearch)
  }

  router.push({name: "post-list", query: {q: searchTermsToString(tags)}})
}

function reloadTagList() {
  let searchString = route.query.q
  if (searchString == null || searchString == undefined || searchString == "") {
    tagList.value = []
    return
  }

  let q: string

  if (typeof searchString != "string") {
    q = searchString[0]
  } else {
    q = searchString
  }

  let parsed = parseTags(q)
  tagList.value = parsed
}

  
function onTagEvent(event: CustomEvent<string>) {
  let tagAct = event.type
  let tag = event.detail
  
  if (tagAct == SEARCH_SET_EVENT) {
    let s = new TagSearch()
    s.tagName = tag
    s.negated = false
    tagList.value = [s]
    
    runSearch()
    return
  }

  // Find the index of the tag we're looking to add/exclude/remove in the 
  // current searched tags list, if it's in there.
  // Following if statements will vary in behavior depending on if tag 
  // is in list or not
  let idx = tagList.value.findIndex(t => (t as TagSearch).tagName == tag)

  // -1 = not found = tag is not the searched tags list
  const NOT_FOUND = -1
  
  // Add tag to search, if already in search, ensure it's not being negated
  // otherwise just push onto the searched tags list
  if (tagAct == SEARCH_ADD_EVENT) {
    if (idx != NOT_FOUND) {
      let s = tagList.value[idx]

      if (s.negated) {
        s.negated = false
      }

      return
    }

    let s = new TagSearch()
    s.tagName = tag
    s.negated = false
    tagList.value.push(s)

    return
  }

  // Remove tag, if not in list, don't do anything, if it is, remove it
  if (tagAct == SEARCH_REMOVE_EVENT) {
    if (idx == NOT_FOUND) {
      return
    }

    tagList.value.splice(idx, 1)

    return
  }

  // Exclude tag from search, if not in list, negate and push to list
  // else just negate the found tag
  if (tagAct == SEARCH_EXCLUDE_EVENT) {
    if (idx == NOT_FOUND) {
      let s = new TagSearch()
      s.tagName = tag
      s.negated = true
      tagList.value.push(s)
      return
    }

    let s = tagList.value[idx]
    s.negated = true

    return
  }
}

onMounted(() => {
  // Listen to the tag search being changed
  document.body.addEventListener(SEARCH_ADD_EVENT, onTagEvent)
  document.body.addEventListener(SEARCH_EXCLUDE_EVENT, onTagEvent)
  document.body.addEventListener(SEARCH_REMOVE_EVENT, onTagEvent)
  document.body.addEventListener(SEARCH_SET_EVENT, onTagEvent)
})

onUnmounted(() => {  
  // Stop listening to the tag search being changed
  document.body.removeEventListener(SEARCH_ADD_EVENT, onTagEvent)
  document.body.removeEventListener(SEARCH_EXCLUDE_EVENT, onTagEvent)
  document.body.removeEventListener(SEARCH_REMOVE_EVENT, onTagEvent)
  document.body.removeEventListener(SEARCH_SET_EVENT, onTagEvent)
})
</script>

<style>
[tag] {
  &:hover {
    cursor: pointer;
    border-color: var(--bs-primary) !important;
  }

  &[tag-negated="true"] span:first-of-type {
    text-decoration: line-through;
    color: gray;
  }
}

.tag-negate-toggle {
  background-color: unset;
  border: unset;

  &:hover {
    color: gray;
  }
}
</style>