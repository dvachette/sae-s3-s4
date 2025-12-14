<template>
  <div class="carte" :style="{ '--w': largeur }">
    <img src="@/assets/imgs/carte/perso/fonds/fond_comm.png" alt="carte" />
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
      <p class="faibForce">Faiblesse</p>
      <p class="faibForce">Force</p>
      <img
        src="@/assets/imgs/carte/perso/faiblessesForces/suivi.png"
        alt="faiblesse"
      />
      <img
        src="@/assets/imgs/carte/perso/faiblessesForces/locviseur.png"
        alt="force"
      />
      <p class="dateMandat">2024 2025</p>
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
import { ref } from 'vue';

const props = defineProps({
  data: Object,
  largeur: String
});

//chargement des images du dossier perso (**/* permet de charger tous les sous dossiers de perso)
const images = import.meta.glob('../assets/imgs/carte/perso/**/*.png', { eager: true })

//partie haute
const nom = props.data.name;
const pv = props.data.maxHitpoints;
const niv = props.data.level;

//partie attaques
const attaques = props.data.attacks;
  const effets = attaques[0].effects;
  const degats1 = ref();
  const degats2 = ref();  

  for(const effet of attaques[0].effects){
    console.log(effet.type);
    if(effet.type == 'damage'){
      degats1.value = effet.value;
    }
  }
  if(attaques.length == 2){
    for(const effet of attaques[1].effects){
      console.log(effet.type);
      if(effet.type == 'damage'){
        degats2.value = effet.value;
      }
    }
  }

//partie basse
const desc = props.data.description;
const mandat = props.data.mandat;
const imgMandat = images['../assets/imgs/carte/perso/mandats/'+props.data.mandat+'.png']?.default 
//prends l'url dans la liste des images chargées dont la clé est le chemin d'acces a cette image,
// ? permet de renvoyer undefined si l'img n'existe pas
// .default permet d'accéder à l'url utilisable par l'attribut src de <img/> 
const dateMandat = ref();
if(mandat == "SDI"){
  dateMandat.value = '2025 2026';
} else if (mandat == "FBI"){
  dateMandat.value = '2024 2025';
} else if (mandat == "MIB"){
  dateMandat.value = '2023 2024';
} else {
  dateMandat.value = '2022 2023'
}



</script>

<style scoped>
@import '../assets/css/carteMembre.css';
</style>
