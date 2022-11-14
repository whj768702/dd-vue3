<template>
  <div ref="$el" class="vddl-draggable"
       :is="tag"
       @dragstart.stop="handleDragstart"
       @dragend.stop="handleDragend"
       @click.stop="handleClick"
       @selectstart="handleSelected">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import {onMounted, watch, nextTick, ref, getCurrentInstance} from "vue";

interface Props {
  draggable: Object|[];
  wrapper?: [];
  index?: number;
  tag?: string;
  effectAllowed?: string;
  type?: string;
  disableIf?: boolean;
  dragstart?: (events) => void;
  selected?: (events) => void;
  dragend?: (events, target) => void;
  moved?: (events) => void;
  copied?: (boolean,events) => void;
  canceled?: (events) => void;
}

const props = withDefaults(defineProps<Props>(), {
  tag: 'div'
});

let $el = ref();

const instance = getCurrentInstance();
const vddlDropEffectWorkaround = instance.appContext.config.globalProperties.vddlDropEffectWorkaround;
const vddlDragTypeWorkaround = instance.appContext.config.globalProperties.vddlDragTypeWorkaround;
// let vddlDropEffectWorkaround = {dropEffect: null};
// let vddlDragTypeWorkaround = {
//   isDragging: false,
//   dragType: null,
// };

function handleDragstart(event) {
  let draggable = JSON.stringify(props.draggable);
  // Check whether the element is draggable, since dragstart might be triggered on a child.
  if (draggable == 'false' || props.disableIf) return true;
  // Serialize the data associated with this element. IE only supports the Text drag type
  event.dataTransfer.setData("Text", draggable);
  // Only allow actions specified in effect-allowed attribute
  event.dataTransfer.effectAllowed = props.effectAllowed || "move";
  // Add CSS classes. IE9 not support 'classList'
  $el.value.className = $el.value.className.trim() + " vddl-dragging";
  setTimeout(() => {
    $el.value.className = $el.value.className.trim() + " vddl-dragging-source";
  }, 0);
  // Workarounds for stupid browsers, see description below
  vddlDropEffectWorkaround.dropEffect = "none";
  vddlDragTypeWorkaround.isDragging = true;
  // Save type of item in global state. Usually, this would go into the dataTransfer
  // typename, but we have to use "Text" there to support IE
  vddlDragTypeWorkaround.dragType = props.type || undefined;
  // Try setting a proper drag image if triggered on a vddl-handle (won't work in IE).
  if (event._dndHandle && event.dataTransfer.setDragImage) {
    event.dataTransfer.setDragImage($el.value, event._dndHandleLeft, event._dndHandleTop);
  }
  // Invoke callback
  if (typeof (props.dragstart) === 'function') {
    props.dragstart(event.target);
  }
}

function handleDragend(event) {
  let dropEffect = vddlDropEffectWorkaround.dropEffect;
  switch (dropEffect) {
    case "move":
      if (typeof (props.moved) === 'function') {
        nextTick(() => {
          props.moved({
            index: props.index,
            list: props.wrapper,
            event: event.target,
            draggable: props.draggable,
          });
        });
      } else {
        nextTick(() => {
          props.wrapper.splice(props.index, 1);
        });
      }
      break;
    case "copy":
      if (typeof (props.copied) === 'function') {
        props.copied(props.draggable, event.target);
      }
      break;
    case "none":
      if (typeof (props.canceled) === 'function') {
        props.canceled(event.target);
      }
      break;
  }
  if (typeof (props.dragend) === 'function') {
    props.dragend(dropEffect, event.target);
  }
  // Clean up
  $el.value.className = $el.value.className.replace("vddl-dragging", "").trim();
  setTimeout(() => {
    if ($el.value) $el.value.className = $el.value.className.replace("vddl-dragging-source", "").trim();
  }, 0);
  vddlDragTypeWorkaround.isDragging = false;
}

function handleClick(event) {
  if (!props.selected) return;
  if (typeof (props.selected) === 'function') {
    props.selected(props.wrapper[props.index]);
  }
}

/**
 * Workaround to make element draggable in IE9
 * http://stackoverflow.com/questions/5500615/internet-explorer-9-drag-and-drop-dnd
 */
function handleSelected() {
  // if (this.dragDrop) this.dragDrop();
  // return false;
}

// init
function init() {
  let status = true;
  if (props.disableIf) status = false;
  $el.value.setAttribute('draggable', status);
}

watch(() => props.disableIf, (val) => {
  $el.value.setAttribute('draggable', !val);
});
onMounted(() => {
  init();
})
</script>
