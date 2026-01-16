import { createApp } from 'vue';
import App from './App.vue';
import './assets/css/style.css';
import router from './router';
import Login from './Login.vue';
import Booster from './Booster.vue';
import Combat from './Combat.vue';
import Collection from './Collection.vue';
import Boutique from './Boutique.vue';
import Social from './Social.vue';
import Profil from './Profil.vue';
import Duel from './duel.vue';
import duel_resultat from './duel_resultat.vue';
import creation_echange from './Composants/creation_echange.vue';

const app = createApp(App);
createApp(App).use(router).mount('#app');
