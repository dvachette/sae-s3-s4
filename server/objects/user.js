const Database = require('better-sqlite3');
const Collection = require('./collection.js');
const FriendRequest = require('./friendRequest.js');
const Trade = require('./trade.js');
const Card = require('./card.js');
const Deck = require('./deck.js');
const Hashage = require("../utils/hashing.js");
class User {
    // Attibuts et méthodes de la classe User
    userId;
    username;
    email;
    lastBoosterOpening;
    balance;
    collection;
    friends;
    pendingFriendRequests;
    pendingIncomingRequests;
    sentTrades;
    receivedTrades;
    acceptedTrades;
    deck;
    profilePicture;
    
    constructor(userId, username, email, lastBoosterOpening, balance, profilePicture) {
        this.userId = userId;
        this.username = username;
        this.email = email;
        this.lastBoosterOpening = lastBoosterOpening;
        this.balance = balance;
        this.collection = [];
        this.friends = [];
        this.pendingFriendRequests = [];
        this.pendingIncomingRequests = [];
        this.sentTrades = [];
        this.receivedTrades = [];
        this.acceptedTrades = [];
        this.deck = null;
        this.profilePicture = profilePicture;
    }
    
    static fromRow(row) {
        const user = new User(
            row.userId,
            row.name,
            row.email,
            row.lastBoosterOppening,
            row.balance,
            row.profilePicture
        );
        
        // Récupération de la collection de l'utilisateur
        const db = new Database('database.db');
        
        const getCollectionQuery = db.prepare(
            'SELECT * FROM collection WHERE userId = ?'
        );
        const collectionRows = getCollectionQuery.all(user.userId);
        
        // Récuperer les amis de l'utilisateur
        const getFriendsQuery = db.prepare(
            'SELECT * FROM friends WHERE senderId = ? OR receiverId = ?'
        );
        const friendsRows = getFriendsQuery.all(user.userId, user.userId);
        db.close();
        
        for (const collRow of collectionRows) {
            const collectionItem = new Collection(
                collRow.cardId,
                collRow.level,
                collRow.quantity
            );
            user.collection.push(collectionItem);
        }
        
        
        for (const friendRow of friendsRows) {
            if (friendRow.status === 'accepted') {
                const friendId = (friendRow.senderId === user.userId) ? friendRow.receiverId : friendRow.senderId;
                const friendNameQuery = new Database("database.db").prepare('SELECT name FROM user WHERE userId = ?');
                const friendNameRow = friendNameQuery.get(friendId);    
                user.friends.push({userId: friendId, name: friendNameRow.name});
            } else if (friendRow.status === 'pending') {
                const request = FriendRequest.fromRow(friendRow);
                if (friendRow.receiverId === user.userId) {
                    user.pendingIncomingRequests.push(request);
                } else {
                    user.pendingFriendRequests.push(request);
                }
            }
        }
        // Remplir les échanges envoyés et disponibles
        for (const trade of Trade.fromUserId(user.userId)) {
            if (trade.receiverId === null) {
                user.sentTrades.push(trade);
            } else {
                user.acceptedTrades.push(trade);
            }
        }
        for (const friend of user.friends) {
            const trades = Trade.fromUserId(friend.userId);
            for (const trade of trades) {
                if (trade.receiverId === user.userId) {
                    user.acceptedTrades.push(trade);
                } else if (trade.receiverId === null) {
                    this.receivedTrades.push(trade);
                }
            }
        }
        
        // Récupération du deck de l'utilisateur
        const deckCard1 = user.collection.find(item => item.card.cardId === row.card1Id)?.card || null;
        const deckCard2 = user.collection.find(item => item.card.cardId === row.card2Id)?.card || null;
        const deckCard3 = user.collection.find(item => item.card.cardId === row.card3Id)?.card || null;
        const deckCard4 = user.collection.find(item => item.card.cardId === row.card4Id)?.card || null;
        const deckCard5 = user.collection.find(item => item.card.cardId === row.card5Id)?.card || null;
        const petCard = user.collection.find(item => item.card.cardId === row.petId)?.card || null;
        const arenaCard = user.collection.find(item => item.card.cardId === row.arenaId)?.card || null;
        console.log(row.card1Id, row.card2Id, row.card3Id, row.card4Id, row.card5Id, row.petId, row.arenaId);
        console.log(deckCard1, deckCard2, deckCard3, deckCard4, deckCard5, petCard, arenaCard);
        
        const deckCards = [deckCard1, deckCard2, deckCard3, deckCard4, deckCard5];
        user.deck = new Deck(deckCards, petCard, arenaCard);
        return user;
        
    }
    
