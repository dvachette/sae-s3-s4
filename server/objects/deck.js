const Database = require("better-sqlite3");
const Member = require("./member.js");

class Deck {
    cards;
    pet;
    arena;

    constructor(cards, pet, arena) {
        this.cards = cards;
        this.pet = pet;
        this.arena = arena;
    }

    static fromUserId(userId) {
        const db = new Database('database.db');

        const getDeckQuery = db.prepare('SELECT card1Id, card2Id, card3Id, card4Id, card5Id, petId, arenaId FROM user WHERE userId = ?');
        const deckRow = getDeckQuery.get(userId);
        console.log(deckRow);
        if (!deckRow) {
            db.close();
            return null;
        }

        const Card = require('./card.js');

        const cards = [null, null, null, null, null];
        let card = null;
        const getCardLevelQuery = db.prepare('SELECT level FROM collection WHERE userId = ? AND cardId = ?');
        for (let i = 1; i <= 5; i++) {
            const cardId = deckRow[`card${i}id`];
            if (cardId) {
                const levelRow = getCardLevelQuery.get(userId, cardId);
                if (levelRow) {
                    card = Card.fromId(cardId, levelRow.level);
                } else {
                    card = Card.fromId(cardId, 1);
                }
            } else {
                card = Card.fromId(cardId, 1);
            }
            cards[i - 1] = card;
        }
        // 
        const pet = Card.fromId(deckRow.petId, 1);
        const arena = Card.fromId(deckRow.arenaId, 1);

        db.close();
        return new Deck(cards, pet, arena);
    }

    isValid() {
        return this.cards.length === 4;
    }

    replaceCardAt(index, newCard) {
        if (index < 0 || index >= this.cards.length) {
            throw new Error("Index out of bounds");
        }
        if (!(newCard instanceof Member)) {
            throw new Error("Seules des cartes membre peuvent être ajoutées a cet emplacement");
        }
        if (this.cards.includes(newCard)) {
            throw new Error("La carte est déjà présente dans le deck");
        }
        this.cards[index] = newCard;
    }
}

module.exports = Deck;