<script setup>
import { onMounted } from 'vue';

const props = defineProps(["post"])
const currentPost = props.post

onMounted(() => {
  renderPostContent()
})

function renderPostContent() {
  const element = document.getElementById("content-output")

  if (!element || !currentPost) {
    return
  }

  let content = currentPost.content

  for (let c of content) {
    let type = c.type

    if (type == 'header' || type == "title" || type == "section") {
      let tagName
    
      if (type == "header") {
        tagName = "h2"
      } else if (type == "title") {
        tagName = "h1"
      } else  {
        tagName = "p"
      }

      let h2 = document.createElement(tagName)
      h2.textContent = c.data
      element.appendChild(h2)

      continue
    }

    // type = imageref
    let img = document.createElement("img")
    img.src = `http://localhost:8080/images/${c.data}`
    element.appendChild(img)
  }
}

</script>

<template>
  <div id="content-output" class="rounded mt-5 p-4 bg-darker" style="width: 90%; min-height: 50vh;">
    
  </div>
</template>
