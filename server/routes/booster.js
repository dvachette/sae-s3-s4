/**
 * @file server/routes/booster.js
 * @author Elise FOUR, Donatien VACHETTE
 * @brief Routes pour la gestion des boosters.
 * @description Définit les routes pour l'achat et la récupération des boosters.
 */

const Database = require('better-sqlite3'); // Importation de la bibliothèque SQLite3
const {addCardToCollection}=require("../fonctions-utile/request");
/**
 * @brief Achète un booster pour l'utilisateur connecté.
 * @returns response - Résultat de la requête.
 * @returns status 200 - Booster acheté avec succès.
 * @returns status 401 - Utilisateur non authentifié.
 * @returns status 405 - Méthode non autorisée.
 * @returns status 500 - Erreur lors de l'ouverture du booster.
 */
function openBooster(request, response) {
    // Forcer l'utilisation de la methode POST
    if (request.method !== 'POST') {
        return response.status(405).send({ error: 'Methode non autorisée' });
    }

    // Vérifier que l'utilisateur est authentifié
    if (!request.session.userId) {
        return response.status(401).send({ error: 'Utilisateur non authentifié' });
    }



    const userId = request.session.userId;

    const db = new Database('database.db');

    // Récuperer la date de dernier ouverture de booster
    const getLastBoosterOppeningQuery = db.prepare('SELECT lastBoosterOppening FROM user WHERE userid = ?');
    const userData = getLastBoosterOppeningQuery.get(userId);
    const lastBoosterOppening = userData.lastBoosterOppening;

    const currentTime = Math.floor(Date.now() / 1000); // Temps actuel en secondes

    // On peut ouvrir un booster toutes les 3 heures (10800 secondes) 
    if (lastBoosterOppening && (currentTime - lastBoosterOppening) < 3 * 3600) {
        const timeLeft = 3 * 3600 - (currentTime - lastBoosterOppening);
        // TODO: Améliorer le message pour afficher en heures/minutes/secondes
        return response.status(429).send({ error: `Vous devez attendre ${Math.floor(timeLeft / 3600)} heures ${Math.floor((timeLeft % 3600) / 60)} minutes avant d'ouvrir un nouveau booster.` });
    }

    // Récupérer toutes les cartes disponibles
    const getAllCardsQuery = db.prepare('SELECT cardId, weight FROM card');
    const allCards = getAllCardsQuery.all();

    // Faire un tirage par poids pour obtenir 5 cartes
    const drawnCards = [];
    let totalWeight = allCards.reduce((sum, card) => sum + card.weight, 0); // Fait la somme des poids

    // Si la plage de poids est nulle (toutes les cartes ont un poids de 0), on évite la division par zéro
    if (totalWeight === 0) {
        // Renvoyer une erreur
        return response.status(500).send({ error: 'Erreur lors de l\'ouverture du booster, aucunes cartes disponibles. Veuillez réessayer plus tard.' });
    }

    for (let i = 0; i < 5; i++) { // Tirer 5 cartes
        let randomNum = Math.random() * totalWeight; // Nombre aléatoire entre 0 et le poids total
        for (const card of allCards) { // Parcourir les cartes jusqu'a atteindre le nombre aléatoire
            randomNum -= card.weight;
            if (randomNum <= 0) {
                drawnCards.push(card.cardId); // Ajouter la carte tirée
                break;
            }
        }
        // Si c'est le premier tirage de cartes de l'utilisateur, on s'assure d'avoir des cartes différentes
        if (lastBoosterOppening === null) {
            // Retirer la carte tirée de la liste des cartes disponibles pour le prochain tirage
            const drawnCardIndex = allCards.findIndex(c => c.cardId === drawnCards[i]);
            if (drawnCardIndex !== -1) {
                totalWeight -= allCards[drawnCardIndex].weight; // Mettre à jour le poids total
                allCards.splice(drawnCardIndex, 1); // Retirer la carte tirée
            }
        }

    }

    // Insérer les cartes tirées dans la collection de l'utilisateur
    for (const cardId of drawnCards) {
        addCardToCollection(userId,cardId);
    }

    // Ajouter un nombre de clé à l'utilisateur
    const addKeyQuery = db.prepare('UPDATE user SET balance = balance + 5 WHERE userid = ?');
    addKeyQuery.run(userId);

    // Mettre à jour la date de dernier ouverture de booster (en timestamp epoch en secondes)
    const updateLastBoosterOppeningQuery = db.prepare('UPDATE user SET lastBoosterOppening = ? WHERE userid = ?');
    updateLastBoosterOppeningQuery.run(Math.floor(Date.now() / 1000), userId);

    // Retourner le détail des cartes tirées
    const getCardDetailsQuery = db.prepare('SELECT * FROM card WHERE cardid = ?');
    const drawnCardDetails = drawnCards.map(cardId => getCardDetailsQuery.get(cardId));

    return response.status(200).send({ message: 'Booster ouvert avec succès', cards: drawnCardDetails , keys: 5});
}

module.exports = {
    openBooster
};