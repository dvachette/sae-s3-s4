<template>
  <div class="pop_up_pp">
    <div class="entete">
      <img :src="pp" alt="pp" v-if="image_choisie === null"/>
      <img v-else :src="image_choisie" :alt="`Image choisie`"/>
      <h2>Trié par :</h2>
      <div class="Tri">
        <div class="Tri_liste" v-for="item in options" :key="item.value">
            <label>
            <input type="radio" name="tri" v-model="selected" :value="item.value">
                {{ item.label }}
            </label>
            <!-- Checkbox visible uniquement si ce radio est sélectionné -->
            <label v-if="selected === item.value && item.checkbox">
            <input type="checkbox" v-model="item.checkboxValue">
        {{ item.checkbox }}
            </label>
        </div>
      </div>
      <h2>Filtré par :</h2>
      <div class="Filtres">
        <label><input type="checkbox" name="filtre" value="possédées">possédées</input></label>
        <label><input type="checkbox" name="filtre" value="mon_deck">mon deck</input></label>
        <label><input type="checkbox" name="filtre" value="membres">membres</input></label>
        <label><input type="checkbox" name="filtre" value="familiers">familiers</input></label>
        <label><input type="checkbox" name="filtre" value="arènes">arènes</input></label>
      </div>
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
        <button id="b_confirmer" @click="changementPP" v-if="image_choisie != null">Confirmer changement</button>
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

const image_choisie = ref(null) ;

const collection_images = ref([
  "/src/assets/imgs/carte/perso/Maël.png",
  "/src/assets/imgs/carte/perso/36.png",
  "/src/assets/imgs/carte/perso/21.png",
  "/src/assets/imgs/carte/perso/43.png",
  "/src/assets/imgs/carte/perso/39.png",
  "/src/assets/imgs/carte/perso/40.png",
  "/src/assets/imgs/carte/perso/mandats/SDI.png",
  "/src/assets/imgs/carte/perso/mandats/FBI.png",
  "/src/assets/imgs/carte/perso/mandats/SIB.png",
]);

function loadUserData() {
  pp.value = user.value.profilePicture !== null ? user.value.profilePicture : 'src/assets/imgs/logoTCG.png' ;
  collection_images.value = [] ;
  for (let elem of user.value.collection) {
    console.log(elem.card.cardId);
    switch (elem.card._class) {
      case 'member':
        collection_images.value.push(`/src/assets/imgs/carte/perso/${elem.card.cardId}.png`);
        break;
      case 'pet':
        collection_images.value.push(`/src/assets/imgs/carte/pet/${elem.card.cardId}.png`);
        break;
      case 'arena':
        collection_images.value.push(`/src/assets/imgs/carte/arena/carre/${elem.card.cardId}.png`);
        break;
      default:
        break;
    }
  }
}
loadUserData() ;

const options = ref([
  { value: 'mandat', label: 'mandat', checkbox: 'chronologique', checkboxValue: false },
  { value: 'niveau', label: 'niveau', checkbox: 'croissant', checkboxValue: false },
  { value: 'pôle',   label: 'pôle', checkbox: null },
]);

const emit = defineEmits(['fermer', 'changementPP']);

async function changementPP() {
  const response = await fetch(`http://${config.hosts.api}/user`, {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ profilePicture: image_choisie.value }),
  });
  const data = await response.json();
  if (response.ok) {
    user.value.profilePicture = image_choisie.value ;
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
