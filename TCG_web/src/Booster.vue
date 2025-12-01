<template>
  <VerifLogin/>
  <MonHeader />
  <main id="booster">
    <div class="Récompenses_quotidiennes">
      <h2>Récompenses quotidiennes</h2>
      <div class="jour fait" id="j1">
        <p>Jour 1</p>
        <p>20</p>
        <img src="@/assets/imgs/Clef.png" alt="clé" />
      </div>
      <div class="jour actif" id="j2">
        <p>Jour 2</p>
        <img src="@/assets/imgs/carte/carte_inconnue.png" alt="" />
      </div>
      <div class="jour" id="j3">
        <p>Jour 3</p>
        <img src="@/assets/imgs/booster.png" alt="booster" class="Booster" />
      </div>
      <div class="jour" id="j4">
        <p>Jour 4</p>
        <img src="@/assets/imgs/carte/carte_inconnue.png" alt="carteInconnue" />
      </div>
      <div class="jour" id="j5">
        <p>Jour 5</p>
        <p>70</p>
        <img src="@/assets/imgs/cles.png" alt="clés" />
      </div>
      <div class="jour" id="j6">
        <p>Jour 6</p>
        <img src="@/assets/imgs/carte/carte_inconnue.png" alt="carteInconnue" />
      </div>
      <div class="jour" id="j7">
        <p>Jour 7</p>
        <p>3</p>
        <img src="@/assets/imgs/booster.png" alt="booster" class="Booster" />
      </div>
    </div>
    <div class="Booster_page">
      <router-link to="/ouverture"
        ><img src="@/assets/imgs/booster.png" alt="booster" class="Booster"
      /></router-link>
      <p>11h 21min 27sec</p>
      <boutons_achat />
    </div>
    <div class="Compteur">
      <clef :cles="nbCles"/>
    </div>
  </main>
</template>

<script setup>
import { ref } from 'vue';
import clef from '@/Composants/clef.vue';
import boutons_achat from '@/Composants/boutons_achat.vue';

import MonHeader from '@/Composants/header.vue';
import VerifLogin from '@/Composants/verifLogin.vue';




const userData = ref(JSON.parse(localStorage.getItem('userData'))); //OK
const nbCles = ref(userData.value.balance); 
</script>

<style scoped>
@import './assets/css/booster.css';
</style>
