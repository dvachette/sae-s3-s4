<template>
  <div class="pageChangement">
    <h2>Changement de pseudo</h2>
    <form>
      <label> Votre nouveau pseudo </label>
      <input type="text" id="n_pseudo" v-model="pseudo" />
      <button type="submit" id="changer" @click="$emit('confirmer')">
        Changer pseudo
      </button>
      <button id="fermer" @click="$emit('fermer')">Retour</button>
    </form>
  </div>
</template>

<script setup>
const pseudo = '';
</script>

<style scopedS>
@import '@/assets/css/pop_up_pseudo.css';
</style>
