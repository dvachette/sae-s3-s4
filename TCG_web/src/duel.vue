<template>
  <VerifLogin @login-success="onLoginSuccess" />
  <main :style="{ '--jauge_energie': jauge_energie }">
    <div v-if="carteSurvolé" class="membre_pop_up">
      <!-- Composant dupliqué au centre -->
      <div class="membre_carte" v-if="echangeCarte === false">
        <Carte_membre largeur="25vw" :data="carteSurvolé" :isPreview="true">
          <img
            :src="`src/assets/imgs/effets/${effect.type}.png`"
            alt="status"
            class="imgicontype"
            v-for="effect of carteSurvolé.statusEffects"
          />
        </Carte_membre>
      </div>
    </div>
    <div v-if="familierSurvolé" class="familier_pop_up">
      <!-- Composant dupliqué au centre -->
      <div class="familier_carte">
        <Carte_familier
          largeur="25vw"
          :data="familierSurvolé"
          :isPreview="true"
        />
      </div>
    </div>
    <div class="page_chargement" v-if="adversaire == false">
      <div class="non_deck">
        <p>{{  errorMessage }}</p>
        <div class="vague">
          <h2
            v-if="!errorMessage"
            v-for="(lettre, index) in chargement"
            :key="index"
            :class="{ espaces: lettre === ' ' }"
            :style="{ animationDelay: `${index * 0.1}s` }"
          >
            {{ lettre === ' ' ? '\u00A0' : lettre }}
          </h2>
        </div>
        <router-link to="/combat"><button @click="closeSocket()">{{ btnCancelText }}</button></router-link>
      </div>
      <h3>Votre deck :</h3>
      <div class="chargement_deck">
        <Carte_membre
          largeur="10vw"
          :data="deckMembre[0]"
          v-if="afficher_carte == true"
        />
        <Carte_membre
          largeur="10vw"
          :data="deckMembre[1]"
          v-if="afficher_carte == true"
        />
        <Carte_membre
          largeur="10vw"
          :data="deckMembre[2]"
          v-if="afficher_carte == true"
        />
        <Carte_membre
          largeur="10vw"
          :data="deckMembre[3]"
          v-if="afficher_carte == true"
        />
        <Carte_membre
          largeur="10vw"
          :data="deckMembre[4]"
          v-if="afficher_carte == true"
        />
        <Carte_familier
          largeur="10vw"
          :data="deckFamilier"
          v-if="afficher_carte == true"
        />
      </div>
    </div>
    <div class="duel_principale" v-else>
      <img :src="backgroundImageSrc" alt="echange" @error="resetBackground()" />
      <pop_up_abandon
        v-if="afficher_abandon"
        id="abandon"
        @fermer="afficher_abandon = false"
      />
      <div class="cartes_combat">
        <div class="son_deck">
          <div class="ses_infos">
            <img
              :src="combatState.opposant.profilePicture"
              alt="pp_adverse"
            />
            <p>{{ combatState.opposant.playerName }}</p>
          </div>
          <div class="familier">
            <p>Familier</p>
            <Carte_familier
              class="carte_de_combat"
              largeur="7vw"
              :data="combatState.opposant.familier"
              @mouseenter="familierSurvolé = combatState.opposant.familier"
              @mouseleave="familierSurvolé = null"
            />
          </div>
          <Carte_membre
            class="carte_de_combat"
            largeur="7vw"
            :data="combatState.opposant.main.carte1"
            @mouseenter="carteSurvolé = combatState.opposant.main.carte1"
            @mouseleave="carteSurvolé = null"
          >
            <img
              :src="`src/assets/imgs/effets/${effect.type}.png`"
              alt="status"
              class="imgicontype"
              v-for="effect of combatState.opposant.main.carte1.statusEffects"
            />
          </Carte_membre>
          <Vie_cartes
            :pv="combatState.opposant.main.carte1.hitPoints"
            :pvtotal="combatState.opposant.main.carte1.maxHitpoints"
            largeur="7vw"
          />

          <Carte_membre
            class="carte_de_combat"
            largeur="7vw"
            :data="combatState.opposant.main.carte2"
            @mouseenter="carteSurvolé = combatState.opposant.main.carte2"
            @mouseleave="carteSurvolé = null"
          >
            <img
              :src="`src/assets/imgs/effets/${effect.type}.png`"
              alt="status"
              class="imgicontype"
              v-for="effect of combatState.opposant.main.carte2.statusEffects"
            />
          </Carte_membre>
          <Vie_cartes
            :pv="combatState.opposant.main.carte2.hitPoints"
            :pvtotal="combatState.opposant.main.carte2.maxHitpoints"
            largeur="7vw"
          />

          <Carte_membre
            class="carte_de_combat"
            largeur="10vw"
            :data="combatState.opposant.main.carteActive"
            @mouseenter="carteSurvolé = combatState.opposant.main.carteActive"
            @mouseleave="carteSurvolé = null"
          >
            <img
              :src="`src/assets/imgs/effets/${effect.type}.png`"
              alt="status"
              class="imgicontype"
              v-for="effect of combatState.opposant.main.carteActive
                .statusEffects"
            />
          </Carte_membre>
          <Vie_cartes
            :pv="combatState.opposant.main.carteActive.hitPoints"
            :pvtotal="combatState.opposant.main.carteActive.maxHitpoints"
            largeur="10vw"
          />

          <Carte_membre
            class="carte_de_combat"
            largeur="7vw"
            :data="combatState.opposant.main.carte4"
            @mouseenter="carteSurvolé = combatState.opposant.main.carte4"
            @mouseleave="carteSurvolé = null"
          >
            <img
              :src="`src/assets/imgs/effets/${effect.type}.png`"
              alt="status"
              class="imgicontype"
              v-for="effect of combatState.opposant.main.carte4.statusEffects"
            />
          </Carte_membre>
          <Vie_cartes
            :pv="combatState.opposant.main.carte4.hitPoints"
            :pvtotal="combatState.opposant.main.carte4.maxHitpoints"
            largeur="7vw"
          />

          <Carte_membre
            class="carte_de_combat"
            largeur="7vw"
            :data="combatState.opposant.main.carte5"
            @mouseenter="carteSurvolé = combatState.opposant.main.carte5"
            @mouseleave="carteSurvolé = null"
          >
            <img
              :src="`src/assets/imgs/effets/${effect.type}.png`"
              alt="status"
              class="imgicontype"
              v-for="effect of combatState.opposant.main.carte5.statusEffects"
            />
          </Carte_membre>
          <Vie_cartes
            :pv="combatState.opposant.main.carte5.hitPoints"
            :pvtotal="combatState.opposant.main.carte5.maxHitpoints"
            largeur="7vw"
          />
        </div>
        <div class="mon_deck">
          <div class="familier">
            <p>Familier</p>
            <Carte_familier
              class="carte_de_combat"
              largeur="7vw"
              :data="combatState.moi.familier"
              @mouseenter="familierSurvolé = combatState.moi.familier"
              @mouseleave="familierSurvolé = null"
            />
          </div>
          <Carte_membre
            class="carte_de_combat"
            largeur="7vw"
            :data="combatState.moi.main.carte1"
            @mouseenter="carteSurvolé = combatState.moi.main.carte1"
            @mouseleave="carteSurvolé = null"
            @click="swap_cartes(0)"
            :class="{ change_carte: echangeCarte }"
          >
            <img
              :src="`src/assets/imgs/effets/${effect.type}.png`"
              alt="status"
              class="imgicontype"
              v-for="effect of combatState.moi.main.carte1.statusEffects"
            />
          </Carte_membre>
          <Vie_cartes
            :pv="combatState.moi.main.carte1.hitPoints"
            :pvtotal="combatState.moi.main.carte1.maxHitpoints"
            largeur="7vw"
          />

          <Carte_membre
            class="carte_de_combat"
            largeur="7vw"
            :data="combatState.moi.main.carte2"
            @mouseenter="carteSurvolé = combatState.moi.main.carte2"
            @mouseleave="carteSurvolé = null"
            @click="swap_cartes(1)"
            :class="{ change_carte: echangeCarte }"
            ><img
              :src="`src/assets/imgs/effets/${effect.type}.png`"
              alt="status"
              class="imgicontype"
              v-for="effect of combatState.moi.main.carte2.statusEffects"
            />
          </Carte_membre>
          <Vie_cartes
            :pv="combatState.moi.main.carte2.hitPoints"
            :pvtotal="combatState.moi.main.carte2.maxHitpoints"
            largeur="7vw"
          />

          <Carte_membre
            class="carte_de_combat"
            largeur="10vw"
            :data="combatState.moi.main.carteActive"
            @mouseenter="carteSurvolé = combatState.moi.main.carteActive"
            @mouseleave="carteSurvolé = null"
            :class="{ change_carte: echangeCarte }"
            ><img
              :src="`src/assets/imgs/effets/${effect.type}.png`"
              alt="status"
              class="imgicontype"
              v-for="effect of combatState.moi.main.carteActive.statusEffects"
            />
          </Carte_membre>
          <Vie_cartes
            :pv="combatState.moi.main.carteActive.hitPoints"
            :pvtotal="combatState.moi.main.carteActive.maxHitpoints"
            largeur="10vw"
          />

          <Carte_membre
            class="carte_de_combat"
            largeur="7vw"
            :data="combatState.moi.main.carte4"
            @mouseenter="carteSurvolé = combatState.moi.main.carte4"
            @mouseleave="carteSurvolé = null"
            @click="swap_cartes(3)"
            :class="{ change_carte: echangeCarte }"
            ><img
              :src="`src/assets/imgs/effets/${effect.type}.png`"
              alt="status"
              class="imgicontype"
              v-for="effect of combatState.moi.main.carte4.statusEffects"
            />
          </Carte_membre>
          <Vie_cartes
            :pv="combatState.moi.main.carte4.hitPoints"
            :pvtotal="combatState.moi.main.carte4.maxHitpoints"
            largeur="7vw"
          />

          <Carte_membre
            class="carte_de_combat"
            largeur="7vw"
            :data="combatState.moi.main.carte5"
            @mouseenter="carteSurvolé = combatState.moi.main.carte5"
            @mouseleave="carteSurvolé = null"
            @click="swap_cartes(4)"
            :class="{ change_carte: echangeCarte }"
            ><img
              :src="`src/assets/imgs/effets/${effect.type}.png`"
              alt="status"
              class="imgicontype"
              v-for="effect of combatState.moi.main.carte5.statusEffects"
            />
          </Carte_membre>
          <Vie_cartes
            :pv="combatState.moi.main.carte5.hitPoints"
            :pvtotal="combatState.moi.main.carte5.maxHitpoints"
            largeur="7vw"
          />

          <div class="boutons_tour" v-if="combatState.monTour">
            <button
              v-if="echangeCarte === false"
              v-for="attack of combatState.moi.main.carteActive.attacks"
              class="attaques"
              @click="
                attackCarte(
                  combatState.moi.main.carteActive.attacks.indexOf(attack)
                )
              "
            >
              {{ attack.name }}
              <p>{{ attack.description }}</p>
            </button>
            <button
              id="changement_carte"
              @click="echangeCarte = true"
              v-if="echangeCarte == false"
            >
              <img src="@/assets/imgs/echange.png" alt="echange" />
            </button>
            <button id="annuler_echange" @click="echangeCarte = false" v-else>
              annuler échange
            </button>
          </div>
        </div>
      </div>
      <div class="stats">
        <div class="temps">
          <img src="@/assets/imgs/Sablier.png" alt="echange" />
          <p>30sec</p>
          <button @click="skipTurn" v-if="combatState.monTour">Passer</button>
        </div>
        <span>Score :</span>
        <span>1 - 0</span>
        <button @click="afficher_abandon = true">Abandonner</button>
        <div class="jauge_fond">
          <div class="jauge_énergie"></div>
          <span>{{ combatState.moi.energie }}</span>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { reactive, computed, ref } from 'vue';
