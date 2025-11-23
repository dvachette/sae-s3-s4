<template>
  <!-- Écran vidéo -->
  <div v-if="showVideo" class="video-container">
    <video ref="introVideo" autoplay muted playsinline @ended="onVideoEnd">
      <source src="@/assets/vidéos/boosteranim.mp4" type="video/mp4" />
    </video>
  </div>

  <div
    v-else-if="!allCardsGone"
    class="min-h-screen flex items-center justify-center bg-gray-100 p-8"
  >
    <Stack
      :randomRotation="false"
      :sensitivity="180"
      :sendToBackOnClick="false"
      :cardDimensions="{ width: 300, height: 420 }"
      :cardsData="cards"
      @allCardsGone="onAllCardsGone"
    />
  </div>

  <!-- Écran après que toutes les cartes sont parties -->
  <div
    v-else
    class="min-h-screen flex items-center justify-center bg-green-500"
  >
    <h1 class="text-4xl text-white">Toutes les cartes sont parties ! 🎉</h1>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import Stack from '@/Composants/Stack.vue';
import carte_membre from '@/Composants/carte_membre.vue';

const showVideo = ref(true); // ← Remettez true pour la vidéo
const introVideo = ref(null);
const allCardsGone = ref(false);

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

const onAllCardsGone = () => {
  console.log('Toutes les cartes sont parties');
  allCardsGone.value = true;
};

const cards = [
  {
    id: 1,
    component: carte_membre,
    props: {
      largeur: '100%',
      data: {
        nom: 'Mzhdunosaure',
        pv: 120,
        niveau: 5,
      },
    },
  },
  {
    id: 2,
    component: carte_membre,
    props: {
      largeur: '100%',
      data: {
        nom: 'Autre Carte',
        pv: 100,
        niveau: 3,
      },
    },
  },
  {
    id: 3,
    component: carte_membre,
    props: {
      largeur: '100%',
      data: {
        nom: 'Troisième Carte',
        pv: 80,
        niveau: 4,
      },
    },
  },
  {
    id: 4,
    component: carte_membre,
    props: {
      largeur: '100%',
      data: {
        nom: 'Quatrième Carte',
        pv: 90,
        niveau: 6,
      },
    },
  },
  {
    id: 5,
    component: carte_membre,
    props: {
      largeur: '100%',
      data: {
        nom: 'Cinquième Carte',
        pv: 90,
        niveau: 6,
      },
    },
  },
];
</script>

<style scoped>
@import '@/assets/css/ouverture.css';
</style>
