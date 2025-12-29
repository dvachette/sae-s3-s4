<template>
  <div class="pageChangement">
    <h2>Changement d'adresse mail</h2>
    <form>
      <label> Votre ancienne adresse mail</label>
      <input type="text" id="a_mail" v-model="ancien_mail" />

      <label> Votre nouvelle adresse mail </label>
      <input type="text" id="n_mail" v-model="nouveau_mail" />

      <label> Confirmez votre nouvelle adresse mail </label>
      <input type="text" id="c_mail" v-model="confirmer_mail" />

      <label> Votre mot de passe </label>
      <input type="password" id="mdp" v-model="mdp" />
      <button type="submit" id="changer" @click="$emit('confirmer')">
        Changer mail
      </button>
      <button id="fermer" @click="$emit('fermer')">Retour</button>
    </form>
  </div>
</template>

<script setup>
const ancien_mail = '';
const nouveau_mail = '';
const confirmer_mail = '';
const mdp = '';
</script>

<style scopedS>
@import '@/assets/css/pop_up_mail.css';
</style>
