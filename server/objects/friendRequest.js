class FriendRequest {
    constructor(requestId, fromUserId, toUserId, status) {
        this.requestId = requestId;
        this.fromUserId = fromUserId;
        this.toUserId = toUserId;
        this.status = status; // 'pending', 'accepted', 'rejected'
    }
}

module.exports = FriendRequest;