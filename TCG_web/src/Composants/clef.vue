<template>
  <div class="clef">
    <p>{{ props.NbCles || 0 }}</p>
    <img src="@/assets/imgs/Clef.png" alt="Lot de clefs" />
  </div>
</template>


<script setup>
  const props = defineProps({
    nbCles: Number,
  });
</script>
<style scoped>
@import '../assets/css/style_clef.css';
</style>


