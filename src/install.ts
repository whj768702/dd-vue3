import { App } from 'vue';
import Hello from './components/hello.vue';

const install = (app: App) => {
  app.component('dd-hello', Hello);
}

export default { install };

let a = 10;
export { a }