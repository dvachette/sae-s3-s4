<template>
</template>

<script setup>
    import { onBeforeMount } from 'vue';
    import config from '../config.json';
    onBeforeMount(async () => {
        const response = await fetch(`${config.hosts.api}/admin/isAdmin`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include' // Inclure les cookies pour l'authentification
        });
        if (!response.ok) {
            console.error('Erreur lors de la vérification du rôle admin');
            window.location.href = '/'; // Rediriger vers la page d'accueil si l'utilisateur n'est pas admin
        }
    });
</script>