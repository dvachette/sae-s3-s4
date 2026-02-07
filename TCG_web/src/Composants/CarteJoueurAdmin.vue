<template>
    <div class="playerCard">
        <div class="imgBg">
            <img :src="pictureURLDisplay" alt="Image de profil"/>
        </div>
        <h2>Joueur #{{ playerIdDisplay }}</h2>
        <button @click="handleManageClick">Gérer</button>
    </div>
</template>

<script setup>
    import '@/assets/css/carteAdmin.css';
    import { defineProps, computed } from 'vue';
    const { playerid, playerPicture } = defineProps({
        playerid: Number,
        playerPicture: String
    });

    const pictureURLDisplay = computed(() => {
        return playerPicture ? playerPicture : '/src/assets/imgs/logoTCG.png';
    });

    const playerIdDisplay = computed(() => {
        return playerid !== undefined ? playerid : 'Inconnu';
    });


    const emit = defineEmits(['managePlayer']);

    function handleManageClick() {
        emit('managePlayer', playerid);
    }



</script>