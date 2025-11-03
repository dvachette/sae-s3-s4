import { createApp } from 'vue';
import App from './App.vue';
import './assets/css/style.css';
import router from './router';
import Login from './Login.vue';
import Booster from './Booster.vue';

createApp(App).use(router).mount('#app');
