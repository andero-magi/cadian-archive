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
    console.log(fetched)

    this.currentPost = await fetched.json()
    console.log(this.currentPost)

    this.currentPost.upload_date = new Date(this.currentPost.upload_date)
    this.currentPost.modified_date = new Date(this.currentPost.modified_date)
  }
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
          <li><a class="dropdown-item" tag-act="add" :tag="t" href="#">Add to search</a></li>
          <li><a class="dropdown-item" tag-act="remove" :tag="t" href="#">Remove from search</a></li>
          <li><a class="dropdown-item" tag-act="search" :tag="t" href="#">Search for</a></li>
        </ul>
      </div>
    </div>

    <h5 class="mb-2 mt-4">Metadata</h5>
    <div>
      <dl>
        <dt>Upload Date</dt>
        <dd>{{ currentPost.upload_date.toUTCString() }}</dd>

        <dt>Modified Date</dt>
        <dd>{{ currentPost.modified_date.toUTCString() }}</dd>

        <dt>Uploader</dt>
        <dd>{{ currentPost.author_id }}</dd>
      </dl>
    </div>
  </div>
</template>
