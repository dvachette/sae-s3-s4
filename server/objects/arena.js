const Card = require('./card.js');

class Arena extends Card {
    backgroundPictureUrl;

    constructor(cardId, name, mandat, pictureUrl, description, weight, level, borderPictureUrl,backgroundPictureUrl) {
        super(cardId, name, 'arena', mandat, pictureUrl, description, weight, level, borderPictureUrl);
        this.backgroundPictureUrl=backgroundPictureUrl;
    }
}

module.exports = Arena;