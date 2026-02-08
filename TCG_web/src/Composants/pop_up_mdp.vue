
<template>
  <div class="pageChangement">
    <div class="formulaire">
      <h2>Changement de mot de passe</h2>
      <label> Votre ancien mot de passe</label>
      <input type="password" id="a_mdp" v-model="ancien_mdp" />

      <label> Votre nouveau mot de passe </label>
      <input type="password" id="n_mdp" v-model="nouveau_mdp" />

      <label> Confirmez votre mot de passe </label>
      <input type="password" id="c_mdp" v-model="confirmer_mdp" />
      <button id="changer" @click="changementMdp">
        Changer de mot de passe
      </button>
      <button id="fermer" @click="$emit('fermer')">Retour</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import config from '@/config.json'; 

const ancien_mdp = ref('');
const nouveau_mdp = ref('');
const confirmer_mdp = ref('');
const userData = ref(JSON.parse(sessionStorage.getItem('userData')));

const emit = defineEmits(['fermer']);

async function changementMdp() {
  if (nouveau_mdp.value === confirmer_mdp.value) {
    const response = await fetch(`${config.hosts.api}/user`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        password: nouveau_mdp.value,
        mdp_check: ancien_mdp.value,
      }),
    });
    if (response.ok) {
      const data = await response.json();
      console.log(data.message + ' reçues du serveur');
      emit('fermer');
    } else {
      console.error(response);
    }
  } else {
    console.log('les 2 mots de passe rentrés sont différents');
  }
}
</script>

<style scopedS>
@import '@/assets/css/pop_up_mdp.css';
</style>
