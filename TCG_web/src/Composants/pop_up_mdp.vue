<template>
  <div class="pageChangement">
    <h2>Changement de mot de passe</h2>
    <form>
      <label> Votre ancien mot de passe</label>
      <input type="password" id="a_mdp" v-model="ancien_mdp" />

      <label> Votre nouveau mot de passe </label>
      <input type="password" id="n_mdp" v-model="nouveau_mdp" />

      <label> Confirmez votre mot de passe </label>
      <input type="password" id="c_mdp" v-model="confirmer_mdp" />
      <button type="submit" id="changer" @click="$emit('confirmer')">
        Changer de mot de passe
      </button>
      <button id="fermer" @click="$emit('fermer')">Retour</button>
    </form>
  </div>
</template>

<script setup>
const ancien_mdp = '';
const nouveau_mdp = '';
const confirmer_mdp = '';
</script>

<style scopedS>
@import '@/assets/css/pop_up_mdp.css';
</style>
