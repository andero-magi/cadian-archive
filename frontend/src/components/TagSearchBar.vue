<template>
  <input type="text" @change="onInputTyped">
</template>

<script setup lang="ts">
import { ref } from 'vue';

const emits = defineEmits(["change"])
const tags = ref<string[]>([])

function onInputTyped(event: Event): void {
  
}
</script>