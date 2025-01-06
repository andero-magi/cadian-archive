<template>
  <div class="sticky-top d-flex flex-column flex-shrink-0 p-3 text-white bg-darker" style="width: 280px; height: 100vh;">
    <h5 class="mb-4">Search</h5>
    <form @submit.prevent="onSearch">
      <input v-model="searchString" class="form-control" placeholder="Search"/>
      <div>
        <button type="submit" class="btn btn-primary mt-2">Search...</button>
      </div>
    </form>

    <h5 class="my-4">Searched Tags</h5>
    <div id="searched-tags-container">
      <div 
        v-for="(t, idx) in tagList" 
        :tag-negated="t.negated" 
        :tag-idx="idx" 
        :tag="t" 
        @click="onTagClick" 
        class="d-flex justify-content-between bg-dark rounded-pill px-3 py-1 border m-1"
      >
        <span>{{ t.toPrettyString() }}</span>
        <button class="tag-negate-toggle">&#10005;</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import router from '@/router';
import { onMounted, onUnmounted, ref } from 'vue';
import { SEARCH_ADD_EVENT, SEARCH_EXCLUDE_EVENT, SEARCH_REMOVE_EVENT, SEARCH_SET_EVENT } from '@/consts';
import { useRoute } from 'vue-router';
import { FieldSearch, parseTags, TagSearch } from '@/utilities/tags-parser';

const route = useRoute()

const searchString = ref("")
const tagList = ref<(TagSearch|FieldSearch)[]>([])

reloadShit()

router.afterEach((to, from, a) => {
  reloadShit()
  //asdasd
})

function reloadShit() {
  searchString.value = (route.query.q ?? "") as string
  reloadTagList()
}

// Called when a searched tag is clicked on, or when the X on the 
// right side of the tag is clicked on
function onTagClick(ev) {
  let tagIdx = ev.currentTarget.getAttribute("tag-idx")

  if (tagIdx == null) {
    return
  }

  tagIdx = parseInt(tagIdx)
  ev.preventDefault()

  let target = ev.target

  // If toggling tag negation or just removing it
  if (target.classList.contains("tag-negate-toggle")) {
    // Toggle negation
    let tag = tagList.value[tagIdx]
    tag.negated = !tag.negated
    tagList.value[tagIdx] = tag
  } else {
    // Remove tag
    tagList.value.splice(tagIdx, 1)
  }

  updateSearchStringFromList()
}

function updateSearchStringFromList() {
    // Remake what the user has typed in because we changed shit
  let newStr = ""
  for (let tag of tagList.value) {
    if (tag.negated) {
      newStr += "-"
    }
    newStr += tag.toString() + " "
  }

  newStr = newStr.trim()
  searchString.value = newStr

  // Update the 'q=' in the URL
  pushSearchState()
}

// Called when the "Search" button is clickeed
function onSearch() {
  reloadTagList()
  runSearch()
}

function runSearch() {
  router.push({name: "post-list", query: {q: searchString.value}})
}

function pushSearchState() {
  router.replace({query: {...route.query, q: searchString.value}})
}

function reloadTagList() {
  if (searchString.value == "") {
    tagList.value = []
    return
  }

  let parsed = parseTags(searchString.value.trim())
  tagList.value = parsed
}

  
function onTagEvent(event: CustomEvent<string>) {
  let tagAct = event.type
  let tag = event.detail

  console.log(`tagAct=${tagAct} tag='${tag}'`)
  
  if (tagAct == SEARCH_SET_EVENT) {
    let s = new TagSearch()
    s.tagName = tag
    s.negated = false
    tagList.value = [s]

    updateSearchStringFromList()
    runSearch()

    return
  }

  let idx = tagList.value.findIndex(t => (t as TagSearch).tagName == tag)
  
  if (tagAct == SEARCH_ADD_EVENT) {
    if (idx != -1) {
      let s = tagList.value[idx]

      if (s.negated) {
        s.negated = false
        updateSearchStringFromList()
      }

      return
    }

    let s = new TagSearch()
    s.tagName = tag
    s.negated = false
    tagList.value.push(s)
    updateSearchStringFromList()

    return
  }

  if (tagAct == SEARCH_REMOVE_EVENT) {
    if (idx == -1) {
      return
    }

    tagList.value.splice(idx, 1)
    updateSearchStringFromList()

    return
  }

  if (tagAct == SEARCH_EXCLUDE_EVENT) {
    if (idx == -1) {
      let s = new TagSearch()
      s.tagName = tag
      s.negated = true
      tagList.value.push(s)
      updateSearchStringFromList()
      return
    }

    let s = tagList.value[idx]
    s.negated = true

    updateSearchStringFromList()
    return
  }
}

onMounted(() => {
  document.body.addEventListener(SEARCH_ADD_EVENT, onTagEvent)
  document.body.addEventListener(SEARCH_EXCLUDE_EVENT, onTagEvent)
  document.body.addEventListener(SEARCH_REMOVE_EVENT, onTagEvent)
  document.body.addEventListener(SEARCH_SET_EVENT, onTagEvent)
})
onUnmounted(() => {  
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