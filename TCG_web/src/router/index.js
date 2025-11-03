import { createRouter, createWebHistory } from 'vue-router';
import Booster from '../Booster.vue'; // chemin correct
import Login from '../Login.vue';

const routes = [
  { path: '/booster', component: Booster },
  { path: '/connexion', component: Login },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
