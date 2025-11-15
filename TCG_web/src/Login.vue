<template>
  <header>
    <img src="@/assets/imgs/logoTCG.png" alt="Logo du site" />
    <h1>Bienvenue sur BDE INFO TCG</h1>
  </header>

  <main id="mainConnexion">
    <div class="pageConnexion">
      <h2>Connexion</h2>
      <form @submit.prevent="connexion">
        <label for="userName"> Nom d'utilisateur ou email </label>
        <input type="text" id="userName" v-model="id_utilisateur" />

        <label for="password"> Mot de passe </label>
        <input type="password" id="password" v-model="mdp_utilisateur" />

        <button type="submit">Se connecter</button>
      </form>
      <router-link to="/booster"><button>booster</button></router-link>
    </div>
  </main>
</template>

<script>
export default {
  data() {
    return {
      id_utilisateur: '',
      mdp_utilisateur: '',
    };
  },
  methods: {
    async connexion() {
      try {
        // Envoi de la requête de connexion au serveur
        const response = await fetch(
          'http://localhost:3000/login', // URL de l'API de connexion
          {
            method: 'POST', // Méthode POST pour envoyer les données
            headers: { // En-têtes de la requête
              'Content-Type': 'application/json', // Type de contenu JSON
            },
            credentials: "include", // Inclure les cookies dans la requête
            body: JSON.stringify({ // Corps de la requête avec les données utilisateur
              email: this.id_utilisateur,
              password: this.mdp_utilisateur,
            }),
          }
        );
        const data = await response.json(); // Récupération de la réponse JSON
        console.log('Réponse du serveur :', data);
        if (response.ok) { // Vérification du succès de la connexion (code 200 ou 201)
          // Redirection
          this.$router.push('/booster');

        } else {
          // Afficher le message d'erreur (data.error)
          console.error('Échec de la connexion :', data.error);

        }
      } catch (error) {
        console.error('Erreur lors de la connexion :', error);
      }
    },
  },
};

</script>
<script setup>
import { ref } from 'vue';
</script>

<style scoped>
@import './assets/css/styleConnexion.css';
</style>
