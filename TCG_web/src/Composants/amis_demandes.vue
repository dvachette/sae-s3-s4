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
});
</script>

<style scoped>
@import '@/assets/css/demandes.css';
</style>
