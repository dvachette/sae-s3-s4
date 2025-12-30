<template>
  <div class="mon_echange">
    <div class="demande">
      <p>Carte demandée</p>
      <carte_membre :data="membres[0].card" largeur="4.9vw" />
    </div>
    <div class="don">
      <p>Cartes à donner</p>
      <div class="les_cartes">
        <carte_membre
          v-for="index in 2"
          :key="index"
          class="carte_echange"
          :data="membres[index].card"
          largeur="4.9vw"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import carte_membre from '@/Composants/carte_membre.vue';

const userData = ref(JSON.parse(sessionStorage.getItem('userData')));

const collection = computed(() => {
  return userData.value.collection;
});

const membres = computed(() => {
  return collection.value.filter((carte) => carte.card._class === 'member');
});
</script>

<style scoped>
@import '@/assets/css/mes_echanges.css';
</style>
