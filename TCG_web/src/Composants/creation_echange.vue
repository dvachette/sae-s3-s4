<template>
  <verifLogin />
  <MonHeader />
  <div class="creation">
    <div class="recap_fixe">
      <router-link to="/social"
        ><button id="annuler_echange">annuler échange</button></router-link
      >
      <div class="mon_echange">
        <div class="demande">
          <p>Carte demandée</p>
          <img
            v-if="!carteDemandee"
            src="@/assets/imgs/carte/carte_ajout.png"
            alt="Carte_à_Ajouter"
            @click="ajout_carte(0)"
            @dragover.prevent
            @drop="ajout_carte(0)"
          />

          <Carte_membre
            v-else-if="carteDemandee?._class == 'member'"
            :data="carteDemandee"
            largeur="7.5vw"
            @click="ajout_carte(0)"
            @dragover.prevent
            @drop="ajout_carte(0)"
          />

          <Carte_familier
            v-else-if="carteDemandee?._class == 'pet'"
            :data="carteDemandee"
            largeur="7.5vw"
            @click="ajout_carte(0)"
            @dragover.prevent
            @drop="ajout_carte(0)"
          />

          <Carte_terrain
            v-else-if="carteDemandee?._class == 'arena'"
            :data="carteDemandee"
            largeur="7.5vw"
            @click="ajout_carte(0)"
            @dragover.prevent
            @drop="ajout_carte(0)"
          />
        </div>
        <div class="don">
          <p>Cartes à donner</p>
          <div class="les_cartes_don">
            <img
              v-if="!carteaDonnee1"
              src="@/assets/imgs/carte/carte_ajout.png"
              alt="Carte_à_Ajouter"
              @click="ajout_carte(1)"
              @dragover.prevent
              @drop="ajout_carte(1)"
            />

            <Carte_membre
              v-else-if="carteaDonnee1?._class == 'member'"
              :data="carteaDonnee1"
              largeur="7.5vw"
              @click="ajout_carte(1)"
              @dragover.prevent
              @drop="ajout_carte(1)"
            />

            <Carte_familier
              v-else-if="carteaDonnee1?._class == 'pet'"
              :data="carteaDonnee1"
              largeur="7.5vw"
              @click="ajout_carte(1)"
              @dragover.prevent
              @drop="ajout_carte(1)"
            />

            <Carte_terrain
              v-else-if="carteaDonnee1?._class == 'arena'"
              :data="carteaDonnee1"
              largeur="7.5vw"
              @click="ajout_carte(1)"
              @dragover.prevent
              @drop="ajout_carte(1)"
            />
            <img
              v-if="!carteaDonnee2"
              src="@/assets/imgs/carte/carte_ajout.png"
              alt="Carte_à_Ajouter"
              @click="ajout_carte(2)"
              @dragover.prevent
              @drop="ajout_carte(2)"
            />

            <Carte_membre
              v-else-if="carteaDonnee2?._class == 'member'"
              :data="carteaDonnee2"
              largeur="7.5vw"
              @click="ajout_carte(2)"
              @dragover.prevent
              @drop="ajout_carte(2)"
            />

            <Carte_familier
              v-else-if="carteaDonnee2?._class == 'pet'"
              :data="carteaDonnee2"
              largeur="7.5vw"
              @click="ajout_carte(2)"
              @dragover.prevent
              @drop="ajout_carte(2)"
            />

            <Carte_terrain
              v-else-if="carteaDonnee2?._class == 'arena'"
              :data="carteaDonnee2"
              largeur="7.5vw"
              @click="ajout_carte(2)"
              @dragover.prevent
              @drop="ajout_carte(2)"
            />
            <img
              v-if="!carteaDonnee3"
              src="@/assets/imgs/carte/carte_ajout.png"
              alt="Carte_à_Ajouter"
              @click="ajout_carte(3)"
              @dragover.prevent
              @drop="ajout_carte(3)"
            />

            <Carte_membre
              v-if="carteaDonnee3?._class == 'member'"
              :data="carteaDonnee3"
              largeur="7.5vw"
              @click="ajout_carte(3)"
              @dragover.prevent
              @drop="ajout_carte(3)"
            />

            <Carte_familier
              v-else-if="carteaDonnee3?._class == 'pet'"
              :data="carteaDonnee3"
              largeur="7.5vw"
              @click="ajout_carte(3)"
              @dragover.prevent
              @drop="ajout_carte(3)"
            />

            <Carte_terrain
              v-else-if="carteaDonnee3?._class == 'arena'"
              :data="carteaDonnee3"
              largeur="7.5vw"
              @click="ajout_carte(3)"
              @dragover.prevent
              @drop="ajout_carte(3)"
            />
          </div>
          <div class="les_cartes"></div>
        </div>
      </div>
      <router-link to="/social" v-if="echange_valide"
        ><button id="validation_ok" @click="validerEchange">
          valider échange
        </button></router-link
      >
      <button id="validation_non" v-else>valider échange</button>
    </div>
  </div>
  <h2>Choisir des cartes à échanger :</h2>
  <div class="les_cartes">
    <div
      class="conteneur_cartes"
      :style="{ '--width': widthFlexCartes }"
      @click="deselection($event)"
    >
      <div class="une_carte" v-for="carte in touteCartes" :key="carte.cardId">
        <Carte_membre
          v-if="carte._class == 'member'"
          :data="carte"
          largeur="200px"
          :class="{ dansEchange: estDansEchange(carte) }"
          @click="selectionCarteEchange(carte, $event)"
          draggable="true"
          @dragstart="selectionCarteEchange(carte, $event)"
        />

        <Carte_familier
          v-if="carte._class == 'pet'"
          :data="carte"
          largeur="200px"
          :class="{ dansEchange: estDansEchange(carte) }"
          @click="selectionCarteEchange(carte, $event)"
          draggable="true"
          @dragstart="selectionCarteEchange(carte, $event)"
        />

        <Carte_terrain
          v-if="carte._class == 'arena'"
          :data="carte"
          largeur="200px"
          :class="{ dansEchange: estDansEchange(carte) }"
          @click="selectionCarteEchange(carte, $event)"
          draggable="true"
          @dragstart="selectionCarteEchange(carte, $event)"
        />
        <barre_progress_carte
          :niv="
            collection.find((c) => c.card.cardId === carte.cardId)
              ? collection.find((c) => c.card.cardId === carte.cardId).quantity
              : 0
          "
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import config from '@/config.json';
import MonHeader from '@/Composants/header.vue';
import Carte_membre from '@/Composants/carte_membre.vue';
import Carte_familier from '@/Composants/carte_familier.vue';
import Carte_terrain from '@/Composants/carte_terrain.vue';
import barre_progress_carte from './barre_progress_carte.vue';
import verifLogin from '@/Composants/verifLogin.vue';

