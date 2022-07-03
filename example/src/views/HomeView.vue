<template>
  <div class="home">
    <HelloWorld msg="Welcome to Your Vue.js + TypeScript App" />
    <dd-hello msg="my first plugin haha "></dd-hello>
    <div>second</div>
    <dd-hello :msg="a" />
    <div>third</div>
    <dd-hello></dd-hello>
    <div>fourth</div>
    <special-uploader></special-uploader>
  </div>
</template>

<script lang="ts" setup>
import HelloWorld from '@/components/HelloWorld.vue'; // @ is an alias to /src
import { SpecialUploader } from 'viewer-img-vue';
import { Hello } from 'dd-vue3'

let a = 100;
</script>
