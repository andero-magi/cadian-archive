<template>
  <form class="d-flex gap-3" @submit.prevent="onSubmitTag">
    <input 
      placeholder="Search for a tag..." 
      class="form-control taginput" 
      type="text" 
      v-model="taginput"
      @input="onInputTyped"
      @focus="onFocusSearchbar" 
      @blur="onBlurSearchbar"
    >
    <button v-if="buttonType != 'none'" type="submit" class="btn btn-primary">
      <template v-if="buttonType == 'submit'">Submit</template>
      <template v-else>Search...</template>
    </button>
  </form>

  <div @click="onSuggestionClick" class="tagsuggests" v-if="suggestionsVisible">
    <div :tag-name="tag.name" class="suggestion-item" v-for="tag in tags">
      <template v-if="tag.alias_for">
        {{ tag.name }} <span class="text-muted">&rarr;</span> {{ tag.alias_for }}
      </template>
      <template v-else>
        {{ tag.name }}
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { API_URL } from '@/consts';
import { FieldSearch, TagSearch } from '@/utilities/tags-parser';
import { ref } from 'vue';

interface TagSuggestion {
  name: string
  alias_for?: string
}

type ButtonType = "submit" | "search" | "none"
type AcceptingSearch = "search" | "onlytags"

const props = defineProps<{
  button?: ButtonType,
  accepting?: AcceptingSearch
}>()

const buttonType: ButtonType = props.button ?? "submit"
const accepts : AcceptingSearch = props.accepting ?? "search"

const emit = defineEmits<{
  'tag-submit': [tag: TagSearch | FieldSearch]
}>()

const tags = ref<TagSuggestion[]>([])
const suggestionsVisible = ref<boolean>(false)
const taginput = ref<string>("")

const existingTags: TagSuggestion[] = []

let blurTimeoutId: number = 0

await queryExistingTags()

function onBlurSearchbar() {
  if (blurTimeoutId != 0) {
    return
  }

  // Ignore TS error here, it thinks we're in NodeJS (we kinda are)
  // but we're actually running on the browser, so timeout returns a 
  // number ID instead of a handle object
  blurTimeoutId = setTimeout(() => {
    suggestionsVisible.value = false
    blurTimeoutId = 0
  }, 100);
}

function onFocusSearchbar(): void {
  suggestionsVisible.value = true

  if (blurTimeoutId == 0) {
    return
  }

  clearTimeout(blurTimeoutId)
  blurTimeoutId = 0
}

function onInputTyped(event: InputEvent): void {
  let el: HTMLInputElement = event.target as HTMLInputElement
  let value = el.value

  if (value == "") {
    tags.value = existingTags
    return
  }

  let arr = []
  for (let t of existingTags) {
    let name = t.name

    if (value == name || name.includes(value)) {
      arr.push(t)
    }

    if (arr.length > 10) {
      break
    }
  }

  tags.value = arr
}

function onSuggestionClick(input: MouseEvent): void {
  let el = input.target as HTMLElement
  let tag = el.getAttribute("tag-name")

  if (!tag) {
    return
  }

  suggestionsVisible.value = false
  if (blurTimeoutId != 0) {
    clearTimeout(blurTimeoutId)
  }

  fireSubmit(tag)
}

function onSubmitTag(event: InputEvent): void {
  let tag = taginput.value

  if (!tag || tag.trim() == "") {
    return
  }

  fireSubmit(tag)
}

function fireSubmit(tag: string): void {
  tag = tag.trim()
  let obj = new TagSearch()

  if (tag.startsWith("!") || tag.startsWith("-")) {
    obj.negated = true
    tag = tag.substring(1).trim()
  }

  obj.tagName = tag

  emit("tag-submit", obj)

  taginput.value = ""

  updateTagSuggestions(existingTags)
}

function updateTagSuggestions(arr: TagSuggestion[]): void {
  const maxSuggestions = 10

  if (arr.length > maxSuggestions) {
    arr = arr.slice(0, maxSuggestions)
  }

  tags.value = arr
}

async function queryExistingTags(): Promise<void> {
  let response = await fetch(`${API_URL}/tags`)

  if (!response.ok) {
    tags.value = existingTags
    return
  }

  let json: any[] = await response.json()

  for (let {id, parent_id, is_alias} of json) {
    let data: TagSuggestion

    if (is_alias) {
      data = { name: id, alias_for: parent_id }
    } else {
      data = { name: id }
    }

    existingTags.push(data)
  }

  updateTagSuggestions(existingTags)
}
</script>

<style>

.taginput {

}

.tagsuggests {
  position: absolute;
  background-color: #212529;
  max-height: 200px;
  overflow-y: scroll;
  width: max-content;
}

.suggestion-item {
  padding: 0.3rem;
  padding-right: 10rem;

  &:hover {
    background-color: #1e2023;
    cursor: pointer;
  }
}
</style>