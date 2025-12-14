<template>
  <div class="ami">
    <p>{{ nom_ami }}</p>
    <div class="ami_option">
      <img
        src="@/assets/imgs/croix_blanche.png"
        alt="croix"
        @click="$emit('appel_pop_up')"
      />
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
@import '@/assets/css/amis.css';
</style>
