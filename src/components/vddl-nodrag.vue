<template>
  <div class="vddl-nodrag"
       ref="$el"
       :is="props.tag"
       @dragstart="handleDragstart"
       @dragend="handleDragend">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import {defineProps, onMounted, ref} from "vue";

const props = withDefaults(defineProps<{ tag?: string; }>(), {tag: 'div'});
const $el = ref();

function handleDragstart(event) {
  if (!event._dndHandle) {
    // If a child element already reacted to dragstart and set a dataTransfer object, we will
    // allow that. For example, this is the case for user selections inside of input elements.
    if (!(event.dataTransfer.types && event.dataTransfer.types.length)) {
      event.preventDefault();
    }
    event.stopPropagation();
  }
}

function handleDragend(event) {
  if (!event._dndHandle) {
    event.stopPropagation();
  }
}

function init() {
  $el.value.setAttribute('draggable', true);
}

onMounted(() => {
  init();
})
</script>
