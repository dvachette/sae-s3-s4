<template>
    <div class="total" :style="{'--progress': pourcentage}">
          <div class="progression">
            
          </div>
          <p>{{ niv }} / {{ total }}</p>
    </div>
</template>

<script setup>
const props = defineProps({
  niv: Number,
});

const total = (Math.floor(props.niv / 5) + 1) * 5 //le nombre de carte possédées / nb de cartes qu'il faut pour 1 niveau * 5 pour avoir le nb qu'il faut qu'il atteigne
const progress = Math.floor(props.niv / 5)
const pourcentage = (((props.niv % 5)*100)/5)+"%"
</script>

<style scoped>
@import '@/assets/css/barre_progress_carte.css';
</style>