<template>
  <VerifLogin/>
  <MonHeader />
  <main :style="{
      '--progress': pourcentage,
    }">
    <div v-if="carteSurvolé" class="membre_pop_up">
      <!-- Composant dupliqué au centre -->
      <div class="membre_carte">
        <Carte_membre largeur="25vw" :data="carteSurvolé" :isPreview="true" />
      </div>
    </div>
    <div v-if="familierSurvolé" class="familier_pop_up">
      <!-- Composant dupliqué au centre -->
      <div class="familier_carte">
        <Carte_familier
          largeur="25vw"
          :data="familierSurvolé"
          :isPreview="true"
        />
      </div>
    </div>
    <div v-if="TerrainSurvolé" class="terrain_pop_up">
      <!-- Composant dupliqué au centre -->
      <div class="terrain_carte">
        <Carte_terrain
          largeur="25vw"
          :data="TerrainSurvolé"
          :isPreview="true"
        />
      </div>
    </div>
    <div class="tri_filtres">
      <div class="cartes_possédées">
        <h2>cartes possédées :</h2>
        <h3>{{cartesPossedees}}/{{cartesTotal}}</h3>
        <div class="barre_total">
          <div class="barre_progression"></div>
        </div>
      </div>
      <div class="Tri">
        <h2>Trié par :</h2>
        <div class="Tri_liste" v-for="item in options" :key="item.value">
    <label>
      <input type="radio" name="tri" v-model="selected" :value="item.value">
      {{ item.label }}
    </label>
    <!-- Checkbox visible uniquement si ce radio est sélectionné -->
    <label v-if="selected === item.value && item.checkbox">
      <input type="checkbox" v-model="item.checkboxValue">
      {{ item.checkbox }}
    </label>
  </div>
      </div>
      <div class="Filtres">
        <h2>Filtré par :</h2>
        <label><input type="checkbox" name="filtre" value="possédées">possédées</input></label>
        <label><input type="checkbox" name="filtre" value="mon_deck">mon deck</input></label>
        <label><input type="checkbox" name="filtre" value="membres">membres</input></label>
        <label><input type="checkbox" name="filtre" value="familiers">familiers</input></label>
        <label><input type="checkbox" name="filtre" value="arènes">arènes</input></label>
      </div>
    </div>
    <div class="collection">
      <div class="conteneur_cartes" :style="{'--width': widthFlexCartes}">
        <div class="une_carte"
          v-for="carte in collection"
          :key="carte.card.cardId"
         >
          <Carte_membre v-if="carte.card._class == 'member'" 
          
            :data="carte.card" largeur="200px"
            @mouseenter="carteSurvolé = carte.card"
            @mouseleave="carteSurvolé = null"/>

          <Carte_familier v-if="carte.card._class == 'pet'" 
            :data="carte.card" largeur="200px"
            @mouseenter="familierSurvolé = carte.card"
            @mouseleave="familierSurvolé = null"/>

          <Carte_terrain v-if="carte.card._class == 'arena'" 
            :data="carte.card" largeur="200px"
            @mouseenter="TerrainSurvolé = carte.card"
            @mouseleave="TerrainSurvolé = null"/>

          <Barre_progress :niv="carte.quantity" />
        </div>
      </div>
      
    </div>
  </main>
</template>

<script setup>
import { ref,computed } from 'vue';

import MonHeader from '@/Composants/header.vue';
import Carte_membre from './Composants/carte_membre.vue';
import Carte_familier from './Composants/carte_familier.vue';
import Carte_terrain from './Composants/carte_terrain.vue';
import Barre_progress from './Composants/barre_progress_carte.vue';
import VerifLogin from '@/Composants/verifLogin.vue';

const userData = ref(JSON.parse(sessionStorage.getItem('userData'))); //OK
const cartesPossedees = ref('');
const cartesTotal = ref('');

function loadUserData() {
  userData.value = JSON.parse(sessionStorage.getItem('userData'));
  cartesTotal.value = userData.value ? userData.value.stats.totalCartes : '0' ;
  cartesPossedees.value = userData.value ? userData.value.stats.totalPossedees : '0' ;
}
loadUserData();

const pourcentageValue = computed(() => (cartesPossedees.value * 100) / cartesTotal.value);
const pourcentage = computed(() => pourcentageValue.value + '%');

const carteSurvolé = ref(null);
const familierSurvolé = ref(null);
const TerrainSurvolé = ref(null);

const collection = userData.value.collection; //test OK mais vide
console.log("Collection de l'utilisateur :", collection);

const vw = ref(window.innerWidth / 100); //obtenir 1% de la largeur de la fenetre, en px
const width = ref((Math.floor(80 * vw.value / 220))*220);
const widthFlexCartes = ref(width.value+"px");

const selected = ref(null);

const options = ref([
  { value: 'mandat', label: 'mandat', checkbox: 'chronologique', checkboxValue: false },
  { value: 'niveau', label: 'niveau', checkbox: 'croissant', checkboxValue: false },
  { value: 'pôle',   label: 'pôle', checkbox: null },
]);
</script>

<style scoped>
@import './assets/css/collection.css';
</style>
