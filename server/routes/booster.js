/**
 * @file server/routes/booster.js
 * @author Elise FOUR, Donatien VACHETTE
 * @brief Routes pour la gestion des boosters.
 * @description Définit les routes pour l'achat et la récupération des boosters.
 */

const Database = require('better-sqlite3'); // Importation de la bibliothèque SQLite3
const User = require('../objects/user.js'); // Importation de l'objet User
const Card = require('../objects/card.js'); // Importation de l'objet Card
/**
 * @brief Achète un booster pour l'utilisateur connecté.
 * @returns response - Résultat de la requête.
 * @returns status 200 - Booster acheté avec succès.
 * @returns status 401 - Utilisateur non authentifié.
 * @returns status 405 - Méthode non autorisée.
 * @returns status 500 - Erreur lors de l'ouverture du booster.
 */
function openBooster(request, response) {
    // Forcer l'utilisation de la methode POST
    if (request.method !== 'POST') {
        return response.status(405).send({ error: 'Methode non autorisée' });
    }

    // Vérifier que l'utilisateur est authentifié
    if (!request.session.userId) {
        return response.status(401).send({ error: 'Utilisateur non authentifié' });
    }



    const userId = request.session.userId;

    const user = User.fromId(userId);


    // Faire un tirage par poids pour obtenir 5 cartes
    let drawnCards = [];

    if (user.lastBoosterOpening === null) {
        drawnCards = Card.drawUniqueRandomCards(5);
    } else if (user.delayBeforeNextBooster() <= 0) {
        drawnCards = Card.drawRandomCards(5);
        console.log("Drawn cards:", drawnCards);
    } else { // Trop tôt pour ouvrir un nouveau booster, renvoyer un to many request (429)
        return response.status(429).send({ error: 'Booster non disponible pour le moment', delay: user.delayBeforeNextBooster() });
    }
    if (drawnCards.length === 0) {
        return response.status(403).send({ error: 'Trop de cartes demandées' });
    }
    for (const card of drawnCards) {
        user.addCardToCollection(card.cardId, 1);
    }

    user.addKeys(5);

    // Mettre à jour la date de dernier ouverture de booster (en timestamp epoch en secondes)
    user.resetBoosterOpeningDate();


    return response.status(200).send({ message: 'Booster ouvert avec succès', cards: drawnCards , keys: 5});
}

module.exports = {
    openBooster
};