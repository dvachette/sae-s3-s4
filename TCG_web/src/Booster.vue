<template>
  <VerifLogin @login-success="updateUserData" />
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
      <p>{{ timerText }}</p>
      <router-link :to="'/ouverture?buy=true'" v-if="nbCles >= 100"
        ><boutons_achat
      /></router-link>
      <boutons_achat v-else id="bouton_none" />
    </div>
    <div class="Compteur">
      <clef :cles="nbCles" />
    </div>
  </main>
</template>

<script setup>
import { ref } from 'vue';
import clef from '@/Composants/clef.vue';
import boutons_achat from '@/Composants/boutons_achat.vue';

import MonHeader from '@/Composants/header.vue';
import VerifLogin from '@/Composants/verifLogin.vue';

const userData = ref(JSON.parse(sessionStorage.getItem('userData'))); //OK
const nbCles = ref(0);
const lastBoosterOpening = ref(new Date());
// Get the next available booster time (12 hours after last opening)
let now = new Date();
let nextAvailableTime = ref(
  new Date(lastBoosterOpening.value.getTime() + 12 * 60 * 60 * 1000),
);
// Calculate remaining time in milliseconds
let remaining_time = nextAvailableTime.value - now;
let timerText = ref('');
// Update every second
setInterval(() => {
  let remaining_time = nextAvailableTime.value - new Date();
  let hours = Math.floor((remaining_time / (1000 * 60 * 60)) % 24);
  let minutes = Math.floor((remaining_time / (1000 * 60)) % 60);
  let seconds = Math.floor((remaining_time / 1000) % 60);
  if (remaining_time <= 0) {
    timerText.value = 'Booster disponible !';
    return;
  }
  timerText.value = `${hours}h ${minutes}min ${seconds}sec`;
}, 1000);
function updateUserData() {
  userData.value = JSON.parse(sessionStorage.getItem('userData'));
  nbCles.value = userData.value.balance;
  lastBoosterOpening.value = new Date(userData.value.lastBoosterOpening * 1000);
  nextAvailableTime.value = new Date(
    lastBoosterOpening.value.getTime() + 12 * 60 * 60 * 1000,
  );
}
</script>

<style scoped>
@import './assets/css/booster.css';
</style>
