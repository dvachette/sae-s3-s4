import { createApp } from 'vue';
import App from './App.vue';
import './assets/css/style.css'
import { createRouter, createWebHistory } from 'vue-router';
import Login from './Login.vue';
import Booster from './Booster.vue';

const routes = [
    {path: '/', component: Login},
    {path: '/booster', component: Booster}
]
const router = createRouter({
    history: createWebHistory(),
    routes,
});
createApp(App).use(router).mount('#app');