    static fromId(id) {
        const db = new Database("database.db");
        
        const getUserByIdQuery = db.prepare('SELECT * FROM user WHERE userId = ?');
        const row = getUserByIdQuery.get(id);
        
        db.close();
        
        if (row) {
            return User.fromRow(row);
        } else {
            user.pendingFriendRequests.push(request);
        }
    }
    
    
    static fromEmail(email) {
        const db = new Database('database.db');
        
        const getUserByEmailQuery = db.prepare(
            'SELECT * FROM user WHERE email = ?'
        );
        const row = getUserByEmailQuery.get(email);
        db.close();
        if (row) {
            return User.fromRow(row);
        } else {
            return null;
        }
    }
    
    static fromUsername(username) {
        const db = new Database('database.db');
        
        const getUserByUsernameQuery = db.prepare(
            'SELECT * FROM user WHERE name = ?'
        );
        const row = getUserByUsernameQuery.get(username);
        
        db.close();
        
        if (row) {
            return User.fromRow(row);
        } else {
            return null;
        }
    }
    
    static async login(email, password) {
        const db = new Database('database.db');
        const user = User.fromEmail(email);
        const getUserPasswordQuery = db.prepare(
            'SELECT password FROM user WHERE email = ?'
        );
        const row = getUserPasswordQuery.get(email);
        db.close();
        if (user && await Hashage.checkPassword(password, row.password) && user.profileType !== 'deleted') {
            return user;
        } else {
            return null;
        }
    }
    
    static async register(username, email, password) {
        const db = new Database('database.db');
        
        const insertUserQuery = db.prepare(
            'INSERT INTO user (name, email, password) VALUES (?, ?, ?)'
        );
        const hashedPassword = await Hashage.hashPassword(password);
        const result = insertUserQuery.run(username, email, hashedPassword);
        
        db.close();
        
        return User.fromId(result.lastInsertRowid);
    }
    
    static isEmailTaken(email) {
        return User.fromEmail(email) !== null;
    }
    
    static isUsernameTaken(username) {
        return User.fromUsername(username) !== null;
    }
    
    static search(query) {
        const db = new Database('database.db');
        const fetchUserQuery = db.prepare(
            'SELECT name, userId FROM user WHERE name LIKE ?'
        );
        const result = fetchUserQuery.all(query);
        
        return result;
    }
    
    save() {
        const db = new Database('database.db');
        
        if(this.password){
            const updateUserQuery = db.prepare(
                'UPDATE user SET name = ?, email = ?, profilePicture = ?, password = ? WHERE userId = ?'
            );
            updateUserQuery.run(this.username, this.email, this.profilePicture, this.password, this.userId);
        }
        else {
            const updateQuery = db.prepare(
                'UPDATE user SET name = ?, email = ?, profilePicture = ? WHERE userId = ?'
            );
            updateQuery.run(this.username, this.email, this.profilePicture, this.userId);
        }
        console.log(this.username);
        
        db.close();
    }
    
