<template>
  <div id="content-output" class="rounded mt-5 p-4 bg-darker" style="width: 90%; min-height: 50vh;">
    
  </div>
</template>

<script>
export default {
  data() {
    return {
      currentPost: Object
    }
  },
  async created() {
    let idParam = this.$route.params.id
    let fetched = await fetch(`http://localhost:8080/posts/${idParam}`)
    this.currentPost = await fetched.json()

    let el = document.getElementById("content-output")
    console.log(el)

    let content = this.currentPost.content

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
        el.appendChild(h2)

        continue
      }

      let img = document.createElement("img")
      img.src = `http://localhost:8080/images/${c.data}`
      el.appendChild(img)
    }
  }
}
</script>
