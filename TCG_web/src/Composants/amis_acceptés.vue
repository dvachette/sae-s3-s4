<template>
  <div class="ami">
    <p>{{ nom_ami }}</p>
    <div class="ami_option">
      <img
        src="@/assets/imgs/croix_blanche.png"
        alt="croix"
        @click="supprimer_ami"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  nom_ami: String,
  id_ami: Number,
});

const emit = defineEmits(['supprimer', 'erreur']);
async function supprimer_ami() {
  try {
    const response = await fetch('http://localhost:3000/friends', {
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
@import '@/assets/css/amis.css';
</style>
