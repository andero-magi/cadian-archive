<script lang="ts" setup>
import { ref } from 'vue';

const props = defineProps(["post"])
const currentPost = ref()

currentPost.value = props.post

function onDropdownClick(ev: MouseEvent) {
  let target: HTMLElement = ev.target as HTMLElement
  let tag = target.getAttribute("tag")
  let tagAct = target.getAttribute("tag-act")

  if (!tag || !tagAct) {
    return
  }

  ev.preventDefault()
  let evType = `tag${tagAct}`

  let event = new CustomEvent(evType, {detail: tag})
  document.body.dispatchEvent(event)
}
</script>

<template>
  <div class="sticky-top d-flex flex-column flex-shrink-0 p-3 text-white bg-darker" style="width: 280px; height: 100vh;">
    <h5 class="mb-4">Post Tags</h5>
    <div v-for="t in currentPost.tags">
      <div class="dropdown">
        <div aria-expanded="false" data-bs-toggle="dropdown" class="posttag p-1 px-3 my-1 dropdown-toggle">
          {{ t }}
        </div>
        <ul class="dropdown-menu tag-action-listeners">
          <li><a @click="onDropdownClick" class="dropdown-item" tag-act="add" :tag="t" href="#">Add to search</a></li>
          <li><a @click="onDropdownClick" class="dropdown-item" tag-act="rem" :tag="t" href="#">Remove from search</a></li>
          <li><a @click="onDropdownClick" class="dropdown-item" tag-act="set" :tag="t" href="#">Search for</a></li>
          <li><a @click="onDropdownClick" class="dropdown-item" tag-act="exl" :tag="t" href="#">Exclude from search</a></li>
        </ul>
      </div>
    </div>

    <h5 class="mb-2 mt-4">Metadata</h5>
    <div>
      <dl>
        <dt>Uploader</dt>
        <dd>{{ currentPost.author_id }}</dd>

        <dt>Upload Date</dt>
        <dd>{{ currentPost.upload_date.toUTCString() }}</dd>

        <dt>Modified Date</dt>
        <dd>{{ currentPost.modified_date.toUTCString() }}</dd>
      </dl>
    </div>

    <h5 class="mb-2 mt-4">Actions</h5>
    <RouterLink class="btn btn-outline-primary" :to="{name: 'editpost', params: {id: currentPost.id}}">
      Edit Post
    </RouterLink>
    
    <RouterLink class="btn btn-outline-danger mt-2" :to="{name: 'editpost', params: {id: currentPost.id}}">
      Delete Post
    </RouterLink>
  </div>
</template>
