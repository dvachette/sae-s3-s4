<template>
  <div
    class="pv_barre"
    :style="{
      '--progress': pourcentage,
      '--progress-color': progressColor,
      '--w': props.largeur,
    }"
  >
    <div class="vie"></div>
    <p>{{ props.pv }}</p>
  </div>
</template>

<script setup>
import { computed } from 'vue';
const props = defineProps({
  pv: Number,
  pvtotal: Number,
  largeur: Number,
});
const pourcentageValue = computed(() => (props.pv * 100) / props.pvtotal);
const pourcentage = computed(() => pourcentageValue.value + '%');

const progressColor = computed(() => {
  if (pourcentageValue.value >= 75) {
    return 'linear-gradient(90deg, rgb(var(--vertclair)), rgb(var(--vert)))';
  } else if (pourcentageValue.value >= 50) {
    return 'linear-gradient(90deg, rgb(var(--jaune200)), rgb(var(--jaune400)))';
  } else if (pourcentageValue.value >= 25) {
    return 'linear-gradient(90deg, rgb(var(--orange400)), rgb(var(--orange600))';
  } else {
    return 'linear-gradient(90deg, rgb(var(--rouge400)), rgb(var(--rouge600))';
  }
});
</script>

<style scoped>
@import '../assets/css/vie_cartes.css';
</style>
