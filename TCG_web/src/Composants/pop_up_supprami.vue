<template>
  <div class="sup_ami">
    <p>Voulez-vous vraiment supprimer {{ nom_ami }} de vos amis ?</p>
    <div class="choix">
      <button @click="supprimer_ami">Oui</button>
      <button @click="$emit('garder_ami')">Non</button>
    </div>
  </div>
</template>

<script setup>
  import config from '@/config.json'
const props = defineProps({
  nom_ami: String,
  id_ami: Number,
});

const emit = defineEmits(['supprimer', 'erreur', 'garder_ami']);
async function supprimer_ami() {
  try {
    const response = await fetch(`http://${config.hosts.api}/friends`, {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ friendId: props.id_ami }),
    });
    const data = await response.json();
    if (response.ok) {
      emit('supprimer', { ami_id: props.id_ami, ami_nom: props.nom_ami });
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
@import '@/assets/css/supprami.css';
</style>
