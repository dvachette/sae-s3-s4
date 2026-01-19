const Database = require("better-sqlite3");
const Member = require("./member.js");
const Card = require("./card.js");

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
        const row = getDeckQuery.get(userId);
        
        const cards = [];
        for (let i = 1; i <= 5; i++) {
            if (row[`card${i}Id`]) {
                const card = Card.fromId(row[`card${i}Id`]);
                cards.push(card);
            } else {
                cards.push(null);
            }
        }

        let pet = null;
        if (row.petId) {
            pet = Card.fromId(row.petId);
        }

        let arena = null;
        if (row.arenaId) {
            arena = Card.fromId(row.arenaId);
        }

        db.close();

        return new Deck(cards, pet, arena);
    }




    isValid() {
        return this.cards.filter(card => card !== null).length === 5
    }

    replaceCardAt(index, newCard) {
        if (index === 'pet') {
            this.replacePet(newCard);
            return;
        } else if (index === 'arena') {
            this.replaceArena(newCard);
            return;
        }
        if (index < 0 || index >= this.cards.length) {
            throw new Error("Index out of bounds");
        }
        if (!(newCard instanceof Member)) {
            throw new Error("Seules des cartes membre peuvent être ajoutées a cet emplacement");
        }
        if (this.cards.filter(card => card && card.cardId === newCard.cardId).length > 0) {
            throw new Error("La carte est déjà présente dans le deck");
        }
        this.cards[index] = newCard;
    }

    replaceArena(newArena) {
        if (newArena._class !== 'arena') {
            throw new Error("La carte fournie n'est pas une arène");
        }
        this.arena = newArena;
    }

    replacePet(newPet) {
        if (newPet._class !== 'pet') {
            throw new Error("La carte fournie n'est pas un familier");
        }
        this.pet = newPet;
    }

    saveToDatabase(userId) {
        const db = new Database('database.db');

        const updateDeckQuery = db.prepare('UPDATE user SET card1Id = ?, card2Id = ?, card3Id = ?, card4Id = ?, card5Id = ?, petId = ?, arenaId = ? WHERE userId = ?');
        updateDeckQuery.run(
            this.cards[0] ? this.cards[0].cardId : null,
            this.cards[1] ? this.cards[1].cardId : null,
            this.cards[2] ? this.cards[2].cardId : null,
            this.cards[3] ? this.cards[3].cardId : null,
            this.cards[4] ? this.cards[4].cardId : null,
            this.pet ? this.pet.cardId : null,
            this.arena ? this.arena.cardId : null,
            userId
        );

        db.close();
    }
}

module.exports = Deck;