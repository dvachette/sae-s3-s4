<template>
  <main>
    <h2>
      La page des sockets WebSocket
    </h2>
  </main>
</template>

<script setup>
import { onMounted, ref } from 'vue';

async function setupWebSocket() {
    // Récuperer les informations de l'utilisateur connecté depuis le serveur
    const response = await fetch('http://localhost:3000/user', {method: 'GET',credentials: 'include'});
    const userData = await response.json();
    console.log('Utilisateur connecté:', userData);



    const socket = new WebSocket("ws://localhost:8080");
    
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
