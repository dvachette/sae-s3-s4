<template>
  <div class="carte" :style="{ '--w': largeur }">
    <img src="@/assets/imgs/carte/pet/fond_familier.png" alt="carte" />
  <img src="@/assets/imgs/carte/pet/trainCarton.png" alt="imgCarte" />
    <div id="haut_carte">
      <p id="nom">Aurel, le retour</p>
      <div class="niv">
        <p id="lblNiv">{{ niveau }}</p>
        <p id="niv">5</p>
      </div>
    </div>

    <p class="effet">
        Pour 3 tours, l'adversaire imite Yves Lecoq qui imite Jacque Chirac. Iel perd 10 PV  pendant 3 tours
    </p>

    
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
@import '../assets/css/carteFamilier.css';
</style>
