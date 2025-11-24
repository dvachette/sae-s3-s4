<template>
  <!-- Écran vidéo -->
  <div v-if="showVideo" class="video-container">
    <video ref="introVideo" autoplay muted playsinline @ended="onVideoEnd">
      <source src="@/assets/vidéos/boosteranim.mp4" type="video/mp4" />
    </video>
  </div>

  <div v-else-if="!allCardsGone" class="conteneur-cartes">
    <div class="clés">
      <nouv_clef />
    </div>
    <div class="cartes">
      <Stack
        :randomRotation="false"
        :sensitivity="180"
        :sendToBackOnClick="false"
        :cardDimensions="cardDimensions"
        :cardsData="cards"
        @allCardsGone="onAllCardsGone"
      />
    </div>
  </div>
  <!-- Écran récapitulatif final -->
  <div v-else class="ecran-final">
    <div v-for="card in cartesCollectees" :key="card.id" class="carte-recap">
      <component :is="card.component" v-bind="card.props || {}" />
    </div>
    <router-link to="/booster"><button>Suivant</button></router-link>
    <clef />
  </div>
</template>

<script setup>
import { ref, watch, markRaw } from 'vue';
import Stack from '@/Composants/Stack.vue';
import carte_membre from '@/Composants/carte_membre.vue';
import nouv_clef from './Composants/nouv_clef.vue';
import clef from './Composants/clef.vue';

const showVideo = ref(true); // ← Remettez true pour la vidéo
const introVideo = ref(null);
const allCardsGone = ref(false);
const cartesCollectees = ref([]);

// Surveiller quand la vidéo est montée
watch(introVideo, (videoElement) => {
  if (videoElement) {
    videoElement.play().catch((error) => {
      console.error('Erreur lecture vidéo:', error);
    });
  }
});

const onVideoEnd = () => {
  showVideo.value = false;
};

const onAllCardsGone = (cartes) => {
  console.log('Cartes reçues:', cartes);
  console.log('Nombre de cartes:', cartes.length);
  cartesCollectees.value = cartes;
  allCardsGone.value = true;
};
// Dimensions des cartes (vous pouvez les rendre réactives si besoin)
const cardDimensions = ref({ width: 300, height: 420 });

// Fonction pour créer les cartes avec la bonne largeur
const createCard = (id, data) => ({
  id,
  component: markRaw(carte_membre), // ← Ajoutez markRaw ici
  props: {
    largeur: cardDimensions.value.width + 'px',
    data,
  },
});

const cards = [
  createCard(1, { nom: 'Mzhdunosaure', pv: 120, niveau: 5 }),
  createCard(2, { nom: 'Autre Carte', pv: 100, niveau: 3 }),
  createCard(3, { nom: 'Troisième Carte', pv: 80, niveau: 4 }),
  createCard(4, { nom: 'Quatrième Carte', pv: 90, niveau: 6 }),
  createCard(5, { nom: 'Cinquième Carte', pv: 90, niveau: 6 }),
];
</script>

<style scoped>
@import '@/assets/css/ouverture.css';
</style>
