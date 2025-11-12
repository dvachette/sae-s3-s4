<template>
  <MonHeader />
  <main>
    <div class="gestion_soi">
      <div class="pp">
        <img src="@/assets/imgs/logoTCG.png" alt="pp"></img>
        <img src="@/assets/imgs/Appareil_photo.png" alt="edit" />
      </div>
      <div class="pseudo">
        <p>Pseudo: Ton_pseudo</p>
        <img src="@/assets/imgs/Petit_crayon.png" alt="edit" />
      </div>
      <div class="mail">
        <p>Mail : Ton_mail</p>
        <img src="@/assets/imgs/Petit_crayon.png" alt="edit" />
      </div>
      <div class="mdp">
        <p>Mot de passe : stamp_on_the_ground</p>
        <img src="@/assets/imgs/Petit_crayon.png" alt="edit" />
        </div>
        <div class="historiques">
          <router-link to="/social" class="h_combat" active-class="active"
            ><p>historique des combats</p></router-link
          >
          <router-link to="/social" class="h_echange" active-class="active"
            ><p>historique des échanges</p></router-link
          >
        </div>
        <button id="Déconnexion">Déconnexion</button>
        <button id="Supprimer">Supprimer le compte</button>
    </div>
    <div class="param_stats"></div>
  </main>
</template>

<script setup>
import { ref } from 'vue';

import MonHeader from '@/Composants/header.vue';
</script>

<style scoped>
@import './assets/css/profil.css';
</style>
