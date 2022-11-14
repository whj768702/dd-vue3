import type { App, Component } from 'vue';
import { Hello } from './components/index';

import List from './components/vddl-list.vue';
import Draggable from './components/vddl-draggable.vue';
import Nodrag from './components/vddl-nodrag.vue';
import Handle from './components/vddl-handle.vue';
import Placeholder from './components/vddl-placeholder.vue';


const install = (app: App, options: { msg: string }) => {
  app.config.globalProperties.vddlDropEffectWorkaround = {dropEffect: null};
  app.config.globalProperties.vddlDragTypeWorkaround = {
    isDragging: false,
    dragType: '',
  };
  app.component('vddl-draggable', Draggable);
  app.component('vddl-list', List);
  app.component('vddl-nodrag', Nodrag);
  app.component('vddl-handle', Handle);
  app.component('vddl-placeholder', Placeholder);
  app.component('dd-hello', Hello as Component<{ msg: string }>);
  app.provide('msg', options.msg);
}

export default { install };
export { Hello, List, Draggable }
