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
        <img v-if="!carte" src="@/assets/imgs/carte/carte_ajout.png" alt="Carte_à_Ajouter">
        
        <Carte_membre
          v-else
          :data="carte"
          largeur="150px"
        />
      </div>
      <div id="separateur"></div>

      <Carte_familier v-if="familier" :data="familier" largeur="150px"/>
      <img v-else src="@/assets/imgs/carte/carte_ajout.png" alt="Carte_à_Ajouter" id="familier">
      <Carte_terrain v-if="terrain" :data="terrain" largeur="150px" />
      <img v-else src="@/assets/imgs/carte/carte_ajout.png" alt="Carte_à_Ajouter" id="terrain">
    </div>

    
  </main>
</template>

<script setup>
import { ref } from 'vue';
import clef from '@/Composants/clef.vue';

import MonHeader from '@/Composants/header.vue';
import Carte_membre from './Composants/carte_membre.vue';
import Carte_familier from './Composants/carte_familier.vue';
import Carte_terrain from './Composants/carte_terrain.vue';

const vh = ref(window.innerHeight / 100); //obtenir 1% de la hauteur de la fenetre, en px
const hmain = ref(vh.value * 87.5 - 208.5 - 20*2 + 'px');

const userData = ref(JSON.parse(localStorage.getItem('userData'))); //OK
const nbCles = ref(userData.value.balance); 

const deckMembre = userData.value.deck.cards;
const familier = userData.value.deck.pet;
const terrain = userData.value.deck.arena;

const collection = userData.value.collection;

</script>

<style scoped>
@import './assets/css/combat.css';
</style>