    delete() {
        // Supprimer ses liens d'amitié
        for (const friendId of this.friends) {
            try {
                this.removeFriend(friendId);
            } catch (error) {
                // Ignorer les erreurs lors de la suppression des amis
            }
        }
        for (const request of this.pendingFriendRequests) {
            try {
                this.cancelFriendRequest(request.receiverId);
            } catch (error) {
                // Ignorer les erreurs lors de la suppression des demandes d'amis
            }
        }
        for (const request of this.pendingIncomingRequests) {
            try {
                this.rejectFriendRequest(request.senderId);
            } catch (error) {
                // Ignorer les erreurs lors de la suppression des demandes d'amis
            }
        }
        // Remplacer son mail par <id>@DELETED
        this.email = `${this.userId}@DELETED`;
        // Remplacer son nom par DELETED_user_<id>
        this.username = `DELETED_user_${this.userId}`;
        // Remplaces son mot de passe par DELETED
        this.passwordHash = 'DELETED';
        this.save();
        const db = new Database('database.db');
        
        const deleteUserQuery = db.prepare(
            'UPDATE user SET profileType = ? WHERE userId = ?'
        );
        deleteUserQuery.run('deleted', this.userId);
        
        db.close();
    }
    requestFriend(friendId) {
        friendId = parseInt(friendId);
        if (this.userId === friendId) {
            throw new Error('Vous ne pouvez pas vous ajouter vous-même en ami.');
        }
        if (this.friends.includes(friendId)) {
            throw new Error('Cet utilisateur est déjà votre ami.');
        }
        for (const request of this.pendingFriendRequests) {
            if (request.toUserId === friendId) {
                throw new Error(
                    "Vous avez déjà envoyé une demande d'ami à cet utilisateur."
                );
            }
        }
        for (const request of this.pendingIncomingRequests) {
            if (request.fromUserId === friendId) {
                throw new Error(
                    "Cet utilisateur vous a déjà envoyé une demande d'ami."
                );
            }
        }
        const db = new Database('database.db');
        
        const insertFriendRequestQuery = db.prepare(
            'INSERT INTO friends (senderId, receiverId, status) VALUES (?, ?, ?)'
        );
        const result = insertFriendRequestQuery.run(
            this.userId,
            friendId,
            'pending'
        );
        const request = new FriendRequest(
            result.lastInsertRowid,
            this.userId,
            friendId,
            'pending'
        );
        this.pendingFriendRequests.push(request);
        db.close();
    }
    
    removeFriend(friendId) {
        friendId = parseInt(friendId);
        if (!this.friends.some((friend) => friend.userId == friendId)) {
            throw new Error("Cet utilisateur n'est pas dans votre liste d'amis.");
        }
        
        const db = new Database('database.db');
        
        const deleteFriendQuery = db.prepare(
            'DELETE FROM friends WHERE (senderId = ? AND receiverId = ?) OR (senderId = ? AND receiverId = ?)'
        );
        deleteFriendQuery.run(this.userId, friendId, friendId, this.userId);
        this.friends = this.friends.filter((friend) => friend.userId !== friendId);
        db.close();
    }
    
