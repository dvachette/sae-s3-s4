const dDatabase = require('better-sqlite3');
const Card = require('./card.js');
class Collection {
    card;
    quantity;

    constructor(cardId, level, quantity) {
        this.card = Card.fromId(cardId, level);
        if (this.card._class === 'pet') {
            console.log("Init collection - Pet : ", this.card);
        }
        this.quantity = quantity;
    }
}

module.exports = Collection;