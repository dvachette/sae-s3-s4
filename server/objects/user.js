const Database = require("better-sqlite3");
const Collection = require("./collection.js");
const FriendRequest = require("./friendRequest.js");
class User {
    // Attibuts et méthodes de la classe User
    userId;
    username;
    email;
    passwordHash;
    collection;
    friends;
    pendingFriendRequests;
    pendingIncomingRequests;

    constructor(userId, username, email, passwordHash) {
        this.userId = userId;
        this.username = username;
        this.email = email;
        this.passwordHash = passwordHash;
        this.collection = [];
        this.friends = [];
        this.pendingFriendRequests = [];
        this.pendingIncomingRequests = [];
    }

    static fromRow(row) {
        const user = new User(row.userId, row.name, row.email, row.password);

        // Récupération de la collection de l'utilisateur
        const db = new Database("database.db");

        const getCollectionQuery = db.prepare('SELECT * FROM collection WHERE userId = ?');
        const collectionRows = getCollectionQuery.all(user.userId);

        // Récuperer les amis de l'utilisateur
        const getFriendsQuery = db.prepare('SELECT * FROM friends WHERE senderId = ? OR receiverId = ?');
        const friendsRows = getFriendsQuery.all(user.userId, user.userId);
        db.close();


        for (const collRow of collectionRows) {
            const collectionItem = new Collection(collRow.cardId, collRow.level, collRow.quantity);
            user.collection.push(collectionItem);
        }

        for (const friendRow of friendsRows) {
            if (friendRow.status === 'accepted') {
                const friendId = (friendRow.senderId === user.userId) ? friendRow.receiverId : friendRow.senderId;
                user.friends.push(friendId);
            } else if (friendRow.status === 'pending') {
                const request = new FriendRequest(friendRow.requestId, friendRow.senderId, friendRow.receiverId, friendRow.status);
                if (friendRow.receiverId === user.userId) {
                    user.pendingIncomingRequests.push(request);
                } else {
                    user.pendingFriendRequests.push(request);
                }
            }
        }

        return user;

    }

    static fromId(id) {
        const db = new Database("database.db");

        const getUserByIdQuery = db.prepare('SELECT * FROM user WHERE id = ?');
        const row = getUserByIdQuery.get(id);

        db.close();

        if (row) {
            return User.fromRow(row);
        } else {
            return null;
        }
    }

    static fromEmail(email) {
        const db = new Database("database.db");
        
        const getUserByEmailQuery = db.prepare('SELECT * FROM user WHERE email = ?');
        const row = getUserByEmailQuery.get(email);
        db.close();
        if (row) {
            return User.fromRow(row);
        } else {
            return null;
        }
    }

    static fromUsername(username) {
        const db = new Database("database.db");

        const getUserByUsernameQuery = db.prepare('SELECT * FROM user WHERE name = ?');
        const row = getUserByUsernameQuery.get(username);

        db.close();

        if (row) {
            return User.fromRow(row);
        } else {
            return null;
        }
    }

    static login(email, password) {
        const db = new Database("database.db");
        const user = User.fromEmail(email);
        db.close();
        if (user && password === user.passwordHash && user.profileType !== 'deleted') {
            return user;
        } else {
            return null;
        }
    }

    static register(username, email, password) {
        const db = new Database("database.db");

        const insertUserQuery = db.prepare('INSERT INTO user (name, email, password) VALUES (?, ?, ?)');
        const result = insertUserQuery.run(username, email, password);

        db.close();

        return User.fromId(result.lastInsertRowid);
    }

    static isEmailTaken(email) {
        return User.fromEmail(email) !== null;
    }

    static isUsernameTaken(username) {
        return User.fromUsername(username) !== null;
    }

    save() {
        const db = new Database("database.db");

        const updateUserQuery = db.prepare('UPDATE user SET name = ?, email = ?, password = ? WHERE userId = ?');
        updateUserQuery.run(this.username, this.email, this.passwordHash, this.userId);

        db.close();
    }

    delete() {
        const db = new Database("database.db");

        const deleteUserQuery = db.prepare('UPDATE user SET profileType = ? WHERE userId = ?');
        deleteUserQuery.run('deleted', this.userId);

        db.close();
    }


}

module.exports = User;