    acceptFriend(friendId) {
        // Vérifier si une demande entrante existe
        friendId = parseInt(friendId);
        const requestExists = this.pendingIncomingRequests.some(
            (request) => request.fromUserId === friendId
        );
        if (!requestExists) {
            throw new Error("Aucune demande d'ami entrante de cet utilisateur.");
        }
        const db = new Database('database.db');
        
        const updateFriendRequestQuery = db.prepare(
            'UPDATE friends SET status = ? WHERE senderId = ? AND receiverId = ?'
        );
        updateFriendRequestQuery.run('accepted', friendId, this.userId);
        this.friends.push(friendId);
        this.pendingIncomingRequests = this.pendingIncomingRequests.filter(
            (request) => request.fromUserId !== friendId
        );
        db.close();
    }
    rejectFriend(friendId) {
        friendId = parseInt(friendId);
        // Vérifier si une demande entrante existe
        const requestExists = this.pendingIncomingRequests.some(
            (request) => request.fromUserId === friendId
        );
        if (!requestExists) {
            throw new Error("Aucune demande d'ami entrante de cet utilisateur.");
        }
        const db = new Database('database.db');
        
        const deleteFriendRequestQuery = db.prepare(
            'DELETE FROM friends WHERE senderId = ? AND receiverId = ?'
        );
        deleteFriendRequestQuery.run(friendId, this.userId);
        this.pendingIncomingRequests = this.pendingIncomingRequests.filter(
            (request) => request.fromUserId !== friendId
        );
        db.close();
    }
    cancelFriendRequest(friendId) {
        // Vérifier si une demande sortante existe
        friendId = parseInt(friendId);
        const requestExists = this.pendingFriendRequests.some(
            (request) => request.toUserId == friendId
        );
        if (!requestExists) {
            throw new Error("Aucune demande d'ami envoyée à cet utilisateur.");
        }
        const db = new Database('database.db');
        
        const deleteFriendRequestQuery = db.prepare(
            'DELETE FROM friends WHERE senderId = ? AND receiverId = ?'
        );
        deleteFriendRequestQuery.run(this.userId, friendId);
        this.pendingFriendRequests = this.pendingFriendRequests.filter(
            (request) => request.toUserId !== friendId
        );
        db.close();
    }
    
    isFriendWith(userId) {
        return this.friends.includes(userId);
    }
    
    delayBeforeNextBooster() {
        const now = Math.floor(Date.now() / 1000); // Temps actuel en secondes
        const db = new Database('database.db');
        const getLastBoosterOpeningQuery = db.prepare(
            'SELECT lastBoosterOppening FROM user WHERE userId = ?'
        );
        const row = getLastBoosterOpeningQuery.get(this.userId);
        db.close();
        this.lastBoosterOpening = row.lastBoosterOppening;
        const lastOpening = this.lastBoosterOpening;
        const delay = 12 * 60 * 60; // 5 heures en secondes
        const timeSinceLastOpening = now - lastOpening;
        return Math.max(0, delay - timeSinceLastOpening);
    }
    
    addCardToCollection(cardId, quantity) {
        const existingCard = this.collection.find(
            (item) => item.card.cardId === cardId
        );
        if (existingCard) {
            existingCard.quantity += quantity;
        } else {
            const newCard = new Collection(cardId, 1, quantity);
            this.collection.push(newCard);
        }
        console.log(existingCard);
        const db = new Database('database.db');
        
        if (existingCard) {
            const updateQuery = db.prepare(
                'UPDATE collection SET quantity = ? WHERE userId = ? AND cardId = ?'
            );
            updateQuery.run(existingCard.quantity, this.userId, cardId);
        } else {
            const insertQuery = db.prepare(
                'INSERT INTO collection (userId, cardId, level, quantity) VALUES (?, ?, ?, ?)'
            );
            insertQuery.run(this.userId, cardId, 1, quantity);
        }
        
        db.close();
    }
    
    addKeys(amount) {
        this.balance += amount;
        const db = new Database('database.db');
        
        const updateBalanceQuery = db.prepare(
            'UPDATE user SET balance = ? WHERE userId = ?'
        );
        updateBalanceQuery.run(this.balance, this.userId);
        
        db.close();
    }
    
    removeKeys(amount) {
        if (this.balance < amount) {
            throw new Error('Solde insuffisant.');
        }
        this.balance -= amount;
        const db = new Database('database.db');
        
        const updateBalanceQuery = db.prepare(
            'UPDATE user SET balance = ? WHERE userId = ?'
        );
        updateBalanceQuery.run(this.balance, this.userId);
        
        db.close();
    }
    
