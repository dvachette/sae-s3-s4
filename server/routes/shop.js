const Offer = require('../objects/shop.js');
const User = require('../objects/user.js');


function getShop(req, res) {
    const dailyOffers = Offer.getTodayShop();
    return res.status(200).json({ offers: dailyOffers });
}

function buyOffer(req, res) {
    
    const offerId = req.body.offerId;
    const userId = req.session.userId;

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