const Offer = require('../objects/shop.js');
const User = require('../objects/user.js');
const Card = require('../objects/card.js')


function getShop(req, res) {
    const user = User.fromId(req.session.userId);
    if (!user) {
        return res.status(401).send({ error: 'Utilisateur non authentifié' });
    }

    const dailyOffers = Offer.getTodayShop();
    for (const offer of dailyOffers) {
        offer.remaining = offer.remainingUsage(user.userId);
        if (offer.content.type === "card") {
            offer.cardDetail = Card.fromId(offer.content.cardId)
        }
        console.log(offer);
    }
    return res.status(200).json({ offers: dailyOffers });
}

function buyOffer(req, res) {
    const offerId = req.body.offerId;
    const userId = req.session.userId;
    console.log("Achat de l'offre ID :", offerId, "par l'utilisateur ID :", userId);
    if (!userId) {
        return res.status(401).send({ error: 'Utilisateur non authentifié' });
    }

    const offer = Offer.fromId(offerId);
    if (!offer) {
        return res.status(404).send({ error: 'Offre non trouvée' });
    }

    try {
        offer.purchase(userId);
        return res.status(200).send({ message: 'Offre achetée avec succès' });
    } catch (error) {
        return res.status(400).send({ error: error.message });
    }
    return res.status(500).send({ error: 'Erreur serveur' });
}

module.exports = { getShop, buyOffer };