<template>
  <div>
    <header>
      <h1>Bienvenue sur BDE INFO TCG</h1>
    </header>
    <div class="page connexion">
      <h2>Connexion :</h2>
      <form @submit="connexion">
        <div>
          <label>
            <input type="text" v-model="id_utilisateur" />Nom d'utilisateur ou
            email
          </label>
        </div>
        <div>
          <label>
            <input type="password" v-model="mdp_utilisateur" />Mot de passe
          </label>
        </div>
        <button type="submit">Se Connecter</button>
      </form>
      <button>Créer un compte</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
</script>