import Carte_membre from './Composants/carte_membre.vue';
import Carte_familier from './Composants/carte_familier.vue';
import verifLogin from './Composants/verifLogin.vue';
import Vie_cartes from './Composants/vie_cartes.vue';
import pop_up_abandon from './Composants/pop_up_abandon.vue';
import config from '@/config.json';
import {
  EtatCombat,
  EtatJoueur,
  Main,
  CarteMembre,
  CarteFamilier,
  Attaque,
} from './types/duel';
import VerifLogin from './Composants/verifLogin.vue';
const pourcentageValue = computed(() => (combatState.moi.energie * 100) / 10);
const jauge_energie = computed(() => pourcentageValue.value + '%');
let userData = ref(null);
let socket = ref(null);
const adversaire = ref(false);
const chargement = `Recherche d'adversaire...`;
const letters = computed(() => chargement.split(''));
const carteSurvolé = ref(null);
const familierSurvolé = ref(null);
const echangeCarte = ref(false);
const afficher_abandon = ref(false);
const backgroundImageSrc = ref(
  'src/assets/imgs/combat_feyssine.png'
);
const errorMessage = ref('');
const btnCancelText = ref('Annuler le combat');


function resetBackground() {
  console.log('Erreur de chargement de l\'image de fond, réinitialisation à l\'image par défaut.');
  backgroundImageSrc.value = 'src/assets/imgs/combat_feyssine.png';
}

