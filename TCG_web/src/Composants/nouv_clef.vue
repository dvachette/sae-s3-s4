<template>
  <div class="clef">
    <p>+ {{ cles }}</p>
    <img src="@/assets/imgs/Clef.png" alt="Lot de clefs" />
  </div>
</template>

<script setup>
const props = defineProps({
  cles: {
    type: Number,
    required: false,
    default: 0,
  },
});
</script>

<style scoped>
@import '../assets/css/nouv_clef.css';
</style>
