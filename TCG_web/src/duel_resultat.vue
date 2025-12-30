<template>
  <main>
    <div class="mes_cartes">
      <Carte_membre :data="membres[1].card" largeur="200px" />
      <Carte_membre :data="membres[2].card" largeur="200px" />
      <Carte_membre :data="membres[1].card" largeur="200px" />
      <Carte_membre :data="membres[1].card" largeur="200px" />
      <Carte_membre :data="membres[1].card" largeur="200px" />
    </div>
    <Carte_familier :data="familiers[1].card" largeur="200px" />

    <div class="victoire">
      <p>VICTOIRE</p>
    </div>
    <div class="score">
      <p>5 - 3</p>
    </div>
    <div class="mes_infos">
      <p>Joueur_1</p>
    </div>
    <div class="autres_infos">
      <p>Joueur_2</p>
      <button id="ajout_ami">+</button>
    </div>
    <div class="récompenses">
      <p>récompenses :</p>

      <button id="continuer"></button>
    </div>

    <div class="autres_cartes">
      <Carte_membre :data="membres[1].card" largeur="200px" />
      <Carte_membre :data="membres[1].card" largeur="200px" />
      <Carte_membre :data="membres[1].card" largeur="200px" />
      <Carte_membre :data="membres[1].card" largeur="200px" />
      <Carte_membre :data="membres[1].card" largeur="200px" />
    </div>
    <Carte_familier :data="familiers[1].card" largeur="200px" />
  </main>
</template>

<script setup>
import { ref, computed } from 'vue';
import Carte_membre from './Composants/carte_membre.vue';
import Carte_familier from './Composants/carte_familier.vue';

const userData = ref(JSON.parse(localStorage.getItem('userData')));
const collection = ref(userData.value.collection);
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
</script>

<style scoped>
@import './assets/css/duel_resultat.css';
</style>
