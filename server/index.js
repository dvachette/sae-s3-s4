/** 
    @file : server/index.js
    @author : Elise FOUR, Donatien VACHETTE
    @brief : Point d'entrée du serveur Express. 
    @description : Configure les outils intermédiaires, définit les routes et démarre le serveur.
*/

// Modules NPM
const http = require('http'); // Importation du module HTTP natif de Node.js
const express = require('express'); // Importation du framework Express
const session = require('express-session'); // Importation de l'outil de gestion de sessions
const cors = require('cors'); // Importation de l'outil CORS pour gérer les requêtes multi-origines
const ws = require('ws'); // Importation du module WebSocket
const cookie = require('cookie');
const signature = require('cookie-signature');
const dotenv = require('dotenv'); // Importation du module dotenv pour gérer les variables d'environnement

// Modules internes
const friendsRoutes = require('./routes/friends.js'); // Importation des routes d'amis
const userRoutes = require('./routes/user.js'); // Importation des routes utilisateur
const boosterRoutes = require('./routes/booster.js'); // Importation des routes booster
const collectionRoutes= require('./routes/collection.js');// Importation des routes collection
const tradeRoutes= require('./routes/trade.js');// Importation des routes trade
const deckRoutes= require('./routes/deck.js');// Importation des routes deck
const duelUtils = require('./socket/duel.js'); // Importation des utilitaires de duel
const shopRoutes = require('./routes/shop.js'); // Importation des routes shop
const adminRoutes = require('./routes/admin.js'); // Importation des routes admin
dotenv.config(); // Chargement des variables d'environnement depuis le fichier .env

const PORT = process.env.PORT || 3000; // Définition du port d'écoute du serveur

const app = express(); // Création de l'application Express
const server = http.createServer(app); // Création du serveur HTTP avec l'application Express
// Configuration de l'application Express
const SESSION_KEY = process.env.SESSION_KEY

app.use(
    session({
        secret: SESSION_KEY, // Clé secrète pour signer le cookie de session
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
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173', // Autoriser les requêtes provenant de cette origine
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
app.get('/user/name', userRoutes.getUserNameById);
app.post('/login', userRoutes.login);
app.get('/logout', userRoutes.logout);
app.post('/user/search', userRoutes.searchUsers);

// Routes pour les boosters
app.post('/booster/open', boosterRoutes.openBooster);
app.post('/booster/buy', boosterRoutes.buyBooster);

// Routes pour la collection
app.get('/collection',collectionRoutes.getCollection);
app.post('/collection/upgrade',collectionRoutes.upgradeCard);

// Routes pour les échanges
app.post('/trade/request', tradeRoutes.proposeTrade);
app.get('/trade/requests', tradeRoutes.getTrades);
app.get('/trade/requests/me', tradeRoutes.getSelfTradeRequests);
app.delete('/trade/request', tradeRoutes.deleteTrade);
app.post('/trade/accept', tradeRoutes.acceptTrade);
app.get('/trade/cards', tradeRoutes.getAllCard);


app.get("/deck", deckRoutes.getDeck);
app.post("/deck/replaceCard", deckRoutes.replaceCardInDeck);

// Routes pour la boutique
app.get('/shop', shopRoutes.getShop);
app.post('/shop/buy', shopRoutes.buyOffer);


// * ROUTES ADMIN

app.get('/admin/users', adminRoutes.adminGetAllUsers);
app.get('/admin/isAdmin', adminRoutes.isAdmin);
// Use /
app.get('/admin/userDetails/:userId', adminRoutes.adminGetUserDetails);
app.put('/admin/user/pseudo', adminRoutes.adminUpdatePseudo);
app.put('/admin/user/password', adminRoutes.adminUpdatePassword);
app.put('/admin/user/role', adminRoutes.adminUpdateRole);
app.put('/admin/user/email', adminRoutes.adminUpdateEmail);
app.delete('/admin/user', adminRoutes.adminDeleteUser);
app.get('/admin/cards', adminRoutes.adminGetAllCards);
app.put('/admin/user/collection', adminRoutes.adminSetUserCollection);
// Démarrer le serveur sur le port spécifié (Environnement de developpement, pas en production)

const wss = new ws.WebSocketServer({server}); // Serveur WebSocket sur le port 8080
// Gestion des connexions WebSocket

wss.on('connection', duelUtils.receiveSocket); // Utilisation de la fonction de gestion des connexions de duel   

server.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});