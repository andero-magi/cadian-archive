<template>
  <div :class="dropdown ? 'dropdown' : null">
    <button
      tag
      :tag-negated="tag.negated"
      @click="onTagClicked"
      :class="'d-flex justify-content-between bg-dark rounded-pill px-3 py-1 border m-1' + (fullwidth ? ' tsb-full-width' : '')"
      :data-bs-toggle="dropdown ? 'dropdown' : null"
      :aria-expanded="dropdown ? 'false' : null"

      type="button"
    >
      <span :class="dropdown ? ' dropdown-toggle' : null">{{ tag.toPrettyString() }}</span>
      <button v-if="removecross" class="tag-negate-toggle">&#10005;</button>
    </button>

    <ul v-if="dropdown" class="dropdown-menu tag-action-listeners">
      <li><a @click="onDropdownClick" class="dropdown-item" tag-act="add" href="#">Add to search</a></li>
      <li><a @click="onDropdownClick" class="dropdown-item" tag-act="rem" href="#">Remove from search</a></li>
      <li><a @click="onDropdownClick" class="dropdown-item" tag-act="set" href="#">Search for...</a></li>
      <li><a @click="onDropdownClick" class="dropdown-item" tag-act="exl" href="#">Exclude from search</a></li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { FieldSearch, TagSearch } from '@/utilities/tags-parser';
import { ref } from 'vue';

type SearchTerm = TagSearch | FieldSearch

const emit = defineEmits<{
  tagclick: [tag: SearchTerm],
  crossclick: [tag: SearchTerm]
}>()
const props = defineProps<{
  tag: SearchTerm
  dropdown?: boolean
  removecross?: boolean
  fullwidth?: boolean
}>()

const tag = ref(props.tag)
const dropdown = props.dropdown ?? false
const removecross = props.removecross ?? false
const fullwidth = props.fullwidth ?? false

function onTagClicked(event: MouseEvent): void {
  let el = event.target as HTMLElement

  if (el.classList.contains("tag-negate-toggle")) {
    tag.value.negated = !tag.value.negated
    emit('crossclick', tag.value)

    return
  }

  emit('tagclick', tag.value)
}

function onDropdownClick(ev: MouseEvent) {
  let target: HTMLElement = ev.target as HTMLElement
  let tagAct = target.getAttribute("tag-act")

  if (!tagAct) {
    return
  }

  ev.preventDefault()
  let evType = `tag${tagAct}`

  let event = new CustomEvent(evType, {detail: tag.toString()})
  document.body.dispatchEvent(event)
}

</script>

<style>
[tag] {
  &:hover {
    cursor: pointer;
    border-color: var(--bs-primary) !important;
    background-color: rgb(55, 61, 66) !important;
  }

  &:not([data-bs-toggle]):hover span {
    text-decoration: line-through;
  }

  &[tag-negated="true"] span:first-of-type {
    text-decoration: line-through;
    color: gray;
  }
}

.tag-negate-toggle {
  background-color: unset;
  border: unset;

  &:hover {
    color: gray;
  }
}

.tsb-full-width {
  width: 100%;
}
</style>