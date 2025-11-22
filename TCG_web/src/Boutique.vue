c
<template>
  <MonHeader />
  <main>
    <div class="la_boutique">
      <div class="le_booster">
        <div class="Booster"></div>
        <boutons_achat />
      </div>
      <div class="cartes_proposés">
        <clef class="compteur_boutique"></clef>
        <p>2/3</p>
        <p>3/3</p>
        <p>1/3</p>
        <carte_membre class="c1" largeur="8vw"></carte_membre>
        <carte_membre class="c2" largeur="8vw"></carte_membre>
        <carte_membre class="c3" largeur="8vw"></carte_membre>
        <boutons_achat class="b1"></boutons_achat>
        <boutons_achat class="b2"></boutons_achat>
        <boutons_achat class="b3"></boutons_achat>
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
</script>

<style scoped>
@import './assets/css/boutique.css';
</style>
