<template>
  <div class="pageChangement">
    <h2>Changement de mot de passe</h2>
    <form>
      <label for="ancien_mdp"> Votre ancien mot de passe</label>
      <input type="password" id="a_mdp" v-model="ancien_mdp" />

      <label for="nouveau_mdp"> Votre nouveau mot de passe </label>
      <input type="password" id="n_mdp" v-model="nouveau_mdp" />

      <label for="confirmer_mdp"> Confirmer votre mot de passe </label>
      <input type="password" id="c_mdp" v-model="confirmer_mdp" />
      <button @click="$emit('fermer')">Retour</button>
      <button type="submit" @click="$emit('confirmer')">
        Changer de mot de passe
      </button>
    </form>
  </div>
</template>

<script setup>
import {ref} from vue ;

const ancien_mdp = '' ;
const nouveau_mdp = '' ;
const confirmer_mdp = '' ;
</script>

<style scopedS>
@import '@/assets/css/mdp.css';
</style>
