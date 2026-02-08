<template>
  <header id="headerCreation">
    <img src="/assets/imgs/logoTCG.png" alt="Logo du site" />
    <h1>Bienvenue sur BDE INFO TCG</h1>
  </header>

  <main id="mainCreation">
    <router-link to="/"><button>Retour</button></router-link>
    <div class="pageCreation">
      <h2>Créer un compte</h2>
      <form @submit.prevent ="creationCompte">
        <label for="mail"> Email </label>
        <input type="text" id="mail" v-model="email_utilisateur" />

        <label for="userName"> Nom d'utilisateur </label>
        <input type="text" id="userName" v-model="id_utilisateur" />

        <label for="password"> Mot de passe </label>
        <input type="password" id="password" v-model="mdp_utilisateur" />
        <p id="Incorrect" v-show="Creatingerror" >	&#x26A0 {{ texterror }} &#x26A0</p>

        <button type="submit">Créer un compte</button>
      </form>
    </div>
  </main>
</template>

<script setup>
import { ref } from 'vue';
import config from '@/config.json';
</script>

<script>
export default {
  data() {
    return {
      email_utilisateur: '',
      id_utilisateur: '',
      mdp_utilisateur: '',
      Creatingerror: false,
      texterror: '',
    };
  },
  methods: {
    async creationCompte() {
      try {
        // Envoi de la requête de connexion au serveur
        const response = await fetch(
          `${config.hosts.api}/user`, // URL de l'API de connexion
          {
            method: 'POST', // Méthode POST pour envoyer les données
            headers: {
              // En-têtes de la requête
              'Content-Type': 'application/json', // Type de contenu JSON
            },
            credentials: 'include', // Inclure les cookies dans la requête
            body: JSON.stringify({
              // Corps de la requête avec les données utilisateur
              email: this.email_utilisateur,
              name: this.id_utilisateur,
              password: this.mdp_utilisateur,
            }),
          }
        );
        const data = await response.json(); // Récupération de la réponse JSON
        console.log('Réponse du serveur :', data);
        if (response.ok) {
          // Vérification du succès de la connexion (code 200 ou 201)
          // Redirection
          this.$router.push('/booster');

        } else {
          // Afficher le message d'erreur (data.error)
          console.error('Échec de la création:', data.error);
          this.Creatingerror = true;
          this.texterror = data.error;
        }
      } catch (error) {
        console.error('Erreur lors de la création :', error);
      }
    },
  },
};

</script>

<style scoped>
@import '@/assets/css/creationCompte.css';
</style>
