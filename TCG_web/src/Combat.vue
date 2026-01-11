<template>
  <MonHeader />
  <main>
  <div class="pop_up_ff" v-if="afficher_ff == true" @click="detecte_click_ff">
    <img src="@/assets/imgs/Force_et_faiblesse.png" alt="forces et faiblesses"></img>
  </div>
    <div class="page_combat" :style="{ '--hPage': hmain }">
      <div class="F_f">
        <img src="@/assets/imgs/ff_logo.png" alt="Page F/f" />
        <button @click="afficher_ff = true">Forces et faiblesses</button>
      </div>
      <div class="lancement_partie">
        <img src="@/assets/imgs/ff_logo.png" alt="img terrain" />
        <router-link to="/duel"><button>JOUER</button></router-link>
      </div>
      <div class="Compteur">
        <clef :cles="nbCles" />
      </div>
    </div>
    <div class="deck" :style="{ '--hPage': hmain }">
      <p>Mon deck</p>
      <p>Familier</p>
      <p>Terrain</p>

      <div
        class="carteMembreDeck"
        v-for="(carte, index) in deckMembre"
        :key="index"
      >
        <img
          v-if="!carte"
          src="@/assets/imgs/carte/carte_ajout.png"
          alt="Carte_à_Ajouter"
        />

        <Carte_membre v-else :data="carte" largeur="200px" />
      </div>
      <div class="separateur"></div>

      <Carte_familier
        v-if="deckFamilier"
        :data="deckFamilier"
        largeur="200px"
      />
      <img
        v-else
        src="@/assets/imgs/carte/carte_ajout.png"
        alt="Carte_à_Ajouter"
        id="familier"
      />
      <Carte_terrain v-if="deckTerrain" :data="deckTerrain" largeur="200px" />
      <img
        v-else
        src="@/assets/imgs/carte/carte_ajout.png"
        alt="Carte_à_Ajouter"
        id="terrain"
      />
    </div>

    <div
      class="separateurDeckCollection"
      :style="{ '--vhPx': vh + 'px' }"
      v-if="tailleCollection >= 1"
    ></div>

    <div class="collection" v-if="tailleCollection >= 1" @click="selectionCarteCollection">
      <div class="collecMembre">
        <Carte_membre
          v-for="carte of membres"
          :key="carte.card.cardId"
          :data="carte.card"
          largeur="200px"
          class="membre"
          :class="{ dansDeck: estDansDeck(carte.card) }"
        />
      </div>

      <div class="separateur"></div>

      <div class="collecFamilier">
        <Carte_familier
          v-for="carte of familiers"
          :key="carte.card.cardId"
          :data="carte.card"
          largeur="200px"
          class="familier"
          :class="{ dansDeck: carte.card.cardId ==  deckFamilier?.cardId}"
        />
      </div>

      <div class="collecTerrain">
        <Carte_terrain
          v-for="carte of terrains"
          :key="carte.card.cardId"
          :data="carte.card"
          largeur="200px"
          class="terrain"
          :class="{ dansDeck: carte.card.cardId ==  deckFamilier?.cardId}"
        />
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
const hmain = ref(vh.value * 87.5 - 278 - 20 * 2 + 'px');

const userData = ref(JSON.parse(sessionStorage.getItem('userData'))); //OK
const nbCles = ref(userData.value.balance);

const deckMembre = computed(()=>{return userData.value.deck.cards;});
const deckFamilier = computed(()=>{return userData.value.deck.pet;});
const deckTerrain = computed(()=>{return userData.value.deck.arena;});
let afficher_ff = ref(false);

const collection = computed(() => {
  return userData.value.collection;
});
const tailleCollection = collection.value.length;
const membres = computed(() => {
  return collection.value.filter((carte) => carte.card._class === 'member');
});
const familiers = computed(() => {
  //computed : prend une fonction en parametre : elle est recalculée dès que collection change
  return collection.value.filter(
    (carte) => carte.card._class === 'pet' //condition fonction fléchée)qui doit etre a true pour etre selectionnée par filter
    // carte est l'élément examiné par filter lorsqu'il parcours collection
  );
});
const terrains = computed(() => {
  return collection.value.filter((carte) => carte.card._class === 'arena');
});

function detecte_click_ff(evt) {
  if(evt.target.tagName != ('IMG')) {
    afficher_ff.value = false ;
  }
}


/*----------------Script pour changement de deck------------------*/
//faire la classe selection CSS
//faire la clase dansDeck CSS
const carteSelectionnée = ref();


function selectionCarteCollection(evt){
  console.log("click dans collection");
  const carteSelect = evt.target.closest(".carte"); //renvoie l'element parent correspondant au Selecteur CSS .membre ou null si aucun ne correspond
  console.log(carteSelect);
  if(carteSelectionnée.value){
      carteSelectionnée.value.classList.remove("selection");
      carteSelectionnée.value = null;
    }
    
  if(carteSelect != null && !carteSelect.classList.contains("dansDeck")){
    console.log("click dans une carte");
    carteSelect.classList.add("selection");
    carteSelectionnée.value = carteSelect;
  }
}

function estDansDeck(carte){
  if(deckMembre.value?.some(c => c?.cardId == carte?.cardId) || deckFamilier.value?.cardId==carte?.cardId){ //verifie pour chaque element c de deckMembre si y'en a 1 qui a c.id == carte.id
    return true;
  } else {
    return false;
  }
}
</script>

<style scoped>
@import './assets/css/combat.css';
</style>
