<template>
  <div class="pageChangement">
    <div class="formulaire">
      <h2>Changement d'adresse mail</h2>
      <label> Votre nouvelle adresse mail </label>
      <input type="text" id="n_mail" v-model="nouveau_mail" />

      <label> Confirmez votre nouvelle adresse mail </label>
      <input type="text" id="c_mail" v-model="confirmer_mail" />

      <label> Votre mot de passe </label>
      <input type="password" id="mdp" v-model="mdp" />
      <button id="changer" @click="changementMail">Changer mail</button>
      <button id="fermer" @click="$emit('fermer')">Retour</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const nouveau_mail = ref('');
const confirmer_mail = ref('');
const mdp = ref('');
const mdp_incorrect = ref(false);
const mail_identiques = ref(false);

const emit = defineEmits(['fermer']);

async function changementMail() {
  if (nouveau_mail.value === confirmer_mail.value) {
    const response = await fetch('http://localhost:3000/user', {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: nouveau_mail.value, mdp_check: mdp.value }),
    });
    if (response.ok) {
      const data = await response.json();
      console.log(data.message + ' reçues du serveur');
      emit('fermer');
    } else {
      console.error(response);
    }
  } else {
    console.log('les 2 mails rentrés sont différents');
  }
}
</script>

<style scopedS>
@import '@/assets/css/pop_up_mail.css';
</style>
