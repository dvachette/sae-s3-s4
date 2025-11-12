<template>
  <MonHeader />
  <main id="Combat">
    <div class="page_combat">
      <div class="F_f">
        <img src="@/assets/imgs/logoTCG.png" alt="Page F/f" />
        <button>Forces et faiblesses</button>
      </div>
      <div class="lancement_partie">
        <img src="@/assets/imgs/logoTCG.png" alt="Page F/f" />
        <button>Jouer</button>
      </div>
      <div class="Compteur">
        <clef />
      </div>
    </div>
    <div class="deck"></div>
  </main>
</template>

<script setup>
import { ref } from 'vue';
import clef from '@/Composants/clef.vue';

import MonHeader from '@/Composants/header.vue';
</script>

<style scoped>
@import './assets/css/combat.css';
</style>
