<template>
  <VerifLogin @login-success="updateFriendData" />
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
      <div
        v-if="chercheAmi == false"
        class="nouv_ami"
        @click.stop="rechercheAmi"
      >
        <img src="@/assets/imgs/ajout_ami.png" ref="nouvel ami" />
        <p>Ajouter des ami.e.s</p>
      </div>
      <input
        v-else
        type="text"
        ref="zoneTexte"
        @click.stop
        @keypress="afficher_liste"
      />
      <amis_acceptés
        v-for="m_ami in amis"
        :key="m_ami.userId"
        :nom_ami="m_ami.name"
        :id_ami="m_ami.userId"
        @supprimer="supprimer_ami"
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
        @refuser="demande_ami_refusee"
      />
      <div class="demandes_attentes">
        <p>Demandes en attentes</p>
      </div>
      <amis_attentes
        v-for="demande in demandesEnvoyees"
        :key="demande.toUserId"
        :nom_ami="demande.toUserName"
        :ami_id="demande.toUserId"
        @annuler="annuler_demande"
      />
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
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
const chercheAmi = ref(false);
const zoneTexte = ref(null);
const resultRecherche = ref([]);

function updateFriendData() {
  userData.value = JSON.parse(localStorage.getItem('userData'));
  amis.value = userData.value.friends;
  demandesRecues.value = userData.value.pendingIncomingRequests;
  demandesEnvoyees.value = userData.value.pendingFriendRequests;
}

function demande_ami_acceptee(data) {
  const accepted_id = data.ami_id;
  const accepted_name = data.ami_nom;
  demandesRecues.value = demandesRecues.value.filter(
    (friend) => friend.fromUserId != accepted_id
  );
  amis.value.push({ userId: accepted_id, name: accepted_name });
}

function demande_ami_refusee(data) {
  const refused_id = data.ami_id;
  demandesRecues.value = demandesRecues.value.filter(
    (friend) => friend.fromUserId != refused_id
  );
}

function annuler_demande(data) {
  const annulee_id = data.ami_id;
  demandesEnvoyees.value = demandesEnvoyees.value.filter(
    (friend) => friend.toUserId != annulee_id
  );
}

function rechercheAmi() {
  chercheAmi.value = !chercheAmi.value;
}

function handleClickOutside(event) {
  if (zoneTexte.value && !zoneTexte.value.contains(event.target)) {
    chercheAmi.value = false;
  }
}

function supprimer_ami(data) {
  const supprimer_id = data.id_ami;
  amis.value = amis.value.filter((friend) => friend.UserId != supprimer_id);
}

async function afficher_liste(event) {
  if (event.key === 'Enter') {
    try {
      const response = await fetch('http://localhost:3000/user/search', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: event.target.value }),
      });
      const data = await response.json();
      if (response.ok) {
        resultRecherche.value = data.users;
        console.log(resultRecherche.value);
      } else {
        console.error(data);
      }
    } catch (erreur) {
      console.error(erreur);
    }
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>
@import './assets/css/social.css';
</style>
