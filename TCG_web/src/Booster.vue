<template>
  <MonHeader />
  <main id="booster">
    <div class="Récompenses_quotidiennes">
      <h2>Récompenses quotidiennes :</h2>
    </div>
    <div class="Booster_page">
      <div class="Booster"></div>
      <p>11h 21min 27sec</p>
      <boutons_achat />
    </div>
    <div class="Compteur">
      <clef />
    </div>
  </main>
</template>

<script setup>
import { ref } from 'vue';
import clef from '@/Composants/clef.vue';
import boutons_achat from '@/Composants/boutons_achat.vue';


import MonHeader from '@/Composants/header.vue';
</script>

<style scoped>
@import './assets/css/booster.css';
</style>
