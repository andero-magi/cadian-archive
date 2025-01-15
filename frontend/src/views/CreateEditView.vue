<script setup lang="ts">
import { API_URL } from '@/consts';
import { getPost } from '@/utils';
import { ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute()
const props = defineProps(["edit"])
const post = ref()

const editMode = props.edit ?? false

type TextContentElement = "section" | "header" | "title"

if (editMode) {
  let id: string = route.params.id as string
  let postData =  getPost(id)
  post.value = postData
} else {
  let contentArr: any[] = [
    { type: "title", data: "" },
    { type: "section", data: "" }
  ]

  post.value = {}
  post.value.tags = []
  post.value.content = contentArr
}

async function postPost() {
  if (true) {
    return
  }

  let method: string
  if (editMode) {
    method = "PUT"
  } else {
    method = "POST"
  }

  let apiUrl: string

  if (editMode) {
    apiUrl = `${API_URL}/posts/${post.value.id}`
  } else {
    apiUrl = `${API_URL}/posts`
  }

  let result = await fetch(apiUrl, {method: method, body: post.value})
}

function addNewElement(type: TextContentElement) {
  let contentData = {
    type: type,
    data: ""
  }

  post.value.content.push(contentData)
}
</script>

<template>
  <div class="d-flex justify-content-center" style="width: 100%;">
    <div id="content-output" class="rounded mt-5 p-4 bg-darker" style="width: 90%; min-height: 50vh;">
      <template v-for="section in post.content">
        <template v-if="section.type == 'title'">
          <input placeholder="Enter title here..." v-model="section.data" class="w-100 mb-3 d-block h1 p-2"/>
        </template>
        <template v-if="section.type == 'section'">
          <textarea placeholder="Enter text here..." class="d-block p-2 w-100 mb-3" style="height: max-content; min-height: max-content; overflow-y: visible; field-sizing: content;" v-model="section.data"></textarea>
        </template>
        <template v-if="section.type == 'header'">
          <input placeholder="Enter paragraph title here..." class="d-block h3 p-2 w-100 mb-3"v-model="section.data" />
        </template>
        <template v-if="section.type == 'imageref' || section.type == 'imagedata'">
          <img :src="section.data" alt="">
        </template>
      </template>

      <div class="d-flex gap-3">
        <div class="dropdown">
          <button class="btn btn-primary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
            Add new part...
          </button>
          <ul class="dropdown-menu">
            <li><a class="dropdown-item" @click="addNewElement('title')" href="#">New Title...</a></li>
            <li><a class="dropdown-item" @click="addNewElement('header')" href="#">New section title...</a></li>
            <li><a class="dropdown-item" @click="addNewElement('section')" href="#">New paragraph...</a></li>
            <li><a class="dropdown-item" data-bs-toggle="modal" data-bs-target="#exampleModal" href="#">New image...</a></li>
          </ul>
        </div>
        <button class="btn btn-primary" @click="postPost">Submit</button>
      </div>
    </div>
  </div>

<!-- Modal -->
<div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title fs-5" id="exampleModalLabel">Upload image</h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <input class="form-control" type="file">
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        <button type="button" class="btn btn-primary">Submit</button>
      </div>
    </div>
  </div>
</div>
</template>