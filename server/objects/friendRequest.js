const database = require('better-sqlite3')
class FriendRequest {
    requestId;
    fromUserId;
    toUserId;
    fromUserName;
    toUserName;
    status;
    fromUserProfilePicture;
    toUserProfilePicture;
    constructor(requestId, fromUserId, toUserId, fromUserName, toUserName, status, fromUserProfilePicture, toUserProfilePicture) {
        this.requestId = requestId;
        this.fromUserId = fromUserId;
        this.toUserId = toUserId;
        this.fromUserName = fromUserName;
        this.toUserName = toUserName;
        this.status = status; // 'pending', 'accepted', 'rejected'
        this.fromUserProfilePicture = fromUserProfilePicture;
        this.toUserProfilePicture = toUserProfilePicture;
    }

    static fromRow(row) {
        const req = new FriendRequest(row.requestId, row.senderId, row.receiverId, null, null, row.status);
        // Get names from database
        const db = new database('var/database.db');
        const getUserStmt = db.prepare('SELECT name, profilePicture FROM user WHERE userId = ?');
        const fromUser = getUserStmt.get(row.senderId);
        const toUser = getUserStmt.get(row.receiverId);
        req.fromUserName = fromUser ? fromUser.name : null;
        req.toUserName = toUser ? toUser.name : null;
        req.fromUserProfilePicture = fromUser ? fromUser.profilePicture : null;
        req.toUserProfilePicture = toUser ? toUser.profilePicture : null;
        db.close();
        return req;
    }
    
}

module.exports = FriendRequest;