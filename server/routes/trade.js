/**
 * @brief Route pour les échanges entre utilisateurs
 * @file server/routes/trade.js
 * @author Donatien VACHETTE, Elise FOUR
 */

const Database = require('better-sqlite3');

const {addCardToCollection, areFriends} = require('../fonctions-utile/request');

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
        WHERE userId = ? AND cardId IN (?, ?, ?) AND quantity > 0
    `);
    const ownershipResult = checkCardOwnership.get(userId, offeredCardId1, offeredCardId2, offeredCardId3);
    
    if (ownershipResult.count < 3) {
        return response.status(400).send({ error: 'Vous ne possédez pas toutes les cartes offertes.' });
    }
    // La demmande d'échange expire après 7 jours
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 7);

    // La date sera en timestamp en secondes pour la base de données

    const expirationTimestamp = Math.floor(expirationDate.getTime() / 1000);

    // Insérer la proposition d'échange dans la base de données
    const insertTradeQuery = db.prepare(`
        INSERT INTO traderequest (senderId, askedCardId, offeredCard1Id, offeredCard2Id, offeredCard3Id, expirationDate) VALUES (?, ?, ?, ?, ?, ?)
    `);
    insertTradeQuery.run(userId, askedCardId, offeredCardId1, offeredCardId2, offeredCardId3, expirationTimestamp);

    // Enlever les cartes offertes de la collection de l'utilisateur
    const removeCardsQuery = db.prepare(`
        UPDATE collection SET quantity = quantity - 1 
        WHERE userId = ? AND cardId = ? AND quantity > 0
    `);
    removeCardsQuery.run(userId, offeredCardId1);
    removeCardsQuery.run(userId, offeredCardId2);
    removeCardsQuery.run(userId, offeredCardId3);

    return response.status(200).send({ message: 'Proposition d\'échange envoyée avec succès.' });
}
/**
 * @brief Récupère les propositions d'échanges des amis de l'utilisateur
 * @returns Liste des propositions d'échanges
 * @returns response - resultat de la requête
 * @returns status 200 - Succès
 * @returns status 401 - Utilisateur non authentifié
 * @returns status 405 - Méthode non autorisée
 */
function getTrades(request, response) {
    // Vérification de la méthode HTTP
    if (request.method !== 'GET') {
        return response.status(405).send({ error: 'Méthode non autorisée. Utilisez GET.' });
    }
    // Vérification que l'utilisateur est connecté
    if (!request.session || !request.session.userId) {
        return response.status(401).send({ error: 'Utilisateur non authentifié.' });
    }

    const db = new Database('database.db');
    const userId = request.session.userId;

    // Récupérer les propositions d'échanges des amis de l'utilisateur

    const getTradesQuery = db.prepare(`
        SELECT tr.tradeRequestId, tr.senderId, tr.askedCardId, tr.offeredCard1Id, tr.offeredCard2Id, tr.offeredCard3Id, tr.expirationDate
        FROM traderequest tr
        JOIN friends f ON (tr.senderId = f.senderId AND f.receiverId = ?) OR (tr.senderId = f.receiverId AND f.senderId = ?) WHERE f.status = 'accepted'
    `);
    const trades = getTradesQuery.all(userId, userId);
    return response.status(200).send({ trades });
}


/*
*
*/
function acceptTrade(request, response) {
    if (request.method !== 'POST') {
        return response.status(405).send({ error: 'Méthode non autorisée. Utilisez POST.' });
    }
    if (!request.session || !request.session.userId) {
        return response.status(401).send({ error: 'Utilisateur non authentifié.' });
    }

    const tradeRequestId = request.body.tradeRequestId;
    const acceptedCardId = Number(request.body.acceptedCardId);

    if (!tradeRequestId || !acceptedCardId) {
        return response.status(400).send({ error: 'Paramètres manquants.' });
    }
    
    const db = new Database('database.db');
    const userId = request.session.userId;

    // Vérifier que l'échange existe
    const getTradeQuery = db.prepare(`
        SELECT * FROM traderequest WHERE tradeRequestId = ?
    `);

    const trade = getTradeQuery.get(tradeRequestId);

    if (!trade) {
        return response.status(404).send({ error: 'Proposition d\'échange non trouvée.' });
    }
    // Vérifier que l'utilisateur est ami avec l'expéditeur
    if (!areFriends(userId, trade.senderId)) {
        return response.status(403).send({ error: 'Vous n\'êtes pas ami avec l\'expéditeur de cette proposition d\'échange.' });
    }
    // Vérifier que l'échange n'a pas expiré
    const currentTimestamp = Math.floor(Date.now() / 1000);
    if (trade.expirationDate < currentTimestamp) {
        return response.status(400).send({ error: 'La proposition d\'échange a expiré.' });
    }
    // Vérifier que la carte acceptée est bien l'une des cartes offertes
    let offeredCards = [trade.offeredCard1Id, trade.offeredCard2Id, trade.offeredCard3Id]
    
    if (!offeredCards.includes(acceptedCardId)) {
        return response.status(400).send({ error: 'La carte acceptée n\'est pas parmi les cartes offertes.' });
    }
    // Vérifier que l'utilisateur possède la carte acceptée
    const checkCardOwnership = db.prepare(`
        SELECT COUNT(*) AS count FROM collection 
        WHERE userId = ? AND cardId = ? AND quantity > 0
    `);
    const ownershipResult = checkCardOwnership.get(userId, trade.askedCardId);

    if (ownershipResult.count < 1) {
        return response.status(400).send({ error: 'Vous ne possédez pas la carte demandée.' });
    }
    // Effectuer l'échange
    addCardToCollection(userId, acceptedCardId)
    addCardToCollection(trade.senderId, trade.askedCardId)
    offeredCards = offeredCards.filter(cardId => cardId !== acceptedCardId);
    addCardToCollection(trade.senderId, offeredCards[0])
    addCardToCollection(trade.senderId, offeredCards[1])

    // Retirer les cartes de la collection des utilisateurs
    const removeCardQuery = db.prepare(`
        UPDATE collection SET quantity = quantity - 1 
        WHERE userId = ? AND cardId = ? AND quantity > 0
    `);
    removeCardQuery.run(userId, trade.askedCardId);

    // Supprimer la proposition d'échange
    const deleteTradeQuery = db.prepare(`
        DELETE FROM traderequest WHERE tradeRequestId = ?
    `);
    deleteTradeQuery.run(tradeRequestId);

    return response.status(200).send({ message: 'Échange accepté avec succès.' });
}

function deleteTrade(request,response){
    // Vérification de la méthode HTTP
    if (request.method !== 'DELETE') {
        return response.status(405).send({ error: 'Méthode non autorisée. Utilisez DELETE.' });
    }
    // Vérification que l'utilisateur est connecté
    if (!request.session || !request.session.userId) {
        return response.status(401).send({ error: 'Utilisateur non authentifié.' });
    }

    if (!request.body || !request.body.tradeRequestId) {
        return response.status(400).send({ error: 'Paramètres manquants.' });
    }
    const tradeRequestId = request.body.tradeRequestId;
    const db = new Database('database.db');
    const userId = request.session.userId;

    // Vérifier que l'échange existe
    const getTradeQuery = db.prepare(`
        SELECT * FROM traderequest WHERE tradeRequestId = ?
    `);

    const trade = getTradeQuery.get(tradeRequestId);

    if (!trade) {
        return response.status(404).send({ error: 'Proposition d\'échange non trouvée.' });
    }

    // Vérifier que l'utilisateur est l'expéditeur de l'échange
    if (trade.senderId !== userId) {
        return response.status(403).send({ error: 'Vous n\'êtes pas l\'expéditeur de cette proposition d\'échange.' });
    }   


    //rendre les cartes

    addCardToCollection(userId, trade.offeredCard1Id);
    addCardToCollection(userId, trade.offeredCard2Id);
    addCardToCollection(userId, trade.offeredCard3Id);


    //supprime la demande d'echange

    const deleteTradeQuery = db.prepare(`
        DELETE FROM traderequest WHERE tradeRequestId = ?
    `);
    deleteTradeQuery.run(tradeRequestId);

    return response.status(200).send({ message: 'Proposition d\'échange supprimée avec succès.' });


}
module.exports = {
    proposeTrade,
    getTrades,
    acceptTrade,
    deleteTrade
};