<template>
  <div class="comp-echange">
    <p>échange de : {{ nom_echangeur }}</p>
    <div class="autres_echange">
      <div class="reception">
        <p>Carte donnée</p>
        <carte_membre :data="membres[0].card" largeur="7vw" />
      </div>
      <div class="a_don">
        <p>Choisir une carte</p>
        <div class="los_cartos">
          <carte_membre
            v-for="index in 3"
            :key="index"
            class="carte_echange"
            :data="membres[index].card"
            largeur="7vw"
            @click="carte_selectionee = index"
            :class="{ active: carte_selectionee === index }"
          />
        </div>
      </div>
    </div>
    <div class="les_boutons">
      <button
        id="b_confirmer"
        @click="$emit('confirmer')"
        v-if="carte_selectionee != null"
      >
        confirmer échange
      </button>
      <button id="n_confirmer" v-else>confirmer échange</button>
      <button id="b_annuler" @click="$emit('annuler')">annuler échange</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import carte_membre from '@/Composants/carte_membre.vue';

const carte_selectionee = ref(null);

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
@import '@/assets/css/accepter_echange.css';
</style>
