<template>
  <div class="trouvés">
    <p>{{ nom_ami }}</p>
    <p @click="demander_ami">+</p>
  </div>
</template>

<script setup>
const props = defineProps({
  nom_ami: String,
  id_ami: Number,
});

const emit = defineEmits(['demander', 'erreur']);

async function demander_ami() {
  try {
    const response = await fetch('http://localhost:3000/friends/request', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ friendId: props.id_ami }),
    });
    const data = await response.json();
    if (response.ok) {
      emit('demander', { ami_id: props.id_ami, ami_nom: props.nom_ami });
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
@import '@/assets/css/amis_trouve.css';
</style>
