<template>
  <div class="home">
    <HelloWorld msg="Welcome to Your Vue.js + TypeScript App" />
    <dd-hello msg="my first plugin haha "></dd-hello>
    <div>second</div>
    <dd-hello :msg="a" />
    <div>third</div>
    <dd-hello />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import HelloWorld from '@/components/HelloWorld.vue'; // @ is an alias to /src

export default defineComponent({
  name: 'HomeView',
  components: {
    HelloWorld,
  },
  data() {
    return {
      a: 100
    }
  }
});
</script>
