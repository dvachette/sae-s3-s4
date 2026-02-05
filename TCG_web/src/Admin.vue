<template>
    <div class="adminPanel">
        <header id="adminHeader">
            <img src="@/assets/imgs/logoTCG.png" alt="Logo TCG"/>
            <h1>Administration - Gestion des utilisateurs</h1>
            <img src="@/assets/imgs/logoTCG.png" alt="Icône Admin"/>
        </header>
        <input type="search" placeholder="Rechercher un joueur..."/>
        <div id="adminContent">
            <div class="playerCardScroller">
                <div class="playerCardsContainer">
                    <CarteJoueurAdmin
                        v-for="player in users"
                        :key="player.userId"
                        :playerid="player.userId"
                        :playerPicture="player.profilePicture"
                        @managePlayer="handleManagePlayer"
                    />
                </div>
            </div> 
            <div class="playerDetails" v-if="!selectedUser">
                <h2>Détails du joueur</h2>
                <p>Sélectionnez un joueur pour voir ses détails ici.</p>
            </div>
            <div class="playerDetails" v-else>
                <h2>Détails du joueur #{{ selectedUser.userId }}</h2>
                <p><strong>Nom d'utilisateur :</strong> {{ selectedUser.username }}</p>
                <p><strong>Email :</strong> {{ selectedUser.email }}</p>
                <p><strong>Rôle :</strong> {{ selectedUser.role }}</p>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { ref, onMounted } from 'vue';
    import '@/assets/css/admin.css';
    import CarteJoueurAdmin from './Composants/CarteJoueurAdmin.vue';
    import config from "./config.json";
    const users = ref([]);
    const selectedUser = ref(null);
    async function fetchOverviewUsersData() {
        try {
            const response = await fetch(`${config.hosts.api}/admin/users`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include' // Inclure les cookies pour l'authentification
                }
            );
            console.log('Réponse du serveur:', response);
            if (!response.ok) {
                throw new Error('Erreur lors de la récupération des utilisateurs');
            }
            const usersData = await response.json();
            users.value = usersData;
            console.log('Données des utilisateurs récupérées :', usersData);
        } catch (error) {
            console.error('Erreur:', error);
            console.error('Données de réponse:', error.response ? error.response.data : 'Aucune donnée de réponse');
        }
    }

    async function handleManagePlayer(playerId) {
        console.log(`Gérer le joueur avec l'ID : ${playerId}`);
        const response = await fetch(`${config.hosts.api}/admin/userDetails/${playerId}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include', // Inclure les cookies pour l'authentification
            }
        );
        if (!response.ok) {
            console.error('Erreur lors de la récupération des détails du joueur');
            return;
        }
        const playerDetails = await response.json();
        selectedUser.value = playerDetails;
        console.log('Détails du joueur récupérés :', playerDetails);
    }

    onMounted(async () => {
        await fetchOverviewUsersData();
    });
</script>