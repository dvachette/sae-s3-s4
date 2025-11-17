const Database = require('better-sqlite3');

class Card {
    cardId;
    name;
    _class;
    mandat;
    pictureUrl;
    description;
    weight;
    borderPictureUrl;
    level;

    
    constructor(cardId, name, _class, mandat, pictureUrl, description, weight, level, borderPictureUrl) {
        this.cardId = cardId;
        this.name = name;
        this._class = _class;
        this.mandat = mandat;
        this.pictureUrl = pictureUrl;
        this.description = description;
        this.weight = weight;
        this.level = level;
        this.borderPictureUrl = borderPictureUrl;
    }

    static fromId(id, level = 1) {
        const Pet = require('./pet.js');
        const Member = require('./member.js');
        const Arena = require('./arena.js');
        const Attack = require('./attacks.js');


        const db = new Database('database.db');

        const getCardByIdQuery = db.prepare('SELECT * FROM card WHERE cardId = ?');
        const row = getCardByIdQuery.get(id);

        if (!row) {
            db.close();
            return null;
        }

        const getLevelQuery = db.prepare('SELECT * FROM level WHERE cardId = ? AND level = ?');
        const levelRow = getLevelQuery.get(id, level);

        if (!levelRow) {
            db.close();
            return null;
        }
        let card = null;
        switch (row.class) {
            case 'pet':
                const getPetByIdQuery = db.prepare('SELECT * FROM pet WHERE petId = ?');
                const petRow = getPetByIdQuery.get(id);
                if (petRow) {
                    card = new Pet(row.cardId, row.name, row.mandat, row.picture, row.description, row.weight, level, levelRow.borderPicture, JSON.parse(petRow.skill), petRow.skillText);
                }
                break;
            case 'member':
                const getMemberByIdQuery = db.prepare('SELECT * FROM member WHERE cardId = ?');
                const memberRow = getMemberByIdQuery.get(id);

                if (!memberRow) {
                    db.close();
                    return null;
                }

                db.close();
                const name = row.name;
                const mandat = row.mandat;
                const picture = row.picture;
                const description = row.description;
                const weight = row.weight;
                const borderPicture = levelRow.borderPicture;
                const hitpoints = levelRow.hitpoints;
                const attackMultiplier = levelRow.multiplier;
            
                const attack1Name = memberRow.attack1Name;
                const attack1Cost = memberRow.attack1Cost;
                const attack1Description = memberRow.attack1Description;
                const attack1Effects = JSON.parse(memberRow.attack1Effects);

                const attack2Name = memberRow.attack2Name;
                const attack2Cost = memberRow.attack2Cost;
                const attack2Description = memberRow.attack2Description;
                const attack2Effects = JSON.parse(memberRow.attack2Effects);
            
                const attacks = []
                attacks.push(new Attack(attack1Effects, attack1Name, attack1Cost, attack1Description));
                if (attack2Name) {
                    attacks.push(new Attack(attack2Effects, attack2Name, attack2Cost, attack2Description));
                }
                card = new Member(id, name, mandat, picture, description, weight, level, borderPicture, hitpoints, attackMultiplier, attacks);
                break;
            case 'arena':
                const getImageQuery = db.prepare('SELECT backgroundPictureUrl FROM Arena WHERE cardId= ?');
                const backgroundPictureUrlRow =getImageQuery.get(row.cardId);
                card = new Arena(row.cardId, row.name, row.mandat, row.picture, row.description, row.weight, level, levelRow.borderPicture, backgroundPictureUrlRow.backgroundPictureUrl);
                break;
            default:
                db.close();
                return null;
        }
        return card;
    }

    static getAll() {
        const db = new Database('database.db');

        const getAllCardsQuery = db.prepare('SELECT * FROM card');
        const rows = getAllCardsQuery.all();

        db.close();

        const cards = [];
        for (const row of rows) {
            cards.push(Card.fromId(row.cardId, 1));
        }
        return cards;
    }

    static getRandomWeightedCard(cards) {
        let totalWeight = 0;
        for (const card of cards) {
            totalWeight += card.weight;
        }
        console.log("Total weight:", totalWeight);
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
            console.log("Drawn card:", drawnCard);
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