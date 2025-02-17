<script setup lang="ts">
import TagEdit from '@/components/posts/TagEdit.vue';
import { API_URL } from '@/consts';
import { Content, Post } from '@/post';
import router from '@/router';
import { TagSearch } from '@/utilities/tags-parser';
import { getPost } from '@/utils';
import { ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute()
const props = defineProps(["edit"])
const post = ref<Post>()
const tags = ref<TagSearch[]>([])
const postingErrors = ref([])

const editMode = props.edit ?? false
const title = editMode ? "Edit Post" : "New Post"

type TextContentElement = "section" | "header" | "title"

if (editMode) {
  let id: string = route.params.id as string
  let postData = await getPost(id)
  post.value = postData
  refreshTagsRef()
} else {
  let contentArr: Content[] = [
    { type: "title", data: "" },
    { type: "section", data: "" }
  ]

  post.value = {}
  post.value.tags = []
  post.value.content = contentArr
}

function refreshTagsRef() {
  tags.value = post.value.tags.map(t => new TagSearch(t))
}

// Sanitize data a bit, drop empty tags and content
function scrubPost(data: Post): Post {
  let tagsOut = []
  let contentOut = []

  // Only include non empty content sections
  if (data.content) {
    for (let ds of data.content) {
      if (!ds.type || !ds.data) {
        continue
      }
      if (ds.data == "") {
        continue
      }

      contentOut.push({
        data: ds.data,
        type: ds.type
      })
    }
  }

  // Only include non empty tags
  if (data.tags) {
    for (let tag of data.tags) {
      if (!tag) {
        continue
      }

      tagsOut.push(tag.toString())
    }
  }

  const NIL_ID = "00000000-0000-0000-0000-000000000000"
  let userId = localStorage.getItem("userId") ?? NIL_ID

  if (editMode) {
    userId = data.author_id
  }

  let postData = {
    tags: tagsOut,
    content: contentOut,
    author_id: userId
  }

  return postData
}

function onTextPaste(idx: number, event: ClipboardEvent): void {
  let textData = event.clipboardData.getData('text')
  if (textData == "") {
    return
  }

  let split = textData.split(/\n\s*\n/g)
  if (split.length < 2) {
    return
  }

  event.preventDefault()
  post.value.content.splice(idx, 1)

  for (let p of split) {
    p = p.trim()

    if (p == "") {
      continue
    }

    let sect: Content = {
      type: 'section',
      data: p
    }

    post.value.content.splice(idx, 0, sect)
    idx++
  }
}

// Ensures data is valid :)
function validatePost(data: Post): string[] {
  let c: Content[] = data.content
  let t: string[] = data.tags
  
  let errors: string[] = []

  if (c.length < 1) {
    errors.push("No content")
  }
  if (t.length < 1) {
    errors.push("No tags set")
  }

  return errors
}

async function postPost() {
  let filtered = scrubPost(post.value)
  let errors = validatePost(filtered)

  if (errors.length > 0) {
    postingErrors.value = errors
    return
  }

  let method: string = editMode ? "PUT" : "POST"
  let apiUrl: string

  if (editMode) {
    apiUrl = `${API_URL}/posts/${post.value.id}`
  } else {
    apiUrl = `${API_URL}/posts`
  }

  let result = await fetch(
    apiUrl, 
    {
      method: method, 
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(filtered)
    }
  )

  let json = await result.json()
  let id = json.id

  router.push({name: 'post', params: {id: id}})
}

// Called when a player adds a new text element to the content
function addNewElement(type: TextContentElement) {
  let contentData = {
    type: type,
    data: ""
  }

  post.value.content.push(contentData)
}

// Called when a player moves an element up or down with the arrows left 
// of the content section
function moveInDirection(idx: number, dir: number, ev: MouseEvent): void {
  let content: any[] = post.value.content
  let nidx = idx + dir

  if (ev.shiftKey) {
    nidx = dir == 1 ? content.length - 1 : 0
  }

  if (idx < 0 || idx > content.length) {
    return
  }
  if (nidx < 0 || nidx > content.length) {
    return
  }

  let el = content[idx]!
  let other = content[nidx]

  content[idx] = other
  content[nidx] = el
}

// Called when a user clicks the 'X' next to a content section
function removeElement(idx: number): void {
  let content: any[] = post.value.content
  
  if (idx < 0 || idx > content.length) {
    return
  }

  content.splice(idx, 1)
}

// Loads an image as a base64 string from a file given by the user
function loadImage(img: File): Promise<string> {
  return new Promise((res, rej) => {
    let reader = new FileReader()
    reader.readAsDataURL(img)

    reader.onload = () => {
      res(reader.result.toString())
    }
    reader.onerror = () => {
      rej(reader.error)
    }
  })
}

declare const bootstrap: any;

// Called when user clicks "Submit" in the image upload modal
async function submitImage(event: MouseEvent): Promise<void> {
  const inputId = "imginput"
  let imginput = document.getElementById(inputId) as HTMLInputElement
  if (!imginput) {
    console.error(`Failed to find ${inputId} element`)
    return
  }

  let files: FileList = imginput.files
  if (files.length < 1) {
    return
  }

  for (let file of files) {
    let type = file.type ?? ""
    if (!type.startsWith("image/")) {
      continue
    }

    let base64 = await loadImage(file)

    let contentData: Content = {
      type: 'imagedata',
      data: base64
    }

    post.value.content.push(contentData)
  }

  imginput.value = null
  let modalElement = document.getElementById("fileModal")
  let modal = bootstrap.Modal.getInstance(modalElement)

  modal.hide()
}
</script>

<template>
  <div class="d-flex justify-content-center" style="width: 100%;">
    <div id="content-output" class="rounded mt-5 p-4 bg-darker" style="width: 90%; min-height: 50vh;">
      <h1>{{ title }}</h1>

      <div class="text-danger mb-3" v-if="postingErrors.length > 0">
        <h5 class="mb-2">Errors</h5>
        <ul>
          <li v-for="error in postingErrors">{{ error }}</li>
        </ul>
      </div>

      <h3 class="mt-4">Edit Content</h3>

      <div v-for="(section, idx) in post.content" class="d-flex justify-content-between align-items-center p-3 mb-3 gap-2">
        <div>
          <button @click="ev => moveInDirection(idx, -1, ev)" class="hover-white unstyled-button"><i class="bi bi-arrow-up"></i></button>
          <button @click="ev => moveInDirection(idx,  1, ev)" class="hover-white unstyled-button"><i class="bi bi-arrow-down"></i></button>
        </div>

        <input 
          v-if="section.type == 'title'" 
          placeholder="Enter title here..." 
          v-model="section.data" 
          class="w-100 d-block h1 p-2 mb-0"
        />
        <textarea 
          v-if="section.type == 'section'" 
          placeholder="Enter text here..." 
          class="d-block p-2 w-100 mb-0 editsection" 
          v-model="section.data"
          @paste="ev => onTextPaste(idx, ev)"
        >
        </textarea>
        <input 
          v-if="section.type == 'header'" 
          placeholder="Enter paragraph title here..." 
          class="d-block h3 p-2 w-100 mb-0" 
          v-model="section.data" 
        />
        <img 
          v-if="section.type == 'imagedata'" 
          class="editimg" 
          :src="section.data" 
          alt=""
        >
        <img 
          v-if="section.type == 'imageref'" 
          class="editimg" 
          :src="API_URL + '/images/' + section.data"
          alt=""
        >

        <button @click="removeElement(idx)" class="hover-white align-self-stretch unstyled-button">&#10005;</button>
      </div>

      <div class="d-flex gap-3">
        <div class="dropdown">
          <button class="btn btn-primary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
            Add new part...
          </button>
          <ul class="dropdown-menu">
            <li><a class="dropdown-item" @click="addNewElement('title')" href="#">New Title...</a></li>
            <li><a class="dropdown-item" @click="addNewElement('header')" href="#">New section title...</a></li>
            <li><a class="dropdown-item" @click="addNewElement('section')" href="#">New paragraph...</a></li>
            <li><a class="dropdown-item" data-bs-toggle="modal" data-bs-target="#fileModal" href="#">New image...</a></li>
          </ul>
        </div>
      </div>

      <div class="mt-4">
        <TagEdit :post="post" />
      </div>

      <button class="btn btn-primary mt-5" @click="postPost">Submit</button>
    </div>
  </div>

<!-- Modal -->
<div class="modal fade" id="fileModal" tabindex="-1" aria-labelledby="fileModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title fs-5" id="fileModalLabel">Upload image</h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <input class="form-control" id="imginput" type="file" multiple>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        <button @click="submitImage" type="button" class="btn btn-primary">Submit</button>
      </div>
    </div>
  </div>
</div>
</template>

<style>
.unstyled-button {
  background-color: unset;
  outline: unset;
  border: unset;
  height: max-content;
  padding: 0;
}
.hover-white {
  color: rgb(108, 117, 125);
  &:hover {
    color: white;
  }
}

.editimg {
  max-width: 90%;
}
.editsection {
  height: max-content; 
  min-height: max-content; 
  overflow-y: visible; 
  field-sizing: content;
}
</style>