<script lang="ts" setup>
import { inject, defineProps } from 'vue';

const props = defineProps<{ msg: string }>();
const defaultMsg: string = inject('msg') as string;

const msg = props.msg ?? defaultMsg;

</script>

<template>
  <div>
    here is hello msg: {{ msg }}
  </div>
</template>