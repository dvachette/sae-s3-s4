const database = require('../include/database.js');
function createAccount(request, response) {
    if (request.method !== 'POST') {
        return response.status(405).send({ error: 'Methode non autorisée' });
    }
    const mail = request.body.mail;
    const password = request.body.password;
    const username = request.body.username;

    if (!mail || !password || !username) {
        return response.status(400).send({ error: 'Information manquante' });
    }
    const db = database.openDatabase('database.db');
    const checkUserStmt = db.prepare('SELECT COUNT(*) AS count FROM users WHERE mail = ?');
    
}

