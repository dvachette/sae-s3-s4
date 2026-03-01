<template>
  <VerifLogin @login-success="updateFriendData" />
  <MonHeader />
  <main>
    <accepter_echange
      id="a_echange"
      v-if="afficher_echange == true"
      :echange_id="id_ami_echange"
      @fermer="afficher_echange = false"
    />
    <pop_up_supprami
      v-if="afficher_supprami == true"
      :nom_ami="nom_ami_selectionne"
      :id_ami="id_ami_selectionne"
      id="s_ami"
      @supprimer="supprimer_ami"
      @garder_ami="afficher_supprami = false"
    />
    <annuler_echange
      id="s_echange"
      v-if="afficher_annuler == true"
      :echange_id="id_echange"
      @fermer="fermerAnnulerEchange()"
    />
    <div class="part_echange">
      <h2>Mes échanges</h2>
      <mes_echanges
        v-if="listeMesEchanges.trades?.[0]"
        class="e1"
        :echange_id="listeMesEchanges.trades?.[0].tradeRequestId"
        @click="
          afficher_annuler = true;
          id_echange = listeMesEchanges.trades?.[0].tradeRequestId;
        "
      />
      <router-link to="/creation_echange" v-else
        ><new_echange class="e2"
      /></router-link>
      <mes_echanges
        v-if="listeMesEchanges.trades?.[1]"
        class="e1"
        :echange_id="listeMesEchanges.trades?.[1].tradeRequestId"
        @click="
          afficher_annuler = true;
          id_echange = listeMesEchanges.trades?.[1].tradeRequestId;
        "
      />
      <router-link to="/creation_echange" v-else
        ><new_echange class="e2"
      /></router-link>
      <h2>Échanges de vos amis</h2>
      <echange
        v-if="listeAmisEchanges[0] != null"
        v-for="echange in listeAmisEchanges"
        :echange_id="echange.tradeRequestId"
        @click="
          afficher_echange = true;
          id_ami_echange = echange.tradeRequestId;
        "
      />
    </div>
    <div class="les_amis">
      <div
        v-if="chercheAmi == false"
        class="nouv_ami"
        @click.stop="rechercheAmi"
      >
        <img src="/assets/imgs/ajout_ami.png" ref="nouvel ami" />
        <p>Ajouter des ami.e.s</p>
      </div>
      <div class="recherche_ami" v-if="chercheAmi == true" @click.stop>
        <input type="text" ref="zoneTexte" @keypress="afficher_liste" />
        <amis_trouvé
          v-for="p_trouvés in resultRecherche"
          :key="p_trouvés.userId"
          :nom_ami="p_trouvés.name"
          :id_ami="p_trouvés.userId"
          :profile_picture="p_trouvés.profilePicture || '/assets/imgs/logoTCG.png'"
          @demander="demander_ami"
        />
      </div>
      <amis_acceptés
        v-for="m_ami in amis"
        :key="m_ami.userId"
        :nom_ami="m_ami.name"
        :profile_picture="m_ami.profilePicture || '/assets/imgs/logoTCG.png'"
        @appel_pop_up="
          afficher_supprami = true;
          nom_ami_selectionne = m_ami.name;
          id_ami_selectionne = m_ami.userId;
        "
      />
      <div class="demandes_reçus">
        <p>Demandes reçues</p>
      </div>
      <amis_demandes
        v-for="demande in demandesRecues"
        :key="demande.fromUserId"
        :nom_ami="demande.fromUserName"
        :ami_id="demande.fromUserId"
        :profile_picture="demande.fromUserProfilePicture || '/assets/imgs/logoTCG.png'"
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
        :profile_picture="demande.toUserProfilePicture || '/assets/imgs/logoTCG.png'"
        @annuler="annuler_demande"
      />
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import mes_echanges from '@/Composants/mes_echange.vue';
import new_echange from '@/Composants/new_echange.vue';
import amis_acceptés from '@/Composants/amis_acceptés.vue';
import amis_demandes from '@/Composants/amis_demandes.vue';
import amis_attentes from '@/Composants/amis_attentes.vue';
import VerifLogin from '@/Composants/verifLogin.vue';
import pop_up_supprami from './Composants/pop_up_supprami.vue';
import amis_trouvé from './Composants/amis_trouve.vue';
import accepter_echange from './Composants/accepter_echange.vue';
import annuler_echange from './Composants/annuler_echange.vue';
import config from '@/config.json';
import MonHeader from '@/Composants/header.vue';

