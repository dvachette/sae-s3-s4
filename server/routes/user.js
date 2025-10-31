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

function login(request, response) {
    // Forcer l'utilisation de la méthode POST
    if (request.method !== 'POST') {
        return response.status(405).send({ error: 'Methode non autorisée' });
    }

    const mail = request.body.email;
    const password = request.body.password;

    // Vérifier que les champs email et password sont présents
    if (!mail || !password) {
        return response.status(400).send({ error: 'Information manquante' });
    }

    const db = new Database('database.db');

    const getUserQuery = db.prepare('SELECT userid, password FROM user WHERE email = ?');
    const user = getUserQuery.get(mail);

    // Vérifier si l'utilisateur existe et si le mot de passe est correct
    if (!user || user.password !== password) {
        return response.status(401).send({ error: 'Email ou mot de passe incorrect' });
    }

    // Initialiser la session utilisateur
    request.session.userId = user.userId;

    return response.status(200).send({ message: 'Connexion réussie' });
}

async function logout(request, response) { // Fonction asynchrone pour gérer la déconnexion
    // Détruire la session utilisateur
    await request.session.destroy(); // await permet d'attendre la fin de la destruction de la session avant de continuer
    return response.status(200).send({ message: 'Déconnexion réussie' });
}



module.exports = { 
    createAccount,
    login,
    logout
};
