<template>
  <!-- Écran vidéo -->
  <div v-if="showVideo" class="video-container">
    <video ref="introVideo" autoplay muted playsinline @ended="onVideoEnd">
      <source src="@/assets/vidéos/boosteranim.mp4" type="video/mp4" />
    </video>
  </div>

  <div v-else class="révélation">
    <Stack
      :randomRotation="true"
      :sensitivity="180"
      :sendToBackOnClick="false"
      :cardDimensions="{ width: 200, height: 200 }"
      :cardsData="images"
    ></Stack>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const showVideo = ref(true);
const introVideo = ref(null);

onMounted(() => {
  introVideo.value.play().catch(() => {
    // Autoplay peut échouer si la vidéo n’est pas muted → obligé de mettre muted
  });
});

const onVideoEnd = () => {
  showVideo.value = false;
};

import Stack from './Stack.vue';
const images = [
  {
    id: 1,
    img: 'https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?q=80&w=500&auto=format',
  },
  {
    id: 2,
    img: 'https://images.unsplash.com/photo-1449844908441-8829872d2607?q=80&w=500&auto=format',
  },
  {
    id: 3,
    img: 'https://images.unsplash.com/photo-1452626212852-811d58933cae?q=80&w=500&auto=format',
  },
  {
    id: 4,
    img: 'https://images.unsplash.com/photo-1572120360610-d971b9d7767c?q=80&w=500&auto=format',
  },
];
</script>

<style scoped>
@import '@/assets/css/ouverture.css';
</style>
