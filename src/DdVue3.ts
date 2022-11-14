import type { App, Component } from 'vue';
import { Hello } from './components/index';

import List from './components/dd-list.vue';

const install = (app: App, options: { msg: string }) => {
  app.config.globalProperties.vddlDropEffectWorkaround = {dropEffect: null};
  app.config.globalProperties.vddlDragTypeWorkaround = {
    isDragging: false,
    dragType: '',
  };
  app.component('dd-hello', Hello as Component<{ msg: string }>);
  app.provide('msg', options.msg);
}

export default { install };
export { Hello }
