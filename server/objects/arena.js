const Card = require('./card.js');

class Arena extends Card {
    constructor(cardId, name, mandat, pictureUrl, description, weight, level, borderPictureUrl) {
        super(cardId, name, 'arena', mandat, pictureUrl, description, weight, level, borderPictureUrl);
    }
}

module.exports = Arena;