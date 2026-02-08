<template>
    <CheckAdmin />
    <AdminChoixPP v-if="onPPManage" @cancel="closePPChangePopup" :userData="selectedUser" @validate="changePP"/>
    <div class="adminPanel">
        <header id="adminHeader">
            <img src="@/assets/imgs/logoTCG.png" alt="Logo TCG" @click="backToUserSpace" title="Retour à l'espace utilisateur" class="imgBtn"/>
            <h1>Administration - Gestion des utilisateurs</h1>
            <img src="@/assets/imgs/logoTCG.png" alt="Icône Admin"/>
        </header>
        <nav>
            <input type="search" placeholder="Rechercher un joueur..." v-model="searchTerm"/>
        </nav>
        <div id="adminContent">
            <div class="playerCardScroller">
                <div class="playerCardsContainer">
                    <CarteJoueurAdmin
                        v-for="player in displayedUsers"
                        :key="player.userId"
                        :playerid="player.userId"
                        :playerPicture="player.profilePicture"
                        @managePlayer="handleManagePlayer"
                    />
                </div>
            </div> 
            <div class="playerDetails detailsEmpty" v-if="!selectedUser">
                <h2>Détails du joueur</h2>
                <p>Sélectionnez un joueur pour voir ses détails ici.</p>
            </div>
            <div class="playerDetails detailsFilled" v-else>
                <h2>Détails du joueur #{{ selectedUser.userId }}</h2>
                <div class="editKeys">
                    <EditeableNumeric :value="selectedUser.balance" @update:count="changeBalance"/>
                    <img src="@/assets/imgs/Clef.png" alt="Icône Clé" class="keyIcon"/>
                </div>
                <EditeableField :modelValue="selectedUser.username" label="Pseudo" @validateEdit="validateUsernameEdit"/> 
                <EditeableField :modelValue="selectedUser.email" label="Email" @validateEdit="validateEmailEdit"/>
                <p id="roleDisplay" v-if="selectedUser.role === 'deleted'"><strong>Rôle :</strong> {{ selectedUser.role }}</p>
                <p id="roleSelect" v-else><strong>Rôle </strong>
                    <select v-model="selectedUser.role" @change="validateRoleEdit">
                        <option v-for="role in availableRoles" :key="role" :value="role">{{ role }}</option>
                    </select>
                </p>
                <div class="changePassword" v-if="selectedUser.role !== 'deleted'">
                    <fieldset>
                        <legend>Changer le mot de passe</legend>
                        <label>Nouveau mot de passe
                            <input type="password" @input="onNewPasswordChange" v-model="newPassword">
                        </label>
                        <label>Confirmer le mot de passe 
                            <input type="password" @input="onNewPasswordChange" v-model="newPasswordConfirm">
                        </label>
                        <button @click="changePassword" id="validateChangePassword" :disabled="!passwordsMatch">Valider</button>
                    </fieldset>
                </div>
                <button id="manageCollection" v-if="selectedUser.role !== 'deleted'" @click="goToManageCollection">Gérer la collection</button>
                <button id="changePP" @click="openPPChangePopup" v-if="selectedUser.role !== 'deleted'">Changer la photo de profil</button>
                <button class="deleteButton" id="deleteButton" v-if="selectedUser.role !== 'deleted'" @click="deleteUser">Supprimer le joueur</button>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { ref, onMounted, computed } from 'vue';
    import '@/assets/css/admin.css';
    import CarteJoueurAdmin from './Composants/CarteJoueurAdmin.vue';
    import config from "./config.json";
    import EditeableField from './Composants/EditeableField.vue';
    import CheckAdmin from './Composants/CheckAdmin.vue';
    import EditeableNumeric from './Composants/EditeableNumeric.vue';
    import AdminChoixPP from './Composants/AdminChoixPP.vue';
    const users = ref([]);
    const searchTerm = ref('');
    const displayedUsers = computed(() => {
        const term = searchTerm.value.toLowerCase();
        console.log("Filtering users with term:", term);
        return users.value.filter(user => user.name.toLowerCase().includes(term) || user.email.toLowerCase().includes(term));
    }); 

    const onPPManage = ref(false);
    const selectedUser = ref(null);
    const availableRoles = ['user', 'admin']; // Rôles disponibles
    const newPassword = ref('');
    const newPasswordConfirm = ref('');
    const passwordsMatch = computed(() => newPassword.value === newPasswordConfirm.value && newPassword.value !== '' && isPasswordStrong(newPassword.value));
    
    function backToUserSpace() {
        window.location.href = '/booster';
    }

    function openPPChangePopup() {
        onPPManage.value = true;
    }

    function closePPChangePopup() {
        onPPManage.value = false;
    }

    async function changePP(newPP) {
        console.log(`Changing profile picture to ${newPP}`);
        const response = await fetch(`${config.hosts.api}/admin/user/profilePicture`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                targetUserId: selectedUser.value.userId,
                newPP: newPP
            })
        });
        if (!response.ok) {
            console.error('Erreur lors de la mise à jour de la photo de profil');
            return;
        }
        selectedUser.value.profilePicture = newPP; // Mettre à jour localement pour refléter le changement immédiatement
        users.value = users.value.map(user => user.userId === selectedUser.value.userId ? { ...user, profilePicture: newPP } : user); // Mettre à jour la liste des utilisateurs pour refléter le changement
        closePPChangePopup();
    }

    async function changeBalance(amount, _) {
        console.log(`Changing balance to ${amount}`)
        const response = await fetch(`${config.hosts.api}/admin/user/balance`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                targetUserId: selectedUser.value.userId,
                newBalance: amount
            })
        });
        if (!response.ok) {
            console.error('Erreur lors de la mise à jour du solde');
            return;
        }

    }
    

    async function fetchOverviewUsersData() {
        try {
            const response = await fetch(`${config.hosts.api}/admin/users`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include' // Inclure les cookies pour l'authentification
                }
            );
            console.log('Réponse du serveur:', response);
            if (!response.ok) {
                throw new Error('Erreur lors de la récupération des utilisateurs');
            }
            const usersData = await response.json();
            users.value = usersData;
            console.log('Données des utilisateurs récupérées :', usersData);
        } catch (error) {
            console.error('Erreur:', error);
            console.error('Données de réponse:', error.response ? error.response.data : 'Aucune donnée de réponse');
        }
    }

    async function handleManagePlayer(playerId) {
        console.log(`Gérer le joueur avec l'ID : ${playerId}`);
        const response = await fetch(`${config.hosts.api}/admin/userDetails/${playerId}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include', // Inclure les cookies pour l'authentification
            }
        );
        if (!response.ok) {
            console.error('Erreur lors de la récupération des détails du joueur');
            return;
        }
        const playerDetails = await response.json();
        selectedUser.value = playerDetails;
        console.log('Détails du joueur récupérés :', playerDetails);
    }

    function changePassword() {
        console.log('Changer le mot de passe du joueur avec l\'ID :', selectedUser.value.userId);
        // TODO : Implémenter la logique de changement de mot de passe
    }

    async function validateUsernameEdit(newUsername) {
        selectedUser.value.username = newUsername;
        console.log('Nouveau pseudo :', newUsername);
        const response = await fetch(`${config.hosts.api}/admin/user/pseudo`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                userId: selectedUser.value.userId,
                newPseudo: newUsername
            })
        });
        if (!response.ok) {
            console.error('Erreur lors de la mise à jour du pseudo');
            return;
        }
        console.log('Pseudo mis à jour avec succès');
    }

    async function validateEmailEdit(newEmail) {
        selectedUser.value.email = newEmail;
        console.log('Nouvel email :', newEmail);
        if (!isEmailValid(newEmail)) {
            console.warn('Format d\'email invalide');
            alert('Le format de l\'email est invalide. Veuillez entrer un email valide.');
            return;
        }
        const response = await fetch(`${config.hosts.api}/admin/user/email`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                userId: selectedUser.value.userId,
                newEmail: newEmail
            })
        });
        if (!response.ok) {
            console.error('Erreur lors de la mise à jour de l\'email');
            return;
        }
    }

    async function validateRoleEdit(event) {
        selectedUser.value.role = event.target.value;
        console.log('Nouveau rôle :', event.target.value);
        const response = await fetch(`${config.hosts.api}/admin/user/role`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                userId: selectedUser.value.userId,
                newRole: event.target.value
            })
        });
        if (!response.ok) {
            console.error('Erreur lors de la mise à jour du rôle');
            return;
        }
    }

    async function deleteUser() {
        console.log('Supprimer le joueur avec l\'ID :', selectedUser.value.userId);
        if (!confirm('Êtes-vous sûr de vouloir supprimer ce joueur ? Cette action est irréversible.')) {
            return;
        }
        const response = await fetch(`${config.hosts.api}/admin/user`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                userId: selectedUser.value.userId
            })
        });
        if (!response.ok) {
            console.error('Erreur lors de la suppression du joueur');
            return;
        }
    }

    function onNewPasswordChange() {
        if (newPassword.value !== newPasswordConfirm.value) {
            console.warn('Les mots de passe ne correspondent pas');
        } else {
            console.log('Les mots de passe correspondent');
        }   
    }

    function isEmailValid(email) {
        // Expression régulière pour valider le format de l'email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function isPasswordStrong(password) {
        // Vérifie que le mot de passe a au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial
        const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return passwordRegex.test(password);
    }


    function goToManageCollection() {
        if (selectedUser.value) {
            window.location.href = `/admin/collection/${selectedUser.value.userId}`;
        } else {
            alert('Veuillez sélectionner un joueur pour gérer sa collection.');
        }
    }

    onMounted(async () => {
        await fetchOverviewUsersData();
    });
</script>