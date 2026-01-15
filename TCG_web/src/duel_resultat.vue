<template>
  <main>
    <img src="@/assets/imgs/combat_feyssine.png" alt="echange" />
    <div class="mes_cartes">
      <div
        class="carteMembreDeck"
        v-for="(carte, index) in deckMembre"
        :key="index"
      >
        <img
          v-if="!carte"
          src="@/assets/imgs/carte/carte_ajout.png"
          alt="Carte_à_Ajouter"
        />

        <Carte_membre v-else :data="carte" largeur="140px" />
      </div>
      <Carte_familier
        v-if="deckFamilier"
        :data="deckFamilier"
        largeur="140px"
      />
      <img
        v-else
        src="@/assets/imgs/carte/carte_ajout.png"
        alt="Carte_à_Ajouter"
        id="familier"
      />
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
              src="@/assets/imgs/carte/perso/36.png"
              alt="Logo du site"
            />
            <p>{{ nom_j1 }}</p>
          </div>
          <div class="autres_infos">
            <img
              src="@/assets/imgs/carte/perso/36.png"
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
      <div
        class="carteMembreDeck"
        v-for="(carte, index) in deckMembre"
        :key="index"
      >
        <img
          v-if="!carte"
          src="@/assets/imgs/carte/carte_ajout.png"
          alt="Carte_à_Ajouter"
        />

        <Carte_membre v-else :data="carte" largeur="140px" />
      </div>
      <Carte_familier
        v-if="deckFamilier"
        :data="deckFamilier"
        largeur="140px"
      />
      <img
        v-else
        src="@/assets/imgs/carte/carte_ajout.png"
        alt="Carte_à_Ajouter"
        id="familier"
      />
    </div>
  </main>
</template>

<script setup>
import { ref, computed } from 'vue';
import Carte_membre from './Composants/carte_membre.vue';
import Carte_familier from './Composants/carte_familier.vue';

const victoire = false;
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
