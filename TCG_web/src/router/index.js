import { createRouter, createWebHistory } from 'vue-router';
import Booster from '../Booster.vue'; // chemin correct
import Login from '../Login.vue';
import Combat from '../Combat.vue';
import Collection from '../Collection.vue';
import Boutique from '../Boutique.vue';
import Social from '../Social.vue';
import Profil from '../Profil.vue';

const routes = [
  { path: '/booster', component: Booster },
  { path: '/connexion', component: Login },
  { path: '/combat', component: Combat },
  { path: '/collection', component: Collection },
  { path: '/boutique', component: Boutique },
  { path: '/social', component: Social },
  { path: '/profil', component: Profil },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
