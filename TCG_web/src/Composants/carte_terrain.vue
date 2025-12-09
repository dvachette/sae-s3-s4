<template>
  <div class="carte" :style="{ '--w': largeur }">
    <img src="@/assets/imgs/carte/arena/fond_terrain.png" alt="carte" />
    <img src="@/assets/imgs/carte/arena/cartes/feyssine.png" alt="imgCarte" />
    <div id="haut_carte">
      <p id="nom">Aurel, le retour</p>
      <div class="niv">
        <p id="lblNiv">{{ niveau }}</p>
        <p id="niv">5</p>
      </div>
    </div>
    
    <p class="descCarte">
        compliqué à tenir en place, cherchez-le vers les basses ou sous un trampoline
    </p>
  </div>
</template>

<script setup>
const niveau = 'niveau';

const props = defineProps({
  data: Object,
  largeur: String
});

</script>

<style scoped>
@import '../assets/css/carteTerrain.css';
</style>
