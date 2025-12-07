<template>
  <div class="abandon">
    <p>Voulez-vous vraiment abandonner ?</p>
    <div class="choix">
      <router-link to="/booster" class="link" active-class="active">
        <button>Oui, abandonner</button></router-link
      >
      <button @click="$emit('fermer')">Non, continuer</button>
    </div>
  </div>
</template>

<script setup></script>

<style>
@import '@/assets/css/abandon.css';
</style>
