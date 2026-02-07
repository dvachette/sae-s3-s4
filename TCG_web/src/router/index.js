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
import Socket from '../Socket.vue';
import duel from '../duel.vue';
import duel_resultat from '@/duel_resultat.vue';
import Admin from '../Admin.vue';
import creation_echange from '@/Composants/creation_echange.vue';
import AdminCollection from '@/AdminCollection.vue';
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
  { path: '/socket', component: Socket },
  { path: '/duel', component: duel },
  { path: '/duel_resultat', component: duel_resultat },
  { path: '/admin/users', component: Admin },
  { path: '/admin/collection/:userId', component: AdminCollection },
  { path: '/creation_echange', component: creation_echange },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
