const database = require('better-sqlite3')
class FriendRequest {
    requestId;
    fromUserId;
    toUserId;
    fromUserName;
    toUserName;
    status;
    constructor(requestId, fromUserId, toUserId, fromUserName, toUserName, status) {
        this.requestId = requestId;
        this.fromUserId = fromUserId;
        this.toUserId = toUserId;
        this.fromUserName = fromUserName;
        this.toUserName = toUserName;
        this.status = status; // 'pending', 'accepted', 'rejected'
    }

    static fromRow(row) {
        const req = new FriendRequest(row.requestId, row.senderId, row.receiverId, null, null, row.status);
        // Get names from database
        const db = new database('database.db');
        const getUserStmt = db.prepare('SELECT name FROM user WHERE userId = ?');
        const fromUser = getUserStmt.get(row.senderId);
        const toUser = getUserStmt.get(row.receiverId);
        req.fromUserName = fromUser ? fromUser.name : null;
        req.toUserName = toUser ? toUser.name : null;
        db.close();
        return req;
    }
    
}

module.exports = FriendRequest;