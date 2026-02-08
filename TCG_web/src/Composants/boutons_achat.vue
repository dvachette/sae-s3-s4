<template>
  <div class="bouton_achat">
    <p>{{ props.prix }}</p>
    <img src="/assets/imgs/Clef.png" alt="Lot de clefs" />
  </div>
</template>

<script setup>
const props = defineProps({
  prix: Number,
});
</script>

<style scoped>
@import '@/assets/css/bouton_achat.css';
</style>
