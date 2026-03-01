<script setup lang="js">
    import carte_membre from './Composants/carte_membre.vue';
    import carte_familier from './Composants/carte_familier.vue';
    import carte_terrain from './Composants/carte_terrain.vue';
    import CardCounter from './Composants/EditeableNumeric.vue';
    import { ref, onMounted } from 'vue';
    import config from "./config.json";
    import { useRouter } from 'vue-router';
    import CheckAdmin from './Composants/CheckAdmin.vue';
    const cards = ref([]);
    const cardsToDisplay = ref([]);
    const userData = ref(null); 
    // Récupérer l'ID de l'utilisateur depuis l'URL /admin/collection/:userId
    const router = useRouter();
    const userId = router.currentRoute.value.params.userId; 
    const searchTerm = ref('');
    console.log("User ID from URL:", userId);
    async function fetchAllCards() {
        try {
            const response = await fetch(`${config.hosts.api}/admin/cards`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include' // Inclure les cookies pour l'authentification
                }
            );
            if (!response.ok) {
                throw new Error('Erreur lors de la récupération des cartes');
            }
            const cardsData = await response.json();
            cards.value = cardsData;
            console.log('Données des cartes récupérées :', cardsData);
        } catch (error) {
            console.error('Erreur:', error);
            console.error('Données de réponse:', error.response ? error.response.data : 'Aucune donnée de réponse');
        }
    }   

    async function fetchUserCollection(userId) {
        const response = await fetch(`${config.hosts.api}/admin/userDetails/${userId}`,
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
        console.log('Détails du joueur récupérés :', playerDetails);
        userData.value = playerDetails; // Stocker les détails du joueur dans userData
    }

    onMounted(async () => {
        
        await fetchAllCards();
        await fetchUserCollection(userId);
        for (let card of cards.value) {
            const quantity = userData.value.collection.find(c => c.card.cardId === card.cardId)?.quantity || 0;
            card.quantity = quantity; // Ajouter la quantité à chaque carte
            console.log(`Carte ID: ${card.cardId}, Quantité: ${card.quantity}`);
        }
        filterCards(); // Appliquer le filtre initial pour afficher les cartes de la collection de l'utilisateur

    });

    async function updateQuantity(newQuantity, cardId) {
        console.log("call update for card ID:", cardId);
        const response = await fetch(`${config.hosts.api}/admin/user/collection`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                targetUserId: userId,
                cardId: cardId,
                quantity: newQuantity
            })
        });
        if (!response.ok) {
            console.error('Erreur lors de la mise à jour de la quantité de la carte');
            return;
        }
        console.log('Quantité de la carte mise à jour avec succès');
        
    }

    function filterCards() {
        const term = searchTerm.value.toLowerCase();
        console.log("Filtering cards with term:", term);
        cardsToDisplay.value = cards.value.filter(card => card.name.toLowerCase().includes(term));
    }
</script>

<template>
    <CheckAdmin />
    <header id="adminHeader">
            <img src="/assets/imgs/logoTCG.png" alt="Logo TCG"/>
            <h1>Administration - Gestion de la collection de l'utilisateur #{{ userId }}</h1>
            <img src="/assets/imgs/logoTCG.png" alt="Icône Admin"/>
    </header>
    <nav>
        <a href="/admin/users">&lt; Retour à la gestion des utilisateurs</a>
        <input type="text" v-model="searchTerm" placeholder="Rechercher une carte..." @input="filterCards"/>
    </nav>
    <div class="scrollContainer">
        <div class="content">
            <div class="cardContainer" v-for="card in cardsToDisplay" :key="card.cardId">
                <carte_membre v-if="card._class === 'member'" :data="card" largeur="17vw"/>
                <carte_familier v-else-if="card._class === 'pet'" :data="card" largeur="17vw"/>
                <carte_terrain v-else-if="card._class === 'arena'" :data="card" largeur="17vw"/>
                <CardCounter :value="card.quantity || 0" :cardId="card.cardId" @update:count="updateQuantity" />
            </div>
        </div>
    </div>   
</template>

<style scoped>
    header {
    position: fixed;
    top:0;
    left: 0;
    width: 100%;
    height: 15vh;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: linear-gradient(
        90deg,
        rgb(var(--orange400)),
        rgb(var(--orange500))
        );
    z-index: 10;
}

header > img {
    height: 12vh
}
    .scrollContainer {
        width: 100%;
        height: 80vh;
        overflow-y: auto;
        position: relative;
    }
    .content {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 20px;
        padding: 20px;
        position:absolute;
        top: 200px;
    }
    nav {
        position: relative;
        display:flex;
        top:15vh;
        z-index: 10;
        background-color: #D9D9D9;
        width:100vw;
        padding: 1em 3em;
        gap: 3em;
    }
    a {
        text-decoration: none;
        color: black;
        font-size: 1.2em;
        font-weight: bold;
    }
    input {
        font-size: 1em;
        border: 1px solid #ccc;
        border-radius: 20px;
        width: 300px;
    }
    header img {
        height: 80%;
    }
</style>