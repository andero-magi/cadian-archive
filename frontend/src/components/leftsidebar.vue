<template>
  <div class="sticky-top d-flex flex-column flex-shrink-0 p-3 text-white bg-darker" style="width: 280px; height: 100vh;">
    <h5 class="mb-4">Search</h5>
    <input class="form-control" placeholder="Search"/>
    <div>
      <button class="btn btn-primary mt-2">Search...</button>
    </div>

    <h5 class="my-4">Searched Tags</h5>
    <div id="searched-tags-container">

    </div>
  </div>
</template>

<script setup lang="ts">
import { SEARCH_ADD_EVENT, SEARCH_EXCLUDE_EVENT, SEARCH_REMOVE_EVENT, SEARCH_SET_EVENT } from '@/consts';
import { onMounted, onUnmounted } from 'vue';

  
function onTagEvent(event: CustomEvent<string>) {
  let tagAct = event.type
  let tag = event.detail
  console.log(`act=${tagAct}, tag=${tag}`)
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