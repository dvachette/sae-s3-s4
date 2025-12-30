<template>
  <main>
    <img src="@/assets/imgs/combat_feyssine.png" alt="echange" />
    <div class="mes_cartes">
      <Carte_membre :data="membres[0].card" largeur="140px" />
      <Carte_membre :data="membres[1].card" largeur="140px" />
      <Carte_membre :data="membres[2].card" largeur="140px" />
      <Carte_membre :data="membres[3].card" largeur="140px" />
      <Carte_membre :data="membres[4].card" largeur="140px" />
      <Carte_familier :data="familiers[0].card" largeur="140px" />
    </div>
    <div class="resultat">
      <div class="victoire" v-if="victoire">
        <p>VICTOIRE</p>
      </div>
      <div class="défaite" v-else>
        <p>DÉFAITE</p>
      </div>
      <div class="score">
        <p>{{ mon_score }} - {{ son_score }}</p>
      </div>
      <div class="infos">
        <div class="personnes">
          <div class="mes_infos">
            <img
              src="@/assets/imgs/carte/perso/Mzhdunosaure.png"
              alt="Logo du site"
            />
            <p>{{ nom_j1 }}</p>
          </div>
          <div class="autres_infos">
            <img
              src="@/assets/imgs/carte/perso/Mzhdunosaure.png"
              alt="photo de profil"
            />
            <p>{{ nom_j2 }}</p>
          </div>
        </div>
        <button id="ajout_ami">+</button>
      </div>
      <div class="récompenses" v-if="victoire">
        <p>Récompenses :</p>
        <div class="nb_clefs">
          <img src="@/assets/imgs/cles.png" alt="booster" />
          <p>x12</p>
        </div>
      </div>
      <div class="vide" v-else></div>
      <router-link to="/Combat"
        ><button id="continuer">continuer</button></router-link
      >
    </div>
    <div class="autres_cartes">
      <Carte_membre :data="membres[0].card" largeur="140px" />
      <Carte_membre :data="membres[1].card" largeur="140px" />
      <Carte_membre :data="membres[2].card" largeur="140px" />
      <Carte_membre :data="membres[3].card" largeur="140px" />
      <Carte_membre :data="membres[4].card" largeur="140px" />
      <Carte_familier :data="familiers[0].card" largeur="140px" />
    </div>
  </main>
</template>

<script setup>
import { ref, computed } from 'vue';
import Carte_membre from './Composants/carte_membre.vue';
import Carte_familier from './Composants/carte_familier.vue';

const victoire = true;
const mon_score = 5;
const son_score = 2;
const nom_j1 = 'Luke';
const nom_j2 = 'Dark Vador';

const userData = ref(JSON.parse(sessionStorage.getItem('userData')));

const deckMembre = userData.value.deck.cards;
const deckFamilier = userData.value.deck.pet;

const collection = computed(() => {
  return userData.value.collection;
});

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
