import { createRouter, createWebHistory } from 'vue-router';
import Booster from '../Booster.vue';
import Login from '../Login.vue';
import Combat from '../Combat.vue';
import Collection from '../Collection.vue';
import Boutique from '../Boutique.vue';
import Social from '../Social.vue';
import Profil from '../Profil.vue';
import CreationCompte from '../CreationCompte.vue';
import Ouverture from '../ouverture.vue';

const routes = [
  { path: '/booster', component: Booster },
  { path: '/', component: Login },
  { path: '/combat', component: Combat },
  { path: '/collection', component: Collection },
  { path: '/boutique', component: Boutique },
  { path: '/social', component: Social },
  { path: '/profil', component: Profil },
  { path: '/creationcompte', component: CreationCompte },
  { path: '/ouverture', component: Ouverture },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
