<template>
  <div class="demande" id="props.ami_id">
    <div class="ami_info">
      <img :src="profile_picture" alt="Profile Picture" class="pp_amis" />
      <p>{{ nom_ami }}</p>
    </div>
    <div class="accepter" @click="accept_ami">
      <img src="/assets/imgs/check_blanc.png" alt="check" />
    </div>
    <div class="refuser" @click="refus_ami">
      <img src="/assets/imgs/croix_blanche.png" alt="croix" />
    </div>
  </div>
</template>

<script setup>
import config from '@/config.json';
const props = defineProps({
  nom_ami: String,
  ami_id: Number,
  profile_picture: String,
});

const emit = defineEmits(['accepter', 'refuser', 'erreur']);

async function accept_ami() {
  try {
    const response = await fetch(`${config.hosts.api}/friends/accept`, {
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
    const response = await fetch(`${config.hosts.api}/friends/reject`, {
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
