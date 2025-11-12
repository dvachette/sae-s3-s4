<template>
  <MonHeader />
  <main id="collection">
    <div class="tri_filtres">
      <div class="cartes_possédées">
        <h2>cartes possédées :</h2>
        <h3>46/71</h3>
        <div class="barre_total">
          <div class="barre_progression"></div>
        </div>
      </div>
      <div class="Tri">
        <h2>Trié par :</h2>
        <label><input type="radio" name="tri" value="mandat">mandat</input></label>
        <label><input type="radio" name="tri" value="chronologique">chronologique</input></label>
        <label><input type="radio" name="tri" value="niveau">niveau</input></label>
        <label><input type="radio" name="tri" value="croissant">croissant</input></label>
        <label><input type="radio" name="tri" value="pôle">pôle</input></label>
      </div>
      <div class="Filtres">
        <h2>Filtré par :</h2>
        <label><input type="checkbox" name="filtre" value="possédées">possédées</input></label>
        <label><input type="checkbox" name="filtre" value="mon_deck">mon deck</input></label>
        <label><input type="checkbox" name="filtre" value="membres">membres</input></label>
        <label><input type="checkbox" name="filtre" value="familiers">familiers</input></label>
        <label><input type="checkbox" name="filtre" value="arènes">arènes</input></label>
      </div>
    </div>
    <div class="toutes_les_cartes"></div>
  </main>
</template>

<script setup>
import { ref } from 'vue';

import MonHeader from '@/Composants/header.vue';
</script>

<script scoped>
import '@/assets/css/collection.css';
</script>
