<template>
  <div class="carte" :style="{ '--w': largeur }">
    <img src="@/assets/imgs/carte/arena/fond_terrain.png" alt="carte" />
    <img src="@/assets/imgs/carte/arena/cartes/feyssine.png" alt="imgCarte" />
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
const props = defineProps({
  data: Object,
  largeur: String
});

const nom = props.data.name;
const niv = props.data.level;
const desc = props.data.description;

</script>

<style scoped>
@import '../assets/css/carteTerrain.css';
</style>
