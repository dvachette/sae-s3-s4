/**
 * @file server/routes/user.js
 * @author Elise FOUR, Donatien VACHETTE
 * @brief Routes pour la gestion des utilisateurs.
 * @description Définit les routes pour la création de compte, la connexion, la déconnexion et la modification du compte utilisateur.
 */

// Modules NPM
const Database = require('better-sqlite3'); // Importation de la bibliothèque SQLite3

// Modules internes
const User = require('../objects/user.js'); // Importation de l'objet User
const Hashing = require('../utils/hashing');

/**
 * @brief Crée un nouveau compte utilisateur.
 * @param email L'email de l'utilisateur.
 * @param password Le mot de passe de l'utilisateur.
 * @param name Le nom d'utilisateur.
 * @returns response - Résultat de la requête.
 * @returns status 201 - Compte créé avec succès.
 * @returns status 400 - Informations manquantes.
 * @returns status 409 - Mail ou pseudo déjà utilisé.
 * @returns status 405 - Méthode non autorisée.
 */
async function createAccount(request, response) {
  // Forcer l'utilisation de la méthode POST
  if (request.method !== 'POST') {
    return response.status(405).send({ error: 'Methode non autorisée' });
  }

  // Sécurité si le body est vide, sinon le serveur plante
  if (!request.body) {
    return response.status(400).send({ error: 'Informations manquantes' });
  }
  // Récupérer les informations de l'utilisateur depuis le corps de la requête
  const mail = request.body.email;
  const password = request.body.password; // TODO : Ajouter le hachage des mots de passe
  const username = request.body.name;

  // Vérifier que les champs email, password et name sont présents, et refuser la requête si un manque
  if (!mail || !password || !username) {
    return response.status(400).send({ error: 'Informations manquantes' });
  }

  if (!isEmailValid(mail)) {
    return response.status(400).send({ error: "Format d'email invalide" });
  }

  if (!isPasswordStrong(password)) {
    return response.status(400).send({ error: 'Mot de passe trop faible' });
  }

  // Vérifier si l'email ou le nom d'utilisateur existe déjà

  if (User.isEmailTaken(mail) || User.isUsernameTaken(username)) {
    return response.status(409).send({ error: 'Mail ou pseudo déjà utilisé' });
  }

  // Insérer le nouvel utilisateur dans la base de données
  const newUser = await User.register(username, mail, password);

  // Connecter automatiquement l'utilisateur après la création du compte
  request.session.userId = newUser.userId;

  return response
    .status(201)
    .send({ message: 'Compte créé avec succès', user: newUser });
}

/**
 * @brief Connecte un utilisateur.
 * @param email L'email de l'utilisateur.
 * @param password Le mot de passe de l'utilisateur.
 * @returns response - Résultat de la requête.
 * @returns status 200 - Connexion réussie.
 * @returns status 400 - Informations manquantes.
 * @returns status 401 - Email ou mot de passe incorrect.
 * @returns status 405 - Méthode non autorisée.
 */
async function login(request, response) {
  // Forcer l'utilisation de la méthode POST
  if (request.method !== 'POST') {
    return response.status(405).send({ error: 'Methode non autorisée' });
  }
  // Sécurité si le body est vide, sinon le serveur plante
  if (!request.body) {
    return response.status(400).send({ error: 'Informations manquantes' });
  }
  // Récupérer les informations de l'utilisateur depuis le corps de la requête
  const mail = request.body.email;
  const password = request.body.password;

  // Vérifier que les champs email et password sont présents
  if (!mail || !password) {
    return response.status(400).send({ error: 'Information manquante' });
  }

  const user = await User.login(mail, password);
  if (!user) {
    return response
      .status(401)
      .send({ error: 'Email ou mot de passe incorrect' });
  }

  // Initialiser la session utilisateur
  request.session.userId = user.userId;

  return response
    .status(200)
    .send({ message: 'Connexion réussie', user: user });
}

/**
 * @brief Déconnecte un utilisateur.
 * @detail La fonction est asynchrone pour permettre l'utilisation de 'await' lors de la destruction de la session.
 * @returns response - Résultat de la requête.
 * @returns status 200 - Déconnexion réussie.
 */
async function logout(request, response) {
  // Fonction asynchrone pour gérer la déconnexion
  // Détruire la session utilisateur
  await request.session.destroy(); // await permet d'attendre la fin de la destruction de la session avant de continuer
  return response.status(200).send({ message: 'Déconnexion réussie' });
}

/**
 * @brief Modifie les informations du compte utilisateur.
 * @param email (optionnel) Le nouvel email de l'utilisateur.
 * @param password (optionnel) Le nouveau mot de passe de l'utilisateur.
 * @param name (optionnel) Le nouveau nom d'utilisateur.
 * @returns response - Résultat de la requête.
 * @returns status 200 - Compte mis à jour avec succès.
 * @returns status 400 - Aucune information à mettre à jour ou données manquantes.
 * @returns status 401 - Utilisateur non authentifié.
 * @returns status 404 - Utilisateur non trouvé.
 * @returns status 405 - Méthode non autorisée.
 */
