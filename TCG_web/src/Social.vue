<template>
  <VerifLogin />
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
      <amis_demandes
        v-for="demande in demandesRecues"
        :key="demande.fromUserId"
        :nom_ami="demande.fromUserId"
      />
      <div class="demandes_attentes">
        <p>Demandes en attentes</p>
      </div>
      <amis_attentes
        v-for="demande in demandesEnvoyees"
        :key="demande.toUserId"
        :nom_ami="demande.toUserId"
      />
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
import VerifLogin from '@/Composants/verifLogin.vue';

import MonHeader from '@/Composants/header.vue';

const userData = ref(JSON.parse(localStorage.getItem('userData')));

const demandesRecues = ref(userData.value.pendingIncomingRequests);
const demandesEnvoyees = ref(userData.value.pendingFriendRequests);
</script>

<style scoped>
@import './assets/css/social.css';
</style>
