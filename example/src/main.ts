import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import ddVue3 from '../../src/DdVue3';
// import ddVue3 from 'dd-vue3'

const app = createApp(App);

app.use(store);
app.use(router);

app.use(ddVue3, { msg: 'provide msg' });

app.mount('#app')
