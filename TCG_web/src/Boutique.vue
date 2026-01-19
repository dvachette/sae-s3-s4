<template>
  <VerifLogin />
  <MonHeader />
  <main>
    <div class="la_boutique">
      <div class="le_booster">
        <router-link to="/ouverture"
          ><img src="@/assets/imgs/booster.png" alt="booster" class="Booster"
        /></router-link>
        <p>{{ timerText }}</p>
        <router-link :to="'/ouverture?buy=true'" v-if="nbCles >= 100"
          ><boutons_achat :prix="100"
        /></router-link>
        <boutons_achat id="bouton_none" :prix="100" v-else />
      </div>
      <div class="cartes_proposés">
        <clef class="compteur_boutique" :cles="nbCles" />
        <p>2/3</p>
        <p>3/3</p>
        <p>1/3</p>
        <boutons_achat :prix="20" class="b1"></boutons_achat>
        <boutons_achat :prix="20" class="b2"></boutons_achat>
        <boutons_achat :prix="20" class="b3"></boutons_achat>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref } from 'vue';
import clef from '@/Composants/clef.vue';
import boutons_achat from '@/Composants/boutons_achat.vue';
import MonHeader from '@/Composants/header.vue';
import carte_membre from '@/Composants/carte_membre.vue';
import VerifLogin from '@/Composants/verifLogin.vue';
const userData = ref(JSON.parse(sessionStorage.getItem('userData'))); //OK
const nbCles = ref(userData.value.balance);
</script>

<style scoped>
@import './assets/css/boutique.css';
</style>
