<template>
  <main>
    <img src="@/assets/imgs/combat_feyssine.png" alt="echange" />
    <div class="mes_cartes">
      <Carte_membre :data="membres[0].card" largeur="140px" />
      <Carte_membre :data="membres[1].card" largeur="140px" />
      <Carte_membre :data="deckMembre[2]" largeur="140px" />
      <Carte_membre :data="membres[3].card" largeur="140px" />
      <Carte_membre :data="membres[4].card" largeur="140px" />
      <Carte_familier :data="familiers[0].card" largeur="140px" />
    </div>
    <div class="resultat">
      <div class="victoire">
        <p>VICTOIRE</p>
      </div>
      <div class="score">
        <p>5 - 3</p>
      </div>
      <div class="infos">
        <div class="personnes">
          <div class="mes_infos">
            <img
              src="@/assets/imgs/carte/perso/Mzhdunosaure.png"
              alt="Logo du site"
            />
            <p>Joueur_1</p>
          </div>
          <div class="autres_infos">
            <img
              src="@/assets/imgs/carte/perso/Mzhdunosaure.png"
              alt="Logo du site"
            />
            <p>Joueur_2</p>
          </div>
        </div>
        <button id="ajout_ami">+</button>
      </div>
      <div class="récompenses">
        <p>Récompenses :</p>

        <button id="continuer">continuer</button>
      </div>
    </div>
    <div class="autres_cartes">
      <Carte_membre :data="membres[0].card" largeur="140px" />
      <Carte_membre :data="membres[1].card" largeur="140px" />
      <Carte_membre :data="membres[2].card" largeur="140px" />
      <Carte_membre :data="membres[3].card" largeur="140px" />
      <Carte_membre :data="membres[4].card" largeur="140px" />
      <Carte_familier :data="familiers[0].card" largeur="140px" />
    </div>
<<<<<<< HEAD
    <Carte_familier :data="familiers[1].card" largeur="200px" />
=======
>>>>>>> 03663e18b93320e109bf75ce2cbab7baa1a74e9b
  </main>
</template>

<script setup>
<<<<<<< HEAD
import { ref, computed } from 'vue';
=======
import { computed, ref, onMounted } from 'vue';
>>>>>>> 03663e18b93320e109bf75ce2cbab7baa1a74e9b
import Carte_membre from './Composants/carte_membre.vue';
import Carte_familier from './Composants/carte_familier.vue';

const userData = ref(JSON.parse(localStorage.getItem('userData')));
<<<<<<< HEAD
const collection = ref(userData.value.collection);
=======

const collection = computed(() => {
  return userData.value.collection;
});

const deckMembre = userData.value.deck.cards;

console.log(deckMembre);

>>>>>>> 03663e18b93320e109bf75ce2cbab7baa1a74e9b
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
