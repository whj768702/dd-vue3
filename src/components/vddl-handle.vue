<template>
  <div class="vddl-handle"
       ref="$el"
       :is="props.tag"
       @dragstart="handle"
       @dragend="handle">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import {defineProps, withDefaults, onMounted, ref} from "vue";

const props = withDefaults(defineProps<{
  handleLeft: number,
  handleTop: number,
  tag?: string;
}>(), {
  tag: 'div'
});

const $el = ref();

function handle(event) {
  event._dndHandle = true;
  event._dndHandleLeft = props.handleLeft || 0;
  event._dndHandleTop = props.handleTop || 0;
}

function init() {
  $el.value.setAttribute('draggable', 'true');
}

onMounted(() => {
  init();
})
</script>
