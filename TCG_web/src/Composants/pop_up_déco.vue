<template>
  <div class="deco">
    <p>Voulez-vous vraiment vous déconnecter ?</p>
    <div class="choix">
      <button @click="$emit('déconnexion')">Oui</button>
      <button @click="$emit('fermer')">Non</button>
    </div>
  </div>
</template>

<script setup>
</script>

<style>
@import '@/assets/css/pop_up_déco.css';
</style>
