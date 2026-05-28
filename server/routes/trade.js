/**
 * @brief Route pour les échanges entre utilisateurs
 * @file server/routes/trade.js
 * @author Donatien VACHETTE, Elise FOUR
 */

const Database = require('better-sqlite3');
const Card = require('../objects/card');
const User = require('../objects/user');

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
    return response
      .status(405)
      .send({ error: 'Méthode non autorisée. Utilisez POST.' });
  }
  // Vérification que l'utilisateur est connecté
  if (!request.session || !request.session.userId) {
    return response.status(401).send({ error: 'Utilisateur non authentifié.' });
  }
  const {
    askedCardId,
    offeredCardId1 = null,
    offeredCardId2 = null,
    offeredCardId3 = null,
  } = request.body;

  // Vérification des paramètres
  if (!askedCardId || (!offeredCardId1 && !offeredCardId2 && !offeredCardId3)) {
    return response.status(400).send({ error: 'Paramètres manquants.' });
  }

  const db = new Database('var/database.db');

  // Vérifier si l'utilisateur possède les cartes offertes
  const userId = request.session.userId;
  const checkCardOwnership = db.prepare(`
        SELECT COUNT(*) AS count FROM collection 
        WHERE userId = ? AND cardId IN (?, ?, ?) AND quantity > 1
    `);
  const ownershipResult = checkCardOwnership.get(
    userId,
    offeredCardId1,
    offeredCardId2,
    offeredCardId3,
  );

  if (ownershipResult.count < 1) {
    return response
      .status(400)
      .send({ error: 'Vous ne possédez pas toutes les cartes offertes.' });
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
  insertTradeQuery.run(
    userId,
    askedCardId,
    offeredCardId1 ?? null,
    offeredCardId2 ?? null,
    offeredCardId3 ?? null,
    expirationTimestamp,
  );

  // Enlever les cartes offertes de la collection de l'utilisateur
  const removeCardsQuery = db.prepare(`
        UPDATE collection SET quantity = quantity - 1 
        WHERE userId = ? AND cardId = ? AND quantity > 0
    `);
  if (offeredCardId1) removeCardsQuery.run(userId, offeredCardId1);
  if (offeredCardId2) removeCardsQuery.run(userId, offeredCardId2);
  if (offeredCardId3) removeCardsQuery.run(userId, offeredCardId3);

  console.log(
    `Utilisateur ${userId} a proposé un échange : demande la carte ${askedCardId} en offrant les cartes ${offeredCardId1}, ${offeredCardId2}, ${offeredCardId3}. Expire le ${expirationDate.toLocaleString()}`,
  );

  return response
    .status(200)
    .send({ message: "Proposition d'échange envoyée avec succès." });
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
    return response
      .status(405)
      .send({ error: 'Méthode non autorisée. Utilisez GET.' });
  }
  // Vérification que l'utilisateur est connecté
  if (!request.session || !request.session.userId) {
    return response.status(401).send({ error: 'Utilisateur non authentifié.' });
  }

  const db = new Database('var/database.db');
  const userId = request.session.userId;

  // Récupérer les propositions d'échanges des amis de l'utilisateur

  const getTradesQuery = db.prepare(`
        SELECT tr.tradeRequestId, tr.senderId, tr.askedCardId, tr.offeredCard1Id, tr.offeredCard2Id, tr.offeredCard3Id, tr.expirationDate
        FROM traderequest tr
        JOIN friends f ON (tr.senderId = f.senderId AND f.receiverId = ?) OR (tr.senderId = f.receiverId AND f.senderId = ?) WHERE f.status = 'accepted'
    `);
  const now = new Date();

  const trades = getTradesQuery.all(userId, userId);
  for (let trade of trades) {
    const sender = User.fromId(trade.senderId);
    trade.senderUsername = sender.username;
    trade.senderProfilePicture = sender.profilePicture;
    if (now > new Date(trade.expirationDate * 1000)) {
      // Échange expiré, rendre les cartes proposées à l'utilisateur
      if (trade.offeredCard1Id)
        sender.addCardToCollection(trade.offeredCard1Id, 1);
      if (trade.offeredCard2Id)
        sender.addCardToCollection(trade.offeredCard2Id, 1);
      if (trade.offeredCard3Id)
        sender.addCardToCollection(trade.offeredCard3Id, 1);
      // Supprimer l'échange de la base de données
      const deleteTradeQuery = db.prepare(
        'DELETE FROM traderequest WHERE tradeRequestId = ?',
      );
      deleteTradeQuery.run(trade.tradeRequestId);
    }
  }
  // Gerer les échanges expirés
  return response.status(200).send({ trades: trades });
}

