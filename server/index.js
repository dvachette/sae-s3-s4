const express = require('express'); // Importation du framework Express
const userRoutes = require('./routes/user.js'); // Importation des routes utilisateur
const cors = require('cors'); // Importation de l'outil CORS pour gérer les requêtes multi-origines

const PORT = process.env.PORT || 3000; // Définition du port d'écoute du serveur

const app = express(); // Création de l'application Express


app.use(cors()); // Activation de CORS pour toutes les routes
app.use(express.json()); // Outil pour parser le JSON dans les requêtes entrantes
app.use(express.urlencoded({ extended: true })); // Outil pour parser les données URL-encoded


// Routes pour les utilisateurs
app.post('/user', userRoutes.createAccount);



// Démarrer le serveur
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});