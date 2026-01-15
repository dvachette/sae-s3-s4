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
          :id="index"
          @click="echangeDeck(carte, $event)"
        />

        <Carte_membre v-else :data="carte" largeur="200px" @click="echangeDeck(carte, $event)"/>
      </div>
      <div class="separateur"></div>

      <Carte_familier
        v-if="deckFamilier"
        :data="deckFamilier"
        largeur="200px"
        @click="echangeDeck(deckFamilier, $event)"
      />
      <img
        v-else
        src="@/assets/imgs/carte/carte_ajout.png"
        alt="Carte_à_Ajouter"
        id="familier"
        @click="echangeDeck(deckFamilier, $event)"
      />
      <Carte_terrain v-if="deckTerrain" :data="deckTerrain" largeur="200px" @click="echangeDeck(deckTerrain, $event)"/>
      <img
        v-else
        src="@/assets/imgs/carte/carte_ajout.png"
        alt="Carte_à_Ajouter"
        id="terrain"
        @click="echangeDeck(deckTerrain, $event)"
      />
    </div>

    <div
      class="separateurDeckCollection"
      :style="{ '--vhPx': vh + 'px' }"
      v-if="tailleCollection >= 1"
    ></div>

    <div class="collection" v-if="tailleCollection >= 1" @click="deselection($event)">
      <div class="collecMembre">
        <Carte_membre
          v-for="carte of membres"
          :key="carte.card.cardId"
          :data="carte.card"
          largeur="200px"
          class="membre"
          :class="{ dansDeck: estDansDeck(carte.card) }"
          @click="selectionCarteCollection(carte.card, $event)"
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
          @click="selectionCarteCollection(carte.card, $event)"
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
          @click="selectionCarteCollection(carte.card, $event)"
        />
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, computed } from 'vue';
import clef from '@/Composants/clef.vue';
import config from '@/config.json';

import MonHeader from '@/Composants/header.vue';
import Carte_membre from './Composants/carte_membre.vue';
import Carte_familier from './Composants/carte_familier.vue';
import Carte_terrain from './Composants/carte_terrain.vue';
import { number } from 'motion-v';

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

const carteSelectionnée = ref();
const idCarteSelectionnée = ref();
const classCarteSelectionnée = ref();


function selectionCarteCollection(card, evt){
  console.log("click dans collection");
  const carteSelect = evt.currentTarget;//.closest(".carte"); //renvoie l'element parent correspondant au Selecteur CSS .membre ou null si aucun ne correspond
  console.log(carteSelect);
    
  if(carteSelect != null && !carteSelect.classList.contains("dansDeck")){
    console.log("click dans une carte");
    carteSelectionnée.value?.classList.remove("selection");
    carteSelect.classList.add("selection");
    

    carteSelectionnée.value = carteSelect;
    console.log(carteSelectionnée.value.data);

    idCarteSelectionnée.value = card.cardId;
    classCarteSelectionnée.value = card._class;
  }

  console.log("classe : "+classCarteSelectionnée.value+" CardId : "+idCarteSelectionnée.value);
}

function deselection(evt){
  const carteSelect = evt.target.closest(".carte");
  if((!carteSelect || carteSelect.classList.contains("dansDeck")) && carteSelectionnée.value){
      carteSelectionnée.value.classList.remove("selection");

      carteSelectionnée.value = null;
      idCarteSelectionnée.value = null;
      classCarteSelectionnée.value = null;
    }
}
  
function estDansDeck(carte){
  if(deckMembre.value?.some(c => c?.cardId == carte?.cardId) || deckFamilier.value?.cardId==carte?.cardId){ //verifie pour chaque element c de deckMembre si y'en a 1 qui a c.id == carte.id
    return true;
  } else {
    return false;
  }
}

async function echangeDeck(carte, evt){
  const verifIndex = /^[0-4]$/;

  if(idCarteSelectionnée.value){
    let pos = null;
    console.log("dans Echangedeck carte: "+carte?.name+" id: "+evt.target?.id);
    if(carte?._class == "member" && classCarteSelectionnée.value == "member"){
      pos = deckMembre.value.findIndex(elem => elem.cardId === carte.cardId);
      
    } else if (evt.target.tagName == 'IMG' && verifIndex.test(evt.target.id) && classCarteSelectionnée.value == "member"){
      console.log("Click dans une carte membre absente, id: "+evt.target.id);
      pos = +evt.target.id; //le + permet de convertir en number

    }else if((carte?._class == "pet" || (evt.target.tagName == 'IMG' && evt.target.id == 'familier')) && classCarteSelectionnée.value == "pet"){
      pos = "pet";

    } else if ((carte?._class == "arena" || (evt.target.tagName == 'IMG' && evt.target.id == 'terrain')) && classCarteSelectionnée.value == "arena"){
      pos = "arena";

    }


    console.log("position : "+pos);

    const response = await fetch(`http://${config.hosts.api}/deck/replaceCard`, {
      credentials : 'include',
      method : 'POST',
      headers : {'Content-Type':'application/json'},
      body : JSON.stringify({index : pos, newCardId : idCarteSelectionnée.value})
    });
    const data = await response.json();
    
    userData.value.deck = data.deck;

  }
  
}
</script>

<style scoped>
@import './assets/css/combat.css';
</style>
