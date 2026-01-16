const User = require('../objects/user.js');

const elise = User.fromId(8);

console.log("Collection d'Elise :", elise.collection.length);

for (const item of elise.collection) {
    console.log(`Carte ID: ${item.card.cardId}, Quantité: ${item.quantity}`);
}