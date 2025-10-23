const express = require('express'); // Importation du framework Express

const cors = require('cors'); // Importation de l'outil CORS pour gérer les requêtes multi-origines

const PORT = process.env.PORT || 3000; // Définition du port d'écoute du serveur

const app = express(); // Création de l'application Express

app.use(cors()); // Activation de CORS pour toutes les routes

// Routes pour les utilisateurs




// Démarrer le serveur
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});