const Offer = require("../objects/shop.js");

const offers = Offer.getAllOffers();
console.log("All Offers in the Shop:");
offers.forEach(offer => {
    console.log(`Offer ID: ${offer.id}, Cost: ${offer.cost}, Content: ${JSON.stringify(offer.content)}`);
});

const dailyOffers = Offer.generateDailyShop(3);
Offer.saveDailyShop(dailyOffers);

const todayOffers = Offer.getTodayShop();
console.log("Today's Offers:");
todayOffers.forEach(offer => {
    console.log(`Offer ID: ${offer.id}, Cost: ${offer.cost}, Content: ${JSON.stringify(offer.content)}`);
});
