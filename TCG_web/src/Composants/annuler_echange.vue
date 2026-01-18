<template>
  <div class="mon_echange">
    <div class="echange">
      <div class="demande" v-if="carteDemandee">
        <p>Carte demandée</p>
        <Carte_membre
          v-if="carteDemandee._class == 'member'"
          :data="carteDemandee"
          largeur="7vw"
        />

        <Carte_familier
          v-else-if="carteDemandee._class == 'pet'"
          :data="carteDemandee"
          largeur="7vw"
        />

        <Carte_terrain
          v-else-if="carteDemandee._class == 'arena'"
          :data="carteDemandee"
          largeur="7vw"
        />
      </div>
      <div class="don">
        <p>Cartes à donner</p>
        <div class="les_cartes">
          <div class="carte1" v-if="carteaDonnee1">
            <Carte_membre
              v-if="carteaDonnee1._class == 'member'"
              :data="carteaDonnee1"
              largeur="7vw"
              class="carte_echange"
            />

            <Carte_familier
              v-else-if="carteaDonnee1._class == 'pet'"
              :data="carteaDonnee1"
              largeur="7vw"
              class="carte_echange"
            />

            <Carte_terrain
              v-else-if="carteaDonnee1._class == 'arena'"
              :data="carteaDonnee1"
              largeur="7vw"
              class="carte_echange"
            />
          </div>
          <div class="carte2" v-if="carteaDonnee2">
            <Carte_membre
              v-if="carteaDonnee2._class == 'member'"
              :data="carteaDonnee2"
              largeur="7vw"
              class="carte_echange"
            />

            <Carte_familier
              v-else-if="carteaDonnee2._class == 'pet'"
              :data="carteaDonnee2"
              largeur="7vw"
              class="carte_echange"
            />

            <Carte_terrain
              v-else-if="carteaDonnee2._class == 'arena'"
              :data="carteaDonnee2"
              largeur="7vw"
              class="carte_echange"
            />
          </div>
          <div class="carte3" v-if="carteaDonnee3">
            <Carte_membre
              v-if="carteaDonnee3._class == 'member'"
              :data="carteaDonnee3"
              largeur="7vw"
              class="carte_echange"
            />

            <Carte_familier
              v-else-if="carteaDonnee3._class == 'pet'"
              :data="carteaDonnee3"
              largeur="7vw"
              class="carte_echange"
            />

            <Carte_terrain
              v-else-if="carteaDonnee3._class == 'arena'"
              :data="carteaDonnee3"
              largeur="7vw"
              class="carte_echange"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="les_boutons">
      <button id="confirmer" @click="requestSupprimerEchange">
        supprimer échange
      </button>
      <button id="annuler" @click="$emit('fermer')">retour</button>
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
const monEchange = ref(null);
const touteCartes = ref(null);
obtenirMesEchanges();
obtenirCartes();

let carteDemandee = ref(null);
let carteaDonnee1 = ref(null);
let carteaDonnee2 = ref(null);
let carteaDonnee3 = ref(null);

async function obtenirMesEchanges() {
  try {
    const response = await fetch(
      `http://${config.hosts.api}/trade/requests/me`,
      {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(),
      },
    );
    const data = await response.json();
    if (response.ok) {
      monEchange.value = data.trades.find(
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
        (item) => item.cardId === monEchange.value.askedCardId,
      );
      carteaDonnee1.value = touteCartes.value.find(
        (item) => item.cardId === monEchange.value.offeredCard1Id,
      );
      carteaDonnee2.value = touteCartes.value.find(
        (item) => item.cardId === monEchange.value.offeredCard2Id,
      );
      carteaDonnee3.value = touteCartes.value.find(
        (item) => item.cardId === monEchange.value.offeredCard3Id,
      );
    } else {
      console.log('erreur');
    }
  } catch (erreur) {
    console.error(erreur);
  }
}

async function requestSupprimerEchange() {
  try {
    const response = await fetch(`http://${config.hosts.api}/trade/request`, {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ tradeRequestId: props.echange_id }),
    });
    const data = await response.json();
    if (response.ok) {
      console.log('échange supprimé');
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
@import '@/assets/css/annuler_echange.css';
</style>
