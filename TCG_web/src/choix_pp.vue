<template>
  <div class="pop_up_pp">
    <div class="entete">
      <p>Photo de profil choisie :</p>
      <img :src="pp" alt="pp" v-if="image_choisie === null" />
      <img v-else :src="image_choisie" :alt="`Image choisie`" />
    </div>
    <div class="liste_pp">
      <img
        v-for="(image, index) of collection_images"
        :src="image"
        :alt="`Image ${index}`"
        class="images"
        @click="image_choisie = image"
        :class="{ active: image_choisie === image }"
      />
    </div>
    <div class="boutons_pp">
      <button
        id="b_confirmer"
        @click="changementPP"
        v-if="image_choisie != null"
      >
        Confirmer changement
      </button>
      <button id="n_confirmer" v-else>Confirmer changement</button>
      <button id="b_annuler" @click="$emit('fermer')">Annuler</button>
    </div>
  </div>
</template>

<script setup>
import { ref, defineEmits } from 'vue';
import config from '@/config.json';

const selected = ref(null);
const pp = ref('/src/assets/imgs/logoTCG.png');

const user = ref(JSON.parse(sessionStorage.getItem('userData')));

const image_choisie = ref(null);

const collection_images = ref([]);

function loadUserData() {
  pp.value =
    user.value.profilePicture !== null
      ? user.value.profilePicture
      : 'src/assets/imgs/logoTCG.png';
  collection_images.value = [];
  for (let elem of user.value.collection) {
    console.log(elem.card.cardId);
    switch (elem.card._class) {
      case 'member':
        collection_images.value.push(
          `/src/assets/imgs/carte/perso/${elem.card.cardId}.png`,
        );
        break;
      case 'pet':
        collection_images.value.push(
          `/src/assets/imgs/carte/pet/${elem.card.cardId}.png`,
        );
        break;
      case 'arena':
        collection_images.value.push(
          `/src/assets/imgs/carte/arena/carre/${elem.card.cardId}.png`,
        );
        break;
      default:
        break;
    }
  }
}
loadUserData();

const emit = defineEmits(['fermer', 'changementPP']);

async function changementPP() {
  const response = await fetch(`${config.hosts.api}/user`, {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ profilePicture: image_choisie.value }),
  });
  const data = await response.json();
  if (response.ok) {
    user.value.profilePicture = image_choisie.value;
    sessionStorage.setItem('userData', JSON.stringify(user.value));
    console.log(data.message + ' reçues du serveur');
    emit('changementPP');
    emit('fermer');
  } else {
    console.error(data);
  }
}
</script>

<style scoped>
@import './assets/css/choix_pp.css';
</style>
