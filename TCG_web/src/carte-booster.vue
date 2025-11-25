<template>
  <div class="carte-wrapper">
    <!-- Version simplifiée qui devrait marcher -->
    <carte_membre
      :largeur="carteProps.largeur"
      :data="carteProps.data"
      class="carte-principale"
    />

    <!-- Éléments supplémentaires -->
    <div class="elements-supplementaires">
      <Barre_progress :niv="carteProps.data?.niveau || 0" />
      <div class="nombres_cartes">
        <p>+7</p>
      </div>
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
