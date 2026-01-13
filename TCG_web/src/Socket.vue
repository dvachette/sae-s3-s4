<template>
  <VerifLogin/>
  <main>
    <h2>
      La page des sockets WebSocket
    </h2>
  </main>
</template>

<script setup>
import VerifLogin from '@/Composants/verifLogin.vue';
import { onMounted, ref } from 'vue';
import config from '@/config.json'
async function setupWebSocket() {
    // Récuperer les informations de l'utilisateur connecté depuis le serveur
    const response = await fetch(`http://${config.hosts.api}/user`, {method: 'GET',credentials: 'include'});
    const userData = await response.json();
    console.log('Utilisateur connecté:', userData);



    const socket = new WebSocket(`ws://{config.hosts.socket}`);
    
    socket.onopen = () => {
        console.log('WebSocket connection established');
        const messageObj = {
            type: 'authenticate',
            userId: userData.user.userId
        };
        const message = JSON.stringify({ type: 'authenticate', userId: userData.user.userId });
        console.log('Sending authentication message:', message);
        socket.send(message );
    };
    
    socket.onmessage = (event) => {
        console.log('Message from server:', event.data);
    };
    
    socket.onerror = (error) => {
        console.error('WebSocket error:', error);
    };
    
    socket.onclose = () => {
        console.log('WebSocket connection closed');
    };
}

onMounted(() => {
  setupWebSocket();
});
</script>
