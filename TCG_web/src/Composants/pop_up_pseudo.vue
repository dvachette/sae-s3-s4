<template>
  <div class="pageChangement">
    <h2>Changement de pseudo</h2>
    <div class="formulaire">
      <label> Votre nouveau pseudo </label>
      <input type="text" id="n_pseudo" v-model="pseudo" />
      <button id="changer" @click="changementPseudo">Changer pseudo</button>
      <button id="fermer" @click="$emit('fermer')">Retour</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
const pseudo = ref('');

const emit = defineEmits(['fermer']);

async function changementPseudo() {
  const response = await fetch('http://localhost:3000/user', {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name: pseudo.value }),
  });
  if (response.ok) {
    const data = await response.json();
    console.log(data.message + ' reçues du serveur');
    emit('fermer');
  } else {
    console.error(response);
  }
}
</script>

<style scopedS>
@import '@/assets/css/pop_up_pseudo.css';
</style>
