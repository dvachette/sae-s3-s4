/**
    @file : server/routes/friends.js
    @author : Donatien VACHETTE
    @brief : Routes pour la gestion des amis.
    @description : Définit les fonctions pour envoyer des demandes d'amitié, accepter/rejeter des demandes, obtenir la liste d'amis et supprimer des amis.
 */

// Modules NPM
const Database = require('better-sqlite3'); // Importation de better-sqlite3 pour interagir avec la base de données SQLite



/**
 * @brief Envoie une demande d'amitié à un autre utilisateur.
 * @param friendId int - ID de l'ami à ajouter 
 * @returns response - Résultat de la requête
 * @returns status 201 - Demande d'amitié envoyée avec succès
 * @returns status 400 - ID de l'ami manquant / Impossible de s'ajouter soi-même en ami
 * @returns status 401 - Utilisateur non authentifié
 * @returns status 405 - Méthode non autorisée
 * @returns status 409 - Demande d'amitié déjà en attente / Vous êtes déjà amis
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

    // Récupérer les données nécessaires
    const userId = request.session.userId;
    const friendId = request.body.friendId;

    // Vérifier que l'ID de l'ami est fourni
    if (!friendId) {
        return response.status(400).send({ error: 'ID de l\'ami manquant' });
    }

    // Vérifier que l'utilisateur n'essaie pas de s'ajouter lui-même
    if (userId == friendId) {
        return response.status(400).send({ error: 'Impossible de s\'ajouter soi-même en ami' });
    }

    const db = new Database('database.db');

    // Vérifier si la demande d'amitié existe déjà
    const checkRequest = db.prepare('SELECT * FROM friends WHERE (senderId = ? AND receiverId = ?) OR (senderId = ? AND ReceiverId = ?)');
    const existingRequest = checkRequest.get(userId, friendId, friendId, userId);

    // Gérer les différents cas de demande existante
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


/**
 * @brief Récupère la liste des amis de l'utilisateur authentifié.
 * @returns response - Résultat de la requête
 * @returns status 200 - Liste des amis récupérée avec succès
 * @returns status 401 - Utilisateur non authentifié
 * @returns status 405 - Méthode non autorisée (GET uniquement)
 */
