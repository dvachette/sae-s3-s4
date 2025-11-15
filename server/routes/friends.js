/**
    @file : server/routes/friends.js
    @author : Donatien VACHETTE, Elise FOUR
    @brief : Routes pour la gestion des amis.
    @description : Définit les fonctions pour envoyer des demandes d'amitié, accepter/rejeter des demandes, obtenir la liste d'amis et supprimer des amis.
 */

// Modules NPM
const Database = require('better-sqlite3'); // Importation de better-sqlite3 pour interagir avec la base de données SQLite

const User = require('../objects/user.js'); // Importation de l'objet User


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
    const user = User.fromId(userId);
    
    if (!user) {
        return response.status(404).send({ error: 'Utilisateur non trouvé' });
    }
    
    const friendUser = User.fromId(friendId);
    
    if (!friendUser) {
        return response.status(404).send({ error: 'Utilisateur non trouvé' });
    }


    try {
        user.requestFriend(friendId);
    } catch (error) {
        return response.status(409).send({ error: error.message });
    }

    const friendRequest = user.pendingFriendRequests.find(req => req.toUserId === friendId);

    return response.status(201).send({ message: 'Demande d\'amitié envoyée avec succès', friendRequest: friendRequest });
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
    const user = User.fromId(userId);
    
    if (!user) {
        return response.status(404).send({ error: 'Utilisateur non trouvé' });
    }

    const friends = [];
    for (const friendId of user.friends) {
        const friend = User.fromId(friendId);
        if (friend) {
            friends.push({  userId: friend.userId, username: friend.username  });
        }
    }

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
    const user = User.fromId(request.session.userId);
    
    if (!user) {
        return response.status(404).send({ error: 'Utilisateur non trouvé' });
    }

    const requests = [];
    for (const friendId of user.pendingIncomingRequests.map(req => req.fromUserId)) {
        const friend = User.fromId(friendId);
        if (friend) {
            requests.push({  userId: friend.userId, username: friend.username  });
        }
    }

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

    const user = User.fromId(userId);
    
    if (!user) {
        return response.status(404).send({ error: 'Utilisateur non trouvé' });
    }

    try {
        user.acceptFriend(friendId);
    } catch (error) {
        return response.status(400).send({ error: error.message });
    }

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

    const user = User.fromId(userId);

    if (!user) {
        return response.status(404).send({ error: 'Utilisateur non trouvé' });
    }
    try {
        user.rejectFriend(friendId);
    } catch (error) {
        return response.status(400).send({ error: error.message });
    }
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

    const user = User.fromId(userId);
    
    if (!user) {
        return response.status(404).send({ error: 'Utilisateur non trouvé' });
    }

    try {
        user.removeFriend(friendId);
    } catch (error) {
        return response.status(400).send({ error: error.message });
    }

    return response.status(200).send({ message: 'Amitié supprimée avec succès' });
}

/**
 * @brief Supprime une demande d'amitié.
 * @param friendId int - ID de l'ami à qui la demande à supprimer a été faite
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

    const user = User.fromId(userId);
    
    if (!user) {
        return response.status(404).send({ error: 'Utilisateur non trouvé' });
    }

    try {
        user.cancelFriendRequest(friendId);
    } catch (error) {
        return response.status(400).send({ error: error.message });
    }

    return response.status(200).send({ message: 'Demande d\'amitié supprimée avec succès' });

}

function getOutcomingRequests(request, response) {
    //  Vérifier que la méthode est GET
    if (request.method !== 'GET') {
        return response.status(405).send({ error: 'Methode non autorisée' });
    }
    // Vérifier que l'utilisateur est authentifié
    if (!request.session.userId) {
        return response.status(401).send({ error: 'Utilisateur non authentifié' });
    }
    const user = User.fromId(request.session.userId);
    
    if (!user) {
        return response.status(404).send({ error: 'Utilisateur non trouvé' });
    }

    const requests = [];
    for (const friendId of user.pendingFriendRequests.map(req => req.toUserId)) {
        const friend = User.fromId(friendId);
        if (friend) {
            requests.push({  userId: friend.userId, username: friend.username  });
        }
    }

    return response.status(200).send({ requests: requests });
}






module.exports = {
    requestFriend,
    getFriendsList,
    getPendingRequests,
    acceptFriendRequest,
    rejectFriendRequest,
    removeFriend,
    removeFriendRequest,
    getOutcomingRequests
};