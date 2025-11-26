<template>
  <VerifLogin/>
  <MonHeader />
  <main>
    <div class="gestion_soi">
      <div class="pp">
        <img src="@/assets/imgs/logoTCG.png" alt="pp"></img>
        <img src="@/assets/imgs/Appareil_photo.png" alt="edit" />
      </div>
      <div class="pseudo">
        <p v-if="!edit_P">Pseudo : {{ pseudo }}</p>

        <input
          v-else
          type="text"
          v-model="draft_P"
          @keydown.enter="saveP"
          @blur="cancelP"
          class="edit-pseudo"
          ref="input_P  "
        />

        <img
          v-if="!edit_P"
          src="@/assets/imgs/Petit_crayon.png"
          alt="edit"
          @click="startEditP"
          class="edit-pseudo-icon"
        />
        </div>
       <div class="mail">
        <p v-if="!edit_M">Mail : {{ mail }}</p>

        <input
          v-else
          type="text"
          v-model="draft_M"
          @keydown.enter="saveM"
          @blur="cancelM"
          class="edit-mail"
          ref="input_M"
        />

        <img
          v-if="!edit_M"
          src="@/assets/imgs/Petit_crayon.png"
          alt="edit"
          @click="startEditM"
          class="edit-mail-icon"
        />
        </div>
      <div class="mdp">
        <p v-if="!editing">Mot de passe : {{ maskedPassword }}</p>

        <input
          v-else
          type="text"
          v-model="draftPassword"
          @keydown.enter="save"
          @blur="cancel"
          class="edit-input"
          ref="inputEl"
        />

        <img
          v-if="!editing"
          src="@/assets/imgs/Petit_crayon.png"
          alt="edit"
          @click="startEdit"
          class="edit-icon"
        />
        </div>
        <div class="historiques">
          <router-link to="/social" class="h_combat" active-class="active"
            ><p>historique des combats</p></router-link
          >
          <router-link to="/social" class="h_echange" active-class="active"
            ><p>historique des échanges</p></router-link
          >
        </div>
        <button @click="deconnexion" id="Déconnexion">Déconnexion</button>
        <button id="Supprimer">Supprimer le compte</button>
    </div>
    <div class="param_stats">
      <h2>Paramètres :</h2>
      <label><input type="checkbox" name="apparence" value="pôle">Thême Sombre</input></label>
      <label><input type="checkbox" name="musique" value="pôle">Musique active</input></label>
      <label><input type="checkbox" name="effets" value="pôle">Effets Sonores</input></label>
      <h2>Statistiques :</h2>
      <p>Cartes possédées : 46/71</p>
      <p>Parties jouées : 12</p>
      <p>Parties gagnées : 07</p>
      <p>Amis : 27</p>
    </div>
  </main>
</template>

<script setup>
import VerifLogin from '@/Composants/verifLogin.vue';
import MonHeader from '@/Composants/header.vue';
import { ref, computed, nextTick } from 'vue'
import { useRouter } from 'vue-router';
const password = ref('motdepasse123')

const editing = ref(false)
const draftPassword = ref('')
const inputEl = ref(null)

// mot de passe masqué pour l'affichage
const maskedPassword = computed(() =>
  password.value ? '*'.repeat(password.value.length) : '********'
)

function startEdit() {
  editing.value = true
  draftPassword.value = password.value
  nextTick(() => inputEl.value?.focus())
}

function save() {
  editing.value = false
  password.value = draftPassword.value
}

function cancel() {
  editing.value = false
  draftPassword.value = password.value
}

const pseudo = ref('Ton_Pseudo')

const edit_P = ref(false)
const draft_P = ref('')
const input_P = ref(null)

function startEditP() {
  edit_P.value = true
  draft_P.value = pseudo.value
  nextTick(() => input_P.value?.focus())
}

function saveP() {
  edit_P.value = false
  pseudo.value = draft_P.value
}

function cancelP() {
  edit_P.value = false
  draft_P.value = pseudo.value
}

const mail = ref('Ton_Mail')

const edit_M = ref(false)
const draft_M = ref('')
const input_M = ref(null)

function startEditM() {
  edit_M.value = true
  draft_M.value = mail.value
  nextTick(() => input_M.value?.focus())
}

function saveM() {
  edit_M.value = false
  mail.value = draft_M.value
}

function cancelM() {
  edit_M.value = false
  draft_M.value = mail.value
}

const router = useRouter(); 
async function deconnexion(){
  try {
        // Envoi de la requête de connexion au serveur
        const response = await fetch(
          'http://localhost:3000/logout', // URL de l'API de connexion
          {
            method: 'GET', // Méthode GET pour récupérer les données
            credentials: "include", // Inclure les cookies dans la requête
          }
        );
        const data = await response.json(); // Récupération de la réponse JSON
        console.log('Réponse du serveur :', data);
        router.push('/');
      } catch (error) {
        console.error('Erreur lors de la connexion :', error);
        router.push('/');
      }
}

</script>

<style scoped>
@import './assets/css/profil.css';
</style>