function getFriendsList(request, response) {
    // Vérifier que la méthode est GET
    if (request.method !== 'GET') {
        return response.status(405).send({ error: 'Methode non autorisée' });
    }
    // Vérifier que l'utilisateur est authentifié
    if (!request.session.userId) {
        return response.status(401).send({ error: 'Utilisateur non authentifié' });
    }

    // Récupérer les données nécessaires
    const userId = request.session.userId;

    // Récupérer la liste des amis depuis la base de données
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


/**
 * @brief Récupère la liste des demandes d'amitié en attente pour l'utilisateur authentifié.
 * @returns response - Résultat de la requête
 * @returns status 200 - Liste des demandes récupérée avec succès
 * @returns status 401 - Utilisateur non authentifié
 * @returns status 405 - Méthode non autorisée (GET uniquement)
 */
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

/**
 * @brief Accepte une demande d'amitié.
 * @param friendId int - ID de l'ami dont la demande doit être acceptée
 * @returns response - Résultat de la requête
 * @returns status 200 - Demande d'amitié acceptée avec succès
 * @returns status 400 - ID de l'ami manquant
 * @returns status 401 - Utilisateur non authentifié
 * @returns status 404 - Demande d'amitié non trouvée
 * @returns status 405 - Méthode non autorisée (POST uniquement)
 */
function acceptFriendRequest(request, response) {
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

    const db = new Database('database.db');

    // Vérifier si la demande d'amitié existe
    const getRequest = db.prepare('SELECT * FROM friends WHERE senderId = ? AND receiverId = ? AND status = ?');
    const friendRequest = getRequest.get(friendId, userId, 'pending');
    if (!friendRequest) {
        return response.status(404).send({ error: 'Demande d\'amitié non trouvée' });
    }

    // Mettre à jour le statut de la demande d'amitié
    const updateRequest = db.prepare('UPDATE friends SET status = ? WHERE senderId = ? AND receiverId = ?');
    updateRequest.run('accepted', friendId, userId);

    return response.status(200).send({ message: 'Demande d\'amitié acceptée avec succès' });
}


/**
 * @brief Rejette une demande d'amitié.
 * @param friendId int - ID de l'ami dont la demande doit être rejetée
 * @returns response - Résultat de la requête
 * @returns status 200 - Demande d'amitié rejetée avec succès
 * @returns status 400 - ID de l'ami manquant
 * @returns status 401 - Utilisateur non authentifié
 * @returns status 404 - Demande d'amitié non trouvée
 * @returns status 405 - Méthode non autorisée (POST uniquement)
 */
function rejectFriendRequest(request, response) {
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

    const db = new Database('database.db');

    // Vérifier si la demande d'amitié existe
    const getRequest = db.prepare('SELECT * FROM friends WHERE senderId = ? AND receiverId = ? AND status = ?');
    const friendRequest = getRequest.get(friendId, userId, 'pending');
    if (!friendRequest) {
        return response.status(404).send({ error: 'Demande d\'amitié non trouvée' });
    }

    // Mettre à jour le statut de la demande d'amitié
    const updateRequest = db.prepare('UPDATE friends SET status = ? WHERE senderId = ? AND receiverId = ?');
    updateRequest.run('rejected', friendId, userId);

    return response.status(200).send({ message: 'Demande d\'amitié rejetée avec succès' });
}

/**
 * @brief Supprime un ami de la liste d'amis de l'utilisateur authentifié.
 * @param friendId int - ID de l'ami à supprimer
 * @returns response - Résultat de la requête
 * @returns status 200 - Amitié supprimée avec succès
 * @returns status 400 - ID de l'ami manquant
 * @returns status 401 - Utilisateur non authentifié
 * @returns status 404 - Amitié non trouvée
 * @returns status 405 - Méthode non autorisée (DELETE uniquement)
 */
function removeFriend(request, response) {
    // Vérifier que la méthode est DELETE
    if (request.method !== 'DELETE') {
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

    const db = new Database('database.db');

    // Vérifier si l'amitié existe
    const getFriendship = db.prepare('SELECT * FROM friends WHERE ((senderId = ? AND receiverId = ?) OR (senderId = ? AND receiverId = ?)) AND status = ?');
    const friendship = getFriendship.get(userId, friendId, friendId, userId, 'accepted');
    if (!friendship) {
        return response.status(404).send({ error: 'Amitié non trouvée' });
    }

    // Supprimer l'amitié
    const deleteFriendship = db.prepare('DELETE FROM friends WHERE ((senderId = ? AND receiverId = ?) OR (senderId = ? AND receiverId = ?)) AND status = ?');
    deleteFriendship.run(userId, friendId, friendId, userId, 'accepted');

    return response.status(200).send({ message: 'Amitié supprimée avec succès' });
}

/**
 * @brief Supprime une demande d'amitié.
 * @param friendId int - ID de l'ami à qui la demande à supprimé a été faite
 * @returns response - Résultat de la requête
 * @returns status 200 - Demande d'amitié supprimée avec succès
 * @returns status 400 - ID de l'ami manquant
 * @returns status 401 - Utilisateur non authentifié
 * @returns status 404 - Demande d'amitié non trouvée
 * @returns status 405 - Méthode non autorisée (DELETE uniquement)
 */
function removeFriendRequest(request, response){
    // Vérifier que la méthode est DELETE
    if (request.method !== 'DELETE') {
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

    const db = new Database('database.db');

    // Vérifier si la demande d'amitié existe
    const getRequest = db.prepare('SELECT * FROM friends WHERE senderId = ? AND receiverId = ? AND status = ?');
    const friendRequest = getRequest.get(friendId, userId, 'pending');
    if (!friendRequest) {
        return response.status(404).send({ error: 'Demande d\'amitié non trouvée' });
    }

    // Supprime de la demande d'amitié
    const deleteFriendship = db.prepare('DELETE FROM friends WHERE ((senderId = ? AND receiverId = ?) OR (senderId = ? AND receiverId = ?)) AND status = ?');
    deleteFriendship.run(userId, friendId, friendId, userId, 'accepted');

    return response.status(200).send({ message: 'Demande d\'amitié supprimée avec succès' });


}


module.exports = {
    requestFriend,
    getFriendsList,
    getPendingRequests,
    acceptFriendRequest,
    rejectFriendRequest,
    removeFriend,
    removeFriendRequest
};