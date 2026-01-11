<template>
  <div class="carte" :style="{ '--w': largeur }">
    <img :src="imgFond" alt="carte" />
    <img src="@/assets/imgs/carte/perso/Maël.png" alt="imgCarte" />
    <div id="haut_carte">
      <p id="nom">{{nom}}</p>
      <div class="PV">
        <p id="PV">{{pv}}</p>
        <p id="lblPV">PV</p>
      </div>
      <div class="niv">
        <p id="lblNiv">niveau</p>
        <p id="niv">{{niv}}</p>
      </div>
    </div>
    <div class="effetsCarteMembre"><slot></slot></div> <!-- Sert à rajouter les images d'effets de status dans Duel -->
      
    <div class="attaques">
      <p class="cout">{{ attaques[0].cost }}</p>
      <p class="nom_attaque">{{ attaques[0].name }}</p>
      <p class="degats">{{degats1}}</p>
      <p v-if="degats1 != undefined" class="lblDegats">dégâts</p>
      <p v-if="degats1 == undefined" class="lblDegats"></p>
      <p class="desc_attaque">
        {{ attaques[0].description }}
      </p>

      <p v-if="attaques.length == 2" class="cout">{{ attaques[1].cost }}</p>
      <p v-if="attaques.length == 2" class="nom_attaque">{{ attaques[1].name }}</p>
      <p v-if="attaques.length == 2" class="degats">{{degats2}}</p>
      <p v-if="degats2 != undefined" class="lblDegats">dégâts</p>
      <p v-if="degats2 == undefined" class="lblDegats"></p>
      <p v-if="attaques.length == 2" class="desc_attaque">
         {{ attaques[1].description }}
      </p>
    </div>

    <div class="bas_carte">
      <p class="faibForce">Force</p>
      <p class="faibForce">Faiblesse</p>
      <img
        :src="imgForce"
        alt="faiblesse"
      />
      <img
        :src="imgFaiblesse"
        alt="force"
      />
      <p class="dateMandat">{{dateMandat}}</p>
      <img
        :src="imgMandat"
        alt="mandat"
        id="imgMandat"
      />
      <p class="descCarte">
        {{desc}}
      </p>
    </div>
  </div>
</template>
<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  data: Object,
  largeur: String,
});

// chargement des images
const images = import.meta.glob('../assets/imgs/carte/perso/**/*.png', { eager: true });

// ===== partie haute =====
const nom = computed(() => props.data.name);
const pv = computed(() => props.data.hitPoints);
const niv = computed(() => props.data.level);

// ===== attaques =====
const attaques = computed(() => props.data.attacks);

const degats1 = computed(() => {
  const effet = attaques.value[0]?.effects.find(e => e.type === 'damage');
  return effet?.value;
});

const degats2 = computed(() => {
  if (attaques.value.length !== 2) return undefined;
  const effet = attaques.value[1]?.effects.find(e => e.type === 'damage');
  return effet?.value;
});

// ===== mandat =====
const desc = computed(() => props.data.description);
const mandat = computed(() => props.data.mandat);

const imgMandat = computed(() =>
  images[`../assets/imgs/carte/perso/mandats/${mandat.value}.png`]?.default
);

const dateMandat = computed(() => {
  if (mandat.value === 'SDI') return '2025 2026';
  if (mandat.value === 'FBI') return '2024 2025';
  if (mandat.value === 'MIB') return '2023 2024';
  return '2022 2023';
});

// ===== force / faiblesse =====
const poles = {
  0:"presidence", 1:"commRezo", 2:"tresorerie", 3:"secretariat",
  4:"projet", 5:"locviseur", 6:"ma", 7:"mi", 
  8:"culvention", 9:"bobopioux", 10:"bobopioux", 11:"locviseur",
  12:"culvention", 13:"suivi"
};
const force = computed(() => poles[props.data.force[0]]);
const faiblesse = computed(() => poles[props.data.faiblesse[0]]);

const imgForce = computed(() =>
  images[`../assets/imgs/carte/perso/faiblessesForces/${force.value}.png`]?.default
);

const imgFaiblesse = computed(() =>
  images[`../assets/imgs/carte/perso/faiblessesForces/${faiblesse.value}.png`]?.default
);

// ===== fond =====
const imgFond = computed(() => {
  const types = props.data.type;

  if (types.length === 1) {
    return images[`../assets/imgs/carte/perso/fonds/fond_${types[0].name}.png`]?.default;
  }

  let txtTypes = '';
  for (let i = 0; i < types.length; i++) {
    txtTypes += types[i].name.slice(0, 4);
  }

  return images[`../assets/imgs/carte/perso/fonds/fond_${txtTypes}.png`]?.default;
});
</script>

<style scoped>
@import '../assets/css/carteMembre.css';
</style>
