<template>
  <div class="vddl-placeholder"
       :is="props.tag">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import {defineProps, withDefaults} from 'vue';

const props = withDefaults(defineProps<{
  tag?: string;
}>(), {tag: 'div'});

</script>
