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
    <div class="deck" :style="{ '--hPage': hmain }">
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
          largeur="200px"
        />
      </div>
      <div class="separateur"></div>

      <Carte_familier v-if="deckFamilier" :data="deckFamilier" largeur="200px"/>
      <img v-else src="@/assets/imgs/carte/carte_ajout.png" alt="Carte_à_Ajouter" id="familier">
      <Carte_terrain v-if="deckTerrain" :data="deckTerrain" largeur="200px" />
      <img v-else src="@/assets/imgs/carte/carte_ajout.png" alt="Carte_à_Ajouter" id="terrain">
    </div>

    <div class="separateurDeckCollection" :style="{ '--vhPx': vh+'px' }"></div>

    <div class="collection">
      <div class="collecMembre" :style="{ '--wgap': gapCollec }">
        <Carte_membre v-for="carte of membres"
          :key="carte.card.cardId"
      
        :data="carte.card" largeur="200px" class="membre"/>
        <Carte_membre v-for="carte of membres"
          :key="carte.card.cardId + 1"
      
        :data="carte.card" largeur="200px" class="membre"/>
        <Carte_membre v-for="carte of membres"
          :key="carte.card.cardId + 2"
      
        :data="carte.card" largeur="200px" class="membre"/>
        <Carte_membre v-for="carte of membres"
          :key="carte.card.cardId + 3"
      
        :data="carte.card" largeur="200px" class="membre"/>
      </div>

      <div class="separateur"></div>

      <div class="collecFamilier">
        <Carte_familier v-for="carte of familiers"
          :key="carte.card.cardId"
      
        :data="carte.card" largeur="200px" class="familier"/>
      </div>
      

      <div class="collecTerrain">
        <Carte_terrain v-for="carte of terrains"
          :key="carte.card.cardId"
          
            :data="carte.card" largeur="200px" class="terrain"/>
      </div>
      
    </div>
    
  </main>
</template>

<script setup>
import { ref, computed } from 'vue';
import clef from '@/Composants/clef.vue';

import MonHeader from '@/Composants/header.vue';
import Carte_membre from './Composants/carte_membre.vue';
import Carte_familier from './Composants/carte_familier.vue';
import Carte_terrain from './Composants/carte_terrain.vue';

const vh = ref(window.innerHeight / 100); //obtenir 1% de la hauteur de la fenetre, en px
const vw = ref(window.innerWidth / 100);
const hmain = ref(vh.value * 87.5 - 278 - 20*2 + 'px');
const gapCollec = ref(((vw.value * 100 - 40) * 0.7 - (200 * 5))/5 + 'px') //(100vw - padding de div deck)*0.7 pour en avoir 70% (14*5) - l'espace pris par les 5 cartes / tout divisé par 5 pour avoir un seul espace

const userData = ref(JSON.parse(localStorage.getItem('userData'))); //OK
const nbCles = ref(userData.value.balance); 

const deckMembre = userData.value.deck.cards;
const deckFamilier = userData.value.deck.pet;
const deckTerrain = userData.value.deck.arena;

const collection = computed(() => { return userData.value.collection;});
const membres = computed(() => {
  return collection.value.filter( 
    carte => carte.card._class === 'member' 
  )
})
const familiers = computed(() => { //computed : prend une fonction en parametre : elle est recalculée dès que collection change
  return collection.value.filter( 
    carte => carte.card._class === 'pet' //condition fonction fléchée)qui doit etre a true pour etre selectionnée par filter
    // carte est l'élément examiné par filter lorsqu'il parcours collection
  )
})
const terrains = computed(() => {
  return collection.value.filter( 
    carte => carte.card._class === 'arena' 
  )
})
console.log(familiers.value[0].card)

</script>

<style scoped>
@import './assets/css/combat.css';
</style>
