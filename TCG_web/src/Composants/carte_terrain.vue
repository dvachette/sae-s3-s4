<template>
  <div class="carte" :style="{ '--w': largeur }">
    <img src="@/assets/imgs/carte/arena/fond_terrain.png" alt="carte" />
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

const images = import.meta.glob('../assets/imgs/carte/arena/cartes/*.png', { eager: true });

const props = defineProps({
  data: Object,
  largeur: String
});

const nom = props.data.name;
const niv = props.data.level;
const desc = props.data.description;

//partie image
const imgTerrain = images['../assets/imgs/carte/arena/cartes/'+nom+'.png']?.default;

</script>

<style scoped>
@import '../assets/css/carteTerrain.css';
</style>
