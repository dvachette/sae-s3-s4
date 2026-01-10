<template>
  <div class="carte_simple">
    <carte_membre
      v-if="classe == 'member'"
      :largeur="carteProps.largeur"
      :data="carteProps.data"
      class="carte-principale"
    />
    <carte_familier
      v-if="classe == 'pet'"
      :largeur="carteProps.largeur"
      :data="carteProps.data"
      class="carte-principale"
    />
    <carte_terrain
      v-if="classe == 'arena'"
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
import carte_familier from './Composants/carte_familier.vue';
import carte_terrain from './Composants/carte_terrain.vue';
import Barre_progress from './Composants/barre_progress_carte.vue';

const props = defineProps({
  carteProps: Object,
});

const classe = props.carteProps.data._class;

console.log(classe);
</script>

<style scoped>
@import '@/assets/css/carte_booster.css';
</style>
