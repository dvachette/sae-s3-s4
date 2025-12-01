<template>
  <div class="carte" :style="{ '--w': largeur }">
    <img src="@/assets/imgs/carte/perso/fonds/fond_comm.png" alt="carte" />
    <img src="@/assets/imgs/carte/perso/Mzhdunosaure.png" alt="imgCarte" />
    <div id="haut_carte">
      <p id="nom">Mhzdunosaure</p>
      <div class="PV">
        <p id="PV">120</p>
        <p id="lblPV">PV</p>
      </div>
      <div class="niv">
        <p id="lblNiv">{{ niveau }}</p>
        <p id="niv">5</p>
      </div>
    </div>

    <div class="attaques">
      <p class="cout">2</p>
      <p class="nom_attaque">kdkdkd</p>
      <p class="degats">20</p>
      <p class="lblDegats">dégâts</p>
      <p class="desc_attaque">
        Tchou ! Tchou ! Apéro ?
      </p>

      <p class="cout">2</p>
      <p class="nom_attaque">Oh ! Un nid de vaches !</p>
      <p class="degats">20</p>
      <p class="lblDegats">dégâts</p>
      <p class="desc_attaque">
         rend confus son adversaire pendant 2 tours, iel cherchera en vain ce qu'on a tenté de lui montrer
      </p>
    </div>

    <div class="bas_carte">
      <p class="faibForce">Faiblesse</p>
      <p class="faibForce">Force</p>
      <img
        src="@/assets/imgs/carte/perso/faiblessesForces/suivi.png"
        alt="faiblesse"
      />
      <img
        src="@/assets/imgs/carte/perso/faiblessesForces/locviseur.png"
        alt="force"
      />
      <p class="dateMandat">2024 2025</p>
      <img
        src="@/assets/imgs/carte/perso/mandats/fbi.png"
        alt="mandat"
        id="imgMandat"
      />
      <p class="descCarte">
        compliqué à tenir en place, cherchez-le vers les basses ou sous un trampoline
      </p>
    </div>
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
@import '../assets/css/carteMembre.css';
</style>
