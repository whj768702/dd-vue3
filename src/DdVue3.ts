import type { App, Component } from 'vue';
import { Hello } from './components/index';

const install = (app: App, options: { msg: string }) => {
  app.component('dd-hello', Hello as Component<{ msg: string }>);
  app.provide('msg', options.msg);
}

export default { install };
export { Hello }