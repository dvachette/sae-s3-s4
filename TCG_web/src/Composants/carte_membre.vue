<template>
  <div class="carte" :style="{ '--w': largeur }">
    <img src="@/assets/imgs/carte/perso/fond_comm.png" alt="carte" />
    <div id="haut_carte">
      <p id="nom">Mzhdunosaure</p>
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
      <p class="nom_attaque">Com-potes</p>
      <p class="degats">20</p>
      <p class="lblDegats">dégâts</p>
      <p class="desc_attaque">
        Inflige le 2x20 dégats si la carte Aloys est également dans l'équipe
      </p>

      <p class="cout">2</p>
      <p class="nom_attaque">Piouccino</p>
      <p class="degats">20</p>
      <p class="lblDegats">dégâts</p>
      <p class="desc_attaque">
        Soigne de 10pv tous les membres du mandat 2023-2024 (MIB) de son équipe
      </p>
    </div>

    <div class="bas_carte">
      <p class="faib/force">Faiblesse</p>
      <p class="faib/force">Force</p>
      <p class="mandat">2024-2025</p>
    </div>
  </div>
</template>

<script setup>
const niveau = 'niveau';

const props = defineProps({
  largeur: String,
});

const styleValue = "{'--w' : " + props.largeur + '}';
</script>

<style scoped>
@import '../assets/css/carteMembre.css';
</style>
