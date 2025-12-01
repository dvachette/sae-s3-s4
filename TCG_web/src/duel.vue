<template>
  <main>
    <div class="stats">
      <span>Score</span>
      <span>1 - 0</span>
      <div class="jauge_fond">
        <div class="jauge_énergie">
          <span>07</span>
        </div>
        <button>Abandonner</button>
      </div>
      <div class="cartes_combat">
        <div class="familier">
          <p>Familier</p>
          <Carte_membre largeur="100px" />
        </div>
        <Carte_membre largeur="100px" />
        <Vie_cartes :pv="74" :pvtotal="100" largeur="100px" />
        <Carte_membre largeur="100px" />
        <Vie_cartes :pv="74" :pvtotal="100" largeur="100px" />
        <Carte_membre largeur="100px" />
        <Vie_cartes :pv="74" :pvtotal="100" largeur="100px" />
        <Carte_membre largeur="100px" />
        <Vie_cartes :pv="74" :pvtotal="100" largeur="100px" />
        <Carte_membre largeur="100px" />
        <Vie_cartes :pv="74" :pvtotal="100" largeur="100px" />
        <div class="familier">
          <p>Familier</p>
          <Carte_membre largeur="100px" />
        </div>
        <Carte_membre largeur="100px" />
        <Vie_cartes :pv="74" :pvtotal="100" largeur="100px" />
        <Carte_membre largeur="100px" />
        <Vie_cartes :pv="74" :pvtotal="100" largeur="100px" />
        <Carte_membre largeur="100px" />
        <Vie_cartes :pv="74" :pvtotal="100" largeur="100px" />
        <Carte_membre largeur="100px" />
        <Vie_cartes :pv="74" :pvtotal="100" largeur="100px" />
        <Carte_membre largeur="100px" />
        <Vie_cartes :pv="74" :pvtotal="100" largeur="100px" />
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref } from 'vue';
import Carte_membre from './Composants/carte_membre.vue';
import Vie_cartes from './Composants/vie_cartes.vue';
</script>

<style scoped>
@import './assets/css/duel.css';
</style>
