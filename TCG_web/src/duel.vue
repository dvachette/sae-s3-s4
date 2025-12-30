<template>
  <VerifLogin @login-success="onLoginSuccess" />
  <main :style="{ '--jauge_energie': jauge_energie }">
    <img src="@/assets/imgs/combat_feyssine.png" alt="echange" />
    <pop_up_abandon
      v-if="afficher_abandon"
      id="abandon"
      @fermer="afficher_abandon = false"
    />
    <div class="cartes_combat">
      <div class="son_deck">
        <div class="familier">
          <p>Familier</p>
          <Carte_familier largeur="7vw" :data="combatState.opposant.familier"/>
        </div>
        <Carte_membre largeur="7vw" :data="combatState.opposant.main.carte1"/>
        <Vie_cartes :pv="combatState.opposant.main.carte1.hitPoints" :pvtotal="combatState.opposant.main.carte1.maxHitpoints" largeur="7vw" />
        
        <Carte_membre largeur="7vw" :data="combatState.opposant.main.carte2"/>
        <Vie_cartes :pv="combatState.opposant.main.carte2.hitPoints" :pvtotal="combatState.opposant.main.carte2.maxHitpoints" largeur="7vw" />
        
        <Carte_membre largeur="10vw" :data="combatState.opposant.main.carteActive"/>
        <Vie_cartes :pv="combatState.opposant.main.carteActive.hitPoints" :pvtotal="combatState.opposant.main.carteActive.maxHitpoints" largeur="7vw" />
        
        <Carte_membre largeur="7vw" :data="combatState.opposant.main.carte4"/>
        <Vie_cartes :pv="combatState.opposant.main.carte4.hitPoints" :pvtotal="combatState.opposant.main.carte4.maxHitpoints" largeur="7vw" />
        
        <Carte_membre largeur="7vw" :data="combatState.opposant.main.carte5"/>
        <Vie_cartes :pv="combatState.opposant.main.carte5.hitPoints" :pvtotal="combatState.opposant.main.carte5.maxHitpoints" largeur="7vw" />
        
      </div>
      <div class="mon_deck">
        <div class="familier">
          <p>Familier</p>
          <Carte_familier largeur="7vw" :data="combatState.moi.familier"/>
        </div>
        <Carte_membre largeur="7vw" :data="combatState.moi.main.carte1"/>
        <Vie_cartes :pv="combatState.moi.main.carte1.hitPoints" :pvtotal="combatState.moi.main.carte1.maxHitpoints" largeur="7vw" />
        
        <Carte_membre largeur="7vw" :data="combatState.moi.main.carte2"/>
        <Vie_cartes :pv="combatState.moi.main.carte2.hitPoints" :pvtotal="combatState.moi.main.carte2.maxHitpoints" largeur="7vw" />
        
        <Carte_membre largeur="10vw" :data="combatState.moi.main.carteActive"/>
        <Vie_cartes :pv="combatState.moi.main.carteActive.hitPoints" :pvtotal="combatState.moi.main.carteActive.maxHitpoints" largeur="7vw" />
        
        <Carte_membre largeur="7vw" :data="combatState.moi.main.carte4"/>
        <Vie_cartes :pv="combatState.moi.main.carte4.hitPoints" :pvtotal="combatState.moi.main.carte4.maxHitpoints" largeur="7vw" />
        
        <Carte_membre largeur="7vw" :data="combatState.moi.main.carte5"/>
        <Vie_cartes :pv="combatState.moi.main.carte5.hitPoints" :pvtotal="combatState.moi.main.carte5.maxHitpoints" largeur="7vw" />
        
        <button v-for="attack of combatState.moi.main.carteActive.attacks">
          {{attack.name }}
          <p>{{ attack.description }}</p>
        </button>
        <button @click="skipTurn">Passer</button>
        <button><img src="@/assets/imgs/echange.png" alt="echange" /></button>
      </div>
    </div>
    <div class="stats">
      <span>Score :</span>
      <span>1 - 0</span>
      <button @click="afficher_abandon = true">Abandonner</button>
      <div class="jauge_fond">
        <div class="jauge_énergie"></div>
        <span>{{ combatState.moi.energie }}</span>
      </div>
    </div>
  </main>
</template>

<script setup>
import { reactive, computed, ref, onMounted } from 'vue';
import Carte_membre from './Composants/carte_membre.vue';
import Carte_familier from './Composants/carte_familier.vue';
import verifLogin from './Composants/verifLogin.vue';
import Vie_cartes from './Composants/vie_cartes.vue';
import pop_up_abandon from './Composants/pop_up_abandon.vue';

import {
  EtatCombat, 
  EtatJoueur, 
  Main, 
  CarteMembre, 
  CarteFamilier, 
  Attaque
} from './types/duel';
import VerifLogin from './Composants/verifLogin.vue';
const energie = 7;
const pourcentageValue = computed(() => (energie * 100) / 10);
const jauge_energie = computed(() => pourcentageValue.value + '%');
let userData = ref(null);
let socket = ref(null);


