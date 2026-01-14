<template>
    <div class="adminPanel">
        <header id="adminHeader">
            <img src="@/assets/imgs/logoTCG.png" alt="Logo TCG"/>
            <h1>Administration - Gestion des utilisateurs</h1>
            <img src="@/assets/imgs/logoTCG.png" alt="Icône Admin"/>
        </header>
        <input type="search" placeholder="Rechercher un joueur..."/>
        <div id="adminContent">
            <div class="playerCardsContainer">
                <CarteJoueurAdmin
                    v-for="player in 10"
                    :key="player"
                    :playerid="player"
                    :playerPicture="null"
                    @managePlayer="handleManagePlayer"
                />
            </div> 
            <div class="playerDetails">
                <h2>Détails du joueur</h2>
                <p>Sélectionnez un joueur pour voir ses détails ici.</p>
            </div>
        </div>
    </div>
</template>

<script setup>
    import '@/assets/css/admin.css';
    import CarteJoueurAdmin from './Composants/CarteJoueurAdmin.vue';
</script>