const Database = require('better-sqlite3');


function createAccount(request, response) {
    if (request.method !== 'POST') {
        return response.status(405).send({ error: 'Methode non autorisée' });
    }

    const mail = request.body.email;
    const password = request.body.password;
    const username = request.body.name;

    if (!mail || !password || !username) {
        return response.status(400).send({ error: 'Information manquante' });
    }
    const db = new Database('database.db')

    const checkMailPseudo = db.prepare('SELECT * FROM user WHERE email = ? OR name = ?');
    const existingUser = checkMailPseudo.get(mail, username);
    
    if (existingUser) {
        return response.status(409).send({ error: 'Mail ou pseudo déjà utilisé' });
    }

    const insertUser = db.prepare('INSERT INTO user (email, password, name) VALUES (?, ?, ?)');
    insertUser.run(mail, password, username);

    const newUser = db.prepare('SELECT userid, email, name FROM user WHERE email = ?').get(mail);

    return response.status(201).send({ message: 'Compte créé avec succès', user: newUser });
    
    
}

module.exports = { 
    createAccount
};
