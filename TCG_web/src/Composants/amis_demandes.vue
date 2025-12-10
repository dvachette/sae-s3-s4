<template>
  <div class="demande">
    <p>{{ nom_ami }}</p>
    <div class="accepter">
      <img src="@/assets/imgs/check_blanc.png" alt="check" />
    </div>
    <div class="refuser">
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
    const response = await fetch('localhost:3000/friends/accept', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ friendId: ami_id }),
    });
    const data = await response.json();
    if (response.ok) {
      emit('accepter');
    } else {
      emit('erreur');
    }
  } catch (erreur) {
    emit('erreur');
  }
}
</script>

<style scoped>
@import '@/assets/css/amis_demandes.css';
</style>
