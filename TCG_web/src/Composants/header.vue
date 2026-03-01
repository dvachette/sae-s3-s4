<template>
  <header>
    <router-link to="/booster"
      ><img src="/assets/imgs/logoTCG.png" alt="Logo du site"
    /></router-link>
    <router-link to="/booster" class="link" active-class="active"
      ><h1>Booster</h1></router-link
    >
    <router-link to="/combat" class="link" active-class="active"
      ><h1>Combat</h1></router-link
    >
    <router-link to="/collection" class="link" active-class="active"
      ><h1>Collection</h1></router-link
    >
    <router-link to="/boutique" class="link" active-class="active"
      ><h1>Boutique</h1></router-link
    >
    <router-link to="/social" class="link" active-class="active"
      ><h1>Social</h1></router-link
    >
    <router-link v-if="isAdmin" to="/admin/users" class="link" active-class="active"
      ><h1>Admin</h1></router-link>
    <router-link to="/profil" active-class="active" class="p_profil"
      ><img :src="pp" alt="Logo du site" id="photo_p"
    /></router-link>
  </header>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import config from '@/config.json';
const props = defineProps({trigger: Number});

watch(
  () => props.trigger,
  () => {
    console.log('Header mis à jour');
    loadUserData();
  }
);

const pp = ref('/assets/imgs/logoTCG.png');

const user = ref(JSON.parse(sessionStorage.getItem('userData')));
const isAdmin = ref(false)
function loadUserData() {
  user.value = JSON.parse(sessionStorage.getItem('userData'));
  pp.value =
    user.value.profilePicture !== null
      ? user.value.profilePicture
      : '/assets/imgs/logoTCG.png';
}


setTimeout(loadUserData, 2000); // Charger les données de l'utilisateur après un délai de 1 seconde


onMounted(async () => {
  await checkAdminStatus();
});

async function checkAdminStatus() {
const response = await fetch(`${config.hosts.api}/admin/isAdmin`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include' // Inclure les cookies pour l'authentification
  });
  if (!response.ok) {
    console.error('Erreur lors de la vérification du rôle admin');
    isAdmin.value = false;
  } else {
    const data = await response.json();
    console.log('Statut admin récupéré :', data.isAdmin);
    isAdmin.value = data.isAdmin;
  }
}

</script>

<style scoped>
@import '@/assets/css/header.css';
</style>
