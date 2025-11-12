<template>
  <MonHeader />
  <main id="collection">
    <div class="tri_filtres">
      <h2>cartes possédées</h2>
    </div>
    <div class="toutes_les_cartes"></div>
  </main>
</template>

<script setup>
import { ref } from 'vue';

import MonHeader from '@/Composants/header.vue';
</script>
