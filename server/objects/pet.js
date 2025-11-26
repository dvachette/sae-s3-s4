const Card = require('./card.js');

class Pet extends Card {
    modifier;
    modifierText;
    constructor(cardId, name, mandat, pictureUrl, description, weight, level, borderPictureUrl, modifier, modifierText) {
        super(cardId, name, 'pet', mandat, pictureUrl, description, weight, level, borderPictureUrl);
        this.modifier = modifier;
        this.modifierText = modifierText;
    }
}

module.exports = Pet;