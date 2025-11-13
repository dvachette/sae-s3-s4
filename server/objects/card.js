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
}

module.exports = Card;