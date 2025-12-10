<template>
  <div class="demande" id="props.ami_id">
    <p>{{ nom_ami }}</p>
    <div class="accepter" @click="accept_ami">
      <img src="@/assets/imgs/check_blanc.png" alt="check" />
    </div>
    <div class="refuser" @click="refus_ami">
      <img src="@/assets/imgs/croix_blanche.png" alt="croix" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  nom_ami: String,
  ami_id: Number,
});

const emit = defineEmits(['accepter', 'refuser', 'erreur']);

async function accept_ami() {
  try {
    const response = await fetch('http://localhost:3000/friends/remove', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ friendId: props.ami_id }),
    });
    const data = await response.json();
    if (response.ok) {
      emit('accepter', { ami_id: props.ami_id, ami_nom: props.nom_ami });
    } else {
      emit('erreur');
    }
  } catch (erreur) {
    emit('erreur');
    console.error(erreur);
  }
}

async function refus_ami() {
  try {
    const response = await fetch('http://localhost:3000/friends/reject', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ friendId: props.ami_id }),
    });
    const data = await response.json();
    if (response.ok) {
      emit('refuser', { ami_id: props.ami_id, ami_nom: props.nom_ami });
    } else {
      emit('erreur');
      console.log('Here amis_faux');
    }
  } catch (erreur) {
    emit('erreur');
    console.error(erreur);
  }
}
</script>

<style scoped>
@import '@/assets/css/amis_demandes.css';
</style>
