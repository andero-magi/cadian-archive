<template>
  <div class="sticky-top d-flex flex-column flex-shrink-0 p-3 text-white bg-darker" style="width: 280px; height: 100vh;">
    <h5 class="mb-4">Post Tags</h5>
    <template v-for="t in currentPost.tags">
      <SingleTag :dropdown="true" :removecross="false" :fullwidth="true" :tag="new TagSearch(t)"/>
    </template>

    <h5 class="mb-2 mt-4">Metadata</h5>
    <div>
      <dl>
        <dt>Uploader</dt>
        <dd class="uuid">{{ getAuthorName() }}</dd>

        <dt>Upload Date</dt>
        <dd>{{ currentPost.upload_date }}</dd>

        <dt>Modified Date</dt>
        <dd>{{ currentPost.modified_date }}</dd>

        <dt>Post UUID</dt>
        <dd class="uuid">{{ currentPost.id }}</dd>
      </dl>
    </div>

    <h5 v-if="canEdit" class="mb-2 mt-4">Actions</h5>
    <RouterLink v-if="canEdit" class="btn btn-outline-primary" :to="{name: 'editpost', params: {id: currentPost.id}}">
      Edit Post
    </RouterLink>
    
    <button v-if="canEdit" class="btn btn-outline-danger mt-2" data-bs-toggle="modal" data-bs-target="#deleteModal">
      Delete Post
    </button>
  </div>

  <!-- Modal -->
  <div v-if="canEdit" class="modal fade" id="deleteModal" tabindex="-1" aria-labelledby="deleteModalLabel" aria-hidden="true">
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
import SingleTag from './SingleTag.vue';
import { TagSearch } from '@/utilities/tags-parser';

const NIL_ID = '00000000-0000-0000-0000-000000000000'

const route = useRoute()

const props = defineProps(["post"])
const currentPost = ref<Post>()
let canEdit = ref<boolean>(false)

currentPost.value = props.post

console.log(currentPost.value)

if (currentPost.value.author_id == NIL_ID) {
  canEdit.value = true
} else {
  const loggedIn = localStorage.getItem("isAuthenticated") === "true";
  const userId = localStorage.getItem("userId")

  console.log(loggedIn)
  console.log(userId)

  canEdit.value = loggedIn && currentPost.value.author_id == userId
}

async function deletePost(): Promise<void> {
  let apiUrl = `${API_URL}/posts/${currentPost.value.id}`
  let response = await fetch(apiUrl, {method: "DELETE"})

  console.log(response)

  router.push({name: 'post-list', query: {...route.query}})
}

function getAuthorName(): string {
  if (currentPost.value.author_id == NIL_ID) {
    return "Anonymous"
  }
  return currentPost.value.author_id
}
</script>

<style lang="css" scoped>
.uuid {
  font-size: 80%;
}
</style>