const userData = ref(JSON.parse(sessionStorage.getItem('userData')));

const amis = ref(userData.value.friends);
const demandesRecues = ref(userData.value.pendingIncomingRequests);
const demandesEnvoyees = ref(userData.value.pendingFriendRequests);
const chercheAmi = ref(false);
const zoneTexte = ref(null);
const resultRecherche = ref([]);
const afficher_supprami = ref(false);
const nom_ami_selectionne = ref('');
const id_ami_selectionne = ref('');
const afficher_echange = ref(false);
const id_echange = ref(null);
const id_ami_echange = ref(null);
const afficher_annuler = ref(false);
const listeAmisEchanges = ref([]);
const listeMesEchanges = ref([]);

obtenirMesEchanges();
obtenirEchanges();

function updateFriendData() {
  userData.value = JSON.parse(sessionStorage.getItem('userData'));
  amis.value = userData.value.friends;
  demandesRecues.value = userData.value.pendingIncomingRequests;
  demandesEnvoyees.value = userData.value.pendingFriendRequests;
}

function demande_ami_acceptee(data) {
  const accepted_id = data.ami_id;
  const accepted_name = data.ami_nom;
  demandesRecues.value = demandesRecues.value.filter(
    (friend) => friend.fromUserId != accepted_id,
  );
  amis.value.push({ userId: accepted_id, name: accepted_name });
}

function demande_ami_refusee(data) {
  const refused_id = data.ami_id;
  demandesRecues.value = demandesRecues.value.filter(
    (friend) => friend.fromUserId != refused_id,
  );
}

function annuler_demande(data) {
  const annulee_id = data.ami_id;
  demandesEnvoyees.value = demandesEnvoyees.value.filter(
    (friend) => friend.toUserId != annulee_id,
  );
}

function rechercheAmi() {
  chercheAmi.value = !chercheAmi.value;
}

function handleClickOutside(event) {
  if (zoneTexte.value && !zoneTexte.value.contains(event.target)) {
    chercheAmi.value = false;
    resultRecherche.value = [];
  }
}

function supprimer_ami(data) {
  const supprimer_id = data.id_ami;
  amis.value = amis.value.filter((friend) => friend.UserId != supprimer_id);
  afficher_supprami.value = false;
}

function demander_ami(data) {
  const demande_id = data.ami_id;
  const demande_name = data.ami_nom;
  const demande_pp = data.profile_picture;
  demandesEnvoyees.value.push({
    toUserId: demande_id,
    toUserName: demande_name,
    toUserProfilePicture: demande_pp,
  });
  chercheAmi.value = false;
  resultRecherche.value = [];
}

async function afficher_liste(event) {
  if (event.key === 'Enter') {
    try {
      const response = await fetch(`${config.hosts.api}/user/search`, {
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
      } else {
        console.error(data);
      }
    } catch (erreur) {
      console.error(erreur);
    }
  }
}

async function obtenirMesEchanges() {
  try {
    const response = await fetch(
      `${config.hosts.api}/trade/requests/me`,
      {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(),
      },
    );
    const data = await response.json();
    if (response.ok) {
      listeMesEchanges.value = data;
    } else {
      console.error(data);
    }
  } catch (erreur) {
    console.error(erreur);
  }
}

async function obtenirEchanges() {
  try {
    const response = await fetch(`${config.hosts.api}/trade/requests`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(),
    });
    const data = await response.json();
    if (response.ok) {
      listeAmisEchanges.value = data.trades;
      console.log('Amis échanges : ', listeAmisEchanges.value);
    } else {
      console.error(data);
    }
  } catch (erreur) {
    console.error(erreur);
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
});

function fermerAnnulerEchange() {
  afficher_annuler.value = false;
  userData.value = JSON.parse(sessionStorage.getItem('userData'));
  obtenirMesEchanges();
}
</script>

<style scoped>
@import '@/assets/css/social.css';
</style>
