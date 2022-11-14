import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// import ddVue3 from '../../src/DdVue3';
import ddVue3 from 'dd-vue3';

import ViewerPlugin from 'viewer-img-vue';
import 'viewer-img-vue/styles.css';

const app = createApp(App);

app.use(store);
app.use(router);
console.log('ddVue3: ', ddVue3);

app.use(ddVue3, { msg: 'provide msg' });

app.use(ViewerPlugin);

app.mount('#app')
