const user = ref('');

<template>
  <div class="pageChangement">
    <h2>Changement de mot de passe</h2>
    <form>
      <label> Votre ancien mot de passe</label>
      <input type="password" id="a_mdp" v-model="ancien_mdp" />

      <label> Votre nouveau mot de passe </label>
      <input type="password" id="n_mdp" v-model="nouveau_mdp" />

      <label> Confirmez votre mot de passe </label>
      <input type="password" id="c_mdp" v-model="confirmer_mdp" />
      <button type="submit" id="changer" @click="$emit('fermer')">
        Changer de mot de passe
      </button>
      <button id="fermer" @click="$emit('fermer')">Retour</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const ancien_mdp = ref('');
const nouveau_mdp = ref('');
const confirmer_mdp = ref('');
const userData = ref(JSON.parse(sessionStorage.getItem("userData")));

const emit = defineEmits(['fermer']);

async function changementMdp() {
  if(checkPassword(ancien_mdp,userData.password) && nouveau_mdp===confirmer_mdp){
  const response = await fetch('http://localhost:3000/user', {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ mdp: nouveau_mdp.value }),
  });
  if (response.ok) {
    const data = await response.json();
    console.log(data.message + ' reçues du serveur');
    emit('fermer');
  } else {
    console.error(response);
  }
}
}
</script>

<style scopedS>
@import '@/assets/css/pop_up_mdp.css';
</style>
