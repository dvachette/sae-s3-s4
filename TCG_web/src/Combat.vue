<template>
  <MonHeader />
  <main>
    <div class="page_combat" :style="{ '--hPage': hmain }">
      <div class="F_f">
        <img src="@/assets/imgs/ff_logo.png" alt="Page F/f" />
        <button>Forces et faiblesses</button>
      </div>
      <div class="lancement_partie">
        <img src="@/assets/imgs/ff_logo.png" alt="img terrain" />
        <router-link to="/duel" active-class="active"
          ><button>JOUER</button></router-link
        >
      </div>
      <div class="Compteur">
        <clef />
      </div>
    </div>
    <div class="deck">
      <p>Mon deck</p>
      <p>Familier</p>
      <p>Terrain</p>

      <Carte_membre
        v-for="carte in deck"
        :key="carte.id"
        :data="carte"
        largeur="120px"
      />

      <div id="separateur"></div>

      <Carte_membre largeur="120px" />
      <Carte_membre largeur="120px" />
    </div>
  </main>
</template>

<script setup>
import { ref } from 'vue';
import clef from '@/Composants/clef.vue';

import MonHeader from '@/Composants/header.vue';
import Carte_membre from './Composants/carte_membre.vue';

const vh = ref(window.innerHeight / 100); //obtenir 1% de la hauteur de la fenetre, en px
const hmain = ref(vh.value * 87.5 - 166.8 - 20 * 2 + 'px');

const deck = ref([]);

deck.value = [
  { id: 1, niv: 2 },
  { id: 2, niv: 11 },
  { id: 3, niv: 1 },
  { id: 4, niv: 8 },
  { id: 5, niv: 78 },
];
</script>

<style scoped>
@import './assets/css/combat.css';
</style>
