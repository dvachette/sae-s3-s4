const Database = require("better-sqlite3")
const User = require("./user.js");

const db = new Database("database.db");
class Offer {
    constructor(id, cost, weight, image, content, maxUsage) {
        this.id = id;
        this.cost = cost;
        this.weight = weight;
        this.image = image;
        this.content = content;
        this.maxUsage = maxUsage;
    }

    static fromId(id) {
        const stmt = db.prepare("SELECT * FROM offer WHERE offerId = ?");
        const row = stmt.get(id);
        if (!row) return null;
        return new Offer(row.offerId, row.cost, row.weight, row.image, JSON.parse(row.content), row.maxUsage);
    }

    remainingUsage(userId) {
        const stmt = db.prepare("SELECT count FROM historique_des_achats WHERE userId = ? AND offerId = ? AND date=?");
        const row = stmt.get(userId, this.id, new Date().toISOString().slice(0, 10));
        if (!row) return this.maxUsage;
        return Math.max(0, this.maxUsage - row.count);
    }

    purchase(userId) {
        const remaining = this.remainingUsage(userId);
        if (remaining <= 0) {
            throw new Error("Offer usage limit reached for today.");
        }
        const user = User.fromId(userId);
        if (user.balance < this.cost) {
            throw new Error("Insufficient balance to purchase this offer.");
        }
        user.balance -= this.cost;
        switch (this.content.type) {
            case "booster":
                // Logic to grant booster to user would go here
                break;
            case "card":
                user.addCardToCollection(this.content.cardId, this.content.quantity);
                break;
            default:
                throw new Error("Unknown offer content type.");
        }
        user.save();

        const insertStmt = db.prepare("INSERT INTO historique_des_achats (userId, offerId, date, count) VALUES (?, ?, ?, 1) ON CONFLICT(userId, offerId, date) DO UPDATE SET count = count + 1");
        insertStmt.run(userId, this.id, new Date().toISOString().slice(0, 10));
        console.warn("FUNCTION PURCHASE NOT FULLY IMPLEMENTED: Granting offer content to user is not handled yet.");
        
    }

    static getAllOffers() {
        const stmt = db.prepare("SELECT * FROM offer");
        const rows = stmt.all();
        return rows.map(row => new Offer(row.offerId, row.cost, row.weight, row.image, JSON.parse(row.content), row.maxUsage));
    }

    static generateDailyShop(numOffers) {
        let allOffers = Offer.getAllOffers();
        let totalWeight = allOffers.reduce((sum, offer) => sum + offer.weight, 0);
        const selectedOffers = [];
        while (selectedOffers.length < numOffers) {
            totalWeight = allOffers.reduce((sum, offer) => sum + offer.weight, 0);
            let rand = Math.random() * totalWeight;
            let cumulativeWeight = 0;
            for (const offer of allOffers) {
                cumulativeWeight += offer.weight;
                if (rand <= cumulativeWeight) {
                    if (!selectedOffers.includes(offer)) {
                        selectedOffers.push(offer);
                    }
                    break;
                }
            }
            allOffers = allOffers.filter(o => !selectedOffers.includes(o));
        }
        return selectedOffers;

    }

    static saveDailyShop(offers) {
        // Check if an entry for today already exists
        const dateStr = new Date().toISOString().slice(0, 10);
        const checkStmt = db.prepare("SELECT * FROM daily_shop WHERE date = ?");
        const existingEntry = checkStmt.get(dateStr);
        if (existingEntry) {
            return;
        }

        const insertStmt = db.prepare("INSERT INTO daily_shop (date, offer1Id, offer2Id, offer3Id) VALUES (?, ?, ?, ?)");

        const offerIds = offers.map(offer => offer.id);
        insertStmt.run(dateStr, ...offerIds);
    }

    static getTodayShop() {
        const dateStr = new Date().toISOString().slice(0, 10);
        const stmt = db.prepare("SELECT * FROM daily_shop WHERE date = ?");
        const row = stmt.get(dateStr);
        if (!row) {
            const generatedOffers = Offer.generateDailyShop(3);
            Offer.saveDailyShop(generatedOffers);
            return generatedOffers;
        }
        const offers = [];
        for (let i = 1; i <= 3; i++) {
            const offer = Offer.fromId(row[`offer${i}Id`]);
            if (offer) offers.push(offer);
        }
        return offers;
    }
}

module.exports = Offer;