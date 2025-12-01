<template>
  <div class="carte" :style="{ '--w': largeur }">
    <img src="@/assets/imgs/carte/perso/fonds/fond_comm.png" alt="carte" />
    <img src="@/assets/imgs/carte/perso/Mzhdunosaure.png" alt="imgCarte" />
    <div id="haut_carte">
      <p id="nom">{{data.name}}</p>
      <div class="PV">
        <p id="PV">{{ data.maxHitpoints }}</p>
        <p id="lblPV">PV</p>
      </div>
      <div class="niv">
        <p id="lblNiv">niveau</p>
        <p id="niv">{{ data.level }}</p>
      </div>
    </div>

    <div class="attaques">
      <p class="cout">{{ data.attacks[0].cost }}</p>
      <p class="nom_attaque">{{ data.attacks[0].name }}</p>
      <p class="degats">20</p>
      <p class="lblDegats">dégâts</p>
      <p class="desc_attaque">
        {{ data.attacks[0].description }}
      </p>

      <p class="cout">{{ data.attacks[0].cost }}</p>
      <p class="nom_attaque">{{ data.attacks[0].name }}</p>
      <p class="degats">20</p>
      <p class="lblDegats">dégâts</p>
      <p class="desc_attaque">
        {{ data.attacks[0].description }}
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
        {{ data.description }}
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
