<template>
  <div class="comp-echange">
    <p>échange de : {{ nom_echangeur }}</p>
    <div class="autres_echange">
      <div class="reception">
        <p>Carte demandée</p>
        <carte_membre :data="membres[0].card" largeur="4.9vw" />
      </div>
      <div class="a_don">
        <p>Cartes à recevoir</p>
        <div class="los_cartos">
          <carte_membre :data="membres[0].card" largeur="4.9vw" />
          <carte_membre :data="membres[0].card" largeur="4.9vw" />
          <carte_membre :data="membres[0].card" largeur="4.9vw" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import carte_membre from '@/Composants/carte_membre.vue';

const props = defineProps({
  nom_echangeur: String,
});

const userData = ref(JSON.parse(sessionStorage.getItem('userData')));

const collection = computed(() => {
  return userData.value.collection;
});

const membres = computed(() => {
  return collection.value.filter((carte) => carte.card._class === 'member');
});
</script>

<style scoped>
@import '@/assets/css/echange.css';
</style>
