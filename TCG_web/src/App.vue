<template>
    <header id="headerConnexion">
      <img src="@/assets/imgs/logoTCG.png" alt="Logo du site">
      <h1>Bienvenue sur BDE INFO TCG</h1>
    </header>

    <main id="mainConnexion">
      <div class="pageConnexion">
        <h2>Connexion</h2>
        <form @submit="connexion">
          <label for="userName">
            Nom d'utilisateur ou email
          </label>
          <input type="text" id="userName" v-model="id_utilisateur" />
          
          <label for="password">
            Mot de passe
          </label>
          <input type="password" id ="password" v-model="mdp_utilisateur" />
            
          <button type="submit">Se Connecter</button>
        </form>
        <button>Créer un compte</button>
      </div>
    </main>
</template>

<script setup>
import { ref } from 'vue';
</script>

<style scoped>
  @import "./assets/css/styleConnexion.css";
</style>
