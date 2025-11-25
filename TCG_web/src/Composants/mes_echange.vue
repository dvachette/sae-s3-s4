<template>
  <div class="mon_echange">
    <div class="demande">
      <p>Carte demandée</p>
      <carte_membre largeur="4.9vw" />
    </div>
    <div class="don">
      <p>Cartes à donner</p>
      <div class="les_cartes">
        <carte_membre largeur="4.9vw" />
        <carte_membre largeur="4.9vw" />
        <carte_membre largeur="4.9vw" />
      </div>
    </div>
  </div>
</template>

<script setup>
import carte_membre from '@/Composants/carte_membre.vue';
</script>

<style scoped>
@import '@/assets/css/mes_echanges.css';
</style>
