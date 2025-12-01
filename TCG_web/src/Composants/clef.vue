<template>
  <div class="clef">
<<<<<<< HEAD
    <p>{{ props.NbCle || 0 }}</p>
=======
    <p>{{ props.cles }}</p>
>>>>>>> 42282d7a31c4a74c105585ce4bdff2d1d4bf48b4
    <img src="@/assets/imgs/Clef.png" alt="Lot de clefs" />
  </div>
</template>

<<<<<<< HEAD
<script setup>
const props = defineProps({
  NbCle: Number,
});
</script>

=======

<script setup>
  const props = defineProps({
    "cles": {
      type: Number,
      required: false,
      default: 0
    }
  });
</script>
>>>>>>> 42282d7a31c4a74c105585ce4bdff2d1d4bf48b4
<style scoped>
@import '../assets/css/style_clef.css';
</style>


