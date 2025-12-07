<template>
  <div class="carte_simple">
    <carte_membre
      :largeur="carteProps.largeur"
      :data="carteProps.data"
      class="carte-principale"
    />
    <div class="barre_simple">
      <Barre_progress :niv="carteProps.data?.niveau || 0" />
    </div>
  </div>
</template>

<script setup>
import carte_membre from '@/Composants/carte_membre.vue';
import Barre_progress from './Composants/barre_progress_carte.vue';

const props = defineProps({
  carteProps: Object,
});
</script>

<style scoped>
@import '@/assets/css/carte_booster.css';
</style>
