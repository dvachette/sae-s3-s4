<template>
  <div class="comp-echange">
    <p v-if="sonEchange">échange de : {{ sonEchange.senderUsername }}</p>
    <div class="autres_echange">
      <div class="reception" v-if="carteDemandee">
        <p>Carte demandée</p>
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
        <p>Cartes à recevoir</p>
        <div class="los_cartos">
          <div class="carte1" v-if="carteaDonnee1">
            <Carte_membre
              v-if="carteaDonnee1._class == 'member'"
              :data="carteaDonnee1"
              largeur="4.9vw"
              class="carte_echange"
            />

            <Carte_familier
              v-else-if="carteaDonnee1._class == 'pet'"
              :data="carteaDonnee1"
              largeur="4.9vw"
              class="carte_echange"
            />

            <Carte_terrain
              v-else-if="carteaDonnee1._class == 'arena'"
              :data="carteaDonnee1"
              largeur="4.9vw"
              class="carte_echange"
            />
          </div>
          <div class="carte2" v-if="carteaDonnee2">
            <Carte_membre
              v-if="carteaDonnee2._class == 'member'"
              :data="carteaDonnee2"
              largeur="4.9vw"
              class="carte_echange"
            />

            <Carte_familier
              v-else-if="carteaDonnee2._class == 'pet'"
              :data="carteaDonnee2"
              largeur="4.9vw"
              class="carte_echange"
            />

            <Carte_terrain
              v-else-if="carteaDonnee2._class == 'arena'"
              :data="carteaDonnee2"
              largeur="4.9vw"
              class="carte_echange"
            />
          </div>
          <div class="carte3" v-if="carteaDonnee3">
            <Carte_membre
              v-if="carteaDonnee3._class == 'member'"
              :data="carteaDonnee3"
              largeur="4.9vw"
              class="carte_echange"
            />

            <Carte_familier
              v-else-if="carteaDonnee3._class == 'pet'"
              :data="carteaDonnee3"
              largeur="4.9vw"
              class="carte_echange"
            />

            <Carte_terrain
              v-else-if="carteaDonnee3._class == 'arena'"
              :data="carteaDonnee3"
              largeur="4.9vw"
              class="carte_echange"
            />
          </div>
        </div>
      </div>
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

let sonEchange = ref(null);
const touteCartes = ref(null);
obtenirEchanges();
obtenirCartes();

let carteDemandee = ref(null);
let carteaDonnee1 = ref(null);
let carteaDonnee2 = ref(null);
let carteaDonnee3 = ref(null);

async function obtenirEchanges() {
  try {
    const response = await fetch(`${config.hosts.api}/trade/requests`, {
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
    const response = await fetch(`${config.hosts.api}/trade/cards`, {
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
</script>

<style scoped>
  @import '@/assets/css/echange.css';
</style>
