<template>
  <main>
    <img :src="background" alt="echange" @error="background.value = '/src/assets/imgs/combat_feyssine.png'"/>
    <div class="mes_cartes">
      <div
        class="carteMembreDeck"
        v-for="(carte, index) in deckMembre"
        :key="index"
      >
        <img
          v-if="!carte"
          src="@/assets/imgs/carte/carte_ajout.png"
          alt="Carte_à_Ajouter"
        />

        <Carte_membre v-else :data="carte" largeur="140px" />
      </div>
      <Carte_familier
        v-if="deckFamilier"
        :data="deckFamilier"
        largeur="140px"
      />
      <img
        v-else
        src="@/assets/imgs/carte/carte_ajout.png"
        alt="Carte_à_Ajouter"
        id="familier"
      />
    </div>
    <div class="resultat">
      <div class="victoire" v-if="victoire">
        <p>VICTOIRE</p>
      </div>
      <div class="défaite" v-else>
        <p>DÉFAITE</p>
      </div>
      <p class="reasonDuelResult">{{ reason }}</p>
      <div class="score">
        <p>{{ mon_score }} - {{ son_score }}</p>
      </div>
      <div class="infos">
        <div class="personnes">
          <div class="mes_infos">
            <img :src="myPP" alt="Logo du site" />
            <p>{{ myName }}</p>
          </div>
          <div class="autres_infos">
            <img :src="hisPP" alt="photo de profil" />
            <p>{{ hisName }}</p>
          </div>
        </div>
        <button id="ajout_ami">+</button>
      </div>
      <div class="récompenses" v-if="victoire">
        <p>Récompenses :</p>
        <div class="nb_clefs">
          <img src="@/assets/imgs/cles.png" alt="booster" />
          <p>x12</p>
        </div>
      </div>
      <div class="vide" v-else></div>
      <router-link to="/Combat"
        ><button id="continuer">continuer</button></router-link
      >
    </div>
    <div class="autres_cartes">
      <div
        class="carteMembreDeck"
        v-for="(carte, index) in opposantMembres"
        :key="index"
      >
        <img
          v-if="!carte"
          src="@/assets/imgs/carte/carte_ajout.png"
          alt="Carte_à_Ajouter"
        />

        <Carte_membre v-else :data="carte" largeur="140px" />
      </div>
      <Carte_familier
        v-if="opposantFamilier"
        :data="opposantFamilier"
        largeur="140px"
      />
      <img
        v-else
        src="@/assets/imgs/carte/carte_ajout.png"
        alt="Carte_à_Ajouter"
        id="familier"
      />
    </div>
  </main>
</template>

<script setup>
import { ref, computed } from 'vue';
import Carte_membre from './Composants/carte_membre.vue';
import Carte_familier from './Composants/carte_familier.vue';
const victoire = ref(false);
const mon_score = ref(5);
const son_score = ref(2);
const myName = ref('');
const hisName = ref('');
const hisPP = ref('');
const myPP = ref('');
const reason = ref('');
const userData = ref(JSON.parse(sessionStorage.getItem('userData')));
const duelResult = ref(JSON.parse(sessionStorage.getItem('duelResult')));
const deckMembre = userData.value.deck.cards;
const deckFamilier = userData.value.deck.pet;
const combatState = duelResult.value.combatState;
const background = combatState.moi.terrain ? `/src/assets/imgs/carte/arena/fond/${combatState.moi.terrain.cardId}.png` : '/src/assets/imgs/combat_feyssine.png'; 
victoire.value = duelResult.value.victoire;
hisName.value = combatState.opposant.playerName;
hisPP.value = combatState.opposant.profilePicture;
myName.value = userData.value.username;
myPP.value = userData.value.profilePicture;
mon_score.value = duelResult.value.mon_score;
son_score.value = duelResult.value.son_score;
switch (duelResult.value.reason) {
  case 'victory':
    reason.value = "Vous avez vaincu votre adversaire !";
    break;
  case 'defeat':
    reason.value = "Vous avez été vaincu par votre adversaire.";
    break;
  case 'opponent_disconnected':
    reason.value = "Votre adversaire à quitté la partie.";
    break;
  case 'forfeit':
    reason.value = "Vous avez abandonné la partie.";
    break;
  case 'opponent_forfeit':
    reason.value = "Votre adversaire a abandonné la partie.";
    break;
  default:
    reason.value = "";
}
const opposantMembres = computed(() => {
  return [combatState.opposant.main.carte1,
    combatState.opposant.main.carte2,
    combatState.opposant.main.carteActive,
    combatState.opposant.main.carte4,
    combatState.opposant.main.carte5
  ];
});

const opposantFamilier = computed(() => {
  return combatState.opposant.familier;
});

const mesMembres = computed(() => {
  return [combatState.moi.main.carte1,
    combatState.moi.main.carte2,
    combatState.moi.main.carteActive,
    combatState.moi.main.carte4,
    combatState.moi.main.carte5
  ];
});
const familiers = computed(() => {
  //computed : prend une fonction en parametre : elle est recalculée dès que collection change
  return combatState.moi.familier;
});

</script>

<style scoped>
@import './assets/css/duel_resultat.css';
</style>
