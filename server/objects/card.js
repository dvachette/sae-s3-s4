const Database = require('better-sqlite3');

class Card {
    cardId;
    name;
    _class;
    mandat;
    pictureUrl;
    description;
    weight;

    constructor(cardId, name, _class, mandat, pictureUrl, description, weight) {
        this.cardId = cardId;
        this.name = name;
        this._class = _class;
        this.mandat = mandat;
        this.pictureUrl = pictureUrl;
        this.description = description;
        this.weight = weight;
    }

    static fromRow(row) {
        return new Card(row.cardId, row.name, row.class, row.mandat, row.pictureUrl, row.description, row.weight);
    }

    static fromId(id) {
        const db = new Database('database.db');

        const getCardByIdQuery = db.prepare('SELECT * FROM card WHERE cardId = ?');
        const row = getCardByIdQuery.get(id);

        db.close();

        if (row) {
            return Card.fromRow(row);
        } else {
            return null;
        }
    }

    static getAll() {
        const db = new Database('database.db');

        const getAllCardsQuery = db.prepare('SELECT * FROM card');
        const rows = getAllCardsQuery.all();

        db.close();

        const cards = [];
        for (const row of rows) {
            cards.push(Card.fromRow(row));
        }
        return cards;
    }

    static getRandomWeightedCard(cards) {
        let totalWeight = cards.reduce((sum, card) => sum + card.weight, 0);

        // Si la plage de poids est nulle (toutes les cartes ont un poids de 0), on évite la division par zéro
        if (totalWeight === 0) {
            return null; // Ou gérer cela d'une autre manière appropriée
        }

        let randomNum = Math.random() * totalWeight;
        for (const card of cards) {
            if (randomNum < card.weight) {
                return card;
            }
            randomNum -= card.weight;
        }
        return null; // Devrait théoriquement ne jamais arriver
    }

    static drawRandomCards(nb) {
        const allCards = Card.getAll();
        const drawnCards = [];
        for (let i = 0; i < nb; i++) {
            const drawnCard = Card.getRandomWeightedCard(allCards);
            if (drawnCard) {
                drawnCards.push(drawnCard);
            }
        }
        return drawnCards;
    }

    static drawUniqueRandomCards(nb) {
        const allCards = Card.getAll();
        if (allCards.length < nb) {
            return []; // Pas assez de cartes pour tirer nb cartes uniques
        }

        const drawnCards = [];
        const availableCards = [...allCards]; // Copier toutes les cartes disponibles

        for (let i = 0; i < nb; i++) {
            const drawnCard = Card.getRandomWeightedCard(availableCards);
            if (drawnCard) {
                drawnCards.push(drawnCard);
                // Retirer la carte tirée des cartes disponibles
                const index = availableCards.indexOf(drawnCard);
                if (index > -1) {
                    availableCards.splice(index, 1);
                }
            }
        }
        return drawnCards;
    }   
}
module.exports = Card;