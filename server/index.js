const express = require('express'); // Importation du framework Express
const session = require('express-session'); // Importation de l'outil de gestion de sessions

const userRoutes = require('./routes/user.js'); // Importation des routes utilisateur
const cors = require('cors'); // Importation de l'outil CORS pour gérer les requêtes multi-origines

const PORT = process.env.PORT || 3000; // Définition du port d'écoute du serveur

const app = express(); // Création de l'application Express

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


// Routes pour les utilisateurs
app.post('/user', userRoutes.createAccount);
app.post('/login', userRoutes.login);
app.get('/logout', userRoutes.logout);
app.put('/user', userRoutes.editAccount);


// Démarrer le serveur
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});