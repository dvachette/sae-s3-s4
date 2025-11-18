<template>
  <div class="autres_echange">
    <div class="reception">
      <p>Carte demandée</p>
      <carte_membre largeur="5.5vw" />
    </div>
    <div class="a_don">
      <p>Cartes à recevoir</p>
      <div class="los_cartos">
        <carte_membre largeur="5.5vw" />
        <carte_membre largeur="5.5vw" />
        <carte_membre largeur="5.5vw" />
      </div>
    </div>
  </div>
</template>

<script setup>
import carte_membre from '@/Composants/carte_membre.vue';
</script>

<style scoped>
@import '@/assets/css/echange.css';
</style>
