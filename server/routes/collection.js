/**
 * @file server/routes/collection.js
 * @author Elise FOUR, Donatien VACHETTE
 * @brief Routes pour la gestion de collection
 * @description Définit les routes pour visualiser sa collection
 */

// Modules NPM
const Database = require('better-sqlite3'); // Importation de better-sqlite3 pour interagir avec la base de données SQLite


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
    const db = new Database("database.db");

    const listeCardQuery = db.prepare("SELECT Card.*, Collection.level, Collection.quantity From Collection Join Card ON Collection.cardId=Card.cardId WHERE Collection.userId=? ;");
    const collection = listeCardQuery.all(userId);
    return response.status(200).send({message:"Collection bien récupéré",cards:collection});

    
}
module.exports={
    getCollection
};