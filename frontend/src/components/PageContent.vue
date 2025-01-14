<script setup>
import { API_URL } from '@/consts';

const props = defineProps(["post"])
const currentPost = props.post;

</script>

<template>
  <div class="rounded mt-5 p-4 bg-darker" style="width: 90%; min-height: 50vh;">
    <template v-for="sect in currentPost.content">
      <h1 v-if="sect.type == 'title'">{{ sect.data }}</h1>
      <h3 v-if="sect.type == 'header'">{{ sect.data }}</h3>
      <p v-if="sect.type == 'section'">{{ sect.data }}</p>
      <img class="postimg" v-if="sect.type == 'imagedata'" :src="sect.data"/>
      <img class="postimg" v-if="sect.type == 'imageref'" :src="`${API_URL}/images/${sect.data}`"/>
    </template>
  </div>
</template>

<style>
.postimg {
  max-width: 95%;
  display: block;
  margin-left: auto;
  margin-right: auto;
}
</style>