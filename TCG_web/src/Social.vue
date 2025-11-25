<template>
  <MonHeader />
  <main>
    <div class="part_echange">
      <h2>Mes échanges</h2>
      <mes_echanges class="e1" />
      <new_echange class="e2" />
      <h2>Autres échanges</h2>
      <echange nom_echangeur="Panoramix" />
      <echange nom_echangeur="Panoramix" />
      <echange nom_echangeur="Panoramix" />
      <echange nom_echangeur="Panoramix" />
      <echange nom_echangeur="Panoramix" />
    </div>
    <div class="amis">
      <div class="nouv_ami">
        <img src="@/assets/imgs/ajout_ami.png" ref="nouvel ami" />
        <p>Ajouter des ami.e.s</p>
      </div>
      <amis nom_ami="C.JALOUX" />
      <div class="demandes_reçus">
        <p>Demandes reçues</p>
      </div>
      <amis_demandes nom_ami="A.JOUBERT" />
      <div class="demandes_attentes">
        <p>Demandes en attentes</p>
      </div>
      <amis_attentes nom_ami="A.PEYTAVIE" />
    </div>
  </main>
</template>

<script setup>
import { ref } from 'vue';
import mes_echanges from '@/Composants/mes_echange.vue';
import echange from '@/Composants/echange.vue';
import new_echange from '@/Composants/new_echange.vue';
import amis from '@/Composants/amis.vue';
import amis_demandes from '@/Composants/amis_demandes.vue';
import amis_attentes from '@/Composants/amis_attentes.vue';

import MonHeader from '@/Composants/header.vue';
</script>

<style scoped>
@import './assets/css/social.css';
</style>
