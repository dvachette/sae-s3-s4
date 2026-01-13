<template>
  <div class="attente">
    <p>{{ nom_ami }}</p>
    <div class="annuler" @click="annuler_demande">
      <img src="@/assets/imgs/croix_blanche.png" alt="croix" />
    </div>
  </div>
</template>

<script setup>
  import config from '@/config.json'
const props = defineProps({
  nom_ami: String,
  ami_id: Number,
});

const emit = defineEmits(['annuler', 'erreur']);

async function annuler_demande() {
  try {
    const response = await fetch(`http://${config.hosts.api}/friends/request`, {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ friendId: props.ami_id }),
    });
    const data = await response.json();
    if (response.ok) {
      emit('annuler', { ami_id: props.ami_id, ami_nom: props.nom_ami });
    } else {
      emit('erreur');
      console.error(data);
    }
  } catch (erreur) {
    emit('erreur');
    console.error(erreur);
  }
}
</script>

<style scoped>
@import '@/assets/css/amis_attentes.css';
</style>
