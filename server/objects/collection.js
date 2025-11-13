const dDatabase = require('better-sqlite3');

class Collection {
    cardId;
    level;
    quantity;

    constructor(cardId, level, quantity) {
        this.cardId = cardId;
        this.level = level;
        this.quantity = quantity;
    }
}

module.exports = Collection;