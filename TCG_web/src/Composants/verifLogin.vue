<template></template>

<script setup>
import { useRouter } from 'vue-router';
import { onMounted } from 'vue';
import config from '@/config.json'
const emit = defineEmits(['loginSuccess']);
const router = useRouter()
    async function connexion() {
      try {
        // Envoi de la requête de connexion au serveur
        const response = await fetch(
          `http://${config.hosts.api}/user`, // URL de l'API de connexion
          {
            method: 'GET', // Méthode GET pour récupérer les données
            credentials: "include", // Inclure les cookies dans la requête
          }
        );
        const data = await response.json(); // Récupération de la réponse JSON
        console.log('Réponse du serveur :', data);
        if (response.ok) { // Vérification du succès de la connexion (code 200 ou 201)
          // Stockage des données dans sessionStorage
          sessionStorage.setItem('userData', JSON.stringify(data.user));
          // Emettre un événement pour indiquer la réussite de la connexion
          emit('loginSuccess');
        } else {
          // Afficher le message d'erreur (data.error) et redirection vers la connexion
          console.error('Échec de la connexion :', data.error);
          router.push('/');
        }
      } catch (error) {
        console.error('Erreur lors de la connexion :', error);
        router.push('/');
      }
    }

    onMounted(() => {
        connexion();
    });
</script>