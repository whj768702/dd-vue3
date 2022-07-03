import type { App } from 'vue';
import { Hello } from './components';

const install = (app: App, options: { msg: string }) => {
  app.component('dd-hello', Hello);
  app.provide('msg', options.msg);
}

export default { install };
export { Hello }