const userData = ref(JSON.parse(sessionStorage.getItem('userData'))); //OK
const collection = ref(userData.value.collection);
const echange_valide = ref(false);
const touteCartes = ref(null);
obtenirCartes();

const carteDemandee = ref(null);
const carteaDonnee1 = ref(null);
const carteaDonnee2 = ref(null);
const carteaDonnee3 = ref(null);
const carteSelectionnée = ref(null);
const quantitySelectionnée = ref(null);
const carteChangement = ref(null);

function selectionCarteEchange(card, evt) {
  const carteSelect = evt.currentTarget;

  if (carteSelect != null && !carteSelect.classList.contains('dansEchange')) {
    carteSelectionnée.value?.classList.remove('selection');
    carteSelect.classList.add('selection');

    carteSelectionnée.value = carteSelect;
    carteChangement.value = card;
    quantitySelectionnée.value = collection.value.find(
      (c) => c.card.cardId === card.cardId,
    )
      ? collection.value.find((c) => c.card.cardId === card.cardId).quantity
      : 0;
  }
}

function deselection(evt) {
  const carteSelect = evt.target.closest('.carte');
  if (!carteSelect && carteSelectionnée.value) {
    carteSelectionnée.value.classList.remove('selection');

    carteSelectionnée.value = null;
    carteChangement.value = null;
  }
}

function valide_echange() {
  if (
    carteDemandee.value &&
    (carteaDonnee1.value || carteaDonnee2.value || carteaDonnee3.value)
  ) {
    echange_valide.value = true;
  } else {
    echange_valide.value = false;
  }
}

function ajout_carte(index) {
  console.log(quantitySelectionnée.value);
  if (carteChangement) {
    if (index == 0) {
      carteDemandee.value = carteChangement.value;
    } else if (quantitySelectionnée.value > 0) {
      if (index == 1) {
        carteaDonnee1.value = carteChangement.value;
      } else if (index == 2) {
        carteaDonnee2.value = carteChangement.value;
      } else if (index == 3) {
        carteaDonnee3.value = carteChangement.value;
      }
    }
    valide_echange();
  }
}

function estDansEchange(carte) {
  if (
    carte == carteDemandee.value ||
    carte == carteaDonnee1.value ||
    carte == carteaDonnee2.value ||
    carte == carteaDonnee3.value
  ) {
    console.log('true');
    return true;
  } else {
    return false;
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
      console.log(touteCartes.value);
    } else {
      console.log('erreur');
    }
  } catch (erreur) {
    console.error(erreur);
  }
}

async function validerEchange() {
  try {
    const body = {
      askedCardId: carteDemandee.value?.cardId,
    };

    if (carteaDonnee1.value?.cardId) {
      body.offeredCardId1 = carteaDonnee1.value.cardId;
    }
    if (carteaDonnee2.value?.cardId) {
      body.offeredCardId2 = carteaDonnee2.value.cardId;
    }
    if (carteaDonnee3.value?.cardId) {
      body.offeredCardId3 = carteaDonnee3.value.cardId;
    }
    const response = await fetch(`${config.hosts.api}/trade/request`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    if (response.ok) {
      console.log('echange crée');
    } else {
      console.log('erreur');
    }
  } catch (erreur) {
    console.error(erreur);
  }
}
</script>

<style scoped>
@import '../assets/css/creation_echange.css';
</style>
