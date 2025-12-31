const types = require('./types.js');
const User = require('../objects/user.js');
const connexions = {};
const combats = [];
const attente = [];


function receiveSocket(socket) {
    console.log(`New WebSocket connection established : ${socket._socket.remoteAddress}:${socket._socket.remotePort}`);
    socket.on('message', (message) => {
        console.log('Received message:', message.toString());
        const parsedMessage = JSON.parse(message);
        switch (parsedMessage.type) {
            case 'authenticate':
                const userId = parsedMessage.userId;
                connexions[userId] = socket;
                socket.userId = userId;
                const userData = User.fromId(userId);
                if (!userData) {
                    console.log(`Authentication failed for userId: ${userId}`);
                    socket.send(JSON.stringify({ type: 'authentication_failed' }));
                    connexions[userId] = null;
                    socket.close();
                    return;
                }

                if (!userData.deck.isValid()) {
                    console.log(`User ${userId} has an invalid deck`);
                    socket.send(JSON.stringify({ type: 'invalid_deck' }));
                    connexions[userId] = null;
                    socket.close();
                    return;
                }

                console.log(`User ${userId} authenticated for WebSocket`);
                socket.send(JSON.stringify({ type: 'authenticated' }));
                if (attente.length > 0) {
                    const adversaireId = attente.shift();
                    const combat = types.CombatState.fromPlayersIds(userId, adversaireId);
                    combats.push([socket, connexions[adversaireId], combat]);
                    socket.send(JSON.stringify({ type: 'duel_start', adversaireId: adversaireId, combatState: combat.getPlayerState(userId) }));
                    connexions[adversaireId].send(JSON.stringify({ type: 'duel_start', adversaireId: userId, combatState: combat.getPlayerState(adversaireId) }));
                    console.log(`Duel started between ${userId} and ${adversaireId}`);
                } else {
                    attente.push(userId);
                    console.log(`User ${userId} added to waiting list`);
                }
                break;
            case 'skip':
                const combatPairSkip = combats.find(c => c[0] === socket || c[1] === socket);
                if (combatPairSkip) {
                    const combatInstance = combatPairSkip[2];
                    const userId = socket.userId;
                    if (combatInstance.canPlay(userId)) {
                        combatInstance.tour += 1;
                        const [player1Socket, player2Socket] = [combatPairSkip[0], combatPairSkip[1]];
                        player1Socket.send(JSON.stringify({ type: 'duel_update', combatState: combatInstance.getPlayerState(player1Socket.userId) }));
                        player2Socket.send(JSON.stringify({ type: 'duel_update', combatState: combatInstance.getPlayerState(player2Socket.userId) }));
                        console.log(`User ${userId} skipped their turn`);
                    } else {
                        console.log(`User ${userId} attempted to skip turn out of turn`);
                    }
                }
                break;
            case 'attack':
                const combatPairAttack = combats.find(c => c[0] === socket || c[1] === socket);
                if(combatPairAttack){
                    const combatInstanceAttack = combatPairAttack[2];
                    const userIdAttack = socket.userId;
                    const ennemiSocketAttack = combatPairAttack[(combatPairAttack.indexOf(socket)+1)%2];
                    if(combatInstanceAttack.canPlay(userIdAttack)){
                        const attackIndex = parsedMessage.attackIndex;
                        const attack = combatInstanceAttack.getPlayerState(userIdAttack).moi.main.carteActive.attacks[attackIndex];
                        if(attack.cost<=combatInstanceAttack.getPlayerState(userIdAttack).moi.energie){
                            combatInstanceAttack.getPlayerState(ennemiSocketAttack.userId).moi.main.carteActive.hitPoints-=attack.effects.find(e=> e.type === 'damage').value;
                            combatInstanceAttack.getPlayerState(userIdAttack).moi.energie-=attack.cost;
                            combatInstanceAttack.tour+=1;
                            socket.send(JSON.stringify({ type: 'duel_update', combatState: combatInstance.getPlayerState(socket.userId) }));
                            ennemiSocketAttack.send(JSON.stringify({ type: 'duel_update', combatState: combatInstance.getPlayerState(ennemiSocketAttack.userId) }));
                            console.log("attaque lancé");
                        }
                    }
                }
                break;
            case 'swap':
                const swapIndex = parsedMessage.index;
                const combatPairSwap = combats.find(c => c[0] === socket || c[1] === socket);
                const userIdSwap = socket.userId;
                const combat = combatPairSwap[2];
                if (combat.canPlay(userIdSwap)) {
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