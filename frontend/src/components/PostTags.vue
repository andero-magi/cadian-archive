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
        <dd class="uuid">{{ currentPost.author_id }}</dd>

        <dt>Upload Date</dt>
        <dd>{{ currentPost.upload_date }}</dd>

        <dt>Modified Date</dt>
        <dd>{{ currentPost.modified_date }}</dd>

        <dt>Post UUID</dt>
        <dd class="uuid">{{ currentPost.id }}</dd>
      </dl>
    </div>

    <h5 class="mb-2 mt-4">Actions</h5>
    <RouterLink class="btn btn-outline-primary" :to="{name: 'editpost', params: {id: currentPost.id}}">
      Edit Post
    </RouterLink>
    
    <button class="btn btn-outline-danger mt-2" data-bs-toggle="modal" data-bs-target="#deleteModal">
      Delete Post
    </button>
  </div>

  <!-- Modal -->
  <div class="modal fade" id="deleteModal" tabindex="-1" aria-labelledby="deleteModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="deleteModalLabel">Delete post?</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          Deleting this post will erase all content associated with the post.
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          <button @click="deletePost" data-bs-dismiss="modal" type="button" class="btn btn-danger">Delete post</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { API_URL } from '@/consts';
import { Post } from '@/post';
import router from '@/router';
import { ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute()

const props = defineProps(["post"])
const currentPost = ref<Post>()

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

async function deletePost(): Promise<void> {
  let apiUrl = `${API_URL}/posts/${currentPost.value.id}`
  let response = await fetch(apiUrl, {method: "DELETE"})

  console.log(response)

  router.push({name: 'post-list', query: {...route.query}})
}
</script>

<style lang="css" scoped>
.uuid {
  font-size: 80%;
}
</style>