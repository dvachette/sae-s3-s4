<template>
  <div class="abandon">
    <p>Voulez-vous vraiment abandonner ?</p>
    <div class="choix">
        <button @click="$emit('confirm')">Oui, abandonner</button>
      <button @click="$emit('fermer')">Non, continuer</button>
    </div>
  </div>
</template>

<script setup></script>

<style>
@import '@/assets/css/abandon.css';
</style>
