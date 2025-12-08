<template>
  <VerifLogin/>
  <MonHeader />
  <main>
    <div class="tri_filtres">
      <div class="cartes_possédées">
        <h2>cartes possédées :</h2>
        <h3>46/71</h3>
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
          v-for="carte in cartes"
          :key="carte.id"
         >
          <Carte_membre :data="carte" largeur="200px"/>
          <Barre_progress :niv="carte.niv" />
        </div>
        <div class="une_carte"><Carte_familier largeur="200px"/></div>
        <div class="une_carte"><Carte_terrain largeur="200px"/></div> 
      </div>
      
    </div>
  </main>
</template>

<script setup>
import { ref } from 'vue';

import MonHeader from '@/Composants/header.vue';
import Carte_membre from './Composants/carte_membre.vue';
import Carte_familier from './Composants/carte_familier.vue';
import Carte_terrain from './Composants/carte_terrain.vue';
import Barre_progress from './Composants/barre_progress_carte.vue';
import VerifLogin from '@/Composants/verifLogin.vue';

const cartes = ref([])

cartes.value = [
  {id:1, niv:2},
  {id:2, niv:11},
  {id:3, niv:1},
  {id:4, niv:8},
  {id:5, niv:78},
  {id:6, niv:10},
  {id:7, niv:12}
]

const userData = ref(JSON.parse(localStorage.getItem('userData'))); //OK

const collection = userData.value.collection; //test OK mais vide

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
