<template>
  <VerifLogin />
  <MonHeader />
  <main>
    <div class="la_boutique">
      <div class="le_booster">
        <router-link to="/ouverture"
          ><img src="@/assets/imgs/booster.png" alt="booster" class="Booster"
        /></router-link>
        <p>{{ timerText }}</p>
        <router-link :to="'/ouverture?buy=true'" v-if="nbCles >= 100"
          ><boutons_achat :prix="100"
        /></router-link>
        <boutons_achat id="bouton_none" :prix="100" v-else />
      </div>
      <div class="cartes_proposés">
        <clef class="compteur_boutique" :cles="nbCles" />
        <div class="offre" v-for="offer of offers" :key="offer.id">
          <carte_membre v-if="offer.content.type === 'card' && offer.cardDetail._class === 'member'" :data="offer.cardDetail" largeur="20vw"></carte_membre>
          <carte_familier v-else-if="offer.content.type === 'card' && offer.cardDetail._class === 'pet'" :data="offer.cardDetail" largeur="20vw"></carte_familier>
          <carte_terrain v-else-if="offer.content.type === 'card' && offer.cardDetail._class === 'arena'" :data="offer.cardDetail" largeur="20vw"></carte_terrain>
          <boutons_achat :prix="offer.cost" @click="buyOffer(offer.id)" :disabled="offer.remaining === 0"/>
          <p v-if="offer.remaining === 0" class="sold_out">Épuisé</p>
          <p v-else-if="offer.remaining !== undefined" class="remaining">Restant : {{ offer.remaining }}</p>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import clef from '@/Composants/clef.vue';
import boutons_achat from '@/Composants/boutons_achat.vue';
import MonHeader from '@/Composants/header.vue';
import carte_membre from '@/Composants/carte_membre.vue';
import carte_familier from './Composants/carte_familier.vue';
import carte_terrain from './Composants/carte_terrain.vue';
import VerifLogin from '@/Composants/verifLogin.vue';
import config from '@/config.json';
const userData = ref(JSON.parse(sessionStorage.getItem('userData'))); //OK
const nbCles = ref(userData.value.balance);
const offers = ref([]);
async function loadOffers() {
  const response = await fetch(`${config.hosts.api}/shop`, {
    method: 'GET',
    credentials: 'include',
  });
  if (response.ok) {
    const data = await response.json();
    offers.value = data.offers;
    console.log(offers.value);
  } else {
    console.error('Erreur lors du chargement des offres de la boutique');
  }
}

async function buyOffer(offerId) {
  const response = await fetch(`${config.hosts.api}/shop/buy`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      "Content-Type": "application/json"
    },
    body:JSON.stringify({offerId: offerId})
  })
  if (response.ok) {
    const data = await response.json();
    console.log("Achat réussi :", data);
    // Mettre à jour le nombre de clés et les offres
    nbCles.value -= offers.value.find(offer => offer.id === offerId).cost;
    userData.value.balance = nbCles.value;
    if (offers.value.find(offer => offer.id === offerId).content.type === "card") {
      const offer = offers.value.find(offer => offer.id === offerId);
      if (userData.value.collection.find(c => c.card.cardId === offer.content.cardId)) {
        userData.value.collection.find(c => c.card.cardId === offer.content.cardId).quantity += offer.content.quantity;
      } else {
        userData.value.collection.push({ card: offer.cardDetail, quantity: offer.content.quantity });
      }
    }
    sessionStorage.setItem('userData', JSON.stringify(userData.value));

    await loadOffers();
  } else {
    const errorData = await response.json();
    console.error("Erreur lors de l'achat :", errorData.error);
  }
}

onMounted(async () => {
  await loadOffers();
});

</script>

<style scoped>
@import './assets/css/boutique.css';
</style>
