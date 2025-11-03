/**
 * @brief Route pour les échanges entre utilisateurs
 * @file server/routes/trade.js
 * @author Donatien VACHETTE
 */

const Database = require('better-sqlite3');


/**
 * 
 * @param askedCardId L'ID de la carte demandée
 * @param offeredCardId1 L'ID d'une carte offerte
 * @param offeredCardId2 L'ID d'une autre carte offerte
 * @param offeredCardId3 L'ID d'une autre carte offerte
 */
function proposeTrade(request, response) {
    // Vérification de la méthode HTTP
    if (request.method !== 'POST') {
        return response.status(405).send({ error: 'Méthode non autorisée. Utilisez POST.' });
    }
    // Vérification que l'utilisateur est connecté
    if (!request.session || !request.session.userId) {
        return response.status(401).send({ error: 'Utilisateur non authentifié.' });
    }

    const { askedCardId, offeredCardId1, offeredCardId2, offeredCardId3 } = request.body;

    // Vérification des paramètres
    if (!askedCardId || !offeredCardId1 || !offeredCardId2 || !offeredCardId3) {
        return response.status(400).send({ error: 'Paramètres manquants.' });
    }

    const db = new Database('database.db');
    
    // Vérifier si l'utilisateur possède les cartes offertes
    const userId = request.session.userId;
    const checkCardOwnership = db.prepare(`
        SELECT COUNT(*) AS count FROM collection 
        WHERE user_id = ? AND card_id IN (?, ?, ?) AND quantity > 0
    `);
    const ownershipResult = checkCardOwnership.get(userId, offeredCardId1, offeredCardId2, offeredCardId3);
    
    if (ownershipResult.count < 3) {
        return response.status(400).send({ error: 'Vous ne possédez pas toutes les cartes offertes.' });
    }

    // Insérer la proposition d'échange dans la base de données
    const insertTradeQuery = db.prepare(`
        INSERT INTO traderequest (senderId, askedCardId, offeredCardI1d, offeredCard2Id, offeredCard3Id) VALUES (?, ?, ?, ?, ?)
    `);
    insertTradeQuery.run(userId, askedCardId, offeredCardId1, offeredCardId2, offeredCardId3);

    // Enlever les cartes offertes de la collection de l'utilisateur
    const removeCardsQuery = db.prepare(`
        UPDATE collection SET quantity = quantity - 1 
        WHERE user_id = ? AND card_id = ? AND quantity > 0
    `);
    removeCardsQuery.run(userId, offeredCardId1);
    removeCardsQuery.run(userId, offeredCardId2);
    removeCardsQuery.run(userId, offeredCardId3);

    return response.status(200).send({ message: 'Proposition d\'échange envoyée avec succès.' });
}