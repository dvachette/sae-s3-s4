<template>
  <div class="ami">
    <img :src="profile_picture" alt="Profile Picture" class="pp_amis"/>
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
  profile_picture: String,
});
</script>

<style scoped>
@import '@/assets/css/amis.css';
</style>
