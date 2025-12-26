<template>
  <div class="carte" :style="{ '--w': largeur }">
    <img src="@/assets/imgs/carte/pet/fond_familier.png" alt="carte" />
  <img :src="imgFamilier" alt="imgCarte" />
    <div id="haut_carte">
      <p id="nom">{{ nom }}</p>
      <div class="niv">
        <p id="lblNiv">niveau</p>
        <p id="niv">{{ niv }}</p>
      </div>
    </div>

    <p class="effet">
        {{effet}}
    </p>

    
    <p class="descCarte">
        {{desc}}
    </p>
  </div>
</template>

<script setup>
const images = import.meta.glob('../assets/imgs/carte/pet/*.png', { eager: true });

const props = defineProps({
  data: Object,
  largeur: String
});

const nom = props.data.name;
const niv = props.data.level;
const desc = props.data.description;
const effet = props.data.modifierText;

//partie image
const imgFamilier = images['../assets/imgs/carte/pet/'+nom+'.png']?.default;


</script>

<style scoped>
@import '../assets/css/carteFamilier.css';
</style>