async function editAccount(request, response) {
  // Vérifier la methode HTTP
  if (request.method !== 'PUT') {
    return response.status(405).send({ error: 'Methode non autorisée' });
  }

  // Vérifier si l'utilisateur est authentifié
  if (!request.session.userId) {
    return response.status(401).send({ error: 'Utilisateur non authentifié' });
  }

  // Récupérer les nouvelles informations
  const userId = request.session.userId;
  if (!request.body) {
    return response.status(400).send({ error: 'Aucune donnée fournie' });
  }
  const newMail = request.body.email || null;
  const newPassword = request.body.password || null;
  const newUsername = request.body.name || null;
  const newProfilePicture = request.body.profilePicture || null;
  const verifPassword = request.body.mdp_check || '';
  const userVerif = User.fromId(userId);
  const userLogin = await User.login(userVerif.email, verifPassword);
  // Vérifier le mot de passe avant de faire les modifications (pour mail et mdp uniquement)
  if(!userLogin && newUsername === null && newProfilePicture === null){
    return response
      .status(403)
      .send({error : "Mot de passe incorrect"}) ;
  } 
  console.log(request.body);
  // Vérifier qu'au moins une information est fournie
  if (!newMail && !newPassword && !newUsername) {
    return response
      .status(400)
      .send({ error: 'Aucune information à mettre à jour' });
  }

  if (User.isEmailTaken(newMail) || User.isUsernameTaken(newUsername)) {
    return response.status(409).send({ error: 'Mail ou pseudo déjà utilisé' });
  }

  if (newMail && !isEmailValid(newMail)) {
    return response.status(400).send({ error: "Format d'email invalide" });
  }

  if (newPassword && !isPasswordStrong(newPassword)) {
    return response.status(400).send({ error: 'Mot de passe trop faible' });
  }
  const user = User.fromId(userId);
  // Vérifier si l'utilisateur existe
  if (!user) {
    return response.status(404).send({ error: 'Utilisateur non trouvé' });
  }

  // Mettre à jour les informations de l'utilisateur
  // Mettre à jour l'email si fourni
  if (newMail) {
    user.email = newMail;
  }
  // Mettre à jour le mot de passe si fourni
  if (newPassword) {
    user.password = await Hashing.hashPassword(newPassword);
  }
  // Mettre à jour le nom d'utilisateur si fourni
  if (newUsername) {
    user.username = newUsername;
  }

  // Mettre à jour la photo de profil si fournie
  if (newProfilePicture) {
    user.profilePicture = newProfilePicture;
  }
  // Exécuter la requête de mise à jour
  user.save();

  return response
    .status(200)
    .send({ message: 'Compte mis à jour avec succès', user: user });
}

/**
 * @brief Supprime le compte utilisateur.
 * @returns response - Résultat de la requête.
 * @returns status 200 - Compte supprimé avec succès.
 * @returns status 401 - Utilisateur non authentifié.
 * @returns status 404 - Utilisateur non trouvé.
 * @returns status 405 - Méthode non autorisée.
 */
function deleteAccount(request, response) {
  // Vérifier que la méthode HTTP est DELETE
  if (request.method !== 'DELETE') {
    return response.status(405).send({ error: 'Methode non autorisée' });
  }

  // Vérifier si l'utilisateur est authentifié
  if (!request.session.userId) {
    return response.status(401).send({ error: 'Utilisateur non authentifié' });
  }

  const userId = request.session.userId;
  const user = User.fromId(userId);

  if (!user) {
    return response.status(404).send({ error: 'Utilisateur non trouvé' });
  }
  user.delete();

  // Détruire la session utilisateur
  request.session.destroy();

  return response.status(200).send({ message: 'Compte supprimé avec succès' });
}

/**
 * @brief Récupère les informations de l'utilisateur connecté.
 * @returns response - Résultat de la requête.
 * @returns status 200 - Informations utilisateur récupérées avec succès.
 * @returns status 401 - Utilisateur non authentifié.
 * @returns status 404 - Utilisateur non trouvé.
 * @returns status 405 - Méthode non autorisée.
 */
function getUserData(request, response) {
  // Vérifier que la méthode HTTP est GET
  if (request.method !== 'GET') {
    return response.status(405).send({ error: 'Methode non autorisée' });
  }

  // Vérifier si l'utilisateur est authentifié
  if (!request.session.userId) {
    return response.status(401).send({ error: 'Utilisateur non authentifié' });
  }

  const userId = request.session.userId;

  // Connexion à la base de données
  const user = User.fromId(userId);

  if (!user) {
    return response.status(404).send({ error: 'Utilisateur non trouvé' });
  }
  user.stats = user.getStats() ;
  return response.status(200).send({ user: user });
}

function getUserNameById(request, response) {
  // Vérifier que la méthode HTTP est GET
  if (request.method !== 'GET') {
    return response.status(405).send({ error: 'Methode non autorisée' });
  }

  const userId = request.params.id;

  const user = User.fromId(userId);

  if (!user) {
    return response.status(404).send({ error: 'Utilisateur non trouvé' });
  }

  return response.status(200).send({ name: user.name });
}

function isEmailValid(email) {
  // Expression régulière pour valider le format de l'email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isPasswordStrong(password) {
  // Vérifie que le mot de passe a au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
}

function searchUsers(request, response) {
  // Vérifier que la méthode HTTP est GET
  if (request.method !== 'POST') {
    return response.status(405).send({ error: 'Methode non autorisée' });
  }

  // Vérifier si l'utilisateur est authentifié
  if (!request.session.userId) {
    return response.status(401).send({ error: 'Utilisateur non authentifié' });
  }

  const query = request.body.query;
  const ret = User.search(query);
  console.log(ret);

  return response.status(200).send({ users: ret });
}

module.exports = {
  createAccount,
  login,
  logout,
  editAccount,
  deleteAccount,
  getUserData,
  getUserNameById,
  searchUsers,
};
