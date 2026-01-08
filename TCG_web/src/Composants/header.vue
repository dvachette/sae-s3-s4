<template>
  <header>
    <router-link to="/booster"
      ><img src="@/assets/imgs/logoTCG.png" alt="Logo du site"
    /></router-link>
    <router-link to="/booster" class="link" active-class="active"
      ><h1>Booster</h1></router-link
    >
    <router-link to="/combat" class="link" active-class="active"
      ><h1>Combat</h1></router-link
    >
    <router-link to="/collection" class="link" active-class="active"
      ><h1>Collection</h1></router-link
    >
    <router-link to="/boutique" class="link" active-class="active"
      ><h1>Boutique</h1></router-link
    >
    <router-link to="/social" class="link" active-class="active"
      ><h1>Social</h1></router-link
    >
    <router-link to="/profil" active-class="active" class="p_profil"
      ><img :src="pp" alt="Logo du site" id="photo_p"
    /></router-link>
  </header>
</template>

<script setup>
import { ref } from 'vue';
const pp = ref('/src/assets/imgs/logoTCG.png');

const user = ref(JSON.parse(sessionStorage.getItem('userData')));
function loadUserData() {
  pp.value =
    user.value.profilePicture !== null
      ? user.value.profilePicture
      : 'src/assets/imgs/logoTCG.png';
}

loadUserData();
</script>

<style scoped>
@import '../assets/css/header.css';
</style>
