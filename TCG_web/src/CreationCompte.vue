<template>
  <header id="headerCreation">
    <img src="@/assets/imgs/logoTCG.png" alt="Logo du site" />
    <h1>Bienvenue sur BDE INFO TCG</h1>
  </header>

  <main id="mainCreation">
    <router-link to="/"><button>Retour</button></router-link>
    <div class="pageCreation">
      <h2>Créer un compte</h2>
      <form @submit="creationCompte">
        <label for="mail"> Email </label>
        <input type="text" id="mail" v-model="id_utilisateur" />

        <label for="userName"> Nom d'utilisateur </label>
        <input type="text" id="userName" v-model="id_utilisateur" />

        <label for="password"> Mot de passe </label>
        <input type="password" id="password" v-model="mdp_utilisateur" />

        <router-link to="/booster" type="submit">
          <button type="submit">Créer un compte</button>
        </router-link>
      </form>
    </div>
  </main>
</template>

<script setup>
import { ref } from 'vue';
</script>

<style scoped>
@import './assets/css/creationCompte.css';
</style>
