<template>
  <div class="comp-echange">
    <p>échange de : {{ sonEchange }}</p>
    <div class="autres_echange">
      <div class="reception" v-if="carteDemandee">
        <p>Carte donnée</p>
        <Carte_membre
          v-if="carteDemandee._class == 'member'"
          :data="carteDemandee"
          largeur="4.9vw"
        />

        <Carte_familier
          v-else-if="carteDemandee._class == 'pet'"
          :data="carteDemandee"
          largeur="4.9vw"
        />

        <Carte_terrain
          v-else-if="carteDemandee._class == 'arena'"
          :data="carteDemandee"
          largeur="4.9vw"
        />
      </div>
      <div class="a_don">
        <p>Choisir une carte</p>
        <div class="los_cartos">
          <div class="carte1" v-if="carteaDonnee1">
            <Carte_membre
              v-if="carteaDonnee1._class == 'member'"
              :data="carteaDonnee1"
              largeur="4.9vw"
              class="carte_echange"
              @click="carte_selectionee = carteaDonnee1.cardId"
              :class="{ active: carte_selectionee === carteaDonnee1.cardId }"
            />

            <Carte_familier
              v-else-if="carteaDonnee1._class == 'pet'"
              :data="carteaDonnee1"
              largeur="4.9vw"
              class="carte_echange"
              @click="carte_selectionee = carteaDonnee1.cardId"
              :class="{ active: carte_selectionee === carteaDonnee1.cardId }"
            />

            <Carte_terrain
              v-else-if="carteaDonnee1._class == 'arena'"
              :data="carteaDonnee1"
              largeur="4.9vw"
              class="carte_echange"
              @click="carte_selectionee = carteaDonnee1.cardId"
              :class="{ active: carte_selectionee === carteaDonnee1.cardId }"
            />
          </div>
          <div class="carte2" v-if="carteaDonnee2">
            <Carte_membre
              v-if="carteaDonnee2._class == 'member'"
              :data="carteaDonnee2"
              largeur="4.9vw"
              class="carte_echange"
              @click="carte_selectionee = carteaDonnee2.cardId"
              :class="{ active: carte_selectionee === carteaDonnee2.cardId }"
            />

            <Carte_familier
              v-else-if="carteaDonnee2._class == 'pet'"
              :data="carteaDonnee2"
              largeur="4.9vw"
              class="carte_echange"
              @click="carte_selectionee = carteaDonnee2.cardId"
              :class="{ active: carte_selectionee === carteaDonnee2.cardId }"
            />

            <Carte_terrain
              v-else-if="carteaDonnee2._class == 'arena'"
              :data="carteaDonnee2"
              largeur="4.9vw"
              class="carte_echange"
              @click="carte_selectionee = carteaDonnee2.cardId"
              :class="{ active: carte_selectionee === carteaDonnee2.cardId }"
            />
          </div>
          <div class="carte3" v-if="carteaDonnee3">
            <Carte_membre
              v-if="carteaDonnee3._class == 'member'"
              :data="carteaDonnee3"
              largeur="4.9vw"
              class="carte_echange"
              @click="carte_selectionee = carteaDonnee3.cardId"
              :class="{ active: carte_selectionee === carteaDonnee3.cardId }"
            />

            <Carte_familier
              v-else-if="carteaDonnee3._class == 'pet'"
              :data="carteaDonnee3"
              largeur="4.9vw"
              class="carte_echange"
              @click="carte_selectionee = carteaDonnee3.cardId"
              :class="{ active: carte_selectionee === carteaDonnee3.cardId }"
            />

            <Carte_terrain
              v-else-if="carteaDonnee3._class == 'arena'"
              :data="carteaDonnee3"
              largeur="4.9vw"
              class="carte_echange"
              @click="carte_selectionee = carteaDonnee3.cardId"
              :class="{ active: carte_selectionee === carteaDonnee3.cardId }"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="les_boutons">
      <button
        id="b_confirmer"
        @click="requeteAccepterEchange"
        v-if="carte_selectionee != null"
      >
        confirmer échange
      </button>
      <button id="n_confirmer" v-else>confirmer échange</button>
      <button id="b_annuler" @click="$emit('fermer')">annuler échange</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Carte_membre from '@/Composants/carte_membre.vue';
import Carte_familier from '@/Composants/carte_familier.vue';
import Carte_terrain from '@/Composants/carte_terrain.vue';
import config from '@/config.json';

const props = defineProps({
  echange_id: Number,
});

const emit = defineEmits(['fermer']);
let sonEchange = ref(null);
const touteCartes = ref(null);
const carte_selectionee = ref(null);
obtenirEchanges();
obtenirCartes();

let carteDemandee = ref(null);
let carteaDonnee1 = ref(null);
let carteaDonnee2 = ref(null);
let carteaDonnee3 = ref(null);

async function obtenirEchanges() {
  try {
    const response = await fetch(`http://${config.hosts.api}/trade/requests`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(),
    });
    const data = await response.json();
    if (response.ok) {
      sonEchange.value = data.trades.find(
        (item) => item.tradeRequestId === props.echange_id,
      );
    } else {
      console.error(data);
    }
  } catch (erreur) {
    console.error(erreur);
  }
}

async function obtenirCartes() {
  try {
    const response = await fetch(`http://${config.hosts.api}/trade/cards`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(),
    });
    const data = await response.json();
    if (response.ok) {
      touteCartes.value = data.cartes;
      carteDemandee.value = touteCartes.value.find(
        (item) => item.cardId === sonEchange.value.askedCardId,
      );
      carteaDonnee1.value = touteCartes.value.find(
        (item) => item.cardId === sonEchange.value.offeredCard1Id,
      );
      carteaDonnee2.value = touteCartes.value.find(
        (item) => item.cardId === sonEchange.value.offeredCard2Id,
      );
      carteaDonnee3.value = touteCartes.value.find(
        (item) => item.cardId === sonEchange.value.offeredCard3Id,
      );
    } else {
      console.log('erreur');
    }
  } catch (erreur) {
    console.error(erreur);
  }
}

async function requeteAccepterEchange() {
  try {
    const response = await fetch(`http://${config.hosts.api}/trade/accept`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tradeRequestId: props.echange_id,
        acceptedCardId: carte_selectionee.value,
      }),
    });
    const data = await response.json();
    if (response.ok) {
      console.log('Echange terminé');
      emit('fermer');
    } else {
      console.error(data);
    }
  } catch (erreur) {
    console.error(erreur);
  }
}
</script>

<style scoped>
@import '@/assets/css/accepter_echange.css';
</style>
