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
    <div class="les_amis">
      <div class="nouv_ami">
        <img src="@/assets/imgs/ajout_ami.png" ref="nouvel ami" />
        <p>Ajouter des ami.e.s</p>
      </div>
      <amis_acceptés
        v-for="m_ami in amis"
        :key="m_ami.userId"
        :nom_ami="m_ami.name"
      />
      <div class="demandes_reçus">
        <p>Demandes reçues</p>
      </div>
      <amis_demandes
        v-for="demande in demandesRecues"
        :key="demande.fromUserId"
        :nom_ami="demande.fromUserName"
        :ami_id="demande.fromUserId"
        @accepter="demande_ami_acceptee"
      />
      <div class="demandes_attentes">
        <p>Demandes en attentes</p>
      </div>
      <amis_attentes
        v-for="demande in demandesEnvoyees"
        :key="demande.toUserId"
        :nom_ami="demande.toUserName"
      />
    </div>
  </main>
</template>

<script setup>
import { ref } from 'vue';
import mes_echanges from '@/Composants/mes_echange.vue';
import echange from '@/Composants/echange.vue';
import new_echange from '@/Composants/new_echange.vue';
import amis_acceptés from '@/Composants/amis_acceptés.vue';
import amis_demandes from '@/Composants/amis_demandes.vue';
import amis_attentes from '@/Composants/amis_attentes.vue';
import VerifLogin from '@/Composants/verifLogin.vue';

import MonHeader from '@/Composants/header.vue';

const userData = ref(JSON.parse(localStorage.getItem('userData')));

const amis = ref(userData.value.friends);
const demandesRecues = ref(userData.value.pendingIncomingRequests);
const demandesEnvoyees = ref(userData.value.pendingFriendRequests);
console.log(demandesRecues, demandesEnvoyees);

function demande_ami_acceptee(data) {
  const accepted_id = data.ami_id;
  const accepted_name = data.nom_ami;
}
</script>

<style scoped>
@import './assets/css/social.css';
</style>