let deckMembre = ref(null);
let deckFamilier = ref(null);
let afficher_carte = ref(false);
const combatState = reactive(
  new EtatCombat(
    1, // tour
    true, // monTour
    new EtatJoueur(
      5, // Energie
      new CarteFamilier(
        'Béboule',
        1,
        'Il est trop mignon',
        'Offre un boost au mandat SDI',
        {
          type: 'boost',
          target: 'owner',
          on: 'damage',
          value: '10',
          filter: { mandat: 'SDI' },
        }
      ),
      new Main(
        new CarteMembre(
          'Mzhdunosaurus',
          80,
          100,
          [
            new Attaque(
              [{ type: 'damage', target: 'opponent', value: 10 }],
              2,
              'VisionADE',
              'Il lance des emplois du temps sur son adversaire'
            ),
          ],
          'Le parrain',
          'MIB',
          [13],
          [5, 11],
          [{ name: 'communication' }]
        ),
        new CarteMembre(
          'Mzhdunosaurus',
          80,
          100,
          [
            new Attaque(
              [{ type: 'damage', target: 'opponent', value: 10 }],
              2,
              'VisionADE',
              'Il lance des emplois du temps sur son adversaire'
            ),
          ],
          'Le parrain',
          'MIB',
          [13],
          [5, 11],
          [{ name: 'communication' }]
        ),
        new CarteMembre(
          'Mzhdunosaurus',
          80,
          100,
          [
            new Attaque(
              [{ type: 'damage', target: 'opponent', value: 10 }],
              2,
              'VisionADE',
              'Il lance des emplois du temps sur son adversaire'
            ),
          ],
          'Le parrain',
          'MIB',
          [13],
          [5, 11],
          [{ name: 'communication' }]
        ),
        new CarteMembre(
          'Mzhdunosaurus',
          80,
          100,
          [
            new Attaque(
              [{ type: 'damage', target: 'opponent', value: 10 }],
              2,
              'VisionADE',
              'Il lance des emplois du temps sur son adversaire'
            ),
          ],
          'Le parrain',
          'MIB',
          [13],
          [5, 11],
          [{ name: 'communication' }]
        ),
        new CarteMembre(
          'Mzhdunosaurus',
          80,
          100,
          [
            new Attaque(
              [{ type: 'damage', target: 'opponent', value: 10 }],
              2,
              'VisionADE',
              'Il lance des emplois du temps sur son adversaire'
            ),
          ],
          'Le parrain',
          'MIB',
          [13],
          [5, 11],
          [{ name: 'communication' }]
        )
      )
    ),
    new EtatJoueur(
      5, // Energie
      new CarteFamilier(
        'Béboule',
        1,
        'Il est trop mignon',
        'Offre un boost au mandat SDI',
        {
          type: 'boost',
          target: 'owner',
          on: 'damage',
          value: '10',
          filter: { mandat: 'SDI' },
        }
      ),
      new Main(
        new CarteMembre(
          'Mzhdunosaurus',
          80,
          100,
          [
            new Attaque(
              [{ type: 'damage', target: 'opponent', value: 10 }],
              2,
              'VisionADE',
              'Il lance des emplois du temps sur son adversaire'
            ),
          ],
          'Le parrain',
          'MIB',
          [13],
          [5, 11],
          [{ name: 'communication' }]
        ),
        new CarteMembre(
          'Mzhdunosaurus',
          80,
          100,
          [
            new Attaque(
              [{ type: 'damage', target: 'opponent', value: 10 }],
              2,
              'VisionADE',
              'Il lance des emplois du temps sur son adversaire'
            ),
          ],
          'Le parrain',
          'MIB',
          [13],
          [5, 11],
          [{ name: 'communication' }]
        ),
        new CarteMembre(
          'Mzhdunosaurus',
          80,
          100,
          [
            new Attaque(
              [{ type: 'damage', target: 'opponent', value: 10 }],
              2,
              'VisionADE',
              'Il lance des emplois du temps sur son adversaire'
            ),
          ],
          'Le parrain',
          'MIB',
          [13],
          [5, 11],
          [{ name: 'communication' }]
        ),
        new CarteMembre(
          'Mzhdunosaurus',
          80,
          100,
          [
            new Attaque(
              [{ type: 'damage', target: 'opponent', value: 10 }],
              2,
              'VisionADE',
              'Il lance des emplois du temps sur son adversaire'
            ),
          ],
          'Le parrain',
          'MIB',
          [13],
          [5, 11],
          [{ name: 'communication' }]
        ),
        new CarteMembre(
          'Mzhdunosaurus',
          80,
          100,
          [
            new Attaque(
              [{ type: 'damage', target: 'opponent', value: 10 }],
              2,
              'VisionADE',
              'Il lance des emplois du temps sur son adversaire'
            ),
          ],
          'Le parrain',
          'MIB',
          [13],
          [5, 11],
          [{ name: 'communication' }]
        )
      )
    )
  )
);

