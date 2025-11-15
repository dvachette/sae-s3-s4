/**
 * @file server/routes/collection.js
 * @author Elise FOUR, Donatien VACHETTE
 * @brief Routes pour la gestion de collection
 * @description Définit les routes pour visualiser sa collection
 */

// Modules NPM
const Database = require('better-sqlite3'); // Importation de better-sqlite3 pour interagir avec la base de données SQLite

// Modules internes
const User = require('../objects/user.js'); // Importation de l'objet User
const Card = require('../objects/card.js'); // Importation de l'objet Card
const Arena = require('../objects/arena.js'); // Importation de l'objet Arena
const Member = require('../objects/member.js'); // Importation de l'objet Member
const Pet = require('../objects/pet.js'); // Importation de l'objet Pet

function getCollection(request, response) {
        // Vérifier que la méthode est GET
    if (request.method !== 'GET') {
        return response.status(405).send({ error: 'Methode non autorisée' });
    }
    // Vérifier que l'utilisateur est authentifié
    if (!request.session.userId) {
        return response.status(401).send({ error: 'Utilisateur non authentifié' });
    }

    const userId = request.session.userId;
    const user = User.fromId(userId);

    const collection = user.collection;
    return response.status(200).send({message:"Collection bien récupéré",cards:collection});

    
}

/**
 * @brief Permet d'améliorer une carte au niveau supérieur
 * @returns response - Résultat de la requête.
 * @returns status 200 - Carte améliorée avec succès.
 * @returns status 401 - Utilisateur non authentifié.
 * @returns status 405 - Méthode non autorisée.
 * @returns status 400 - Erreur lors de l'amélioration de la carte.
 */
function upgradeCard(request, response) {
    // Forcer l'utilisation de la methode POST
    if (request.method !== 'POST') {
        return response.status(405).send({ error: 'Methode non autorisée' });
    }

    // Vérifier que l'utilisateur est authentifié
    if (!request.session.userId) {
        return response.status(401).send({ error: 'Utilisateur non authentifié' });
    }

    const userId = request.session.userId;
    const { cardId } = request.body;

    console.log(`Demande d'amélioration de la carte ${cardId} par l'utilisateur ${userId}`);
    const user = User.fromId(userId);

    try {
        user.upgradeCard(cardId);
    } catch (error) {
        return response.status(400).send({ error: error.message });
    }

    return response.status(200).send({ message: 'Carte améliorée avec succès', userCollection: user.collection });

}


module.exports={
    getCollection,
    upgradeCard
};