<template>
  <div class="sticky-top d-flex flex-column flex-shrink-0 p-3 text-white bg-darker" style="width: 280px; height: 100vh;">
    <h5 class="mb-4">Search</h5>

    <div>
      <Suspense><TagSearchBar :omit-button="true"/></Suspense>
      <button class="btn btn-primary mt-2" @click="onSearch">Search...</button>
    </div>


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
import TagSearchBar from './TagSearchBar.vue';

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

// Called when the "Search" button is clickeed
function onSearch() {
  reloadTagList()
  runSearch()
}

/**
 * Update the searchString by joining the tagList into a string
 */
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
  
  if (tagAct == SEARCH_SET_EVENT) {
    let s = new TagSearch()
    s.tagName = tag
    s.negated = false
    tagList.value = [s]

    // Probably the worst offense of anything here in this mess:
    //  1. Change the tag list
    //  2. Combine that list into a string and change the searchString value
    //  3. Use that string to route to the search view
    updateSearchStringFromList()
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

  // Remove tag, if not in list, don't do anything, if it is, remove it
  if (tagAct == SEARCH_REMOVE_EVENT) {
    if (idx == NOT_FOUND) {
      return
    }

    tagList.value.splice(idx, 1)
    updateSearchStringFromList()

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