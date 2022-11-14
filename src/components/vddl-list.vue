<template>
  <div class="vddl-list" :is="tag"
       ref="$el"
       @dragenter.prevent="handleDragenter"
       @dragover.stop.prevent="handleDragover"
       @drop.stop.prevent="handleDrop"
       @dragleave="handleDragleave">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import {defineProps, ref, onMounted, getCurrentInstance} from 'vue';

interface Props {
  list: any[];
  tag?: string;
  allowedTypes?: string[];
  disableIf?: boolean;
  horizontal?: boolean;
  externalSources?: boolean;

  dragover?: (events) => void;
  inserted?: (events) => void;
  drop?: (events) => void;

}
const props = withDefaults(defineProps<Props>(), {tag: 'div'})

let placeholderNode = null;
let listNode = null;
const $el = ref<HTMLDivElement>();

const instance = getCurrentInstance();
const vddlDropEffectWorkaround = instance.appContext.config.globalProperties.vddlDropEffectWorkaround;
const vddlDragTypeWorkaround = instance.appContext.config.globalProperties.vddlDragTypeWorkaround;
// let vddlDropEffectWorkaround = {dropEffect: null};
// let vddlDragTypeWorkaround = {
//   isDragging: false,
//   dragType: null,
// };

function handleDragenter(event) {
  if (!isDropAllowed(event)) return true;
}

function handleDragover(event) {
  if (!isDropAllowed(event)) return true;
  if (placeholderNode.parentNode != listNode) {
    listNode.appendChild(placeholderNode);
  }
  if (event.target !== listNode) {
    // Try to find the node direct directly below the list node.
    let listItemNode = event.target;
    while (listItemNode.parentNode !== listNode && listItemNode.parentNode) {
      listItemNode = listItemNode.parentNode;
    }
    if (listItemNode.parentNode === listNode && listItemNode !== placeholderNode) {
      // If the mouse pointer is in the upper half of the child element,
      // we place it before the child element, otherwise below it.
      if (isMouseInFirstHalf(event, listItemNode)) {
        listNode.insertBefore(placeholderNode, listItemNode);
      } else {
        listNode.insertBefore(placeholderNode, listItemNode.nextSibling);
      }
    }
  } else {
    // This branch is reached when we are dragging directly over the list element.
    // Usually we wouldn't need to do anything here, but the IE does not fire it's
    // events for the child element, only for the list directly. Therefore, we repeat
    // the positioning algorithm for IE here.
    if (isMouseInFirstHalf(event, placeholderNode, true)) {
      // Check if we should move the placeholder element one spot towards the top.
      // Note that display none elements will have offsetTop and offsetHeight set to
      // zero, therefore we need a special check for them.
      while (placeholderNode.previousElementSibling
      && (isMouseInFirstHalf(event, placeholderNode.previousElementSibling, true)
          || placeholderNode.previousElementSibling.offsetHeight === 0)) {
        listNode.insertBefore(placeholderNode, placeholderNode.previousElementSibling);
      }
    } else {
      // Check if we should move the placeholder element one spot towards the bottom
      while (placeholderNode.nextElementSibling &&
      !isMouseInFirstHalf(event, placeholderNode.nextElementSibling, true)) {
        listNode.insertBefore(placeholderNode,
            placeholderNode.nextElementSibling.nextElementSibling);
      }
    }
  }
  // At this point we invoke the callback, which still can disallow the drop.
  // We can't do this earlier because we want to pass the index of the placeholder.
  if (props.dragover && !invokeCallback('dragover', event, getPlaceholderIndex())) {
    return stopDragover();
  }
  if ($el.value.className.indexOf("vddl-dragover") < 0) $el.value.className = $el.value.className.trim() + " vddl-dragover";
  return false;
}

function handleDrop(event) {
  console.log('handle drop: ', event);
  if (!isDropAllowed(event)) return true;
  // The default behavior in Firefox is to interpret the dropped element as URL and
  // forward to it. We want to prevent that even if our drop is aborted.
  // Unserialize the data that was serialized in dragstart. According to the HTML5 specs,
  // the "Text" drag type will be converted to text/plain, but IE does not do that.
  let data = event.dataTransfer.getData("Text") || event.dataTransfer.getData("text/plain");
  let transferredObject;
  try {
    transferredObject = JSON.parse(data);
  } catch (e) {
    return stopDragover();
  }
  // Invoke the callback, which can transform the transferredObject and even abort the drop.
  let index = getPlaceholderIndex();
  if (props.drop) {
    transferredObject = invokeCallback('drop', event, index, transferredObject);
    if (!transferredObject) {
      return stopDragover();
    }
  }
  // Insert the object into the array, unless drop took care of that (returned true).
  if (transferredObject !== true) {
    props.list.splice(index, 0, transferredObject);
  }
  invokeCallback('inserted', event, index, transferredObject);
  // In Chrome on Windows the dropEffect will always be none...
  // We have to determine the actual effect manually from the allowed effects
  if (event.dataTransfer.dropEffect === "none") {
    if (event.dataTransfer.effectAllowed === "copy" ||
        event.dataTransfer.effectAllowed === "move") {
      vddlDropEffectWorkaround.dropEffect = event.dataTransfer.effectAllowed;
    } else {
      vddlDropEffectWorkaround.dropEffect = event.ctrlKey ? "copy" : "move";
    }
  } else {
    vddlDropEffectWorkaround.dropEffect = event.dataTransfer.dropEffect;
  }
  // Clean up
  stopDragover();
  return false;
}

