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
const tradeRoutes= require('./routes/trade.js');// Importation des routes trade

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
// Autorisation des requêtes CORS sur localhost:5173 (port par défaut de Vite)

app.use(cors({
    origin: 'http://localhost:5173', 
    credentials: true // Autoriser l'envoi de cookies avec les requêtes CORS
}));
app.use(express.json()); // Outil pour parser le JSON dans les requêtes entrantes
app.use(express.urlencoded({ extended: true })); // Outil pour parser les données URL-encoded


// Routes de l'application


// Routes pour la gestion des amis
app.post('/friends/request', friendsRoutes.requestFriend);
app.get('/friends/requests', friendsRoutes.getPendingRequests);
app.get('/friends/requests/me', friendsRoutes.getOutcomingRequests);
app.delete('/friends/request', friendsRoutes.removeFriendRequest);
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
app.post('/collection/upgrade',collectionRoutes.upgradeCard);

// Routes pour les échanges
app.post('/trade/request', tradeRoutes.proposeTrade);
app.get('/trade/requests', tradeRoutes.getTrades);
app.get('/trade/requests/me', tradeRoutes.getSelfTradeRequests);
app.delete('/trade/request', tradeRoutes.deleteTrade);
app.post('/trade/accept', tradeRoutes.acceptTrade);

// Démarrer le serveur sur le port spécifié (Environnement de developpement, pas en production)
app.listen(PORT, () => {
    console.log('ATTENTION, SERVEUR EN MODE DÉVELOPPEMENT, NE PAS UTILISER EN PRODUCTION !');
    console.log(`Server is running on port ${PORT}`);
});