class FriendRequest {
    requestId;
    fromUserId;
    toUserId;
    status;
    constructor(requestId, fromUserId, toUserId, status) {
        this.requestId = requestId;
        this.fromUserId = fromUserId;
        this.toUserId = toUserId;
        this.status = status; // 'pending', 'accepted', 'rejected'
    }

    static fromRow(row) {
        return new FriendRequest(row.requestId, row.senderId, row.receiverId, row.status);
    }
    
}

module.exports = FriendRequest;