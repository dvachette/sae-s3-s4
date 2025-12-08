<template>
  <div class="suppr">
    <p>Voulez-vous vraiment supprimer ce compte ?</p>
    <div class="choix">
      <button @click="$emit('suprpimer_compte')">Oui, supprimer</button>
      <button @click="$emit('fermer')">Non</button>
    </div>
  </div>
</template>

<script setup></script>

<style>
@import '@/assets/css/suppression.css';
</style>
