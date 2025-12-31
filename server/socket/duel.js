const types = require('./types.js');
const User = require('../objects/user.js');
const connexions = {}; // Objet pour mapper les userId aux sockets WebSocket
const combats = []; // Liste des combats en cours [socket1, socket2, combatInstance]
const attente = []; // Liste des userId en attente de duel (normalement un seul à la fois, mais une liste quand meme en cas de pépin)

/**
 * Fonction pour gérer une nouvelle connexion WebSocket (ajouter les écouteurs d'événements, et ajouter à la liste des connexions)
 * @param {*} socket 
 */
function receiveSocket(socket) { 
    console.log(`New WebSocket connection established : ${socket._socket.remoteAddress}:${socket._socket.remotePort}`);
    socket.on('message', (message) => { // Écouteur des messages entrants
        console.log(`Message received from ${socket._socket.remoteAddress}:${socket._socket.remotePort} : ${message}`);
        const parsedMessage = JSON.parse(message);
        switch (parsedMessage.type) {
            case 'authenticate': // Authentification de l'utilisateur (envoi du userId, une fois, à la connexion)
                const userId = parsedMessage.userId; // Récupération du userId envoyé par le client
                connexions[userId] = socket; // Ajout de la connexion à la liste des connexions
                socket.userId = userId; // Stockage du userId dans la socket pour un accès facile plus tard 
                const userData = User.fromId(userId); // Récupération des données utilisateur
                if (!userData) { // Validation de l'ID utilisateur
                    console.log(`Authentication failed for userId: ${userId}`);
                    socket.send(JSON.stringify({ type: 'authentication_failed' }));
                    connexions[userId] = null; // Suppression de la connexion invalide
                    socket.close(); // Fermeture de la connexion
                    return;
                }

                if (!userData.deck.isValid()) { // Validation du deck utilisateur
                    console.log(`User ${userId} has an invalid deck`);
                    socket.send(JSON.stringify({ type: 'invalid_deck' }));
                    connexions[userId] = null; // Suppression de la connexion invalide
                    socket.close(); // Fermeture de la connexion
                    return;
                }

                console.log(`User ${userId} authenticated for WebSocket`);
                socket.send(JSON.stringify({ type: 'authenticated' })); // Confirmation de l'authentification au client
                if (attente.length > 0) { // Si un autre utilisateur est en attente, démarrer un duel
                    const adversaireId = attente.shift(); // Récupération de l'ID de l'adversaire en attente (premier de la liste (file))
                    const combat = types.CombatState.fromPlayersIds(userId, adversaireId); // Création d'une nouvelle instance de combat
                    combats.push([socket, connexions[adversaireId], combat]); // Ajout du combat à la liste des combats en cours
                    socket.send(JSON.stringify({ type: 'duel_start', adversaireId: adversaireId, combatState: combat.getPlayerState(userId) })); // Envoi du message de début de duel au client
                    connexions[adversaireId].send(JSON.stringify({ type: 'duel_start', adversaireId: userId, combatState: combat.getPlayerState(adversaireId) })); // Envoi du message de début de duel à l'adversaire
                    console.log(`Duel started between ${userId} and ${adversaireId}`);
                } else { // Sinon, ajouter l'utilisateur à la liste d'attente
                    attente.push(userId); //Ajout de l'utilisateur à la liste d'attente
                    console.log(`User ${userId} added to waiting list`);
                }
                break;
            case 'skip': // Passer son tour
                const combatPairSkip = combats.find(c => c[0] === socket || c[1] === socket); // Trouver le combat correspondant à la socket
                if (combatPairSkip) {
                    const combatInstance = combatPairSkip[2]; // Récupérer l'instance de combat (CombatState)
                    const userId = socket.userId; // Récupérer l'ID utilisateur de la socket
                    if (combatInstance.canPlay(userId)) { // Vérifier si c'est bien le tour de l'utilisateur
                        combatInstance.advanceTurn(); // Avancer le tour

                        // Envoyer la mise à jour du combat aux deux joueurs
                        const [player1Socket, player2Socket] = [combatPairSkip[0], combatPairSkip[1]];
                        player1Socket.send(JSON.stringify({ type: 'duel_update', combatState: combatInstance.getPlayerState(player1Socket.userId) }));
                        player2Socket.send(JSON.stringify({ type: 'duel_update', combatState: combatInstance.getPlayerState(player2Socket.userId) }));
                        console.log(`User ${userId} skipped their turn`);
                    } else {
                        console.log(`User ${userId} attempted to skip turn out of turn`);
                    }
                }
                break;
            case 'attack': // Attaquer avec une carte
                const combatPairAttack = combats.find(c => c[0] === socket || c[1] === socket); // Trouver le combat correspondant à la socket
                if(combatPairAttack){
                    const combatInstanceAttack = combatPairAttack[2];
                    const userIdAttack = socket.userId;
                    if (combatInstanceAttack.canPlay(userIdAttack)) {
                        const attackIndex = parsedMessage.index; // Récupération de l'index de l'attaque
                        const attackSuccess = combatInstanceAttack.attack(userIdAttack, attackIndex); // Tentative d'attaque
                        if (attackSuccess) { // Si l'attaque a réussi
                            combatInstanceAttack.advanceTurn(); // Avancer le tour

                            // Envoyer la mise à jour du combat aux deux joueurs
                            const [player1SocketAttack, player2SocketAttack] = [combatPairAttack[0], combatPairAttack[1]];
                            player1SocketAttack.send(JSON.stringify({ type: 'duel_update', combatState: combatInstanceAttack.getPlayerState(player1SocketAttack.userId) }));
                            player2SocketAttack.send(JSON.stringify({ type: 'duel_update', combatState: combatInstanceAttack.getPlayerState(player2SocketAttack.userId) }));
                            console.log(`User ${userIdAttack} performed an attack with index ${attackIndex}`);
                        } else {
                            console.log(`User ${userIdAttack} attempted an invalid attack with index ${attackIndex}`);
                        }
                    } else {
                        console.log(`User ${userIdAttack} attempted to attack out of turn`);
                    }
                } else {
                    console.log(`No combat found for user ${socket.userId} to perform attack`);
                }
                break;
            case 'swap':
                const swapIndex = parsedMessage.index;
                const combatPairSwap = combats.find(c => c[0] === socket || c[1] === socket);
                const userIdSwap = socket.userId;
                const combat = combatPairSwap[2];
                if (combat.canPlay(userIdSwap)) {
                    if (combat.swapCard(userIdSwap, swapIndex)) {
                        combat.advanceTurn();

                        // Envoyer la mise à jour du combat aux deux joueurs
                        const [player1SocketSwap, player2SocketSwap] = [combatPairSwap[0], combatPairSwap[1]];
                        player1SocketSwap.send(JSON.stringify({ type: 'duel_update', combatState: combat.getPlayerState(player1SocketSwap.userId) }));
                        player2SocketSwap.send(JSON.stringify({ type: 'duel_update', combatState: combat.getPlayerState(player2SocketSwap.userId) }));
                        console.log(`User ${userIdSwap} swapped card at index ${swapIndex}`);
                    } else { // Si l'échange a échoué
                        console.log(`User ${userIdSwap} attempted invalid swap at index ${swapIndex}`);
                    }
                } else { // Si ce n'est pas le tour du joueur
                    console.log(`User ${userIdSwap} requested to swap card at index ${swapIndex}`);
                }
                break;
            default:
                console.log(`Unknown message type received: ${parsedMessage.type}`);
        }
    });

    socket.on('close', () => {
        console.log(`WebSocket connection closed: ${socket._socket.remoteAddress}:${socket._socket.remotePort}`);
        const userId = socket.userId;
        if (userId && connexions[userId]) {
            delete connexions[userId];
            console.log(`User ${userId} removed from connexions`);
        }
        const attenteIndex = attente.indexOf(userId);
        if (attenteIndex !== -1) {
            attente.splice(attenteIndex, 1);
            console.log(`User ${userId} removed from waiting list`);
        }
        for (let i = 0; i < combats.length; i++) {
            const combat = combats[i];
            if (combat.includes(socket)) {
                const adversaireSocket = combat[0] === socket ? combat[1] : combat[0];
                adversaireSocket.send(JSON.stringify({ type: 'duel_end', reason: 'opponent_disconnected' }));
                combats.splice(i, 1);
                console.log(`Duel involving user ${userId} ended due to disconnection`);
                break;
            }
        }
    });
}





module.exports = {
    receiveSocket,
};