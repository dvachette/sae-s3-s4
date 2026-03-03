const Database = require('better-sqlite3');

const Card = require('./card.js');
const User = require('./user.js');
class Trade {
    tradeId;
    senderId;
    receiverId;
    offeredCards;
    requestedCard;
    acceptedCard;
    expiration;



    constructor(tradeId, senderId, offeredCards, requestedCard, acceptedCard, expiration, receiverId) {
        this.tradeId = tradeId;
        this.senderId = senderId;
        this.offeredCards = offeredCards;
        this.requestedCard = requestedCard;
        this.acceptedCard = acceptedCard;
        this.expiration = expiration;
        this.receiverId = receiverId;
    }

    static fromRow(row) {
        return new Trade(
            row.tradeId, 
            row.senderId, 
            [
                Card.fromId(row.offeredCard1ID), 
                Card.fromId(row.offeredCard2ID), 
                Card.fromId(row.offeredCard3ID)
            ],
            row.requestedCardId,
            row.acceptedCardId,
            row.expirationDate,
            row.receiverId
        );
    }

    static fromId(id) {
        const db = new Database('var/database.db');

        const getTradeByIdQuery = db.prepare('SELECT * FROM traderequest WHERE tradeId = ?');
        const row = getTradeByIdQuery.get(id);

        db.close();

        if (row) {
            return Trade.fromRow(row);
        } else {
            return null;
        }
    }

    static fromUserId(userId) {
        const db = new Database('var/database.db');

        const getTradesByUserIdQuery = db.prepare('SELECT * FROM traderequest WHERE senderId = ?');
        const rows = getTradesByUserIdQuery.all(userId);

        db.close();

        const trades = [];
        for (const row of rows) {
            trades.push(Trade.fromRow(row));
        }
        return trades;
    }

    static acceptedByUserId(userId) {
        const db = new Database('var/database.db');

        const getAcceptedTradesByUserIdQuery = db.prepare('SELECT * FROM traderequest WHERE receiverId = ? AND acceptedCardId IS NOT NULL');
        const rows = getAcceptedTradesByUserIdQuery.all(userId);

        db.close();

        const trades = [];
        for (const row of rows) {
            trades.push(Trade.fromRow(row));
        }
        return trades;
    }

    static createTrade(asker, offeredCardsIds, askedCardId) {
        // Vérifier que l'utilisateur propose bien 3 cartes et qu'il les possède
        if (offeredCardsIds.length !== 3) {
            throw new Error('Vous devez proposer exactement 3 cartes pour un échange.');
        }

        for (const cardId of offeredCardsIds) {
            if (asker.getCardQuantity(cardId) <= 0) {
                throw new Error(`Vous ne possédez pas la carte avec l'ID ${cardId}.`);
            }
        }

        // Enlever les cartes proposées de la collection de l'utilisateur
        for (const cardId of offeredCardsIds) {
            asker.addCardToCollection(cardId, -1);
        }

        const db = new Database('var/database.db');

        const createTradeQuery = db.prepare(`
            INSERT INTO traderequest (senderId, offeredCard1ID, offeredCard2ID, offeredCard3ID, requestedCardId, expirationDate)
            VALUES (?, ?, ?, ?, ?, ?)
        `);
        
        const expirationDate = Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60); // 7 jours à partir de maintenant
        const result = createTradeQuery.run(
            asker.userId,
            offeredCardsIds[0],
            offeredCardsIds[1],
            offeredCardsIds[2],
            askedCardId,
            expirationDate
        );

        db.close();

        return Trade.fromId(result.lastInsertRowid);
    }

    cancel() {
        const db = new Database('var/database.db');
        const user = User.fromId(this.senderId);

        for (const cardId of this.offeredCards.map(card => card.cardId)) {
            // Rendre les cartes proposées à l'utilisateur
            user.addCardToCollection(cardId, 1);
        }
        const deleteTradeQuery = db.prepare('DELETE FROM traderequest WHERE tradeId = ?');
        deleteTradeQuery.run(this.tradeId);

        db.close();
    }

    accept(receiverId, acceptedCardId) {
        const db = new Database('var/database.db');
        const sender = User.fromId(this.senderId);
        const receiver = User.fromId(receiverId);
        
        // Vérifier que le receveur possède la carte demandée
        if (receiver.getCardQuantity(this.requestedCard) < 1) {
            throw new Error('Vous ne possédez pas la carte demandée pour cet échange.');
        }
        // Vérifier que la carte acceptée est bien l'une des cartes offertes
        const offeredCardIds = this.offeredCards.map(card => card.cardId);
        if (!offeredCardIds.includes(acceptedCardId)) {
            throw new Error('La carte acceptée n\'est pas parmi les cartes offertes.');
        }

        // Mettre à jour l'échange dans la base de données
        const acceptTradeQuery = db.prepare(`
            UPDATE traderequest SET receiverId = ?, acceptedCardId = ? WHERE tradeId = ?
        `);
        acceptTradeQuery.run(receiverId, acceptedCardId, this.tradeId);

        db.close();
        // Effectuer l'échange des cartes
        receiver.addCardToCollection(this.requestedCard, -1);
        sender.addCardToCollection(acceptedCardId, 1);
        // Rendre les cartes non acceptées au vendeur
        for (const cardId of offeredCardIds) {
            if (cardId !== acceptedCardId) {
                sender.addCardToCollection(cardId, 1);
            }
        }
    }
}

module.exports = Trade;