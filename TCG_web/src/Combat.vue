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
        <clef :cles="nbCles" />
      </div>
    </div>
    <div class="deck">
      <p>Mon deck</p>
      <p>Familier</p>
      <p>Terrain</p>

      <div class="carteMembreDeck" 
        v-for="(carte, index) in deckMembre"
        :key="index"
      >
        <div class="carteVide"
          v-if="!carte"
        ></div>

        <Carte_membre
          v-else
          :data="carte"
          largeur="120px"
        />
      </div>
      <div id="separateur"></div>

      <Carte_membre v-if="!deckMembre[2]" :data="deckMembre[2]" largeur="120px" />
      <Carte_membre v-if="!deckMembre[2]" :data="deckMembre[2]" largeur="120px" />
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



const userData = ref(JSON.parse(localStorage.getItem('userData'))); //OK
const nbCles = ref(userData.value.balance); 
console.log(userData.value.deck);
const deckMembre = userData.value.deck.cards;
console.log(deckMembre[2]);
const familier = userData.value.deck.pet;
const terrain = userData.value.deck.arena;

</script>

<style scoped>
@import './assets/css/combat.css';
</style>
