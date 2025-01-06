<script setup lang="ts">
import { getPost } from '@/utils';
import { ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute()
const props = defineProps(["edit"])
const post = ref({})

const editMode = props.edit ?? false

if (editMode) {
  let id: string = route.params.id as string
  let postData = await getPost(id)
  post.value = postData
}

function loadDataFromSections() {

}

function postPost() {

}
</script>


<template></template>