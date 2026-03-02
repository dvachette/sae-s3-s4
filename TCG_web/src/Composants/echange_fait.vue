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
        <p>Cartes reçue</p>
        <div class="los_cartos">
          <div class="carte1" v-if="carteDonnee">
            <Carte_membre
              v-if="carteDonnee._class == 'member'"
              :data="carteDonnee"
              largeur="4.9vw"
              class="carte_echange"
            />

            <Carte_familier
              v-else-if="carteDonnee._class == 'pet'"
              :data="carteDonnee"
              largeur="4.9vw"
              class="carte_echange"
            />

            <Carte_terrain
              v-else-if="carteDonnee._class == 'arena'"
              :data="carteDonnee"
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
let carteDonnee = ref(null);
</script>

<style scoped>
@import '@/assets/css/echange.css';
</style>
