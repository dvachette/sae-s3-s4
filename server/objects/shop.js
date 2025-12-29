const db = require("better-sqlite3")
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
        const stmt = db.prepare("SELECT * FROM offers WHERE id = ?");
        const row = stmt.get(id);
        if (!row) return null;
        return new Offer(row.id, row.cost, row.weight, row.image, JSON.parse(row.content), row.maxUsage);
    }

    remainingUsage(userId) {
        const stmt = db.prepare("SELECT count FROM historic_des_achats WHERE userId = ? AND offerId = ? AND date=?");
        const row = stmt.get(userId, this.id, new Date().toISOString().slice(0, 10));
        if (!row) return this.maxUsage;
        return Math.max(0, this.maxUsage - row.count);
    }

    purchase(userId) {
        const remaining = this.remainingUsage(userId);
        if (remaining <= 0) {
            throw new Error("Offer usage limit reached for today.");
        }
        const insertStmt = db.prepare("INSERT INTO historic_des_achats (userId, offerId, date, count) VALUES (?, ?, ?, 1) ON CONFLICT(userId, offerId, date) DO UPDATE SET count = count + 1");
        insertStmt.run(userId, this.id, new Date().toISOString().slice(0, 10));
        console.warn("FUNCTION PURCHASE NOT FULLY IMPLEMENTED: Granting offer content to user is not handled yet.");
        
    }
}