/**
 * @file server/routes/booster.js
 * @author Elise FOUR, Donatien VACHETTE
 * @brief Routes pour la gestion des boosters.
 * @description Définit les routes pour l'achat et la récupération des boosters.
 */

const Database = require('better-sqlite3'); // Importation de la bibliothèque SQLite3

/**
 * @brief Achète un booster pour l'utilisateur connecté.
 * @returns response - Résultat de la requête.
 * @returns status 200 - Booster acheté avec succès.
 * @returns status 401 - Utilisateur non authentifié.
 * @returns status 405 - Méthode non autorisée.
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

    const db = new Database('database.db');

    // Récupérer toutes les cartes disponibles
    const getAllCardsQuery = db.prepare('SELECT cardId, weight FROM card');
    const allCards = getAllCardsQuery.all();

    // Faire un tirage par poids pour obtenir 5 cartes
    const drawnCards = [];
    const totalWeight = allCards.reduce((sum, card) => sum + card.weight, 0); // Fait la somme des poids

    for (let i = 0; i < 5; i++) { // Tirer 5 cartes
        let randomNum = Math.random() * totalWeight; // Nombre aléatoire entre 0 et le poids total
        for (const card of allCards) { // Parcourir les cartes jusqu'a atteindre le nombre aléatoire
            randomNum -= card.weight;
            if (randomNum <= 0) {
                drawnCards.push(card.cardId); // Ajouter la carte tirée
                break;
            }
        }
    }

    // Insérer les cartes tirées dans la collection de l'utilisateur
    for (const cardId of drawnCards) {
        // Vérifier si l'utilisateur possède déjà la carte
        const checkCardQuery = db.prepare('SELECT * FROM collection WHERE userId = ? AND cardId = ?');
        const existingCard = checkCardQuery.get(userId, cardId);

        if (existingCard) {
            // Si la carte existe déjà, incrémenter la quantité
            const updateCardQuantity = db.prepare('UPDATE collection SET quantity = quantity + 1 WHERE userId = ? AND cardId = ?');
            updateCardQuantity.run(userId, cardId);
        } else {
            // Sinon, insérer la nouvelle carte avec une quantité de 1
            const insertNewCard = db.prepare('INSERT INTO collection (userId, cardId, level, quantity) VALUES (?, ?, 1, 1)');
            insertNewCard.run(userId, cardId);
        }
    }

    // Ajouter un nombre de clé à l'utilisateur
    const addKeyQuery = db.prepare('UPDATE user SET balance = balance + 5 WHERE userid = ?');
    addKeyQuery.run(userId);

    // Mettre à jour la date de dernier ouverture de booster (en timestamp epoch en secondes)
    const updateLastBoosterOppeningQuery = db.prepare('UPDATE user SET lastBoosterOppening = ? WHERE userid = ?');
    updateLastBoosterOppeningQuery.run(Math.floor(Date.now() / 1000), userId);

    // Retourner le détail des cartes tirées
    const getCardDetailsQuery = db.prepare('SELECT * FROM card WHERE cardid = ?');
    const drawnCardDetails = drawnCards.map(cardId => getCardDetailsQuery.get(cardId));

    return response.status(200).send({ message: 'Booster ouvert avec succès', cards: drawnCardDetails , keys: 5});
}

module.exports = {
    openBooster
};