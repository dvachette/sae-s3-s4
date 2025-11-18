<template>
  <MonHeader />
  <main>
    <h2>
      La page qui te montre tous tes amis et toutes les transactions à faire
      avec eux
    </h2>
    <mes_echanges />
    <echange />
  </main>
</template>

<script setup>
import { ref } from 'vue';
import mes_echanges from '@/Composants/mes_echange.vue';
import echange from '@/Composants/echange.vue';

import MonHeader from '@/Composants/header.vue';
</script>
