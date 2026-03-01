<template>
  <div class="carte" :style="{ '--w': largeur }">
    <img src="/assets/imgs/carte/arena/fond_terrain.png" alt="carte" />
    <img :src="imgTerrain" alt="imgCarte" />
    
    <div id="haut_carte">
      <p id="nom">{{nom}}</p>
      <div class="niv">
        <p id="lblNiv">niveau</p>
        <p id="niv">{{niv}}</p>
      </div>
    </div>
    
    <p class="descCarte">
        {{desc}}
    </p>
  </div>
</template>

<script setup>
import {computed } from 'vue';

const props = defineProps({
  data: Object,
  largeur: String
});

const nom = computed(()=> props.data.name);
const niv = computed(() => props.data.level);
const desc = computed(() => props.data.description);
const id = computed(() => props.data.cardId);

//partie image
const imgTerrain = computed(() => '/assets/imgs/carte/arena/cartes/'+id.value+'.png');

</script>

<style scoped>
@import '@/assets/css/carteTerrain.css';
</style>
