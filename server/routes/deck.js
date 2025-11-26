const express = require("express");
const Deck = require("../objects/deck.js");
const User = require("../objects/user.js");
function getDeck(request, response) {
    const userId = request.session.userId;
    if (!userId) {
        return response.status(401).json({ error: "Vous n'etes pas authentifié" });
    }
    const user = User.fromId(userId);
    if (!user) {
        return response.status(401).json({ error: "Utilisateur non authentifié" });
    }
    const deck = user.deck;
    if (!deck) {
        return response.status(404).json({ error: "Deck non trouvé" });
    }
    return response.status(200).json({ deck: deck });
}

function replaceCardInDeck(request, response) {
    // Index 0 à 4 pour les cartes, 'pet' pour le familier, 'arena' pour l'arène
    const userId = request.session.userId;
    if (!userId) {
        return response.status(401).json({ error: "Vous n'etes pas authentifié" });
    }
    const user = User.fromId(userId);
    if (!user) {
        return response.status(401).json({ error: "Utilisateur non authentifié" });
    }
    const deck = user.deck;
    if (!deck) {
        return response.status(404).json({ error: "Deck non trouvé" });
    }
    const { index, newCardId } = request.body;
    if (index === undefined || newCardId === undefined) {
        return response.status(400).json({ error: "Paramètres manquants" });
    }
    if (user.collection.find(collectionItem => collectionItem.card.cardId == newCardId) === undefined) {
        return response.status(404).json({ error: "Carte non trouvée dans la collection" });
    }
    const newCard = user.collection.find(collectionItem => collectionItem.card.cardId == newCardId).card;
    if (!newCard) {
        return response.status(404).json({ error: "Carte non trouvée dans la collection" });
    }
    try {
        deck.replaceCardAt(index, newCard);
        deck.saveToDatabase(userId);
    } catch (error) {
        return response.status(400).json({ error: error.message });
    }
    return response.status(200).json({ deck: deck });
}

module.exports = {
    getDeck,
    replaceCardInDeck
}