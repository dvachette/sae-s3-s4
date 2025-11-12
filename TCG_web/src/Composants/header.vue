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
    <router-link to="/profil" class="link" active-class="active"
      ><img src="@/assets/imgs/logoTCG.png" alt="Logo du site"
    /></router-link>
  </header>
</template>

<script setup>
import '@/assets/css/header.css';
</script>
