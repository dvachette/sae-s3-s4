const Card = require('./card.js');

class Trade {
    tradeId;
    askerId;
    receiverId;
    offeredCards;
    requestedCard;
    acceptedCard;
    expiration;



    constructor(tradeId, askerId, offeredCards, requestedCard, acceptedCard, expiration, receiverId) {
        this.tradeId = tradeId;
        this.askerId = askerId;
        this.offeredCards = offeredCards;
        this.requestedCard = requestedCard;
        this.acceptedCard = acceptedCard;
        this.expiration = expiration;
        this.receiverId = receiverId;
    }

    static fromRow(row) {
        return new Trade(
            row.tradeId, 
            row.askerId, 
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
        const db = new Database('database.db');

        const getTradeByIdQuery = db.prepare('SELECT * FROM trade WHERE tradeId = ?');
        const row = getTradeByIdQuery.get(id);

        db.close();

        if (row) {
            return Trade.fromRow(row);
        } else {
            return null;
        }
    }

    static fromUserId(userId) {
        const db = new Database('database.db');

        const getTradesByUserIdQuery = db.prepare('SELECT * FROM trade WHERE askerId = ?');
        const rows = getTradesByUserIdQuery.all(userId);

        db.close();

        const trades = [];
        for (const row of rows) {
            trades.push(Trade.fromRow(row));
        }
        return trades;
    }

    static acceptedByUserId(userId) {
        const db = new Database('database.db');

        const getAcceptedTradesByUserIdQuery = db.prepare('SELECT * FROM trade WHERE receiverId = ? AND acceptedCardId IS NOT NULL');
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
            if (!asker.getCardQuantity(cardId)) {
                throw new Error(`Vous ne possédez pas la carte avec l'ID ${cardId}.`);
            }
        }


        const db = new Database('database.db');

        const createTradeQuery = db.prepare(`
            INSERT INTO trade (askerId, offeredCard1ID, offeredCard2ID, offeredCard3ID, requestedCardId, expirationDate)
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


}

module.exports = Trade;