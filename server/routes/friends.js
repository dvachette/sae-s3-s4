const Database = require('better-sqlite3');

/**
 * Module gérant les routes de gestion des relations d'amitié entre utilisateurs.
 * Chaque fonction exportée correspond à une route spécifique.
 */

function requestFriend(request, response) {
    // Vérifier que la méthode est POST
    if (request.method !== 'POST') {
        return response.status(405).send({ error: 'Methode non autorisée' });
    }
    // Vérifier que l'utilisateur est authentifié
    if (!request.session.userId) {
        return response.status(401).send({ error: 'Utilisateur non authentifié' });
    }

    const userId = request.session.userId;
    const friendId = request.body.friendId;

    // Vérifier que l'ID de l'ami est fourni
    if (!friendId) {
        return response.status(400).send({ error: 'ID de l\'ami manquant' });
    }

    // Vérifier que l'utilisateur n'essaie pas de s'ajouter lui-même
    if (userId === friendId) {
        return response.status(400).send({ error: 'Impossible de s\'ajouter soi-même en ami' });
    }

    const db = new Database('database.db');

    // Vérifier si la demande d'amitié existe déjà
    const checkRequest = db.prepare('SELECT * FROM friends WHERE (senderId = ? AND receiverId = ?) OR (senderId = ? AND ReceiverId = ?)');
    const existingRequest = checkRequest.get(userId, friendId, friendId, userId);
    if (existingRequest) {
        switch (existingRequest.status) {
            case 'pending':
                return response.status(409).send({ error: 'Demande d\'amitié déjà en attente' });
            case 'accepted':
                return response.status(409).send({ error: 'Vous êtes déjà amis' });
            case 'rejected':
                // Permettre de renvoyer une demande si elle a été rejetée
                break;
        }
    }

    // Insérer la nouvelle demande d'amitié
    const insertRequest = db.prepare('INSERT INTO friends (senderId, receiverId, status) VALUES (?, ?, ?)');
    insertRequest.run(userId, friendId, 'pending');

    return response.status(201).send({ message: 'Demande d\'amitié envoyée avec succès' });
}


function getFriendsList(request, response) {
    if (request.method !== 'GET') {
        return response.status(405).send({ error: 'Methode non autorisée' });
    }
    
    if (!request.session.userId) {
        return response.status(401).send({ error: 'Utilisateur non authentifié' });
    }

    const userId = request.session.userId;
    const db = new Database('database.db');

    const getFriendsQuery = db.prepare(`
        SELECT u.userid, u.name, u.email 
        FROM user u
        JOIN friends f ON (u.userid = f.senderId OR u.userid = f.receiverId)
        WHERE (f.senderId = ? OR f.receiverId = ?) AND f.status = 'accepted' AND u.userid != ?
    `);
    const friends = getFriendsQuery.all(userId, userId, userId);

    return response.status(200).send({ friends: friends });
}

function getPendingRequests(request, response) {
    //  Vérifier que la méthode est GET
    if (request.method !== 'GET') {
        return response.status(405).send({ error: 'Methode non autorisée' });
    }
    // Vérifier que l'utilisateur est authentifié
    if (!request.session.userId) {
        return response.status(401).send({ error: 'Utilisateur non authentifié' });
    }

    const userId = request.session.userId;
    const db = new Database('database.db');

    const getRequestsQuery = db.prepare(`
        SELECT u.userid, u.name, u.email 
        FROM user u
        JOIN friends f ON u.userid = f.senderId
        WHERE f.receiverId = ? AND f.status = 'pending'
    `);
    const requests = getRequestsQuery.all(userId);

    return response.status(200).send({ requests: requests });
}


module.exports = {
    requestFriend,
    getFriendsList,
    getPendingRequests
};