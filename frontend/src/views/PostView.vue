<script setup>
import { onMounted, ref } from "vue";
import PageContent from "../components/PageContent.vue"
import PostTags from "../components/PostTags.vue"
import { useRoute } from "vue-router";
import { getPost } from "@/utils";

const route = useRoute()
const currentPost = ref({})

await updatePostRef()

async function updatePostRef() {
  let json = await fetchPost()
  currentPost.value = json
}

async function fetchPost() {
  let postId = route.params.id ?? ""
  if (postId == "") {
    return null
  }

  return await getPost()
}
</script>

<template>
    <div class="d-flex justify-content-center" style="width: 100%;">
      <PageContent :post="currentPost"/>
    </div>

    <PostTags :post="currentPost"/>
</template>