<template>
  <div class="autres_echange">
    <div class="reception">
      <p>Carte demandée</p>
      <carte_membre largeur="4.9vw" />
    </div>
    <div class="a_don">
      <p>Cartes à recevoir</p>
      <div class="los_cartos">
        <carte_membre largeur="4.9vw" />
        <carte_membre largeur="4.9vw" />
        <carte_membre largeur="4.9vw" />
      </div>
    </div>
  </div>
</template>

<script setup>
import carte_membre from '@/Composants/carte_membre.vue';

const props = defineProps({
  nom_echangeur: String,
});
</script>

<style scoped>
@import '@/assets/css/echange.css';
</style>
