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
  }
}
</script>

<template>
  <div class="sticky-top d-flex flex-column flex-shrink-0 p-3 text-white bg-darker" style="width: 280px; height: 100vh;">
    <h5 class="mb-4">Post Tags</h5>
    <h5 class="mb-4">Metadata</h5>
    <div>
      <dl>
        <dt>Upload Date</dt>
        <dd>{{ currentPost.upload_date }}</dd>

        <dt>Modified Date</dt>
        <dd>{{ currentPost.modified_date }}</dd>

        <dt>Uploader</dt>
        <dd>{{ currentPost.author_id }}</dd>
      </dl>
    </div>
  </div>
</template>
