<template>
  <div class="carte" :style="{ '--w': largeur }">
    <img src="/assets/imgs/carte/pet/fond_familier.png" alt="carte" />
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
  import { computed } from 'vue';

const props = defineProps({
  data: Object,
  largeur: String
});

const nom = computed(() => props.data.name);
const niv = computed(() => props.data.level);
const desc = computed(() => props.data.description);
const effet = computed(() => props.data.modifierText);
const id = computed(() => props.data.cardId);

//partie image
const imgFamilier = computed(() => '/assets/imgs/carte/pet/'+id.value+'.png');


</script>

<style scoped>
@import '@/assets/css/carteFamilier.css';
</style>