const afficher_abandon = ref(false);
const combatState = reactive(new EtatCombat(
  1, // tour 
  true, // monTour
  new EtatJoueur(
    5, // Energie
    new CarteFamilier(
      "Béboule",
      1,
      "Il est trop mignon",
      "Offre un boost au mandat SDI",
      {"type":"boost", "target":"owner", "on":"damage", "value":"10", "filter":{"mandat":"SDI"}}
    ),
    new Main(
      new CarteMembre("Mzhdunosaurus", 80, 100, [new Attaque([{"type":"damage","target":"opponent","value":10}], 2, "VisionADE", "Il lance des emplois du temps sur son adversaire")], "Le parrain", "MIB", [13], [5, 11], [{name:"communication"}]),
      new CarteMembre("Mzhdunosaurus", 80, 100, [new Attaque([{"type":"damage","target":"opponent","value":10}], 2, "VisionADE", "Il lance des emplois du temps sur son adversaire")], "Le parrain", "MIB", [13], [5, 11], [{name:"communication"}]),
      new CarteMembre("Mzhdunosaurus", 80, 100, [new Attaque([{"type":"damage","target":"opponent","value":10}], 2, "VisionADE", "Il lance des emplois du temps sur son adversaire")], "Le parrain", "MIB", [13], [5, 11], [{name:"communication"}]),
      new CarteMembre("Mzhdunosaurus", 80, 100, [new Attaque([{"type":"damage","target":"opponent","value":10}], 2, "VisionADE", "Il lance des emplois du temps sur son adversaire")], "Le parrain", "MIB", [13], [5, 11], [{name:"communication"}]),
      new CarteMembre("Mzhdunosaurus", 80, 100, [new Attaque([{"type":"damage","target":"opponent","value":10}], 2, "VisionADE", "Il lance des emplois du temps sur son adversaire")], "Le parrain", "MIB", [13], [5, 11], [{name:"communication"}]),
    )
  ),
  new EtatJoueur(
    5, // Energie
    new CarteFamilier(
      "Béboule",
      1,
      "Il est trop mignon",
      "Offre un boost au mandat SDI",
      {"type":"boost", "target":"owner", "on":"damage", "value":"10", "filter":{"mandat":"SDI"}}
    ),
    new Main(
      new CarteMembre("Mzhdunosaurus", 80, 100, [new Attaque([{"type":"damage","target":"opponent","value":10}], 2, "VisionADE", "Il lance des emplois du temps sur son adversaire")], "Le parrain", "MIB", [13], [5, 11], [{name:"communication"}]),
      new CarteMembre("Mzhdunosaurus", 80, 100, [new Attaque([{"type":"damage","target":"opponent","value":10}], 2, "VisionADE", "Il lance des emplois du temps sur son adversaire")], "Le parrain", "MIB", [13], [5, 11], [{name:"communication"}]),
      new CarteMembre("Mzhdunosaurus", 80, 100, [new Attaque([{"type":"damage","target":"opponent","value":10}], 2, "VisionADE", "Il lance des emplois du temps sur son adversaire")], "Le parrain", "MIB", [13], [5, 11], [{name:"communication"}]),
      new CarteMembre("Mzhdunosaurus", 80, 100, [new Attaque([{"type":"damage","target":"opponent","value":10}], 2, "VisionADE", "Il lance des emplois du temps sur son adversaire")], "Le parrain", "MIB", [13], [5, 11], [{name:"communication"}]),
      new CarteMembre("Mzhdunosaurus", 80, 100, [new Attaque([{"type":"damage","target":"opponent","value":10}], 2, "VisionADE", "Il lance des emplois du temps sur son adversaire")], "Le parrain", "MIB", [13], [5, 11], [{name:"communication"}]),
    )
  )
));

function onLoginSuccess() {
  // Logique à exécuter après une connexion réussie
  console.log('Utilisateur connecté avec succès');
  userData.value = JSON.parse(sessionStorage.getItem('userData'));
  // Initialiser la socket
  socket.value = new WebSocket('ws://localhost:8080');
  socket.value.onopen = () => {
    socket.value.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log('Message reçu du serveur:', message);
      if (message.type === 'duel_start') {
        // Mettre à jour l'état du combat avec les nouvelles données reçues
        Object.assign(combatState, message.combatState);
        // Forcer la mise à jour de l'interface utilisateur si nécessaire
        
        console.log('État du combat mis à jour:', combatState);
      }
    };


    console.log('Connexion WebSocket établie');
    // Envoyer des données d'authentification si nécessaire
    socket.value.send(JSON.stringify({ type: 'authenticate', userId: userData.value.userId }));
  };
}

function skipTurn() {
  if (socket.value && socket.value.readyState === WebSocket.OPEN) {
    socket.value.send(JSON.stringify({ type: 'skip' }));
  }
}


function swapCards(index) {
  if (socket.value && socket.value.readyState === WebSocket.OPEN) {
    socket.value.send(JSON.stringify({ type: 'swap', index: index }));
  }
}

</script>

<style scoped>
@import './assets/css/duel.css';
</style>
