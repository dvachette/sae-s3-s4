<template>
  <div class="attente">
    <p>{{ nom_ami }}</p>
    <div class="annuler">
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
@import '@/assets/css/attentes.css';
</style>
