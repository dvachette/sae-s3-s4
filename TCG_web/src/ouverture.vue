<template>
  <div v-if="showVideo" class="video-container">
    <video
      ref="introVideo"
      autoplay
      muted
      playsinline
      @ended="onVideoEnd"
      @play="fetchBooster"
    >
      <source src="@/assets/vidéos/boosteranim.mp4" type="video/mp4" />
    </video>
  </div>

  <div v-else-if="!allCardsGone" class="conteneur-cartes">
    <div class="clés">
      <nouv_clef :cles="obtainedKeys" />
    </div>
    <div class="cartes">
      <Stack
        :cardDimensions="cardDimensions"
        :cardsData="cards"
        @allCardsGone="onAllCardsGone"
      />
    </div>
  </div>
  <!-- Écran récapitulatif final -->
  <div v-else class="ecran-final">
    <clef class="nbClé" :cles="nbCles" />
    <div class="toutes_cartes">
      <div v-for="card in cartesCollectees" :key="card.id" class="carte-recap">
        <component
          :is="card.component"
          v-bind="{
            ...card.props,
            carteProps: {
              ...card.props.carteProps,
              largeur: cardWidthRecapVw, // ← Changez la largeur ici (au lieu de 300px)
            },
          }"
        />
      </div>
    </div>
    <router-link to="/booster"><button>Suivant</button></router-link>
  </div>
</template>

<script setup>
import { ref, watch, markRaw, computed } from 'vue';
import Stack from '@/Composants/Stack.vue';
import carte_membre from '@/Composants/carte_membre.vue';
import nouv_clef from './Composants/nouv_clef.vue';
import clef from './Composants/clef.vue';
import carteBooster from './carte-booster.vue';
import router from './router';

const showVideo = ref(true); // ← Remettez true pour la vidéo
const introVideo = ref(null);
const allCardsGone = ref(false);
const cartesCollectees = ref([]);

// Surveiller quand la vidéo est montée
watch(introVideo, (videoElement) => {
  if (videoElement) {
    videoElement.play().catch((error) => {
      console.error('Erreur lecture vidéo:', error);
    });
  }
});

const onVideoEnd = () => {
  showVideo.value = false;
};

const onAllCardsGone = (cartes) => {
  console.log('Nombre de cartes:', cartes.length);
  cartesCollectees.value = cartes;
  allCardsGone.value = true;
};

const cardDimensions = ref({ width: 20, height: 34 });
// Computed pour convertir en string avec unité
const cardWidthVw = computed(() => '20vw');
const cardWidthRecapVw = computed(() => '20vw');

// Fonction pour créer les cartes avec la bonne largeur
const createCard = (id, data, isNew = false, rarete = 'Commun') => ({
  id,
  component: markRaw(carteBooster),
  props: {
    carteComponent: markRaw(carte_membre),
    carteProps: {
      largeur: cardWidthVw.value,
      data, //doit modifier ca pour lui donner la carte
    },
  },
});

let cards = [];

const userData = ref(JSON.parse(sessionStorage.getItem('userData'))); //OK
const nbCles = ref(userData.value.balance); // TODO: Ajouter les clés gagnées ici
const obtainedKeys = ref(0);
async function fetchBooster() {
  const response = await fetch('http://localhost:3000/booster/open', {
    method: 'POST',
    credentials: 'include',
  });
  const data = await response.json();
  if (!response.ok) {
    console.error('Erreur ouverture booster:', data.error);
    router.push('/booster');
    return;
  }
  console.log('Booster ouvert:', data);
  // Mettre à jour les clés dans le sessionStorage
  nbCles.value += data.keys;
  obtainedKeys.value = data.keys;
  sessionStorage.setItem('userData', JSON.stringify(userData.value));
  for (const cardInfo of data.cards) {
    const card = createCard(cardInfo.cardId, cardInfo);
    cards.push(card);
  }
  console.log('Cartes du booster:', cards);
}
</script>

<style scoped>
@import '@/assets/css/ouverture.css';
</style>
