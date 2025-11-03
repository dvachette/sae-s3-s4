/** 
    @file : server/index.js
    @author : Elise FOUR, Donatien VACHETTE
    @brief : Point d'entrée du serveur Express. 
    @description : Configure les outils intermédiaires, définit les routes et démarre le serveur.
*/

// Modules NPM
const express = require('express'); // Importation du framework Express
const session = require('express-session'); // Importation de l'outil de gestion de sessions
const cors = require('cors'); // Importation de l'outil CORS pour gérer les requêtes multi-origines
// Modules internes
const friendsRoutes = require('./routes/friends.js'); // Importation des routes d'amis
const userRoutes = require('./routes/user.js'); // Importation des routes utilisateur
const boosterRoutes = require('./routes/booster.js'); // Importation des routes booster
const collectionRoutes= require('./routes/collection.js');// Importation des routes collection

const PORT = process.env.PORT || 3000; // Définition du port d'écoute du serveur

const app = express(); // Création de l'application Express

// Configuration de l'application Express
app.use(
    session({
        // TODO: CHANGER LA CLÉ SECRÈTE AVANT DE METTRE EN PRODUCTION 
        secret: 'votre_secret_de_session', // Clé secrète pour signer le cookie de session
        resave: false, // Ne pas sauvegarder la session si elle n'a pas été modifiée
        saveUninitialized: true, // Sauvegarder les sessions non initialisées
        cookie: { 
            secure: false,
            maxAge: 10800000
        } // Utiliser des cookies non sécurisés (HTTP)
    }

))
app.use(cors()); // Activation de CORS pour toutes les routes
app.use(express.json()); // Outil pour parser le JSON dans les requêtes entrantes
app.use(express.urlencoded({ extended: true })); // Outil pour parser les données URL-encoded


// Routes de l'application


// Routes pour la gestion des amis
app.post('/friends/request', friendsRoutes.requestFriend);
app.get('/friends/requests', friendsRoutes.getPendingRequests);
app.post('/friends/accept', friendsRoutes.acceptFriendRequest);
app.post('/friends/reject', friendsRoutes.rejectFriendRequest);
app.get('/friends', friendsRoutes.getFriendsList);
app.delete('/friends', friendsRoutes.removeFriend);


// Routes pour les utilisateurs
app.delete('/user', userRoutes.deleteAccount);
app.get('/user', userRoutes.getUserData);
app.post('/user', userRoutes.createAccount);
app.put('/user', userRoutes.editAccount);
app.post('/login', userRoutes.login);
app.get('/logout', userRoutes.logout);

// Routes pour les boosters
app.post('/booster/open', boosterRoutes.openBooster);

// Routes pour la collection
app.get('/collection',collectionRoutes.getCollection);


// Démarrer le serveur sur le port spécifié (Environnement de developpement, pas en production)
app.listen(PORT, () => {
    console.log('ATTENTION, SERVEUR EN MODE DÉVELOPPEMENT, NE PAS UTILISER EN PRODUCTION !');
    console.log(`Server is running on port ${PORT}`);
});