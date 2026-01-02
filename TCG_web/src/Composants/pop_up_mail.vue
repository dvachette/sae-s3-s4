
<template>
  <div class="pageChangement">
    <h2>Changement d'adresse mail</h2>
    <form>
      <label> Votre nouvelle adresse mail </label>
      <input type="text" id="n_mail" v-model="nouveau_mail" />

      <label> Confirmez votre nouvelle adresse mail </label>
      <input type="text" id="c_mail" v-model="confirmer_mail" />

      <label> Votre mot de passe </label>
      <input type="password" id="mdp" v-model="mdp" />
      <button type="submit" id="changer" @click="$emit('fermer')">
        Changer mail
      </button>
      <button id="fermer" @click="$emit('fermer')">Retour</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const nouveau_mail = ref('');
const confirmer_mail = ref('');
const mdp = ref('');
const userData = ref(JSON.parse(sessionStorage.getItem("userData")));

const emit = defineEmits(['fermer']);

async function changementMail() {
  if(checkPassword(mdp,userData.password) && nouveau_mail===confirmer_mail){
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
@import '@/assets/css/pop_up_mail.css';
</style>