function handleDragleave(event) {
  $el.value.className = $el.value.className.replace("vddl-dragover", "").trim();
  setTimeout(() => {
    if ($el.value.className.indexOf("vddl-dragover") < 0) {
      placeholderNode.parentNode && placeholderNode.parentNode.removeChild(placeholderNode);
    }
  }, 100);
}

// Checks whether the mouse pointer is in the first half of the given target element.
function isMouseInFirstHalf(event, targetNode, relativeToParent?) {
  let mousePointer = props.horizontal ? (event.offsetX || event.layerX)
      : (event.offsetY || event.layerY);
  let targetSize = props.horizontal ? targetNode.offsetWidth : targetNode.offsetHeight;
  let targetPosition = props.horizontal ? targetNode.offsetLeft : targetNode.offsetTop;
  targetPosition = relativeToParent ? targetPosition : 0;
  return mousePointer < targetPosition + targetSize / 2;
}

/**
 * Tries to find a child element that has the 'vddl-placeholder' class set. If none was found, a
 * new div element is created.
 */
function getPlaceholderElement() {
  let placeholder,
      oldPlaceholder = $el.value.parentNode.querySelectorAll('.vddl-placeholder');
  if (oldPlaceholder.length > 0) {
    placeholder = oldPlaceholder[0];
    return placeholder;
  }
  let newPlaceholder = document.createElement('div');
  newPlaceholder.setAttribute('class', 'vddl-placeholder');
  return newPlaceholder;
}

function getPlaceholderIndex() {
  return Array.prototype.indexOf.call(listNode.children, placeholderNode);
}

/**
 * Checks various conditions that must be fulfilled for a drop to be allowed
 */
function isDropAllowed(event) {
  // Disallow drop from external source unless it's allowed explicitly.
  if (!vddlDragTypeWorkaround.isDragging && !props.externalSources) return false;
  // Check mimetype. Usually we would use a custom drag type instead of Text, but IE doesn't
  // support that.
  if (!hasTextMimetype(event.dataTransfer.types)) return false;
  // Now check the allowed-types against the type of the incoming element. For drops from
  // external sources we don't know the type, so it will need to be checked via drop.
  if (props.allowedTypes && vddlDragTypeWorkaround.isDragging) {
    let allowed = props.allowedTypes;
    if (Array.isArray(allowed) && allowed.indexOf(vddlDragTypeWorkaround.dragType) === -1) {
      return false;
    }
  }
  // Check whether droping is disabled completely
  return !props.disableIf;

}

/**
 * Small helper function that cleans up if we aborted a drop.
 */
function stopDragover() {
  placeholderNode.parentNode && placeholderNode.parentNode.removeChild(placeholderNode);
  $el.value.className = $el.value.className.replace("vddl-dragover", "").trim();
  return true;
}

/**
 * Invokes a callback with some interesting parameters and returns the callbacks return value.
 */
function invokeCallback(expression, event, index, item?) {
  let fn = props[expression];
  if (fn) {
    fn({
      event: event,
      index: index,
      item: item || undefined,
      list: props.list,
      external: !vddlDragTypeWorkaround.isDragging,
      type: vddlDragTypeWorkaround.isDragging ? vddlDragTypeWorkaround.dragType : undefined
    });
  }
  return !!fn;
}

/**
 * Check if the dataTransfer object contains a drag type that we can handle. In old versions
 * of IE the types collection will not even be there, so we just assume a drop is possible.
 */
function hasTextMimetype(types) {
  if (!types) return true;
  for (let i = 0; i < types.length; i += 1) {
    if (types[i] === "Text" || types[i] === "text/plain") return true;
  }
  return false;
}

function init() {
  placeholderNode = getPlaceholderElement();
  listNode = $el.value;
  placeholderNode.parentNode && placeholderNode.parentNode.removeChild(placeholderNode);
}

onMounted(()=> {
  init();
})
</script>

<style scoped>

</style>