function onLoginSuccess() {
  // Logique à exécuter après une connexion réussie
  console.log('Utilisateur connecté avec succès');
  userData.value = JSON.parse(sessionStorage.getItem('userData'));
  deckMembre = userData.value.deck.cards;
  deckFamilier = userData.value.deck.pet;
  console.log(deckMembre);
  afficher_carte.value = true;
  // Initialiser la socket
  socket.value = new WebSocket(`ws://${config.hosts.socket}`);
  socket.value.onopen = () => {
    socket.value.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log('Message reçu du serveur:', message);
      if (message.type === 'duel_start' || message.type === 'duel_update') {
        // Mettre à jour l'état du combat avec les nouvelles données reçues
        combatState.moi = message.combatState.moi;
        combatState.opposant = message.combatState.opposant;
        combatState.tour = message.combatState.tour;
        combatState.monTour = message.combatState.monTour;
        if (message.type === 'duel_start') {
          adversaire.value = true;
          backgroundImageSrc.value =
            `src/assets/imgs/carte/arena/fond/${message.combatState.moi.terrain.cardId}.png`;
        }

        console.log('État du combat mis à jour:', combatState);
      } else if (message.type === 'already_connected') {
        errorMessage.value = 'Vous êtes déjà connecté dans un autre duel.';
        btnCancelText.value = 'Quitter';
      } else if (message.type === 'invalid_deck') {
        errorMessage.value = 'Votre deck est invalide. Veuillez le vérifier.';
        btnCancelText.value = 'Quitter';
      } else if (message.type === 'authentication_failed') {
        errorMessage.value = 'Échec de l\'authentification. Veuillez vous reconnecter.';
        btnCancelText.value = 'Quitter';
      } else if (message.type === 'duel_end') {
        // Gérer la fin du duel
        console.log('Duel terminé:', message.reason);
        // Rediriger vers une autre page ou afficher les résultats
      } 
    };

    console.log('Connexion WebSocket établie');
    // Envoyer des données d'authentification si nécessaire
    socket.value.send(
      JSON.stringify({ type: 'authenticate', userId: userData.value.userId })
    );
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

function attackCarte(index) {
  if (socket.value && socket.value.readyState === WebSocket.OPEN) {
    socket.value.send(JSON.stringify({ type: 'attack', attackIndex: index }));
  }
}

function swap_cartes(index) {
  if (echangeCarte.value === true) {
    console.log(index);
    if (socket.value && socket.value.readyState === WebSocket.OPEN) {
      socket.value.send(JSON.stringify({ type: 'swap', index: index }));
      echangeCarte.value = false;
    }
  }
}

function closeSocket() {
  if (socket.value) {
    socket.value.close();
    console.log('Socket fermée');
  }
}
</script>

<style scoped>
@import './assets/css/duel.css';
</style>
