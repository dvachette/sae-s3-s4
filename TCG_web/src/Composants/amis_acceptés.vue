<template>
  <div class="ami">
    <p>{{ nom_ami }}</p>
    <div class="ami_option">
      <img src="@/assets/imgs/trois_points.png" alt="3 points" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  nom_ami: String,
});
console.log(props.nom_ami);
</script>

<style scoped>
@import '@/assets/css/amis.css';
</style>
