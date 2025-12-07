<template>
  <main :style="{ '--jauge_energie': jauge_energie }">
    <img src="@/assets/imgs/combat_feyssine.png" alt="echange" />
    <pop_up_abandon v-if="afficher_abandon" id="abandon" />
    <div class="cartes_combat">
      <div class="son_deck">
        <div class="familier">
          <p>Familier</p>
          <Carte_membre largeur="7vw" />
        </div>
        <Carte_membre largeur="7vw" />
        <Vie_cartes :pv="100" :pvtotal="100" largeur="7vw" />
        <Carte_membre largeur="7vw" />
        <Vie_cartes :pv="74" :pvtotal="120" largeur="7vw" />
        <Carte_membre largeur="10vw" />
        <Vie_cartes :pv="40" :pvtotal="100" largeur="10vw" />
        <Carte_membre largeur="7vw" />
        <Vie_cartes :pv="74" :pvtotal="100" largeur="7vw" />
        <Carte_membre largeur="7vw" />
        <Vie_cartes :pv="12" :pvtotal="100" largeur="7vw" />
      </div>
      <div class="mon_deck">
        <div class="familier">
          <p>Familier</p>
          <Carte_membre largeur="7vw" />
        </div>
        <Carte_membre largeur="7vw" />
        <Vie_cartes :pv="5" :pvtotal="100" largeur="7vw" />
        <Carte_membre largeur="7vw" />
        <Vie_cartes :pv="74" :pvtotal="81" largeur="7vw" />
        <Carte_membre largeur="10vw" />
        <Vie_cartes :pv="30" :pvtotal="100" largeur="10vw" />
        <Carte_membre largeur="7vw" />
        <Vie_cartes :pv="74" :pvtotal="200" largeur="7vw" />
        <Carte_membre largeur="7vw" />
        <Vie_cartes :pv="74" :pvtotal="100" largeur="7vw" />
        <button>
          ATTAQUE 1
          <p>description super cool de l'attaque de fou</p>
        </button>
        <button>
          ATTAQUE 2
          <p>description super cool de l'attaque de fou</p>
        </button>
        <button><img src="@/assets/imgs/echange.png" alt="echange" /></button>
      </div>
    </div>
    <div class="stats">
      <span>Score :</span>
      <span>1 - 0</span>
      <button @click="afficher_abandon = true">Abandonner</button>
      <div class="jauge_fond">
        <div class="jauge_énergie"></div>
        <span>{{ energie }}</span>
      </div>
    </div>
  </main>
</template>

<script setup>
import { computed, ref } from 'vue';
import Carte_membre from './Composants/carte_membre.vue';
import Vie_cartes from './Composants/vie_cartes.vue';
import pop_up_abandon from './Composants/pop_up_abandon.vue';

const energie = 7;
const pourcentageValue = computed(() => (energie * 100) / 10);
const jauge_energie = computed(() => pourcentageValue.value + '%');

const afficher_abandon = ref(false);
</script>

<style scoped>
@import './assets/css/duel.css';
</style>