/*
 *
 */
function acceptTrade(request, response) {
  if (request.method !== 'POST') {
    return response
      .status(405)
      .send({ error: 'Méthode non autorisée. Utilisez POST.' });
  }
  if (!request.session || !request.session.userId) {
    return response.status(401).send({ error: 'Utilisateur non authentifié.' });
  }

  const tradeRequestId = request.body.tradeRequestId;
  const acceptedCardId = Number(request.body.acceptedCardId);

  if (!tradeRequestId || !acceptedCardId) {
    return response.status(400).send({ error: 'Paramètres manquants.' });
  }

  const db = new Database('var/database.db');
  const userId = request.session.userId;
  const user = User.fromId(userId);
  // Vérifier que l'échange existe
  const getTradeQuery = db.prepare(`
        SELECT * FROM traderequest WHERE tradeRequestId = ?
    `);

  const trade = getTradeQuery.get(tradeRequestId);

  if (!trade) {
    return response
      .status(404)
      .send({ error: "Proposition d'échange non trouvée." });
  }
  // Vérifier que l'utilisateur est ami avec l'expéditeur
  if (!user.isFriendWith(trade.senderId)) {
    return response.status(403).send({
      error:
        "Vous n'êtes pas ami avec l'expéditeur de cette proposition d'échange.",
    });
  }
  // Vérifier que l'échange n'a pas expiré
  const currentTimestamp = Math.floor(Date.now() / 1000);
  if (trade.expirationDate < currentTimestamp) {
    return response
      .status(400)
      .send({ error: "La proposition d'échange a expiré." });
  }
  // Vérifier que la carte acceptée est bien l'une des cartes offertes
  let offeredCards = [
    trade.offeredCard1Id,
    trade.offeredCard2Id,
    trade.offeredCard3Id,
  ];

  if (!offeredCards.includes(acceptedCardId)) {
    return response.status(400).send({
      error: "La carte acceptée n'est pas parmi les cartes offertes.",
    });
  }
  // Vérifier que l'utilisateur possède la carte acceptée
  const checkCardOwnership = db.prepare(`
        SELECT quantity AS count FROM collection 
        WHERE userId = ? AND cardId = ? AND quantity > 0
    `);
  const ownershipResult = checkCardOwnership.get(userId, trade.askedCardId);

  if (ownershipResult.count < 2) {
    return response.status(400).send({
      error: "Vous ne possédez pas assez d'exemplaires de la carte demandée.",
    });
  }

  const sender = User.fromId(trade.senderId);
  // Effectuer l'échange
  user.addCardToCollection(acceptedCardId, 1);
  if (acceptedCardId) sender.addCardToCollection(trade.askedCardId, 1);
  offeredCards = offeredCards.filter((cardId) => cardId !== acceptedCardId);
  if (offeredCards[0]) sender.addCardToCollection(offeredCards[0], 1);
  if (offeredCards[1]) sender.addCardToCollection(offeredCards[1], 1);

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

function deleteTrade(request, response) {
  // Vérification de la méthode HTTP
  if (request.method !== 'DELETE') {
    return response
      .status(405)
      .send({ error: 'Méthode non autorisée. Utilisez DELETE.' });
  }
  // Vérification que l'utilisateur est connecté
  if (!request.session || !request.session.userId) {
    return response.status(401).send({ error: 'Utilisateur non authentifié.' });
  }

  if (!request.body || !request.body.tradeRequestId) {
    return response.status(400).send({ error: 'Paramètres manquants.' });
  }
  const tradeRequestId = request.body.tradeRequestId;
  const db = new Database('var/database.db');
  const userId = request.session.userId;
  const user = User.fromId(userId);
  // Vérifier que l'échange existe
  const getTradeQuery = db.prepare(`
        SELECT * FROM traderequest WHERE tradeRequestId = ?
    `);

  const trade = getTradeQuery.get(tradeRequestId);

  if (!trade) {
    return response
      .status(404)
      .send({ error: "Proposition d'échange non trouvée." });
  }

  // Vérifier que l'utilisateur est l'expéditeur de l'échange
  if (trade.senderId !== userId) {
    return response.status(403).send({
      error: "Vous n'êtes pas l'expéditeur de cette proposition d'échange.",
    });
  }

  //rendre les cartes

  if (trade.offeredCard1Id) user.addCardToCollection(trade.offeredCard1Id, 1);
  if (trade.offeredCard2Id) user.addCardToCollection(trade.offeredCard2Id, 1);
  if (trade.offeredCard3Id) user.addCardToCollection(trade.offeredCard3Id, 1);

  //supprime la demande d'echange

  const deleteTradeQuery = db.prepare(`
        DELETE FROM traderequest WHERE tradeRequestId = ?
    `);
  deleteTradeQuery.run(tradeRequestId);

  return response
    .status(200)
    .send({ message: "Proposition d'échange supprimée avec succès." });
}

function getSelfTradeRequests(request, response) {
  // Vérification de la méthode HTTP
  if (request.method !== 'GET') {
    return response
      .status(405)
      .send({ error: 'Méthode non autorisée. Utilisez GET.' });
  }
  // Vérification que l'utilisateur est connecté
  if (!request.session || !request.session.userId) {
    return response.status(401).send({ error: 'Utilisateur non authentifié.' });
  }

  const db = new Database('var/database.db');
  const userId = request.session.userId;

  // Récupérer les propositions d'échanges des amis de l'utilisateur

  const getTradesQuery = db.prepare(`
        SELECT tr.tradeRequestId, tr.senderId, tr.askedCardId, tr.offeredCard1Id, tr.offeredCard2Id, tr.offeredCard3Id, tr.expirationDate
        FROM traderequest tr WHERE tr.senderId = ?
    `);
  const trades = getTradesQuery.all(userId);
  // Enlever les échanges expirés
  const now = new Date();
  for (let trade of trades) {
    const sender = User.fromId(trade.senderId);
    if (now > new Date(trade.expirationDate * 1000)) {
      // Échange expiré, rendre les cartes proposées à l'utilisateur
      if (trade.offeredCard1Id)
        sender.addCardToCollection(trade.offeredCard1Id, 1);
      if (trade.offeredCard2Id)
        sender.addCardToCollection(trade.offeredCard2Id, 1);
      if (trade.offeredCard3Id)
        sender.addCardToCollection(trade.offeredCard3Id, 1);
      // Supprimer l'échange de la base de données
      const deleteTradeQuery = db.prepare(
        'DELETE FROM traderequest WHERE tradeRequestId = ?',
      );
      deleteTradeQuery.run(trade.tradeRequestId);
    }
  }
  trades.filter((trade) => now <= new Date(trade.expirationDate * 1000));
  return response.status(200).send({ trades: trades });
}

function getAllCard(request, response) {
  // Vérification de la méthode HTTP
  if (request.method !== 'GET') {
    return response
      .status(405)
      .send({ error: 'Méthode non autorisée. Utilisez GET.' });
  }
  // Vérification que l'utilisateur est connecté
  if (!request.session || !request.session.userId) {
    return response.status(401).send({ error: 'Utilisateur non authentifié.' });
  }

  // Récupérer les propositions d'échanges des amis de l'utilisateur

  const cartes = Card.getAll();

  return response.status(200).send({ cartes: cartes });
}
module.exports = {
  proposeTrade,
  getTrades,
  acceptTrade,
  deleteTrade,
  getSelfTradeRequests,
  getAllCard,
};