    resetBoosterOpeningDate() {
        this.lastBoosterOpening = Math.floor(Date.now() / 1000);
        const db = new Database('database.db');
        const updateLastBoosterOpeningQuery = db.prepare(
            'UPDATE user SET lastBoosterOppening = ? WHERE userId = ?'
        );
        updateLastBoosterOpeningQuery.run(this.lastBoosterOpening, this.userId);
        db.close();
    }
    
    setCardQuantity(cardId, quantity) {
        const existingCard = this.collection.find(
            (item) => item.card.cardId === cardId
        );
        if (existingCard) {
            existingCard.quantity = quantity;
            const db = new Database('database.db');
            const updateQuery = db.prepare(
                'UPDATE collection SET quantity = ? WHERE userId = ? AND cardId = ?'
            );
            updateQuery.run(quantity, this.userId, cardId);
            db.close();
        } else {
            throw new Error(
                "L'utilisateur ne possède pas cette carte dans sa collection."
            );
        }
    }
    
    getCardQuantity(cardId) {
        const existingCard = this.collection.find(
            (item) => item.card.cardId === cardId
        );
        if (existingCard) {
            return existingCard.quantity;
        } else {
            return 0;
        }
    }
    
    upgradeCard(cardId) {
        /*
        level 1 -> 2 : 5 cartes 
        level 2 -> 3 : 10 cartes au total (5 supplémentaires)
        level 3 -> 4 : 15 cartes au total (5 supplémentaires)
        level 4 -> 5 : 20 cartes au total (5 supplémentaires)
        */
        const neededCardsByLevel = {
            1: 5,
            2: 10,
            3: 15,
            4: 20,
        };
        const existingCard = this.collection.find(
            (item) => item.card.cardId == cardId
        );
        if (existingCard) {
            const currentLevel = existingCard.card.level;
            if (currentLevel >= 5) {
                throw new Error('La carte est déjà au niveau maximum.');
            }
            const neededCards = neededCardsByLevel[currentLevel];
            if (existingCard.quantity >= neededCards) {
                // On peut upgrader
                const existingCardIndex = this.collection.indexOf(existingCard);
                this.collection[existingCardIndex].card = Card.fromId(
                    cardId,
                    currentLevel + 1
                );
                const db = new Database('database.db');
                const updateCollectionQuery = db.prepare(
                    'UPDATE collection SET level = ? WHERE userId = ? AND cardId = ?'
                );
                updateCollectionQuery.run(currentLevel + 1, this.userId, cardId);
                db.close();
            } else {
                throw new Error(
                    "Vous n'avez pas assez de cartes pour améliorer cette carte."
                );
            }
        } else {
            throw new Error(
                "L'utilisateur ne possède pas cette carte dans sa collection."
            );
        }
    }

    getStats() {
        const db = new Database('database.db') ;
        const totalCardQuery = db.prepare('SELECT COUNT(cardId) AS total FROM Card') ;
        const totalCards = totalCardQuery.get().total ;
        const cardQuery = db.prepare('SELECT COUNT(cardId) AS total FROM Collection WHERE userId = ?');
        const cards = cardQuery.get(this.userId).total ;
        const partiesJoueesQuery = db.prepare('SELECT COUNT(combatId) AS total FROM Historique_des_combats WHERE GagnantId = ? or PerdantId = ?') ;
        const partiesJouees = partiesJoueesQuery.get(this.userId, this.userId).total ; 
        const partiesGagneesQuery = db.prepare('SELECT COUNT(combatId) AS total FROM Historique_des_combats WHERE GagnantId = ? ') ;
        const partiesGagnees = partiesGagneesQuery.get(this.userId).total ;  
        const amisQuery = db.prepare("SELECT COUNT(friendId) AS total FROM Friends WHERE (senderId = ? or receiverId = ?) and status = 'accepted'") ;
        const amis = amisQuery.get(this.userId, this.userId).total ;
        return { totalCartes : totalCards , totalPossedees : cards, totalParties : partiesJouees, totalVictoires : partiesGagnees, totalAmis : amis};
    }
}

module.exports = User;
