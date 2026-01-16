<template>
  <MonHeader />
  <div class="creation">
    <div class="recap_fixe">
      <div class="mon_echange">
        <div class="demande">
          <p>Carte demandée</p>
          <img
            v-if="!carteDemandee"
            src="@/assets/imgs/carte/carte_ajout.png"
            alt="Carte_à_Ajouter"
          />

          <Carte_membre
            v-else-if="carteDemandee?._class == 'member'"
            :data="carteDemandee"
            largeur="7vw"
          />

          <Carte_familier
            v-else-if="carteDemandee?._class == 'pet'"
            :data="carteDemandee"
            largeur="7vw"
          />

          <Carte_terrain
            v-else-if="carteDemandee?._class == 'arena'"
            :data="carteDemandee"
            largeur="7vw"
          />
        </div>
        <div class="don">
          <p>Cartes à donner</p>
          <div class="les_cartes_don">
            <img
              v-if="!carteaDonnee1"
              src="@/assets/imgs/carte/carte_ajout.png"
              alt="Carte_à_Ajouter"
            />

            <Carte_membre
              v-else-if="carteaDonnee1?._class == 'member'"
              :data="carteaDonnee1"
              largeur="7vw"
            />

            <Carte_familier
              v-else-if="carteaDonnee1?._class == 'pet'"
              :data="carteaDonnee1"
              largeur="7vw"
            />

            <Carte_terrain
              v-else-if="carteaDonnee1?._class == 'arena'"
              :data="carteaDonnee1"
              largeur="7vw"
            />
            <img
              v-if="!carteaDonnee2"
              src="@/assets/imgs/carte/carte_ajout.png"
              alt="Carte_à_Ajouter"
            />

            <Carte_membre
              v-else-if="carteaDonnee2?._class == 'member'"
              :data="carteaDonnee2"
              largeur="7vw"
            />

            <Carte_familier
              v-else-if="carteaDonnee2?._class == 'pet'"
              :data="carteaDonnee2"
              largeur="7vw"
            />

            <Carte_terrain
              v-else-if="carteaDonnee2?._class == 'arena'"
              :data="carteaDonnee2"
              largeur="7vw"
            />
            <img
              v-if="!carteaDonnee3"
              src="@/assets/imgs/carte/carte_ajout.png"
              alt="Carte_à_Ajouter"
            />

            <Carte_membre
              v-if="carteaDonnee3?._class == 'member'"
              :data="carteaDonnee3"
              largeur="7vw"
            />

            <Carte_familier
              v-else-if="carteaDonnee3?._class == 'pet'"
              :data="carteaDonnee3"
              largeur="7vw"
            />

            <Carte_terrain
              v-else-if="carteaDonnee3?._class == 'arena'"
              :data="carteaDonnee3"
              largeur="7vw"
            />
          </div>
          <div class="les_cartes"></div>
        </div>
      </div>
    </div>
  </div>
  <h2>Choisir des cartes à donner :</h2>
  <div class="les_cartes">
    <div class="conteneur_cartes" :style="{ '--width': widthFlexCartes }">
      <div
        class="une_carte"
        v-for="carte in collection"
        :key="carte.card.cardId"
      >
        <Carte_membre
          v-if="carte.card._class == 'member'"
          :data="carte.card"
          largeur="200px"
        />

        <Carte_familier
          v-if="carte.card._class == 'pet'"
          :data="carte.card"
          largeur="200px"
        />

        <Carte_terrain
          v-if="carte.card._class == 'arena'"
          :data="carte.card"
          largeur="200px"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import MonHeader from '@/Composants/header.vue';
import Carte_membre from '@/Composants/carte_membre.vue';
import Carte_familier from '@/Composants/carte_familier.vue';
import Carte_terrain from '@/Composants/carte_terrain.vue';

const userData = ref(JSON.parse(sessionStorage.getItem('userData'))); //OK
const collection = userData.value.collection;

const carteDemandee = ref(null);
console.log(carteDemandee.value);
const carteaDonnee1 = ref(null);
const carteaDonnee2 = ref(null);
const carteaDonnee3 = ref(null);
</script>

<style scoped>
@import '../assets/css/creation_echange.css';
</style>
